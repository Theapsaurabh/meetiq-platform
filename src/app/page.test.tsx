/**
 * Tests for Home page component
 *
 * Framework/Library:
 * - React Testing Library for rendering and interactions
 * - Vitest or Jest for test runner and mocking (tests use global `vi` if available, else fall back to `jest`)
 *
 * These tests focus on the behaviors visible in the provided diff:
 * - useSession-based conditional rendering
 * - signUp.email and signIn.email flows with onSuccess/onError callbacks
 * - signOut flow when session is present
 * - form inputs and button interactions
 */

import React from "react";
import type { ReactElement } from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";

// Prefer user-event if available in the project; fall back to fireEvent otherwise
let userEvent: any;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  userEvent = require("@testing-library/user-event").default || require("@testing-library/user-event");
} catch {
  userEvent = null;
}

// Detect global mock API (Vitest or Jest)
const mocker = (globalThis as any).vi ?? (globalThis as any).jest;
if (!mocker) {
  // Minimal shim if neither is available; this allows the file to parse, though real tests require a runner.
  // In real project, this shim should be unnecessary because either Vitest or Jest will be installed.
  (globalThis as any).vi = {
    fn: (...args: any[]) => {
      // naive spy function
      const fn = (...callArgs: any[]) => (fn as any)._impl?.(...callArgs);
      (fn as any).mock = { calls: [] as any[] };
      (fn as any).mockImplementation = (impl: any) => ((fn as any)._impl = impl);
      return fn;
    },
    mock: () => {},
    restoreAllMocks: () => {},
    resetAllMocks: () => {},
    clearAllMocks: () => {},
  };
}

// We will mock the auth-client module used by the component
// Path based on the source under test: "@/lib/auth-client"
const useSessionMock = (mocker?.fn ?? vi.fn)();
const signUpEmailMock = (mocker?.fn ?? vi.fn)();
const signInEmailMock = (mocker?.fn ?? vi.fn)();
const signOutMock = (mocker?.fn ?? vi.fn)();

// The component imports UI primitives. We keep them minimal and behaviorally equivalent for tests.
// If the project provides real components, these mocks simply render children/inputs to keep test stable.
mocker?.mock?.("@/components/ui/button", () => ({
  Button: (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>{props.children}</button>
  ),
}));
mocker?.mock?.("@/components/ui/input", () => ({
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} />,
}));

mocker?.mock?.("@/lib/auth-client", () => {
  return {
    authClient: {
      useSession: () => useSessionMock(),
      signUp: {
        email: (...args: any[]) => signUpEmailMock(...args),
      },
      signIn: {
        email: (...args: any[]) => signInEmailMock(...args),
      },
      signOut: (...args: any[]) => signOutMock(...args),
    },
  };
});

// Now import the component under test AFTER mocks
import Home from "./page"; // assuming component file is src/app/page.tsx

// Helpers
const setup = () => {
  const ui: ReactElement = <Home />;
  return render(ui);
};

// Window alert spy
const alertSpy = (mocker?.spyOn ?? ((obj: any, key: string) => {
  const orig = obj[key];
  obj[key] = (...args: any[]) => {
    (obj[key] as any)._calls = (obj[key] as any)._calls || [];
    (obj[key] as any)._calls.push(args);
  };
  return { mockRestore: () => (obj[key] = orig) };
}))(window, "alert");

beforeEach(() => {
  (mocker?.clearAllMocks ?? vi.clearAllMocks)();
  (mocker?.resetAllMocks ?? vi.resetAllMocks)();

  // Default to unauthenticated session
  useSessionMock.mockImplementation?.(() => ({ data: null })) ??
    (useSessionMock as any).mockImplementation?.(() => ({ data: null }));

  // Ensure alert is a function
  (window as any).alert = (window as any).alert ?? (() => {});
});

afterAll(() => {
  alertSpy.mockRestore?.();
});

