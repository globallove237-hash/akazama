"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, EyeOff, Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { setAdminSession } from "@/actions/admin-security";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const params = useParams();
  const router = useRouter();
  const adminUrl = params.adminUrl as string;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Simple admin credentials check (in production, use proper authentication)
      if (username === "admin" && password === "admin123") {
        // Set admin session
        const result = await setAdminSession(adminUrl);
        
        if (result.success) {
          // Redirect to admin dashboard using the same admin URL
          router.push(`/${adminUrl}`);
        } else {
          setError("Erreur lors de la connexion");
        }
      } else {
        setError("Identifiants incorrects");
      }
    } catch (err) {
      setError("Erreur lors de la connexion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#060515] via-[#0b0820] to-[#061018] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-900/30 mb-4">
            <Shield className="h-6 w-6 text-amber-400" />
          </div>
          <CardTitle className="text-white text-xl">Accès Administrateur</CardTitle>
          <CardDescription className="text-white/70">
            Connexion sécurisée à l'interface d'administration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white">
                Nom d'utilisateur
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                placeholder="Entrez votre nom d'utilisateur"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Mot de passe
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40 pr-10"
                  placeholder="Entrez votre mot de passe"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-white/50" />
                  ) : (
                    <Eye className="h-4 w-4 text-white/50" />
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-900/20 border border-red-800/50">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connexion...
                </>
              ) : (
                "Se connecter"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-white/50">
              URL sécurisée: /{adminUrl}/login
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}