import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import LoginScene from "../../components/three/LoginScene";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mood, setMood] = useState(null); // optional: makes 3D react
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const res = await login(email, password);
    if (res.ok) {
      navigate("/dashboard");
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black from-slate-900 to-slate-800 text-white">
      {/* 3D background */}
      <div className="absolute inset-0 -z-10 opacity-70">
        <LoginScene mood={mood} />
      </div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl p-6 bg-gray-900 rounded-2xl backdrop-blur-md shadow-xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* left: form */}
          <div className="p-3">
            <h2 className="text-3xl font-bold mb-2">Welcome back</h2>
            <p className="text-sm text-slate-300 mb-4">
              Sign in to generate your mood-based grocery plan.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Email</label>
                <input
                  type="email"
                  className="w-full p-3 rounded-lg bg-white/5 border border-slate-600"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Password</label>
                <input
                  type="password"
                  className="w-full mb-4 p-3 rounded-lg bg-white/5 border border-slate-600"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 p-3 rounded-lg bg-purple-500 hover:bg-purple-600 disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>

              {error && (
                <div className="text-rose-400 text-sm mt-2">{error}</div>
              )}
            </form>

            <div className="mt-6 text-sm text-slate-300">
              Don't have an account?{" "}
              <button
                className="text-purple-500"
                onClick={() => navigate("/register")}
              >
                Create one
              </button>
            </div>
          </div>

          {/* right: decorative / info */}
          <div className="p-3 flex flex-col justify-center">
            <div className="mb-4">
              <h3 className="text-lg font-medium">Why mood-based?</h3>
              <p className="text-sm text-slate-300">
                We combine your mood & dietary preferences to generate a
                personalized weekly grocery list and simple recipes.
              </p>
            </div>

            <div className="mt-6">
              <div className="bg-white/5 p-4 rounded-lg">
                <div className="text-xs text-slate-300 mb-1">
                  Select your mood:
                </div>
                <div className="flex gap-3 text-lg">
                  <span className="cursor-pointer hover:scale-110 transition">
                    😄
                  </span>
                  <span className="cursor-pointer hover:scale-110 transition">
                    😴
                  </span>
                  <span className="cursor-pointer hover:scale-110 transition">
                    😫
                  </span>
                  <span className="cursor-pointer hover:scale-110 transition">
                    🏃
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-2">
                  Your mood helps us create better meal plans.
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