describe("Home page - unauthenticated state (no session)", () => {
  test("renders two forms with expected inputs and buttons", () => {
    setup();

    // Create user section
    expect(screen.getAllByPlaceholderText(/email/i).length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByPlaceholderText(/password/i).length).toBeGreaterThanOrEqual(2);
    expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create user/i })).toBeInTheDocument();

    // Login section
    expect(screen.getByRole("button", { name: /user login/i })).toBeInTheDocument();
  });

  test("updates input fields correctly", async () => {
    setup();

    const u = userEvent ? userEvent.setup() : null;

    const name = screen.getByPlaceholderText(/name/i) as HTMLInputElement;
    const emailCreate = screen.getAllByPlaceholderText(/email/i)[0] as HTMLInputElement;
    const passwordCreate = screen.getAllByPlaceholderText(/password/i)[0] as HTMLInputElement;

    if (u) {
      await u.type(name, "Alice");
      await u.type(emailCreate, "alice@example.com");
      await u.type(passwordCreate, "s3cret");
    } else {
      fireEvent.change(name, { target: { value: "Alice" } });
      fireEvent.change(emailCreate, { target: { value: "alice@example.com" } });
      fireEvent.change(passwordCreate, { target: { value: "s3cret" } });
    }

    expect(name.value).toBe("Alice");
    expect(emailCreate.value).toBe("alice@example.com");
    expect(passwordCreate.value).toBe("s3cret");
  });

  test("sign-up happy path shows Success alert and passes correct args to authClient.signUp.email", async () => {
    setup();

    // Arrange: signUp should call onSuccess callback
    (signUpEmailMock as any).mockImplementation((_payload: any, handlers: any) => {
      handlers?.onSuccess?.();
    });

    const u = userEvent ? userEvent.setup() : null;

    const name = screen.getByPlaceholderText(/name/i);
    const email = screen.getAllByPlaceholderText(/email/i)[0];
    const password = screen.getAllByPlaceholderText(/password/i)[0];
    const btn = screen.getByRole("button", { name: /create user/i });

    if (u) {
      await u.type(name, "Bob");
      await u.type(email, "bob@example.com");
      await u.type(password, "hunter2");
      await u.click(btn);
    } else {
      fireEvent.change(name, { target: { value: "Bob" } });
      fireEvent.change(email, { target: { value: "bob@example.com" } });
      fireEvent.change(password, { target: { value: "hunter2" } });
      fireEvent.click(btn);
    }

    // Assert call payload
    expect(signUpEmailMock).toHaveBeenCalledTimes(1);
    const [payload] = (signUpEmailMock as any).mock.calls[0];
    expect(payload).toMatchObject({
      name: "Bob",
      email: "bob@example.com",
      password: "hunter2",
    });

    // Assert alert
    expect(window.alert).toHaveBeenCalledWith("Success");
  });

  test("sign-up error path shows wrong alert", async () => {
    setup();

    (signUpEmailMock as any).mockImplementation((_payload: any, handlers: any) => {
      handlers?.onError?.(new Error("fail"));
    });

    const u = userEvent ? userEvent.setup() : null;

    const name = screen.getByPlaceholderText(/name/i);
    const email = screen.getAllByPlaceholderText(/email/i)[0];
    const password = screen.getAllByPlaceholderText(/password/i)[0];
    const btn = screen.getByRole("button", { name: /create user/i });

    if (u) {
      await u.type(name, "Eve");
      await u.type(email, "eve@example.com");
      await u.type(password, "pwd");
      await u.click(btn);
    } else {
      fireEvent.change(name, { target: { value: "Eve" } });
      fireEvent.change(email, { target: { value: "eve@example.com" } });
      fireEvent.change(password, { target: { value: "pwd" } });
      fireEvent.click(btn);
    }

    expect(signUpEmailMock).toHaveBeenCalledTimes(1);
    expect(window.alert).toHaveBeenCalledWith("wrong");
  });

  test("login happy path shows Success alert and passes correct args to authClient.signIn.email", async () => {
    setup();

    (signInEmailMock as any).mockImplementation((_payload: any, handlers: any) => {
      handlers?.onSuccess?.();
    });

    const u = userEvent ? userEvent.setup() : null;

    const email = screen.getAllByPlaceholderText(/email/i)[1];
    const password = screen.getAllByPlaceholderText(/password/i)[1];
    const btn = screen.getByRole("button", { name: /user login/i });

    if (u) {
      await u.type(email, "jane@example.com");
      await u.type(password, "pass1234");
      await u.click(btn);
    } else {
      fireEvent.change(email, { target: { value: "jane@example.com" } });
      fireEvent.change(password, { target: { value: "pass1234" } });
      fireEvent.click(btn);
    }

    expect(signInEmailMock).toHaveBeenCalledTimes(1);
    const [payload] = (signInEmailMock as any).mock.calls[0];
    expect(payload).toMatchObject({
      email: "jane@example.com",
      password: "pass1234",
    });

    expect(window.alert).toHaveBeenCalledWith("Success");
  });

  test("login error path shows wrong alert", async () => {
    setup();

    (signInEmailMock as any).mockImplementation((_payload: any, handlers: any) => {
      handlers?.onError?.(new Error("nope"));
    });

    const u = userEvent ? userEvent.setup() : null;

    const email = screen.getAllByPlaceholderText(/email/i)[1];
    const password = screen.getAllByPlaceholderText(/password/i)[1];
    const btn = screen.getByRole("button", { name: /user login/i });

    if (u) {
      await u.type(email, "bad@example.com");
      await u.type(password, "bad");
      await u.click(btn);
    } else {
      fireEvent.change(email, { target: { value: "bad@example.com" } });
      fireEvent.change(password, { target: { value: "bad" } });
      fireEvent.click(btn);
    }

    expect(signInEmailMock).toHaveBeenCalledTimes(1);
    expect(window.alert).toHaveBeenCalledWith("wrong");
  });
});

