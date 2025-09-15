"use client";

import { useState, useEffect } from "react";
import Header from "@/components/header";
import ShaderBackground from "@/components/shader-background";
import { PrincingTable } from "@/components/waiting/princing-table";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import PricingVerification from "@/components/waiting/verification";
import { checkAuthStatus } from "@/actions/auth";
import PulsingCircle from "@/components/pulsing-circle";
import MobileNavigation from "@/components/mobile-navigation";

export default function PrincingPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already authenticated on page load
  useEffect(() => {
    async function checkAuth() {
      try {
        const authResult = await checkAuthStatus();
        setIsAuthenticated(authResult.isAuthenticated);
        setUser(authResult.user);
      } catch (error) {
        console.error("Error checking auth:", error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, []);

  const handleVerify = async () => {
    // After verification, recheck auth status
    try {
      const authResult = await checkAuthStatus();
      setIsAuthenticated(authResult.isAuthenticated);
      setUser(authResult.user);
    } catch (error) {
      console.error("Error after verification:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#060515] via-[#0b0820] to-[#061018] text-slate-100 relative overflow-hidden">
        <ShaderBackground>
          <Header isAnotherPage={true} />
          <div
            className={cn(
              "absolute inset-0 z-[-10] size-full max-h-102 opacity-50",
              "[mask-image:radial-gradient(ellipse_at_center,var(--background),transparent)]",
            )}
            style={{
              backgroundImage:
                "radial-gradient(var(--foreground) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <main className="relative z-20 max-w-4xl mx-auto px-6 py-12 md:py-20 flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
              <p className="text-white/70">
                Vérification de l'authentification...
              </p>
            </div>
          </main>
          <PulsingCircle />
        </ShaderBackground>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <PricingVerification
        isAuthenticated={isAuthenticated}
        onVerify={handleVerify}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#060515] via-[#0b0820] to-[#061018] text-slate-100 relative overflow-hidden pb-16 md:pb-0">
      <ShaderBackground>
        <Header
          isAnotherPage={true}
          isAuthenticated={isAuthenticated}
          user={user}
        />
        <div
          className={cn(
            "absolute inset-0 z-[-10] size-full max-h-102 opacity-50",
            "[mask-image:radial-gradient(ellipse_at_center,var(--background),transparent)]",
          )}
          style={{
            backgroundImage:
              "radial-gradient(var(--foreground) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center py-12">
          <div
            className="inline-flex items-center px-3 py-1 rounded-full bg-white/6 backdrop-blur-sm mb-6"
            style={{ filter: "url(#glass-effect)" }}
          >
            <Heart className="w-3.5 h-3.5 text-pink-400 mr-3" />
            <span className="text-white/90 text-sm font-light">
              Nos offres d'abonnement
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-white mb-4 leading-tight">
            <span className="font-thin italic instrument">Trouvez</span> l'amour
            authentique
          </h1>

          <p className="text-sm sm:text-base font-light text-white/70 mb-6 max-w-xl leading-relaxed">
            Choisissez l'offre qui correspond à vos attentes pour une expérience
            de rencontre unique et authentique. Tous nos abonnements incluent un
            accompagnement personnalisé.
          </p>

          <div className="text-xs text-white/50 mb-12">
            <strong>Important :</strong> Les places sont limitées pour garantir
            une qualité d'expérience optimale pour tous nos membres.
          </div>

          <PrincingTable />
        </div>
        <MobileNavigation />
      </ShaderBackground>
    </div>
  );
}
