"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { setAuth } from "@/lib/auth";
import { AuthResponse } from "@/types";
import { Calendar, Mail, Lock } from "lucide-react";
import { login } from "@/lib/api";

interface LoginForm {
  email: string;
  password: string;
}

function InputField({
  label,
  type,
  icon: Icon,
  error,
  register,
}: {
  label: string;
  type: string;
  icon: any;
  error?: string;
  register: any;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="mt-1 relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type={type}
          {...register}
          className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setApiError("");
    try {
      const response = await login(data.email, data.password);
      const authData: AuthResponse = response.data;
      setAuth(authData.token, authData.user);
      router.push("/dashboard");
    } catch (err: any) {
      setApiError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full space-y-6">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {apiError && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {apiError}
            </div>
          )}

          <InputField
            label="Email address"
            type="email"
            icon={Mail}
            register={register("email", { required: "Email is required" })}
            error={errors.email?.message}
          />

          <InputField
            label="Password"
            type="password"
            icon={Lock}
            register={register("password", {
              required: "Password is required",
            })}
            error={errors.password?.message}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <p className="text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/register")}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Register here
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
