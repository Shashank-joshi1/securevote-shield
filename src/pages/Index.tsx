import { useAuth } from "@/contexts/AuthContext";
import LoginPage from "@/components/LoginPage";
import VotingPage from "@/components/VotingPage";
import AdminPanel from "@/components/AdminPanel";

const Index = () => {
  const { user } = useAuth();

  if (!user) return <LoginPage />;
  if (user.role === "admin") return <AdminPanel />;
  return <VotingPage />;
};

export default Index;
