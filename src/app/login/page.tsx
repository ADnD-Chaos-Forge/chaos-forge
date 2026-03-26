"use client";

import { useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      if (!isSupabaseConfigured()) {
        setError(
          "Supabase ist nicht konfiguriert. Bitte .env.local mit NEXT_PUBLIC_SUPABASE_URL und NEXT_PUBLIC_SUPABASE_ANON_KEY anlegen."
        );
        setLoading(false);
        return;
      }

      // Test-User Bypass: try auto-login, API checks if email matches
      const testRes = await fetch("/api/test-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (testRes.ok) {
        const testData = await testRes.json();
        const supabase = createClient();
        await supabase.auth.setSession({
          access_token: testData.access_token,
          refresh_token: testData.refresh_token,
        });
        window.location.href = "/characters";
        return;
      }
      // Not a test user — fall through to normal Magic Link

      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
      } else {
        setMessage("Prüfe dein Postfach — wir haben dir einen Magic Link gesendet!");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ein unbekannter Fehler ist aufgetreten.");
    }

    setLoading(false);
  }

  return (
    <div className="flex flex-1 items-center justify-center px-6" data-testid="login-page">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-heading text-2xl text-primary">
            Willkommen, Abenteurer
          </CardTitle>
          <CardDescription>
            Melde dich mit deiner E-Mail an — wir senden dir einen magischen Link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="held@chaosrpg.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                data-testid="login-email-input"
              />
            </div>
            <Button type="submit" disabled={loading} data-testid="login-submit-button">
              {loading ? "Sende Magic Link..." : "Magic Link senden"}
            </Button>
            {message && (
              <p className="text-sm text-green-500" data-testid="login-success-message">
                {message}
              </p>
            )}
            {error && (
              <p className="text-sm text-destructive" data-testid="login-error-message">
                {error}
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
