import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { loginUser, registerUser } from "@/lib/store";
import { Shield, Lock, UserPlus, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useAuth();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast({ title: "Error", description: "Please fill all fields", variant: "destructive" });
      return;
    }

    if (isRegister) {
      const result = registerUser(username.trim(), password);
      if (typeof result === "string") {
        toast({ title: "Error", description: result, variant: "destructive" });
      } else {
        setUser(result);
        toast({ title: "Welcome!", description: "Account created successfully" });
      }
    } else {
      const result = loginUser(username.trim(), password);
      if (typeof result === "string") {
        toast({ title: "Error", description: result, variant: "destructive" });
      } else {
        setUser(result);
        toast({ title: "Welcome back!", description: `Logged in as ${result.username}` });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-2">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">SecureVote</h1>
          <p className="text-muted-foreground text-sm">
            End-to-end encrypted online voting system
          </p>
        </div>

        <Card className="shadow-lg border-border/60">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">
              {isRegister ? "Create Account" : "Sign In"}
            </CardTitle>
            <CardDescription>
              {isRegister
                ? "Register to participate in the election"
                : "Enter your credentials to access the voting system"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Username</label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  autoComplete="username"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  autoComplete={isRegister ? "new-password" : "current-password"}
                />
              </div>
              <Button type="submit" className="w-full gap-2">
                {isRegister ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                {isRegister ? "Register" : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsRegister(!isRegister)}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {isRegister
                  ? "Already have an account? Sign in"
                  : "Don't have an account? Register"}
              </button>
            </div>

            {!isRegister && (
              <div className="mt-4 p-3 rounded-lg bg-muted text-xs text-muted-foreground space-y-1">
                <div className="flex items-center gap-1.5 font-medium">
                  <Lock className="w-3 h-3" /> Admin Access
                </div>
                <p>Username: <code className="text-foreground">admin</code> · Password: <code className="text-foreground">admin123</code></p>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
          <Lock className="w-3 h-3" />
          Protected with AES-256-GCM encryption
        </p>
      </div>
    </div>
  );
}
