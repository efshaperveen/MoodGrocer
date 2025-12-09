import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    diet: "mixed",
    allergies: "",
    defaultServings: 2,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

   const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/api/users/register`, {
        name: form.name,
        email: form.email,
        password: form.password,
        preferences: {
          diet: form.diet,
          allergies: form.allergies.split(",").map((a) => a.trim()),
          defaultServings: form.defaultServings,
        },
      });
      console.log(res.data);
      alert("Registration Successful!");
      setForm({
        name: "",
        email: "",
        password: "",
        diet: "mixed",
        allergies: "",
        defaultServings: 2,
      });

      navigate("/login")
    } catch (error) {
      console.error(error);
      alert("Registration Failed");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black from-blue-900 via-black to-slate-900 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-gray-900 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/20"
      >
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div whileHover={{ scale: 1.02 }}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:outline-none"
              required
            />
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:outline-none"
              required
            />
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:outline-none"
              required
            />
          </motion.div>

          <div className="flex gap-2">
            <motion.div whileHover={{ scale: 1.02 }} className="w-1/2">
              <select
                name="diet"
                value={form.diet}
                onChange={handleChange}
                className="w-full p-3 bg-black/40 border border-white/20 rounded-xl text-white"
              >
                <option value="mixed">Mixed</option>
                <option value="veg">Vegetarian</option>
                <option value="non-veg">Non-Veg</option>
                <option value="vegan">Vegan</option>
              </select>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} className="w-1/2">
              <input
                type="number"
                min="1"
                name="defaultServings"
                placeholder="Servings"
                value={form.defaultServings}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:outline-none"
              />
            </motion.div>
          </div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <input
              type="text"
              name="allergies"
              placeholder="Allergies (comma separated)"
              value={form.allergies}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:outline-none"
            />
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-purple-500 hover:bg-purple-600 text-white p-3 rounded-xl font-semibold shadow-lg"
          >
            Register
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
