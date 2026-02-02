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
import { Github} from 'lucide-react';

import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { authClient } from "@/lib/auth-client";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6,{ message: "Password must be at least 6 characters long" }),
});

export function SignInView() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    setLoading(true);
    setError(null);

    authClient.signIn.email(
      data,
      {
        onSuccess: () => router.push("/"),
        onError: ({ error }) => {
          setError(error.message);
          setLoading(false);
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0F1A] px-4">
      <Card className="w-full max-w-4xl border border-white/10 bg-white/5 backdrop-blur-xl">
        <CardContent className="grid md:grid-cols-2 p-0">
          
          {/* FORM */}
          <div className="p-8 md:p-12 space-y-8">
            <header className="space-y-2">
              <h1 className="text-3xl font-semibold text-white">
                Welcome back
              </h1>
              <p className="text-white/60 text-sm">
                Sign in to your account
              </p>
            </header>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 h-4 w-4" />
                          <Input
                            {...field}
                            className="pl-9"
                            placeholder="you@company.com"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 h-4 w-4" />
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

                {error && (
                  <Alert className="bg-red-500/10 border-red-500/20 text-red-400">
                    {error}
                  </Alert>
                )}

                <Button
                  disabled={loading}
                  className="w-full h-11 bg-indigo-600 hover:bg-indigo-500"
                >
                  {loading ? "Signing in…" : "Sign in"}
                </Button>

                <div className="text-center text-sm text-white/50">
                  or
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11"
                  onClick={() =>
                    authClient.signIn.social({ provider: "Google" })
                  }
                >
                  
                  Continue with Google
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

                <p className="text-sm text-white/60 text-center">
                  Don’t have an account?{" "}
                  <Link href="/sign-up" className="text-indigo-400 hover:underline">
                    Sign up
                  </Link>
                </p>
              </form>
            </Form>
          </div>

          {/* BRAND */}
          <div className="hidden md:flex flex-col justify-center px-12 bg-gradient-to-br from-indigo-600/20 to-violet-600/20">
  <div className="space-y-6 max-w-sm">
    <h2 className="text-3xl font-semibold text-white leading-tight">
      Secure access to your workspace
    </h2>

    <p className="text-white/70 text-sm leading-relaxed">
      Sign in to manage your account, access personalized features,
      and continue where you left off — securely and seamlessly.
    </p>

    <ul className="space-y-4 text-sm text-white/70">
      <li className="flex items-start gap-3">
        <span className="text-indigo-400">✔</span>
        Industry-standard authentication & encryption
      </li>
      <li className="flex items-start gap-3">
        <span className="text-indigo-400">✔</span>
        Fast, reliable access across all devices
      </li>
      <li className="flex items-start gap-3">
        <span className="text-indigo-400">✔</span>
        Trusted by professionals and teams
      </li>
    </ul>

    <div className="pt-6 border-t border-white/10">
      <p className="text-xs text-white/50">
        Having trouble signing in? Your data is safe — support is always available.
      </p>
    </div>
  </div>
</div>


        </CardContent>
      </Card>
    </div>
  );
}
