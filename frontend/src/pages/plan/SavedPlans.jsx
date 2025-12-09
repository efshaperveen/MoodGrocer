import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";

const SavedPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

 const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${BASE_URL}/api/plans/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPlans(res.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-white text-xl">
        Loading your saved plans...
      </div>
    );
  }

  return (
    <div className="flex bg-black min-h-screen">
      {/* Sidebar */}
      <Sidebar onLogout={handleLogout} />

      <div className="flex-1 ml-20 md:ml-64">
        {/* Topbar */}
        <Topbar user={user} onLogout={handleLogout} />

        {/* PAGE CONTENT */}
        <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-16 px-4">
          <h1 className="text-4xl font-bold text-center text-purple-400 mb-10">
            Your Saved Diet Plans ❤️
          </h1>

          {plans.length === 0 ? (
            <p className="text-center text-gray-300 text-lg">
              No saved plans found. Generate a new plan!
            </p>
          ) : (
            <div className="grid gap-7 sm:grid-cols-2  lg:grid-cols-3">
              {plans.map((plan) => (
                <motion.div
                  key={plan._id}
                  className=" bg-gray-800/60 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-gray-700"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.07 }} // <-- Framer Motion hover zoom
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl font-semibold text-purple-300">
                    Mood: {plan.mood}
                  </h2>

                  <p className="text-gray-300 mt-2 text-sm">
                    Week Start:{" "}
                    {new Date(plan.weekStart).toLocaleDateString("en-IN")}
                  </p>

                  <div className="mt-4 flex justify-between items-center">
                    <Link
                      to={`/plans/${plan._id}`}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white"
                    >
                      View Details
                    </Link>

                    <Link
                      to={`/plans/${plan._id}`}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"
                    >
                      Download
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedPlans;
