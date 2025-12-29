import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Lock, Film } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const [, setLocation] = useLocation();
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Login erfolgreich!");
        setLocation("/");
      } else {
        toast.error(data.message || "Login fehlgeschlagen");
        setPassword("");
      }
    } catch (error) {
      toast.error("Verbindungsfehler");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background bg-grain flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Film className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-heading font-bold text-foreground">
            Analog<span className="text-primary">DB</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Bitte melde dich an, um auf deine Film-Datenbank zuzugreifen.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Passwort
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Passwort eingeben"
                className="pl-10"
                disabled={isLoading}
                data-testid="input-password"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
            data-testid="button-login"
          >
            {isLoading ? "Wird geladen..." : "Anmelden"}
          </Button>
        </form>

        <div className="text-center text-xs text-muted-foreground pt-4 border-t border-border">
          <p>Standard-Passwort: <code className="bg-muted px-2 py-0.5 rounded">analogfilm2024</code></p>
          <p className="mt-1 text-[10px]">Ändere das Passwort in server/auth.ts</p>
        </div>
      </Card>
    </div>
  );
}
