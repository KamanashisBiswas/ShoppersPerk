"use client";

import { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const COUNTRY_CODES = [
  { code: "+880", flag: "🇧🇩", name: "BD" },
  { code: "+91", flag: "🇮🇳", name: "IN" },
  { code: "+1", flag: "🇺🇸", name: "US" },
  { code: "+44", flag: "🇬🇧", name: "UK" },
];

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

type Step = "phone" | "otp";

// ─── Spinner ─────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

// ─── Decorative background ──────────────────────────────────────────────────
function Background() {
  // Each wave path is 2880 wide (2× 1440) so it tiles perfectly when slid -50%
  const wavePath1 =
    "M0,80 C160,140 320,20 480,80 C640,140 800,20 960,80 C1120,140 1280,20 1440,80 C1600,140 1760,20 1920,80 C2080,140 2240,20 2400,80 C2560,140 2720,20 2880,80 L2880,200 L0,200 Z";
  const wavePath2 =
    "M0,60 C120,110 240,10 360,60 C480,110 600,10 720,60 C840,110 960,10 1080,60 C1200,110 1320,10 1440,60 C1560,110 1680,10 1800,60 C1920,110 2040,10 2160,60 C2280,110 2400,10 2520,60 C2640,110 2760,10 2880,60 L2880,160 L0,160 Z";
  const wavePath3 =
    "M0,45 C90,80 180,10 270,45 C360,80 450,10 540,45 C630,80 720,10 810,45 C900,80 990,10 1080,45 C1170,80 1260,10 1350,45 C1440,80 1530,10 1620,45 C1710,80 1800,10 1890,45 C1980,80 2070,10 2160,45 C2250,80 2340,10 2430,45 C2520,80 2610,10 2700,45 C2790,80 2850,20 2880,45 L2880,120 L0,120 Z";

  const slideAnim = (dur: number) => ({
    x: ["0%", "-50%"],
    transition: { duration: dur, repeat: Infinity, ease: "linear" as const },
  });

  return (
    <>
      {/* Base */}
      <div className="absolute inset-0 bg-[#AC1754]" />

      {/* Light blobs for depth */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.32, 0.15] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-40 -left-40 w-120 h-120 rounded-full bg-white/20 blur-3xl"
      />
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.22, 0.1] }}
        transition={{
          duration: 13,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute -bottom-32 -right-32 w-md h-112 rounded-full bg-white/15 blur-3xl"
      />

      {/* ── Wave layer 1 — back, tallest, slowest ── */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none h-32 md:h-44">
        <motion.div
          className="absolute bottom-0 left-0 h-full"
          style={{ width: "200%" }}
          animate={slideAnim(18)}
        >
          <svg
            viewBox="0 0 2880 200"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <path d={wavePath1} fill="#ffffff" fillOpacity="0.10" />
          </svg>
        </motion.div>
      </div>

      {/* ── Wave layer 2 — mid ── */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none h-24 md:h-36">
        <motion.div
          className="absolute bottom-0 left-0 h-full"
          style={{ width: "200%" }}
          animate={slideAnim(11)}
        >
          <svg
            viewBox="0 0 2880 160"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <path d={wavePath2} fill="#ffffff" fillOpacity="0.18" />
          </svg>
        </motion.div>
      </div>

      {/* ── Wave layer 3 — front, shortest, fastest ── */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none h-16 md:h-24">
        <motion.div
          className="absolute bottom-0 left-0 h-full"
          style={{ width: "200%" }}
          animate={slideAnim(7)}
        >
          <svg
            viewBox="0 0 2880 120"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <path d={wavePath3} fill="#ffffff" fillOpacity="0.28" />
          </svg>
        </motion.div>
      </div>

      {/* ── Top wave (reversed direction) ── */}
      <div className="absolute top-0 left-0 w-full overflow-hidden pointer-events-none h-14 md:h-20 rotate-180">
        <motion.div
          className="absolute bottom-0 left-0 h-full"
          style={{ width: "200%" }}
          animate={{
            x: ["0%", "-50%"],
            transition: { duration: 14, repeat: Infinity, ease: "linear" },
          }}
        >
          <svg
            viewBox="0 0 2880 100"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <path
              d="M0,50 C240,90 480,10 720,50 C960,90 1200,10 1440,50 C1680,90 1920,10 2160,50 C2400,90 2640,10 2880,50 L2880,100 L0,100 Z"
              fill="#ffffff"
              fillOpacity="0.09"
            />
          </svg>
        </motion.div>
      </div>

      {/* Floating emoji */}
      {["💄", "✨", "🌸", "💅", "🧴", "💋"].map((e, i) => (
        <motion.span
          key={i}
          className="absolute text-2xl select-none pointer-events-none"
          style={
            [
              { top: "8%", left: "6%" },
              { top: "15%", right: "8%" },
              { top: "72%", left: "4%" },
              { top: "80%", right: "6%" },
              { top: "40%", left: "2%" },
              { top: "55%", right: "3%" },
            ][i]
          }
          animate={{
            y: [0, -12, 0],
            rotate: [0, 8, 0],
            opacity: [0.45, 0.85, 0.45],
          }}
          transition={{
            duration: 4 + i * 0.6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.4,
          }}
        >
          {e}
        </motion.span>
      ))}
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const [step, setStep] = useState<Step>("phone");

  // phone step
  const [phone, setPhone] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [phoneLoading, setPhoneLoading] = useState(false);

  // otp step
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendSecs, setResendSecs] = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // countdown timer when OTP screen is active
  useEffect(() => {
    if (step !== "otp") return;
    // initialise inside the effect with a lazy initialiser to avoid cascading renders
    const id = setTimeout(() => {
      setResendSecs(RESEND_SECONDS);
      setCanResend(false);
    }, 0);
    const interval = setInterval(() => {
      setResendSecs((s) => {
        if (s <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      clearTimeout(id);
      clearInterval(interval);
    };
  }, [step]);

  // ── handlers ──────────────────────────────────────────────────────────────
  function handleGetOtp() {
    if (phone.length < 7) {
      setPhoneError("Please enter a valid phone number");
      return;
    }
    setPhoneError("");
    setPhoneLoading(true);
    // UI-only: simulate 900ms loading then switch step
    setTimeout(() => {
      setPhoneLoading(false);
      setStep("otp");
    }, 900);
  }

  function handleOtpChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    setOtpError("");
    if (value && index < OTP_LENGTH - 1) otpRefs.current[index + 1]?.focus();
  }

  function handleOtpKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      otpRefs.current[index - 1]?.focus();
    if (e.key === "ArrowLeft" && index > 0) otpRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1)
      otpRefs.current[index + 1]?.focus();
  }

  function handleOtpPaste(e: React.ClipboardEvent) {
    const digits = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!digits) return;
    const next = Array(OTP_LENGTH).fill("");
    digits.split("").forEach((ch, i) => {
      next[i] = ch;
    });
    setOtp(next);
    otpRefs.current[Math.min(digits.length, OTP_LENGTH - 1)]?.focus();
    e.preventDefault();
  }

  function handleVerify() {
    if (otp.join("").length < OTP_LENGTH) {
      setOtpError("Please enter the complete 6-digit OTP");
      return;
    }
    setOtpError("");
    setOtpLoading(true);
    // UI-only: simulate 1.2s loading
    setTimeout(() => setOtpLoading(false), 1200);
  }

  function handleResend() {
    if (!canResend) return;
    setOtp(Array(OTP_LENGTH).fill(""));
    setOtpError("");
    // re-trigger the countdown
    setStep("phone");
    requestAnimationFrame(() => setStep("otp"));
  }

  function goBack() {
    setStep("phone");
    setOtp(Array(OTP_LENGTH).fill(""));
    setOtpError("");
  }

  const otpFilled = otp.join("").length;

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <div className="relative min-h-screen flex items-center justify-center font-fredoka px-4 py-10 overflow-hidden">
      <Background />

      {/* ── Centered card ── */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-pink-200/60 border border-pink-100 overflow-hidden"
      >
        {/* Pink accent bar at top */}
        <div className="h-1.5 w-full bg-linear-to-r from-[#AC1754] via-pink-400 to-fuchsia-400" />

        <div className="px-8 pt-8 pb-9">
          {/* Logo + tagline */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.45 }}
            className="flex flex-col items-center mb-7"
          >
            <Image
              src="/images/logo/logo.png"
              alt="Shoppers Perk"
              width={100}
              height={50}
              className="object-contain mb-2.5"
            />
            <div className="flex items-center gap-2">
              <div className="h-px w-8 bg-pink-200" />
              <p className="text-xs font-medium text-[#AC1754] tracking-widest uppercase">
                Your Beauty. Your Perk.
              </p>
              <div className="h-px w-8 bg-pink-200" />
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {/* ════════════════════════════════════════
                STEP 1 — Phone Input
            ════════════════════════════════════════ */}
            {step === "phone" && (
              <motion.div
                key="phone"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                {/* Heading */}
                <div className="mb-7">
                  <h1 className="text-[2rem] font-semibold text-gray-900 leading-tight mb-1">
                    Welcome back 👋
                  </h1>
                  <p className="text-gray-500 text-sm">
                    Enter your phone number to get started
                  </p>
                </div>

                {/* Phone field */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Phone Number
                  </label>
                  <div
                    className={[
                      "flex items-stretch rounded-xl border transition-all duration-200 overflow-hidden",
                      phoneError
                        ? "border-red-400 bg-red-50 focus-within:ring-2 focus-within:ring-red-300/30"
                        : "border-gray-200 bg-gray-50 focus-within:border-[#AC1754] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#AC1754]/20",
                    ].join(" ")}
                  >
                    {/* Country code dropdown trigger */}
                    <div className="relative shrink-0">
                      <button
                        type="button"
                        onClick={() => setShowDropdown((v) => !v)}
                        className="h-full flex items-center gap-1.5 pl-3 pr-2.5 border-r border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        <span className="text-base leading-none">
                          {selectedCountry.flag}
                        </span>
                        <span>{selectedCountry.code}</span>
                        <svg
                          className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      <AnimatePresence>
                        {showDropdown && (
                          <motion.ul
                            initial={{ opacity: 0, y: -6, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -6, scale: 0.97 }}
                            transition={{ duration: 0.13 }}
                            className="absolute top-full left-0 mt-1 w-40 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden"
                          >
                            {COUNTRY_CODES.map((c) => (
                              <li key={c.code}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedCountry(c);
                                    setShowDropdown(false);
                                  }}
                                  className={[
                                    "w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors cursor-pointer",
                                    selectedCountry.code === c.code
                                      ? "bg-pink-50 text-[#AC1754] font-medium"
                                      : "text-gray-700 hover:bg-gray-50",
                                  ].join(" ")}
                                >
                                  <span className="text-base">{c.flag}</span>
                                  <span>{c.name}</span>
                                  <span className="ml-auto text-gray-400 text-xs">
                                    {c.code}
                                  </span>
                                </button>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Number input */}
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setPhone(e.target.value.replace(/\D/g, ""));
                        setPhoneError("");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleGetOtp();
                      }}
                      placeholder="01XXXXXXXXX"
                      maxLength={11}
                      className="flex-1 min-w-0 bg-transparent px-3 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none"
                    />
                  </div>

                  {/* Error message */}
                  <AnimatePresence>
                    {phoneError && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-1.5 text-xs text-red-500 flex items-center gap-1"
                      >
                        <svg
                          className="w-3 h-3 shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {phoneError}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Get OTP button */}
                <button
                  type="button"
                  onClick={handleGetOtp}
                  disabled={phoneLoading || !phone}
                  className="w-full py-3.5 rounded-xl font-semibold text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer
                    bg-[#AC1754] text-white shadow-md shadow-[#AC1754]/30
                    hover:bg-[#951448] hover:shadow-lg hover:shadow-[#AC1754]/40
                    active:scale-[0.98]
                    disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none disabled:cursor-not-allowed"
                >
                  {phoneLoading ? (
                    <>
                      <Spinner /> Sending OTP…
                    </>
                  ) : (
                    <>
                      Get OTP <span className="text-base">→</span>
                    </>
                  )}
                </button>

                {/* Terms */}
                <p className="mt-5 text-xs text-gray-400 text-center leading-relaxed">
                  By continuing you agree to our{" "}
                  <Link href="#" className="text-[#AC1754] hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="text-[#AC1754] hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </motion.div>
            )}

            {/* ════════════════════════════════════════
                STEP 2 — OTP Verification
            ════════════════════════════════════════ */}
            {step === "otp" && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                {/* Back button */}
                <button
                  type="button"
                  onClick={goBack}
                  className="flex items-center gap-1.5 text-gray-500 hover:text-[#AC1754] text-sm font-medium mb-6 transition-colors group cursor-pointer"
                >
                  <svg
                    className="w-4 h-4 transition-transform group-hover:-translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Back
                </button>

                {/* Heading */}
                <div className="mb-7">
                  <div className="w-14 h-14 rounded-2xl bg-[#AC1754]/10 flex items-center justify-center mb-4">
                    <svg
                      className="w-7 h-7 text-[#AC1754]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.8}
                        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h1 className="text-[2rem] font-semibold text-gray-900 leading-tight mb-1">
                    Verify OTP
                  </h1>
                  <p className="text-gray-500 text-sm">
                    We sent a 6-digit code to{" "}
                    <span className="font-semibold text-gray-800">
                      {selectedCountry.code} {phone}
                    </span>
                  </p>
                </div>

                {/* OTP boxes */}
                <div
                  className="flex gap-2 justify-between mb-2"
                  onPaste={handleOtpPaste}
                >
                  {otp.map((digit, i) => (
                    <motion.input
                      key={i}
                      ref={(el) => {
                        otpRefs.current[i] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      autoFocus={i === 0}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleOtpChange(i, e.target.value)
                      }
                      onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
                        handleOtpKeyDown(i, e)
                      }
                      onFocus={(e) => e.target.select()}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.055 }}
                      className={[
                        "w-11 h-12 sm:w-12 sm:h-13 text-center text-xl font-semibold rounded-xl border-2 outline-none transition-all duration-200 cursor-text caret-[#AC1754]",
                        otpError
                          ? "border-red-400 bg-red-50 text-red-600 focus:ring-2 focus:ring-red-300/30"
                          : digit
                            ? "border-[#AC1754] bg-[#AC1754]/5 text-[#AC1754] focus:ring-2 focus:ring-[#AC1754]/20"
                            : "border-gray-200 bg-gray-50 text-gray-900 focus:border-[#AC1754] focus:bg-white focus:ring-2 focus:ring-[#AC1754]/20 hover:border-gray-300",
                      ].join(" ")}
                    />
                  ))}
                </div>

                {/* OTP error */}
                <AnimatePresence>
                  {otpError && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-1 mb-2 text-xs text-red-500 flex items-center gap-1"
                    >
                      <svg
                        className="w-3 h-3 shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {otpError}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Progress bar */}
                <div className="flex gap-1 mt-3 mb-5">
                  {otp.map((d, i) => (
                    <motion.div
                      key={i}
                      animate={{ backgroundColor: d ? "#AC1754" : "#e5e7eb" }}
                      transition={{ duration: 0.2 }}
                      className="h-1 flex-1 rounded-full"
                    />
                  ))}
                </div>

                {/* Verify button */}
                <button
                  type="button"
                  onClick={handleVerify}
                  disabled={otpLoading || otpFilled < OTP_LENGTH}
                  className="w-full py-3.5 rounded-xl font-semibold text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer
                    bg-[#AC1754] text-white shadow-md shadow-[#AC1754]/30
                    hover:bg-[#951448] hover:shadow-lg hover:shadow-[#AC1754]/40
                    active:scale-[0.98]
                    disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none disabled:cursor-not-allowed"
                >
                  {otpLoading ? (
                    <>
                      <Spinner /> Verifying…
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Verify &amp; Login
                    </>
                  )}
                </button>

                {/* Resend */}
                <p className="mt-4 text-center text-sm text-gray-500">
                  Didn&apos;t receive the code?{" "}
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResend}
                      className="text-[#AC1754] font-semibold hover:underline cursor-pointer"
                    >
                      Resend OTP
                    </button>
                  ) : (
                    <span className="text-gray-400">
                      Resend in{" "}
                      <span className="font-semibold text-gray-600 tabular-nums">
                        00:{String(resendSecs).padStart(2, "0")}
                      </span>
                    </span>
                  )}
                </p>

                {/* Security note */}
                <div className="mt-5 flex items-center gap-2.5 bg-gray-50 rounded-xl px-3.5 py-2.5 border border-gray-100">
                  <svg
                    className="w-4 h-4 text-green-500 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  <p className="text-xs text-gray-500 leading-snug">
                    Your number is secured with end-to-end encryption
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
