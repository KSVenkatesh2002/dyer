"use client";
import { useSignUp } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaKey,
  FaArrowRight,
  FaInfoCircle,
} from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const RegisterForm = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [code, setCode] = useState("");
  const [verify, setVerify] = useState(false);
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    emailAddress: "",
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

  async function handleVerificationSubmit(e) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");

    try {
      const signupAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (signupAttempt.status === "complete") {
        await setActive({ session: signupAttempt.createdSessionId });
        router.replace("/");
      } else {
        console.error(
          "Error status not complete:",
          JSON.stringify(signupAttempt, null, 2)
        );
      }
    } catch (error) {
      setError(error.message);
      console.error(
        "Error while otp verification:",
        JSON.stringify(error, null, 2)
      );
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      await signUp.create({
        ...form,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setVerify(true);
    } catch (error) {
      setError(error.message);
      console.error("error during register", error);
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
    value,
    onChange,
  }) => (
    <div className="space-y-2">
      <label className="text-sm font-bold text-gray-700 ml-1">{label}</label>
      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
            <Icon />
          </div>
        )}

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full ${
            Icon ? "pl-11" : "pl-4"
          } pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-white focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-200 font-medium text-gray-700 placeholder:text-gray-400`}
          placeholder={placeholder}
        />
      </div>
    </div>
  );

  if (verify) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-secondary/5 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl shadow-gray-200/50 p-8 md:p-10 border border-white/50 text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
            <FaKey className="text-2xl" />
          </div>
          <h2 className="text-2xl font-black text-secondary mb-2">
            Verify Email
          </h2>
          <p className="text-muted-text mb-8">
            Please enter the code sent to your email.
          </p>

          {error && (
            <p className="text-sm text-red-500 mb-4 bg-red-50 p-3 rounded-lg">
              {error}
            </p>
          )}

          <form onSubmit={handleVerificationSubmit} className="space-y-6">
            <InputGroup
              label="Verification Code"
              name="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Ex: 123456"
              icon={null}
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
                "Verify Account"
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-secondary/5 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl shadow-gray-200/50 p-8 md:p-10 border border-white/50">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-secondary mb-2">
            Create Account
          </h1>
          <p className="text-muted-text">
            Join Dyer Handloom to manage your workshop.
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
            <p className="font-bold text-orange-700 mb-1">
              Already have an account?
            </p>
            <p>
              Use the demo credentials on the login page if you just want to
              look around.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputGroup
            label="Username"
            name="username"
            onChange={handleChange}
            placeholder="Choose a username"
            icon={FaUser}
          />
          <InputGroup
            label="Email Address"
            name="emailAddress"
            onChange={handleChange}
            placeholder="name@example.com"
            icon={FaEnvelope}
          />
          <InputGroup
            label="Password"
            name="password"
            type="password"
            onChange={handleChange}
            placeholder="Create a strong password"
            icon={FaLock}
          />

          {/* CAPTCHA Widget Container - Needed for Clerk */}
          <div id="clerk-captcha" className="my-2"></div>

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
                Create Account <FaArrowRight className="opacity-80" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm font-medium text-gray-500">
            Already registered?{" "}
            <Link
              href="/login"
              className="text-primary hover:text-secondary font-bold transition-colors"
            >
              Login Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
