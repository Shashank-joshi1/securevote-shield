import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/AuthContext";
import { CANDIDATES, markVoted, storeEncryptedVote, hasUserVoted } from "@/lib/store";
import { encryptVote } from "@/lib/crypto";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Vote, Shield, Lock, LogOut } from "lucide-react";

export default function VotingPage() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [selected, setSelected] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [voted, setVoted] = useState(() => hasUserVoted(user!.id));
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleVote = async () => {
    if (!selected || !user) return;
    setSubmitting(true);
    try {
      const candidate = CANDIDATES.find((c) => c.id === selected)!;
      const encrypted = await encryptVote(JSON.stringify({ candidateId: candidate.id, candidateName: candidate.name }));
      storeEncryptedVote(user.id, encrypted);
      markVoted(user.id);
      setVoted(true);
      toast({ title: "Vote Submitted!", description: "Your vote has been encrypted and stored securely." });
    } catch {
      toast({ title: "Error", description: "Failed to submit vote", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (voted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4 animate-fade-in">
        <div className="text-center space-y-6 max-w-md animate-scale-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/10">
            <CheckCircle2 className="w-10 h-10 text-accent" />
          </div>
          <h1 className="text-3xl font-bold">Vote Recorded</h1>
          <p className="text-muted-foreground">
            Your encrypted vote has been securely stored. Thank you for participating in the democratic process.
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground bg-muted p-3 rounded-lg">
            <Lock className="w-3 h-3" />
            Your vote is protected with AES-256-GCM encryption
          </div>
          <Button variant="outline" onClick={logout} className="gap-2">
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg">SecureVote</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Welcome, <strong className="text-foreground">{user?.username}</strong></span>
            <Button variant="ghost" size="sm" onClick={logout} className="gap-1.5">
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="text-center space-y-2 mb-10">
          <h1 className="text-3xl font-bold">Cast Your Vote</h1>
          <p className="text-muted-foreground">Select your preferred candidate below. Your vote will be encrypted before storage.</p>
        </div>

        <div className="grid gap-3">
          {CANDIDATES.map((candidate) => (
            <Card
              key={candidate.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                selected === candidate.id
                  ? "ring-2 ring-primary shadow-md"
                  : "hover:border-primary/30"
              }`}
              onClick={() => setSelected(candidate.id)}
            >
              <CardContent className="flex items-center gap-4 p-5">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                  style={{ backgroundColor: candidate.color, color: "white" }}
                >
                  {candidate.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">{candidate.name}</p>
                  <p className="text-sm text-muted-foreground">{candidate.party}</p>
                </div>
                {selected === candidate.id && (
                  <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center gap-4">
          <Button
            size="lg"
            disabled={!selected || submitting}
            onClick={() => setConfirmOpen(true)}
            className="gap-2 px-8"
          >
            <Vote className="w-5 h-5" />
            {submitting ? "Encrypting & Submitting..." : "Submit Encrypted Vote"}
          </Button>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Lock className="w-3 h-3" /> Your selection will be encrypted with AES-256-GCM before storage
          </p>
        </div>
      </main>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Your Vote</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-4">
                <p>You are about to cast your vote for:</p>
                {selected && (() => {
                  const candidate = CANDIDATES.find((c) => c.id === selected)!;
                  return (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                        style={{ backgroundColor: candidate.color, color: "white" }}
                      >
                        {candidate.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{candidate.name}</p>
                        <p className="text-sm text-muted-foreground">{candidate.party}</p>
                      </div>
                    </div>
                  );
                })()}
                <p className="text-sm">This action cannot be undone. Your vote will be encrypted and submitted.</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Go Back</AlertDialogCancel>
            <AlertDialogAction onClick={handleVote} disabled={submitting}>
              {submitting ? "Submitting..." : "Confirm & Encrypt Vote"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
