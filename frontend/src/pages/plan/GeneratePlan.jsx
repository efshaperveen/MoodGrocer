import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
// Layout Components
import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";

export default function GeneratePlan() {
  const [mood, setMood] = useState("");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user")) || null;
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleGenerate = async () => {
    if (!mood) {
      setError("Please select your mood");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        `${BASE_URL}/api/plans/generate`,
        {
          mood,
          preferences: user?.preferences || {},
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPlan(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="flex bg-black min-h-screen">
      {/* Sidebar */}
      <Sidebar onLogout={handleLogout} />

      <div className="flex-1 ml-20 md:ml-64">
        {/* Topbar */}
        <Topbar user={user} onLogout={handleLogout} />

        {/* Page Content */}
        <div className="p-6 text-white">
          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-4xl font-bold text-purple-400 mb-6"
          >
            Generate Your AI Diet Plan ✨
          </motion.h1>

          <div className="max-w-xl mx-auto bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-lg">
            {/* Mood Selector */}
            <label className="text-lg font-semibold">Select your mood:</label>
            <select
              className="w-full mt-2 p-3 bg-black/40 border border-white/20 rounded-xl text-white"
              onChange={(e) => setMood(e.target.value)}
            >
              <option value="">-- Choose Mood --</option>
              <option value="Happy">😊 Happy</option>
              <option value="Tired">😴 Tired</option>
              <option value="Stressed">😫 Stressed</option>
              <option value="Busy">📅 Busy</option>
            </select>

            {/* Error */}
            {error && <p className="text-red-400 mt-2">{error}</p>}

            {/* Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={handleGenerate}
              className="mt-5 w-full py-3 bg-purple-600 rounded-xl font-semibold hover:bg-purple-700"
            >
              {loading ? "Generating..." : "Generate Plan"}
            </motion.button>
          </div>

          {/* Loading Animation */}
          {loading && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="mx-auto mt-10 border-4 border-purple-500 border-t-transparent rounded-full w-16 h-16"
            ></motion.div>
          )}

          {/* RESULT SECTION */}
          {plan && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-10 max-w-4xl mx-auto p-6 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl"
            >
              <h2 className="text-2xl font-bold mb-4 text-purple-300">
                Weekly Plan Generated 🎉
              </h2>

              {/* Groceries */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-yellow-300">
                  Groceries
                </h3>
                <ul className="mt-3 list-disc ml-6 space-y-1">
                  {plan.groceries.map((g, i) => (
                    <li key={i}>
                      {g.item} —{" "}
                      <span className="text-gray-300">{g.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recipes */}
              <div>
                <h3 className="text-xl font-semibold  text-yellow-300">
                  Recipes
                </h3>
                <div className="space-y-4 mt-3">
                  {plan.recipes.map((r, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      className="p-4 bg-black/40 border border-white/10 rounded-xl"
                    >
                      <h4 className="text-lg font-bold">{r.title}</h4>

                      <p className="text-purple-300 text-sm">
                        Meal Type: {r.mealType}
                      </p>

                      <h5 className="mt-2 font-semibold">Ingredients:</h5>
                      <ul className="list-disc ml-6 text-gray-300">
                        {r.ingredients.map((ing, idx) => (
                          <li key={idx}>
                            {ing.name} — {ing.quantity}
                          </li>
                        ))}
                      </ul>

                      <h5 className="mt-2 font-semibold">Instructions:</h5>
                      <p className="text-gray-300">{r.instructions}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
