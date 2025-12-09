import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
// PDF libraries
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PlanDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch plan by ID
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${BASE_URL}/api/plans/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPlan(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [id]);

  // Delete Plan
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${BASE_URL}/api/plans/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate("/saved-plans");
    } catch (err) {
      console.error(err);
    }
  };

  // MULTI-PAGE PDF DOWNLOAD
  const downloadPDF = async () => {
    const element = document.getElementById("plan-content");

    // Capture long content
    const canvas = await html2canvas(element, {
      scale: 2,
      scrollY: -window.scrollY,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("diet-plan.pdf");
  };

  if (loading) return <p className="text-white text-center mt-20">Loading...</p>;
  if (!plan) return <p className="text-red-400 text-center mt-20">Plan not found</p>;

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white">

      {/* WRAP EVERYTHING TO EXPORT IN PDF */}
      <div id="plan-content">

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto mb-10"
        >
          <h1 className="text-4xl font-bold text-purple-400">Your Diet Plan</h1>
          <p className="text-gray-300 mt-1">
            Mood: <span className="text-purple-300">{plan.mood}</span>
          </p>

          <button
            onClick={() => navigate("/saved-plans")}
            className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg"
          >
            ← Back
          </button>
        </motion.div>

        {/* Groceries Section */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-4xl mx-auto bg-gray-800/60 p-6 rounded-2xl mb-10 shadow-xl"
        >
          <h2 className="text-2xl font-semibold text-purple-300 mb-4">Groceries</h2>
          <ul className="space-y-2">
            {plan.groceries.map((g, index) => (
              <li key={index} className="flex justify-between bg-gray-700/40 p-3 rounded-lg">
                <span>{g.item}</span>
                <span className="text-gray-300">{g.quantity}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Recipes Section */}
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-2xl font-semibold text-purple-300">Recipes</h2>

          {plan.recipes.map((recipe, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-800/70 p-6 rounded-2xl shadow-lg border border-gray-700"
            >
              <h3 className="text-xl font-bold text-purple-400">{recipe.title}</h3>
              <p className="text-sm text-gray-400 mb-3">Meal: {recipe.mealType}</p>

              {/* Ingredients */}
              <div className="mt-4">
                <h4 className="text-lg font-semibold text-purple-300">Ingredients</h4>
                <ul className="mt-2 space-y-2">
                  {recipe.ingredients.map((ing, i) => (
                    <li key={i} className="flex justify-between bg-gray-700/40 p-2 rounded-lg">
                      <span>{ing.name}</span>
                      <span className="text-gray-300">{ing.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructions */}
              <div className="mt-4">
                <h4 className="text-lg font-semibold text-purple-300">Instructions</h4>
                <p className="mt-2 text-gray-300 bg-gray-700/40 p-3 rounded-lg">
                  {recipe.instructions}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Download & Delete Buttons */}
      <div className="max-w-4xl mx-auto mt-10 space-y-4">
        
        <button
          onClick={downloadPDF}
          className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-xl text-lg font-semibold"
        >
          Download as PDF
        </button>

        <button
          onClick={handleDelete}
          className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-xl text-lg font-semibold"
        >
          Delete Plan
        </button>

      </div>

    </div>
  );
};

export default PlanDetails;

