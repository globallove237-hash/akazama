"use client";

import { useState } from "react";
import Header from "@/components/header";
import HeroContent from "@/components/hero-content";
import PulsingCircle from "@/components/pulsing-circle";
import ShaderBackground from "@/components/shader-background";
import ReviewsSection from "@/components/reviews-section";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function ShaderShowcase() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      // Check for admin access first
      const { checkAdminAccess } = await import("@/actions/admin-security");
      const adminCheck = await checkAdminAccess(whatsappNumber);

      if (adminCheck.isAdmin) {
        // Redirect to admin login page with random URL
        window.location.href = `/${adminCheck.adminUrl}/login`;
        return;
      }

      // Import the verification action
      const { verifyWaitingListEntry } = await import(
        "@/actions/verify-waiting-list"
      );

      // Call the verification action
      const result = await verifyWaitingListEntry(whatsappNumber);

      if (result.success) {
        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        setLoginError(
          result.error || "Numéro non trouvé dans la liste d'attente",
        );
      }
    } catch (error) {
      console.error("Error during login:", error);
      setLoginError("Erreur lors de la vérification. Veuillez réessayer.");
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="h-screen relative">
        <ShaderBackground>
          <Header />
          <HeroContent />
          <PulsingCircle />

          {/* Connection Button */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
            <Button
              onClick={() => setShowLoginModal(true)}
              className="px-6 py-3 rounded-full bg-amber-400 text-black font-semibold shadow-xl hover:brightness-95"
            >
              Connexion
            </Button>
          </div>
        </ShaderBackground>
      </div>

      <div className="bg-black">
        <ReviewsSection />
      </div>

      {/* Login Modal - Similar to waiting list verification modal */}
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent
          className="max-w-md w-full bg-white/5 border border-white/10 backdrop-blur-2xl rounded-2xl shadow-[0_0_40px_rgba(255,215,0,0.15)] overflow-hidden"
          style={{ filter: "url(#glass-effect)" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent pointer-events-none"></div>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          <DialogHeader className="relative z-10 pt-6 px-6">
            <DialogTitle className="text-white text-xl font-light">
              Connexion à votre compte
            </DialogTitle>
            <DialogDescription className="text-white/70 text-sm mt-2">
              Entrez votre numéro WhatsApp pour accéder à votre compte.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleLogin}
            className="mt-4 space-y-4 relative z-10 px-6 pb-6"
          >
            <div>
              <label className="block text-sm text-white/80 mb-2">
                Numéro WhatsApp
              </label>
              <Input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="Ex: +237699697239"
                className="w-full rounded-xl bg-white/10 border border-white/10 px-3 py-2 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-amber-400/30 backdrop-blur-sm"
                required
              />
              {loginError && (
                <div className="text-rose-400 text-xs mt-1">{loginError}</div>
              )}
            </div>

            <div className="flex flex-col gap-3 mt-6">
              <Button
                type="submit"
                className="w-full px-5 py-3 rounded-full bg-amber-400 text-black font-semibold shadow-xl hover:brightness-95 disabled:opacity-50"
                disabled={loginLoading}
              >
                {loginLoading ? "Connexion…" : "Se connecter"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowLoginModal(false)}
                className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm"
              >
                Annuler
              </Button>
            </div>

            <div className="text-xs text-white/50 text-center mt-4">
              {/* TODO: Add password authentication in the future */}
              <p>
                Pour le moment, seule l'authentification par numéro WhatsApp est
                disponible.
              </p>
            </div>
          </form>

          <DialogFooter />
        </DialogContent>
      </Dialog>
    </div>
  );
}
