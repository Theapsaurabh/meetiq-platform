"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Eye, EyeOff, User, Mail, Lock, Github } from "lucide-react";
import { authClient } from "@/lib/auth-client";

/* ---------------- schema ---------------- */

const schema = z
  .object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Minimum 6 characters"),
    confirmPassword: z.string().min(6, "Minimum 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/* ---------------- password strength ---------------- */

function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 6) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

export function SignUpView() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = form.watch("password") || "";
  const strength = getPasswordStrength(password);

  const onSubmit = (data: z.infer<typeof schema>) => {
    const { confirmPassword, ...payload } = data; // 🚨 IMPORTANT

    setLoading(true);
    setError(null);

    authClient.signUp.email(payload, {
      onSuccess: () => router.push("/"),
      onError: ({ error }) => {
        setError(error.message);
        setLoading(false);
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0F1A] px-4">
      <Card className="w-full max-w-4xl border border-white/10 bg-white/5 backdrop-blur-xl">
        <CardContent className="grid md:grid-cols-2 p-0">

          {/* ================= FORM ================= */}
          <div className="p-8 md:p-12 space-y-8">
            <header>
              <h1 className="text-3xl font-semibold text-white">
                Create your account
              </h1>
              <p className="text-sm text-white/60">
                Secure, fast and built for long-term use
              </p>
            </header>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                          <Input {...field} className="pl-9" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                          <Input {...field} className="pl-9" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            className="pl-9 pr-9"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40"
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Confirm Password */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => {
                    const passwordValue = form.watch("password");

                    return (
                      <FormItem>
                        <FormLabel>Confirm password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                            <Input
                              {...field}
                              type={showConfirmPassword ? "text" : "password"}
                              className="pl-9 pr-16"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40"
                            >
                              {showConfirmPassword ? (
                                <EyeOff size={16} />
                              ) : (
                                <Eye size={16} />
                              )}
                            </button>

                            {field.value && passwordValue && (
                              <span
                                className={`absolute right-10 top-1/2 -translate-y-1/2 text-xs ${
                                  field.value === passwordValue
                                    ? "text-green-400"
                                    : "text-red-400"
                                }`}
                              >
                                {field.value === passwordValue ? "Match" : "No match"}
                              </span>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                {/* Password strength */}
                {password && (
                  <div className="space-y-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-full ${
                            strength >= i
                              ? strength <= 1
                                ? "bg-red-400"
                                : strength === 2
                                ? "bg-yellow-400"
                                : strength === 3
                                ? "bg-blue-400"
                                : "bg-green-400"
                              : "bg-white/10"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-white/60">
                      {strength <= 1 && "Weak password"}
                      {strength === 2 && "Fair password"}
                      {strength === 3 && "Good password"}
                      {strength === 4 && "Strong password"}
                    </p>
                  </div>
                )}

                {error && (
                  <Alert className="bg-red-500/10 border-red-500/20 text-red-400">
                    {error}
                  </Alert>
                )}

                <Button
                  disabled={loading}
                  className="w-full h-11 bg-indigo-600 hover:bg-indigo-500"
                >
                  {loading ? "Creating account…" : "Create account"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11"
                  onClick={() =>
                    authClient.signIn.social({ provider: "github" })
                  }
                >
                  <Github className="mr-2 h-4 w-4" />
                  Continue with GitHub
                </Button>

                <p className="text-sm text-center text-white/60">
                  Already have an account?{" "}
                  <Link href="/sign-in" className="text-indigo-400 hover:underline">
                    Sign in
                  </Link>
                </p>

              </form>
            </Form>
          </div>

          {/* ================= SIDE PANEL ================= */}
          <div className="hidden md:flex flex-col justify-center px-12 bg-gradient-to-br from-indigo-600/20 to-violet-600/20">
            <div className="space-y-6 max-w-sm">
              <h2 className="text-3xl font-semibold text-white">
                Build your account with confidence
              </h2>
              <p className="text-white/70 text-sm leading-relaxed">
                We keep onboarding simple while maintaining strong security
                standards used by professional platforms.
              </p>
              <ul className="space-y-3 text-sm text-white/70">
                <li>✔ Encrypted credentials & secure storage</li>
                <li>✔ No unnecessary steps or friction</li>
                <li>✔ Designed for reliability and scale</li>
              </ul>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
