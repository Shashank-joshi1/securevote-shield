import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import LandingPage from "@/components/LandingPage";
import LoginPage from "@/components/LoginPage";
import VotingPage from "@/components/VotingPage";
import AdminPanel from "@/components/AdminPanel";

const Index = () => {
  const { user } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  if (user?.role === "admin") return <AdminPanel />;
  if (user) return <VotingPage />;
  if (showLogin) return <LoginPage onBack={() => setShowLogin(false)} />;
  return <LandingPage onGetStarted={() => setShowLogin(true)} />;
};

export default Index;
