"use client";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OctagonAlert, Eye, EyeOff, Mail, Lock, User, Github, CheckCircle } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  FormField,
} from "@/components/ui/form";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  confirmPassword: z.string().min(6, "Password must be required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const SignUpView = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setError(null);
    setLoading(true);

    authClient.signUp.email(
      {
        name: data.name,
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          setLoading(false);
          router.push("/");
        },
        onError: ({ error }) => {
          setLoading(false);
          setError(error.message);
        },
      }
    );
  };

  // Password strength checker
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(form.watch("password") || "");

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-r from-green-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl animate-fadeInUp">
        <Card className="overflow-hidden border-0 bg-white/10 backdrop-blur-xl shadow-2xl">
          <CardContent className="grid p-0 md:grid-cols-2 min-h-[700px]">
            {/* Form Section */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm"></div>
              <Form {...form}>
                <form 
                  onSubmit={form.handleSubmit(onSubmit)} 
                  className="relative z-10 p-8 md:p-12 h-full flex flex-col justify-center space-y-5"
                >
                  {/* Header */}
                  <div className="text-center space-y-2 animate-slideDown">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      Let&apos;s Get Started
                    </h1>
                    <p className="text-gray-300 text-lg">
                      Create your account and join us today
                    </p>
                  </div>

                  {/* Name Field */}
                  <div className="space-y-2 animate-slideLeft animation-delay-200">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-200 font-medium">Full Name</FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors group-focus-within:text-blue-400" />
                              <Input
                                type="text"
                                placeholder="Enter your full name"
                                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400/50 transition-all duration-300 hover:bg-white/15"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2 animate-slideRight animation-delay-300">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-200 font-medium">Email</FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors group-focus-within:text-blue-400" />
                              <Input
                                type="email"
                                placeholder="Enter your email"
                                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400/50 transition-all duration-300 hover:bg-white/15"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2 animate-slideLeft animation-delay-400">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-200 font-medium">Password</FormLabel>
                          <FormControl>
                            <div className="space-y-2">
                              <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors group-focus-within:text-blue-400" />
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Create a strong password"
                                  className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400/50 transition-all duration-300 hover:bg-white/15"
                                  {...field}
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-400 transition-colors"
                                >
                                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                              </div>
                              {/* Password Strength Indicator */}
                              {field.value && (
                                <div className="space-y-2">
                                  <div className="flex space-x-1">
                                    {[...Array(4)].map((_, i) => (
                                      <div
                                        key={i}
                                        className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                                          i < passwordStrength
                                            ? passwordStrength === 1
                                              ? "bg-red-400"
                                              : passwordStrength === 2
                                              ? "bg-yellow-400"
                                              : passwordStrength === 3
                                              ? "bg-blue-400"
                                              : "bg-green-400"
                                            : "bg-gray-600"
                                        }`}
                                      ></div>
                                    ))}
                                  </div>
                                  <p className="text-xs text-gray-400">
                                    {passwordStrength === 1 && "Weak"}
                                    {passwordStrength === 2 && "Fair"}
                                    {passwordStrength === 3 && "Good"}
                                    {passwordStrength === 4 && "Strong"}
                                  </p>
                                </div>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Confirm Password Field */}
                  <div className="space-y-2 animate-slideRight animation-delay-500">
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-200 font-medium">Confirm Password</FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors group-focus-within:text-blue-400" />
                              <Input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm your password"
                                className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400/50 transition-all duration-300 hover:bg-white/15"
                                {...field}
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-400 transition-colors"
                              >
                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                              </button>
                              {/* Password match indicator */}
                              {field.value && form.watch("password") && (
                                <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                                  {field.value === form.watch("password") ? (
                                    <CheckCircle className="h-5 w-5 text-green-400" />
                                  ) : (
                                    <OctagonAlert className="h-5 w-5 text-red-400" />
                                  )}
                                </div>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Error Alert */}
                  {error && (
                    <Alert className="bg-red-500/20 border-red-500/30 backdrop-blur-sm animate-shake">
                      <OctagonAlert className="h-4 w-4 text-red-400" />
                      <AlertTitle className="text-red-400">{error}</AlertTitle>
                    </Alert>
                  )}

                  {/* Sign Up Button */}
                  <Button
                    disabled={loading}
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 animate-slideUp animation-delay-600"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Creating Account...</span>
                      </div>
                    ) : (
                      "Create Account"
                    )}
                  </Button>

                  {/* Divider */}
                  <div className="relative animate-fadeIn animation-delay-700">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-transparent text-gray-400">Or continue with</span>
                    </div>
                  </div>

                  {/* Social Buttons */}
                  <div className="grid grid-cols-2 gap-4 animate-slideUp animation-delay-800">
                    <Button
                      disabled={loading}
                      variant="outline"
                      type="button"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Google
                    </Button>
                    <Button
                      disabled={loading}
                      variant="outline"
                      type="button"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
                    >
                      <Github className="w-5 h-5 mr-2" />
                      GitHub
                    </Button>
                  </div>

                  {/* Sign In Link */}
                  <div className="text-center animate-fadeIn animation-delay-900">
                    <p className="text-gray-300">
                      Already have an account?{" "}
                      <Link
                        href="/sign-in"
                        className="text-blue-400 hover:text-blue-300 underline underline-offset-4 font-medium transition-colors"
                      >
                        Sign In
                      </Link>
                    </p>
                  </div>
                </form>
              </Form>
            </div>

            {/* Visual Section */}
            <div className="relative hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-800 overflow-hidden">
              {/* Animated geometric shapes */}
              <div className="absolute inset-0">
                <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float"></div>
                <div className="absolute bottom-20 right-10 w-24 h-24 bg-cyan-400/20 rounded-full blur-lg animate-float animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-blue-400/15 rounded-full blur-md animate-float animation-delay-4000"></div>
              </div>

              {/* Main content */}
              <div className="relative z-10 text-center space-y-8 p-8">
                <div className="animate-bounce-slow">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-white/20 to-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  </div>
                </div>
                
                <div className="space-y-4 animate-fadeInUp animation-delay-1000">
                  <h2 className="text-4xl font-bold text-white">Start Your Journey</h2>
                  <p className="text-blue-100 text-lg leading-relaxed">
                    Join thousands of users and unlock a world of possibilities with your new account.
                  </p>
                </div>

                {/* Feature highlights */}
                <div className="grid grid-cols-1 gap-4 mt-8 animate-fadeInUp animation-delay-1200">
                  {[
                    "🎯 Personalized Experience",
                    "🛡️ Secure & Private",
                    "⚡ Instant Access",
                    "🌍 Global Community",
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 bg-white/10 rounded-lg p-3 backdrop-blur-sm hover:bg-white/15 transition-all duration-300 transform hover:scale-105"
                    >
                      <span className="text-lg">{feature.split(" ")[0]}</span>
                      <span className="text-white/90">{feature.split(" ").slice(1).join(" ")}</span>
                    </div>
                  ))}
                </div>

                {/* Progress steps */}
                <div className="mt-8 animate-fadeInUp animation-delay-1400">
                  <div className="flex justify-center space-x-2">
                    {[1, 2, 3].map((step, index) => (
                      <div
                        key={step}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === 0 ? "bg-white" : "bg-white/30"
                        }`}
                      ></div>
                    ))}
                  </div>
                  <p className="text-white/70 text-sm mt-2">Step 1 of 3 - Create Account</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 animate-fadeIn animation-delay-1000">
          <p className="text-gray-400 text-sm">
            By creating an account, you agree to our{" "}
            <a href="#" className="text-blue-400 hover:text-blue-300 underline underline-offset-4 transition-colors">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-400 hover:text-blue-300 underline underline-offset-4 transition-colors">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-blob { animation: blob 7s infinite; }
        .animate-fadeInUp { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-slideDown { animation: slideDown 0.6s ease-out forwards; }
        .animate-slideLeft { animation: slideLeft 0.6s ease-out forwards; }
        .animate-slideRight { animation: slideRight 0.6s ease-out forwards; }
        .animate-slideUp { animation: slideUp 0.6s ease-out forwards; }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out forwards; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
        
        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-300 { animation-delay: 300ms; }
        .animation-delay-400 { animation-delay: 400ms; }
        .animation-delay-500 { animation-delay: 500ms; }
        .animation-delay-600 { animation-delay: 600ms; }
        .animation-delay-700 { animation-delay: 700ms; }
        .animation-delay-800 { animation-delay: 800ms; }
        .animation-delay-900 { animation-delay: 900ms; }
        .animation-delay-1000 { animation-delay: 1000ms; }
        .animation-delay-1200 { animation-delay: 1200ms; }
        .animation-delay-1400 { animation-delay: 1400ms; }
        .animation-delay-2000 { animation-delay: 2000ms; }
        .animation-delay-4000 { animation-delay: 4000ms; }
      `}</style>
    </div>
  );
};