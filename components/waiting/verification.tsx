"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import ShaderBackground from "@/components/shader-background";
import Header from "@/components/header";
import PulsingCircle from "@/components/pulsing-circle";

export default function PricingVerification({ 
  isAuthenticated, 
  onVerify 
}: { 
  isAuthenticated: boolean; 
  onVerify: () => void;
}) {
  const [whatsapp, setWhatsapp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!whatsapp.trim()) {
      setError("Veuillez entrer votre numéro WhatsApp");
      return;
    }
    
    // Basic whatsapp format check: digits, optional + and spaces
    if (!/^\+?[0-9 \-()]{6,}$/.test(whatsapp)) {
      setError("Numéro WhatsApp invalide");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Verify the number against the database
      const { verifyWaitingListEntry } = await import("@/actions/verify-waiting-list");
      const result = await verifyWaitingListEntry(whatsapp);
      
      if (result.success) {
        onVerify();
      } else {
        setError(result.error || "Numéro non trouvé dans la liste d'attente");
      }
    } catch (err) {
      setError("Erreur lors de la vérification");
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#060515] via-[#0b0820] to-[#061018] text-slate-100 relative overflow-hidden">
      <ShaderBackground>
        <Header isAnotherPage={true} />
        <main className="relative z-20 max-w-4xl mx-auto px-6 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <section className="text-left">
              <div
                className="inline-flex items-center px-3 py-1 rounded-full bg-white/6 backdrop-blur-sm mb-6 relative"
                style={{ filter: "url(#glass-effect)" }}
              >
                <div className="absolute top-0 left-1 right-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full" />
                <Heart className="w-3.5 h-3.5 text-pink-400 mr-3" />
                <span className="text-white/90 text-sm font-light relative z-10">
                  Accès aux offres
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-white mb-4 leading-tight">
                <span className="font-medium italic instrument">Accédez</span>{" "}
                à nos
                <br />
                <span className="font-light text-white/95">Offres Premium</span>
              </h1>

              <p className="text-sm sm:text-base font-light text-white/70 mb-6 max-w-xl leading-relaxed">
                Entrez votre numéro WhatsApp pour vérifier votre inscription et accéder 
                à nos offres d'abonnement exclusives. Vous devez être dans notre liste 
                d'attente pour continuer.
              </p>

              <div className="flex items-center gap-4 flex-wrap"></div>
            </section>

            {/* Right column: verification form */}
            <aside className="relative">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 via-white/3 to-transparent border border-white/6 backdrop-blur-md shadow-2xl">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Vérification d'accès
                </h3>
                <p className="text-sm text-white/70 mb-4">
                  Veuillez entrer votre numéro WhatsApp pour accéder aux offres.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp" className="text-white">Numéro WhatsApp</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-white/50" />
                      <Input
                        id="whatsapp"
                        type="tel"
                        placeholder="+237XXXXXXXX"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40"
                      />
                    </div>
                    {error && (
                      <p className="text-sm text-red-400">{error}</p>
                    )}
                  </div>
                  
                  <Button 
                    type="submit"
                    className="w-full px-5 py-3 rounded-full bg-amber-400 text-black font-semibold shadow-xl hover:brightness-95 disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {isLoading ? "Vérification..." : "Accéder aux offres"}
                  </Button>
                </form>
                
                <div className="mt-6 text-center">
                  <p className="text-white/70 text-sm">
                    Vous n'êtes pas encore dans la liste d'attente ?
                  </p>
                  <Button 
                    variant="link" 
                    className="text-amber-400 hover:text-amber-300 p-0 mt-1"
                    onClick={() => router.push("/waiting-list")}
                  >
                    Rejoindre la liste d'attente
                  </Button>
                </div>

                <p className="text-xs text-white/50 mt-4">
                  Seuls les membres inscrits dans notre liste d'attente peuvent accéder aux offres.
                </p>
              </div>
            </aside>
          </div>
        </main>
        <PulsingCircle />
      </ShaderBackground>
    </div>
  );
}