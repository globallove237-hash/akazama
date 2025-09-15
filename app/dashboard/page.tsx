"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircle,
  Clock,
  XCircle,
  Wallet,
  Phone,
  AlertCircle,
  LogOut,
  Home,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { checkAuthStatus, logout } from "@/actions/auth";
import Header from "@/components/header";
import ShaderBackground from "@/components/shader-background";
import { cn } from "@/lib/utils";
import MobileNavigation from "@/components/mobile-navigation";

type Payment = {
  id: number;
  amount: number;
  currency: string;
  paymentMethod: string;
  transactionId: string | null;
  status: string;
  screenshotPath: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type User = {
  id: number;
  fullName: string;
  whatsapp: string;
  payment: Payment | null;
};

export default function UserDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentSettings, setPaymentSettings] = useState<{
    orangeMoneyNumber?: string;
    mtnMoneyNumber?: string;
  }>({});

  useEffect(() => {
    async function loadUserData() {
      try {
        const authResult = await checkAuthStatus();

        if (!authResult.isAuthenticated || !authResult.user) {
          router.push("/waiting-list");
          return;
        }

        setUser(authResult.user);

        // Fetch payment settings from database
        try {
          const { getPaymentSettings } = await import("@/actions/payment");
          const result = await getPaymentSettings();
          if (result.success && result.data) {
            setPaymentSettings({
              orangeMoneyNumber:
                result.data.orangeMoneyNumber || "+237699697239",
              mtnMoneyNumber: result.data.mtnMoneyNumber || "+237678123456",
            });
          } else {
            // Fallback to default numbers
            setPaymentSettings({
              orangeMoneyNumber: "+237699697239",
              mtnMoneyNumber: "+237678123456",
            });
          }
        } catch (error) {
          console.error("Error fetching payment settings:", error);
          // Fallback to default numbers
          setPaymentSettings({
            orangeMoneyNumber: "+237699697239",
            mtnMoneyNumber: "+237678123456",
          });
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        router.push("/waiting-list");
      } finally {
        setIsLoading(false);
      }
    }

    loadUserData();
  }, [router]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-6 w-6 text-yellow-500" />;
      case "verified":
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case "completed":
        return <CheckCircle className="h-6 w-6 text-blue-500" />;
      default:
        return <XCircle className="h-6 w-6 text-red-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "En attente de vérification";
      case "verified":
        return "Paiement vérifié";
      case "completed":
        return "Complété";
      default:
        return "Paiement rejeté";
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case "pending":
        return "Votre paiement est en cours de vérification par notre équipe. Cela peut prendre 1 à 2 heures.";
      case "verified":
        return "Votre paiement a été vérifié avec succès. Vous pouvez maintenant accéder à tous les services.";
      case "completed":
        return "Votre paiement est complété et votre abonnement est actif.";
      default:
        return "Votre paiement a été rejeté. Veuillez contacter le support pour plus d'informations.";
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case "orange_money":
        return "Orange Money";
      case "mtn_mobile_money":
        return "MTN Mobile Money";
      default:
        return method;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Error during logout:", error);
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
              <p className="text-white/70">Chargement...</p>
            </div>
          </main>
        </ShaderBackground>
      </div>
    );
  }

  if (!user) {
    return <div>Utilisateur introuvable</div>;
  }

  const payment = user.payment;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#060515] via-[#0b0820] to-[#061018] text-slate-100 relative overflow-hidden">
      <ShaderBackground>
        <Header isAnotherPage={true} isAuthenticated={true} user={user} />
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
        <main className="relative z-20 max-w-4xl mx-auto px-6 py-12 md:py-20">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Tableau de bord</h1>
              <p className="text-white/70 mt-2">Bienvenue, {user.fullName}</p>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-white/30 text-white hover:bg-white/10 rounded-full"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Payment Status Card */}
            <Card
              className="bg-white/5 border-white/10 backdrop-blur-2xl shadow-[0_0_40px_rgba(255,215,0,0.15)] overflow-hidden rounded-2xl"
              style={{ filter: "url(#glass-effect)" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent pointer-events-none"></div>
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="text-xl">
                  Statut de votre paiement
                </CardTitle>
                <CardDescription className="text-white/60">
                  Suivez l'état de votre transaction
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                {payment ? (
                  <div className="flex flex-col items-center text-center py-6">
                    <div className="mb-4">{getStatusIcon(payment.status)}</div>
                    <h3 className="text-xl font-bold mb-2">
                      {getStatusText(payment.status)}
                    </h3>
                    <p className="text-white/70 mb-6">
                      {getStatusDescription(payment.status)}
                    </p>

                    <div className="w-full space-y-4">
                      <div className="flex justify-between py-2 border-b border-white/10">
                        <span className="text-white/70">Montant</span>
                        <span className="font-medium">
                          {payment.amount.toLocaleString()} {payment.currency}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/10">
                        <span className="text-white/70">Méthode</span>
                        <span className="font-medium">
                          {getPaymentMethodText(payment.paymentMethod)}
                        </span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-white/70">Date</span>
                        <span className="font-medium">
                          {new Date(payment.createdAt).toLocaleDateString(
                            "fr-FR",
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center py-6">
                    <div className="mb-4">
                      <Wallet className="h-12 w-12 text-white/30" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Aucun paiement</h3>
                    <p className="text-white/70 mb-6">
                      Vous n'avez pas encore effectué de paiement. Accédez aux
                      offres pour commencer.
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                {payment ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => router.push("/payment")}
                      className="border-white/30 text-white hover:bg-white/10 rounded-full"
                    >
                      Modifier le paiement
                    </Button>
                    <Button
                      onClick={() => router.push("/support")}
                      className="bg-amber-600 hover:bg-amber-700 rounded-full"
                    >
                      Contacter le support
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => router.push("/pricing")}
                    className="w-full bg-amber-600 hover:bg-amber-700 rounded-full"
                  >
                    Voir les offres
                  </Button>
                )}
              </CardFooter>
            </Card>

            {/* Support Card */}
            <Card
              className="bg-white/5 border-white/10 backdrop-blur-2xl shadow-[0_0_40px_rgba(255,215,0,0.15)] overflow-hidden rounded-2xl"
              style={{ filter: "url(#glass-effect)" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent pointer-events-none"></div>
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="text-xl">Besoin d'aide ?</CardTitle>
                <CardDescription className="text-white/60">
                  Contactez notre équipe de support
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-white/70 mb-6">
                  Si vous avez des questions sur votre paiement ou rencontrez
                  des problèmes, notre équipe est disponible pour vous aider.
                </p>

                <div className="space-y-4">
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 rounded-full"
                    onClick={() => {
                      const number = (
                        paymentSettings.orangeMoneyNumber || "+237699697239"
                      ).replace(/\D/g, "");
                      window.open(
                        `https://wa.me/${number}?text=Bonjour, j'ai besoin d'aide concernant mon compte et mes paiements.`,
                        "_blank",
                      );
                    }}
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    WhatsApp Support
                  </Button>

                  <div className="p-4 bg-amber-900/20 rounded-lg border border-amber-800/50">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-amber-400 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-amber-300 mb-1">
                          Temps de réponse
                        </h4>
                        <p className="text-sm text-white/80">
                          Notre équipe répond généralement sous 2 heures pendant
                          les heures de bureau.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <MobileNavigation />
      </ShaderBackground>
    </div>
  );
}
