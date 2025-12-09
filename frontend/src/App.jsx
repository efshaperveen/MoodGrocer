import { Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import { AuthProvider } from "./context/AuthContext";
import GeneratePlan from "./pages/plan/GeneratePlan";
import PlanDetails from "./pages/plan/PlanDetails";
import SavedPlans from "./pages/plan/SavedPlans";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/generate-plan" element={<GeneratePlan />} />
        <Route path="/saved-plans" element={<SavedPlans />} />
        <Route path="/plans/:id" element={<PlanDetails />} />
      </Routes>
    </AuthProvider>
  );
}
