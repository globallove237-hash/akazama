"use client";

import { CheckCircle, Heart, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getCustomerServiceNumbers } from "@/actions/customer-service";
import ShaderBackground from "@/components/shader-background";
import Header from "@/components/header";

export default function PaymentSuccessPage() {
  const [customerService, setCustomerService] = useState<{
    whatsappNumber?: string;
    supportNumber?: string;
  }>({});

  useEffect(() => {
    async function fetchCustomerService() {
      try {
        const result = await getCustomerServiceNumbers();
        if (result.success && result.data) {
          setCustomerService({
            whatsappNumber: result.data.whatsappNumber || undefined,
            supportNumber: result.data.supportNumber || undefined,
          });
        }
      } catch (error) {
        console.error("Error fetching customer service numbers:", error);
      }
    }

    fetchCustomerService();
  }, []);

  const handleWhatsAppContact = () => {
    const number = customerService.whatsappNumber?.replace(/\D/g, "");
    if (number) {
      // Include transaction details in the WhatsApp message
      const message = encodeURIComponent(
        "Bonjour, j'ai effectué un paiement et j'aimerais avoir des informations sur l'état de ma transaction. Mon numéro de transaction est: [NUMERO_TRANSACTION]",
      );
      window.open(`https://wa.me/${number}?text=${message}`, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#060515] via-[#0b0820] to-[#061018] text-slate-100 relative overflow-hidden">
      <ShaderBackground>
        <Header isAnotherPage={true} />
        <main className="relative z-20 max-w-md mx-auto px-4 py-12 md:py-20 flex items-center justify-center min-h-[60vh]">
          <div className="max-w-md w-full">
            <div
              className="p-6 rounded-2xl bg-white/5 border-white/10 backdrop-blur-2xl shadow-[0_0_40px_rgba(255,215,0,0.15)] overflow-hidden"
              style={{ filter: "url(#glass-effect)" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent pointer-events-none"></div>
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              <div className="relative z-10 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-900/30 mb-6">
                  <CheckCircle className="h-10 w-10 text-green-400" />
                </div>

                <h1 className="text-2xl font-bold mb-4">
                  Paiement soumis avec succès !
                </h1>

                <p className="text-white/80 mb-6 leading-relaxed">
                  Merci pour votre paiement. Notre équipe va vérifier votre
                  transaction dans les plus brefs délais.
                </p>

                <div className="bg-amber-900/20 rounded-xl p-5 mb-6 text-left">
                  <h2 className="font-bold text-amber-300 mb-3 text-lg">
                    Prochaines étapes :
                  </h2>
                  <ul className="text-sm space-y-2 text-white/90">
                    <li className="flex items-start">
                      <span className="text-amber-400 mr-2">•</span>
                      <span>
                        Notre équipe vérifie votre paiement (1-2 heures)
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-400 mr-2">•</span>
                      <span>Vous recevez une confirmation par WhatsApp</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-400 mr-2">•</span>
                      <span>Votre compte est activé</span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col space-y-3">
                  <Button
                    asChild
                    className="bg-amber-600 hover:bg-amber-700 rounded-full"
                  >
                    <Link href="/pricing">Voir les offres</Link>
                  </Button>

                  <Button
                    onClick={handleWhatsAppContact}
                    className="bg-green-600 hover:bg-green-700 rounded-full"
                    disabled={!customerService.whatsappNumber}
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    Contacter le support
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 rounded-full"
                  >
                    <Link href="/dashboard">Mon tableau de bord</Link>
                  </Button>
                </div>

                <div className="mt-8 flex justify-center">
                  <Heart className="h-5 w-5 text-pink-400" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </ShaderBackground>
    </div>
  );
}