describe("Home page - authenticated state (session present)", () => {
  test("renders logged-in view with user name and triggers signOut on click", async () => {
    // Make useSession return a session-like object
    useSessionMock.mockImplementation?.(() => ({
      data: {
        user: { name: "Test User" },
      },
    }));

    setup();

    expect(screen.getByText(/logged in as/i)).toBeInTheDocument();
    expect(screen.getByText(/test user/i)).toBeInTheDocument();

    const signOutButton = screen.getByRole("button", { name: /sing out/i }); // note: component text has "Sing Out"
    const u = userEvent ? userEvent.setup() : null;
    if (u) {
      await u.click(signOutButton);
    } else {
      fireEvent.click(signOutButton);
    }

    expect(signOutMock).toHaveBeenCalledTimes(1);
  });
});

/**
 * Edge cases:
 * - Empty strings for inputs are still forwarded; authClient handlers determine validity.
 * - Multiple clicks should call authClient multiple times.
 */
describe("Edge cases and repeated interactions", () => {
  test("multiple clicks on Create User call signUp multiple times", async () => {
    setup();

    (signUpEmailMock as any).mockImplementation((_payload: any, handlers: any) => {
      handlers?.onSuccess?.();
    });

    const btn = screen.getByRole("button", { name: /create user/i });

    const u = userEvent ? userEvent.setup() : null;
    if (u) {
      await u.click(btn);
      await u.click(btn);
    } else {
      fireEvent.click(btn);
      fireEvent.click(btn);
    }

    expect(signUpEmailMock).toHaveBeenCalledTimes(2);
  });

  test("empty input values are forwarded as-is", async () => {
    setup();

    (signInEmailMock as any).mockImplementation((_payload: any, handlers: any) => {
      handlers?.onError?.(new Error("invalid"));
    });

    const btn = screen.getByRole("button", { name: /user login/i });

    const u = userEvent ? userEvent.setup() : null;
    if (u) {
      await u.click(btn);
    } else {
      fireEvent.click(btn);
    }

    const [payload] = (signInEmailMock as any).mock.calls[0];
    expect(payload).toMatchObject({ email: "", password: "" });
    expect(window.alert).toHaveBeenCalledWith("wrong");
  });
});