import { useState } from "react";
import axios from "axios";
import Toast from "./Toast.jsx";

const MainForm = () => {
  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [, setUser] = useState(() => {
    const savedUser = localStorage.getItem("vault_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const endpoint =
      mode === "login"
        ? `${import.meta.env.VITE_BASE_URL}/api/v0/auth/login`
        : `${import.meta.env.VITE_BASE_URL}/api/v0/auth/register`;

    try {
      const res = await axios.post(endpoint, formData, {
        withCredentials: true,
      });

      setToast({
        type: "success",
        message:
          res.data?.message ||
          (mode === "login"
            ? "Welcome back to Vault."
            : "Account created successfully."),
      });

      console.log(res);

      const userData = { email: formData.email, token: res.data.token };
      localStorage.setItem("vault_user", JSON.stringify(userData));
      setUser(userData);

      if (mode === "register") {
        setMode("login");
      }
    } catch (err) {
      setToast({
        type: "error",
        message:
          err.response?.data?.message ||
          "Authentication failed. Please verify credentials.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full bg-[#080808] font-['Bricolage_Grotesque',sans-serif] text-neutral-100 flex items-center justify-center p-4 sm:p-6 overflow-hidden selection:bg-orange-500/30 selection:text-orange-200">
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Modern Radial Mesh Background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(249,115,22,0.12),transparent_45%)]" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-48 bg-[radial-gradient(ellipse_at_bottom,rgba(255,255,255,0.03),transparent_70%)]" />

      {/* Main Glassmorphic Card */}
      <div className="relative w-full max-w-[420px]">
        {/* Subtle Ambient Border Glow */}
        <div className="absolute -inset-px rounded-3xl bg-gradient-to-b from-white/15 via-white/5 to-transparent pointer-events-none" />

        <div className="relative rounded-3xl border border-white/10 bg-[#0d0d0e]/80 backdrop-blur-2xl p-7 sm:p-9 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.85)]">
          {/* Subtle Top Accent Beam */}
          <div className="pointer-events-none absolute left-1/2 top-0 h-[1.5px] w-1/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />

          {/* Brand Mark */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-neutral-900 border border-white/10 shadow-inner">
              <span className="text-sm font-bold text-orange-400">V</span>
            </div>
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium tracking-tight text-neutral-400">
              v0.1-preview
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-1 mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {mode === "login" ? "Access your Vault" : "Create your key"}
            </h1>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {mode === "login"
                ? "Enter your credentials to unlock your private records."
                : "Initialize a localized, encrypted thought space."}
            </p>
          </div>

          {/* Segmented Pill Control */}
          <div className="mb-6 grid grid-cols-2 rounded-xl border border-white/10 bg-black/50 p-1 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`rounded-lg py-2 text-xs font-semibold tracking-tight transition-all duration-200 ${
                mode === "login"
                  ? "bg-neutral-800 text-white shadow-sm"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`rounded-lg py-2 text-xs font-semibold tracking-tight transition-all duration-200 ${
                mode === "register"
                  ? "bg-neutral-800 text-white shadow-sm"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-[11px] font-medium tracking-wide uppercase text-neutral-400"
              >
                Identity (Email)
              </label>
              <input
                id="email"
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@domain.com"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-3 text-sm text-white placeholder-neutral-600 outline-none transition duration-150 focus:border-orange-500/70 focus:bg-orange-500/[0.02] focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-[11px] font-medium tracking-wide uppercase text-neutral-400"
                >
                  Secret Key
                </label>
                {mode === "login" && (
                  <button
                    type="button"
                    className="text-[11px] text-neutral-500 transition hover:text-orange-400"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <input
                id="password"
                type="password"
                name="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-3 text-sm text-white placeholder-neutral-600 outline-none transition duration-150 focus:border-orange-500/70 focus:bg-orange-500/[0.02] focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-orange-500 py-3.5 text-xs font-bold uppercase tracking-wider text-black transition-all duration-200 hover:bg-orange-400 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-[0_12px_24px_-8px_rgba(249,115,22,0.35)]"
            >
              {loading
                ? "Decrypting..."
                : mode === "login"
                  ? "Authenticate Session"
                  : "Generate Account"}
            </button>
          </form>

          {/* Bottom Security Assurance */}
          <div className="mt-8 border-t border-white/5 pt-4 text-center">
            <p className="text-[11px] text-neutral-500 flex items-center justify-center gap-1.5 font-medium">
              <svg
                className="size-3.5 text-neutral-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Encrypted end-to-end with signed JWT credentials
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MainForm;
