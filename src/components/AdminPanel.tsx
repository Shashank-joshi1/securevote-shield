import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { getAllEncryptedVotes, getTotalVoters, getTotalVotesCast, CANDIDATES } from "@/lib/store";
import { decryptVote } from "@/lib/crypto";
import { Shield, LogOut, Lock, Unlock, Users, Vote, BarChart3 } from "lucide-react";

interface DecryptedResult {
  candidateId: string;
  candidateName: string;
}

export default function AdminPanel() {
  const { user, logout } = useAuth();
  const [results, setResults] = useState<Map<string, number> | null>(null);
  const [decrypting, setDecrypting] = useState(false);
  const [rawEncrypted, setRawEncrypted] = useState<string[]>([]);

  const encryptedVotes = getAllEncryptedVotes();
  const totalVoters = getTotalVoters();
  const totalVotes = getTotalVotesCast();

  const handleDecrypt = async () => {
    setDecrypting(true);
    try {
      const tally = new Map<string, number>();
      const encrypted: string[] = [];
      CANDIDATES.forEach((c) => tally.set(c.id, 0));

      for (const vote of encryptedVotes) {
        encrypted.push(vote.encryptedCandidate.slice(0, 40) + "...");
        const decrypted: DecryptedResult = JSON.parse(await decryptVote(vote.encryptedCandidate));
        tally.set(decrypted.candidateId, (tally.get(decrypted.candidateId) || 0) + 1);
      }
      setRawEncrypted(encrypted);
      setResults(tally);
    } catch {
      console.error("Decryption failed");
    } finally {
      setDecrypting(false);
    }
  };

  const maxVotes = results ? Math.max(...results.values(), 1) : 1;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg">SecureVote</span>
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.username}</span>
            <Button variant="ghost" size="sm" onClick={logout} className="gap-1.5">
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Election Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalVoters}</p>
                <p className="text-xs text-muted-foreground">Registered Voters</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Vote className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalVotes}</p>
                <p className="text-xs text-muted-foreground">Votes Cast</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Lock className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalVotes > 0 ? "Encrypted" : "No Data"}</p>
                <p className="text-xs text-muted-foreground">Vote Status</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Encrypted votes preview */}
        {encryptedVotes.length > 0 && !results && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lock className="w-5 h-5" /> Encrypted Vote Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-6">
                {encryptedVotes.slice(0, 5).map((v, i) => (
                  <div key={i} className="font-mono text-xs bg-muted p-2.5 rounded-md text-muted-foreground truncate">
                    {v.encryptedCandidate.slice(0, 60)}...
                  </div>
                ))}
                {encryptedVotes.length > 5 && (
                  <p className="text-xs text-muted-foreground">+{encryptedVotes.length - 5} more encrypted records</p>
                )}
              </div>
              <Button onClick={handleDecrypt} disabled={decrypting} className="gap-2">
                <Unlock className="w-4 h-4" />
                {decrypting ? "Decrypting Votes..." : "Decrypt & Tally Results"}
              </Button>
            </CardContent>
          </Card>
        )}

        {encryptedVotes.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              <Vote className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p>No votes have been cast yet.</p>
            </CardContent>
          </Card>
        )}

        {/* Decrypted Results */}
        {results && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5" /> Election Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {CANDIDATES.map((candidate) => {
                const count = results.get(candidate.id) || 0;
                const pct = totalVotes > 0 ? (count / totalVotes) * 100 : 0;
                return (
                  <div key={candidate.id} className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{candidate.name}</span>
                      <span className="text-muted-foreground">{count} votes ({pct.toFixed(1)}%)</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${(count / maxVotes) * 100}%`,
                          backgroundColor: candidate.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}

              {rawEncrypted.length > 0 && (
                <div className="mt-6 pt-4 border-t">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Decrypted from encrypted ciphertexts:</p>
                  <div className="space-y-1">
                    {rawEncrypted.slice(0, 3).map((e, i) => (
                      <p key={i} className="font-mono text-[10px] text-muted-foreground truncate">{e}</p>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
