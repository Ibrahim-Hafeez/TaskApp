import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import TaskPage from "@/pages/tasks/TaskPage";
import TodayPage from "@/pages/today/TodayPage";
import FocusPage from "@/pages/focus/FocusPage";
import LoginPage from "@/pages/login/LoginPage";
import SignupPage from "@/pages/signup/SignupPage";
import ForgotPasswordPage from "@/pages/login/ForgotPasswordPage";
import ResetPasswordPage from "./pages/login/ResetPasswordPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      <Route element={<DashboardLayout />}>
        <Route path="/today" element={<TodayPage />} />
        <Route path="/tasks" element={<TaskPage />} />
        <Route path="/focus" element={<FocusPage />} />
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
    </Routes>
  );
}

export default App;
