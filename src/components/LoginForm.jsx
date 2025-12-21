"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import { FaEnvelope, FaLock, FaSignInAlt, FaInfoCircle } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function LoginForm() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    e.preventDefault();
    setError("");
    const target = e.target;
    const name = target.name;
    const value = target.value;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      const signinAttempt = await signIn.create({
        ...form,
      });

      if (signinAttempt.status == "complete") {
        await setActive({ session: signinAttempt.createdSessionId });
        router.replace("/");
      } else {
        setError(JSON.stringify(signinAttempt, null, 2));
        console.error("Error login status not complete:", signinAttempt);
      }
    } catch (error) {
      setError(error.message);
      console.error("error during login", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) return null;

  const InputGroup = ({
    label,
    name,
    type = "text",
    placeholder,
    icon: Icon,
  }) => (
    <div className="space-y-2">
      <label className="text-sm font-bold text-gray-700 ml-1">{label}</label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
          <Icon />
        </div>
        <input
          type={type}
          name={name}
          onChange={handleChange}
          className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-white focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-200 font-medium text-gray-700 placeholder:text-gray-400"
          placeholder={placeholder}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-64px)] bg-secondary/5 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl shadow-gray-200/50 p-8 md:p-10 border border-white/50">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-secondary mb-2">
            Welcome Back
          </h1>
          <p className="text-muted-text">
            Enter your credentials to access the workspace.
          </p>
        </div>

        {/* Global Error */}
        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium mb-6 flex items-start gap-2 animate-pulse">
            <FaInfoCircle className="mt-0.5 shrink-0" />
            <span className="break-words">{error}</span>
          </div>
        )}

        {/* Temp Credentials Info */}
        <div className="mb-8 p-4 bg-orange-50 border border-orange-100 rounded-xl text-orange-900 text-sm leading-relaxed flex gap-3">
          <FaInfoCircle className="text-orange-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-orange-700 mb-1">Demo Access</p>
            <p>
              <span className="font-semibold text-orange-800">Email:</span>{" "}
              dyer@handloom.com
            </p>
            <p>
              <span className="font-semibold text-orange-800">Pasword:</span>{" "}
              dyer@handloom
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputGroup
            label="Email Address"
            name="identifier"
            placeholder="e.g. user@example.com"
            icon={FaEnvelope}
          />

          <InputGroup
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            icon={FaLock}
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${
              loading
                ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                : "bg-primary text-white hover:bg-primary/90 hover:-translate-y-1 hover:shadow-primary/30"
            }`}
          >
            {loading ? (
              <AiOutlineLoading3Quarters className="animate-spin" />
            ) : (
              <>
                Login <FaSignInAlt className="opacity-80" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm font-medium text-gray-500">
            New to the platform?{" "}
            <Link
              href="/register"
              className="text-primary hover:text-secondary font-bold transition-colors"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
