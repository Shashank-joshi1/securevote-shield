import { Button } from "@/components/ui/button";
import { Shield, Lock, Vote, Eye, UserCheck, CheckCircle2 } from "lucide-react";
import heroImage from "@/assets/hero-shield.jpg";

interface LandingPageProps {
  onGetStarted: () => void;
}

const features = [
  {
    icon: Lock,
    title: "AES-256-GCM Encryption",
    description: "Every vote is encrypted using military-grade cryptography before storage.",
  },
  {
    icon: UserCheck,
    title: "One Person, One Vote",
    description: "Our system ensures each registered voter can only cast a single ballot.",
  },
  {
    icon: Eye,
    title: "Admin Decryption Panel",
    description: "Only authorized administrators can decrypt and tally the final results.",
  },
  {
    icon: Shield,
    title: "Tamper-Proof Storage",
    description: "Encrypted votes are stored securely, preventing unauthorized access or modification.",
  },
];

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background animate-fade-in">
      {/* Nav */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Shield className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg">SecureVote</span>
          </div>
          <Button onClick={onGetStarted} size="sm">
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Secure encryption visualization"
            className="w-full h-full object-cover opacity-20"
            width={1280}
            height={720}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        </div>
        <div className="container mx-auto px-4 py-24 md:py-32 relative z-[1] text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-3 py-1.5 rounded-full text-sm font-medium mb-6 animate-slide-up" style={{ animationDelay: "100ms", animationFillMode: "both" }}>
            <CheckCircle2 className="w-4 h-4" />
            End-to-End Encrypted
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-slide-up" style={{ animationDelay: "200ms", animationFillMode: "both" }}>
            Secure Online Voting You Can Trust
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: "300ms", animationFillMode: "both" }}>
            Cast your vote with confidence. Our system uses AES-256-GCM encryption to protect every ballot, ensuring privacy, integrity, and transparency.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "400ms", animationFillMode: "both" }}>
            <Button size="lg" onClick={onGetStarted} className="gap-2 px-8">
              <Vote className="w-5 h-5" />
              Start Voting
            </Button>
            <Button size="lg" variant="outline" onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}>
              Learn How It Works
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-muted/40">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3">How Your Vote Is Protected</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Built with industry-standard encryption and security best practices to ensure every vote counts.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="bg-card rounded-xl p-6 border shadow-sm animate-slide-up hover:shadow-md transition-shadow"
                style={{ animationDelay: `${500 + i * 100}ms`, animationFillMode: "both" }}
              >
                <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-1.5">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Cast Your Vote?</h2>
          <p className="text-muted-foreground mb-8">
            Register or sign in to participate in the election. Your voice matters.
          </p>
          <Button size="lg" onClick={onGetStarted} className="gap-2 px-8">
            <Shield className="w-5 h-5" />
            Get Started
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span>SecureVote — Encrypted Online Voting System</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Lock className="w-3 h-3" />
            Protected with AES-256-GCM Encryption
          </div>
        </div>
      </footer>
    </div>
  );
}
