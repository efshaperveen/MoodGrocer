import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [stats, setStats] = useState(null);
  const [recentPlans, setRecentPlans] = useState([]);
  const [tip, setTip] = useState("");
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, recentRes, tipRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/dashboard/stats`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${BASE_URL}/api/dashboard/recent`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${BASE_URL}/api/dashboard/tip`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setStats(statsRes.data);

        // FIX: ensure array
        const recent = Array.isArray(recentRes.data)
          ? recentRes.data
          : recentRes.data?.plans ||
            recentRes.data?.recentPlans ||
            [];

        setRecentPlans(recent);

        setTip(tipRes.data.tip);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="text-white p-10">Loading Dashboard...</div>
    );
  }

  return (
    <div className="flex bg-black min-h-screen">
      <Sidebar onLogout={handleLogout} />

      <div className="flex-1 ml-20 md:ml-64">
        <Topbar user={user} onLogout={handleLogout} />

        <div className="p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, <span className="text-purple-400">{user?.name}</span> 👋
          </h1>

          <p className="text-gray-300 mb-8">
            Explore all features of your AI Diet Assistant
          </p>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { title: "⚡ Generate AI Meal Plan", desc: "Create a personalized diet instantly." },
              { title: "❤️ View Saved Plans", desc: "Check your past plans anytime." },
              { title: "🍽 Create Custom Plan", desc: "Build your own meal preferences." }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.04, translateY: -4 }}
                className="bg-[#111827] p-5 rounded-xl border border-gray-800 hover:border-purple-400 cursor-pointer transition"
              >
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-400 mt-1">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { number: stats?.totalPlans || 0, label: "Total Plans Created" },
              { number: stats?.totalRecipes || 0, label: "Total Recipes Used" },
              { number: stats?.accountAge + " Days", label: "Account Age" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-purple-600 to-purple-400 p-5 rounded-xl shadow-xl"
              >
                <h4 className="text-xl font-bold">{stat.number}</h4>
                <p className="text-sm text-black/80">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Tip of the Day */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.02, translateX: 5 }}
            className="bg-[#0f172a] border border-gray-800 p-5 rounded-xl mb-8 hover:border-purple-400 transition"
          >
            <h3 className="text-lg font-semibold mb-2">💡 Tip of the Day</h3>
            <p className="text-gray-300">{tip}</p>
          </motion.div>

          {/* Recent Plans */}
          <h2 className="text-xl font-semibold mb-3">📅 Recent Meal Plans</h2>

          <div className="space-y-3">
            {recentPlans.length === 0 && (
              <p className="text-gray-400">No recent plans found.</p>
            )}

            {recentPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, translateX: 5 }}
                className="bg-[#111827] p-4 rounded-lg border border-gray-800 hover:border-purple-400 transition cursor-pointer"
              >
                <p className="font-medium">Mood: {plan.mood}</p>
                <p className="text-sm text-gray-400">
                  Recipes: {plan.recipesCount} • {new Date(plan.date).toDateString()}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

