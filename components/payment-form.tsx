"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import {
  FileImage,
  Upload,
  Phone,
  Wallet,
  ArrowLeft,
  Loader2,
  XCircle,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import ShaderBackground from "@/components/shader-background";
import Header from "@/components/header";
import PulsingCircle from "@/components/pulsing-circle";
import { cn } from "@/lib/utils";
import MobileNavigation from "@/components/mobile-navigation";

type PaymentMethod = "orange_money" | "mtn_mobile_money";
type PackageType = "Essentiel" | "Privilegie" | "VIP Or";

interface Package {
  name: PackageType;
  price: number;
  description: string;
}

const PACKAGES: Package[] = [
  { name: "Essentiel", price: 25000, description: "Idéal pour débuter" },
  {
    name: "Privilegie",
    price: 50000,
    description: "Notre offre la plus populaire",
  },
  { name: "VIP Or", price: 100000, description: "Expérience premium" },
];

export default function PaymentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedPackage, setSelectedPackage] = useState<Package>(PACKAGES[1]); // Default to Privilegie
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("orange_money");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentSettings, setPaymentSettings] = useState<{
    orangeMoneyNumber?: string;
    mtnMoneyNumber?: string;
  }>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user authentication status and payment settings
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Check if user is authenticated
        const { checkAuthStatus } = await import("@/actions/auth");
        const authResult = await checkAuthStatus();

        if (!authResult.isAuthenticated || !authResult.user) {
          router.push("/waiting-list");
          return;
        }

        setUser(authResult.user);

        // Fetch payment settings
        const { getPaymentSettings } = await import("@/actions/payment");
        const result = await getPaymentSettings();
        if (result.success && result.data) {
          setPaymentSettings({
            orangeMoneyNumber: result.data.orangeMoneyNumber || undefined,
            mtnMoneyNumber: result.data.mtnMoneyNumber || undefined,
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        router.push("/waiting-list");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();

    // Set default package based on query parameter
    const plan = searchParams.get("plan");
    if (plan) {
      const pkg = PACKAGES.find((p) => p.name === plan);
      if (pkg) {
        setSelectedPackage(pkg);
      }
    }
  }, [router, searchParams]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setScreenshot(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = "Le numéro de téléphone est requis";
    } else if (!/^\+?[0-9 \-()]{6,}$/.test(phoneNumber)) {
      newErrors.phoneNumber = "Numéro de téléphone invalide";
    }

    if (!screenshot) {
      newErrors.screenshot = "Une capture d'écran est requise";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!user) {
      console.error("User not authenticated");
      return;
    }

    setIsSubmitting(true);

    try {
      let screenshotPath = "/uploads/screenshot.jpg"; // Default fallback

      // Upload screenshot to ImgBB if available
      if (screenshot && previewUrl) {
        try {
          // Convert base64 to blob for upload
          const base64Data = previewUrl.split(",")[1];

          const { uploadImageToImgBB } = await import("@/actions/image-upload");
          const uploadResult = await uploadImageToImgBB(
            base64Data,
            `payment_${Date.now()}.jpg`,
          );

          if (uploadResult.success && uploadResult.data) {
            screenshotPath = uploadResult.data.image.url;
          }
        } catch (uploadError) {
          console.error("Error uploading screenshot:", uploadError);
          // Continue with default path if upload fails
        }
      }

      // Create the payment record with the actual user's waitingListId
      const { createPayment } = await import("@/actions/payment");
      const result = await createPayment({
        waitingListId: user.id, // Use the actual user's ID from session
        amount: selectedPackage.price,
        paymentMethod,
        phoneNumber,
        transactionId: transactionId || undefined,
        screenshotPath, // Use the actual uploaded path or fallback
      });

      if (result.success) {
        router.push("/payment/success");
      } else {
        console.error("Error creating payment:", result.error);
        // In a real app, you would show an error message to the user
      }
    } catch (error) {
      console.error("Error submitting payment:", error);
      // In a real app, you would show an error message to the user
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPaymentNumber = () => {
    const number =
      paymentMethod === "orange_money"
        ? paymentSettings.orangeMoneyNumber
        : paymentSettings.mtnMoneyNumber;

    // Return a default number if none is set
    return number || "+237699000000";
  };

  // Show loading state while checking authentication
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
        </ShaderBackground>
      </div>
    );
  }

  // Redirect if user is not authenticated
  if (!user) {
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
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-900/30 mb-6">
                <XCircle className="h-10 w-10 text-red-400" />
              </div>
              <h1 className="text-2xl font-bold mb-4">Accès refusé</h1>
              <p className="text-white/70 mb-6">
                Vous devez être connecté pour accéder à cette page.
              </p>
              <Button
                onClick={() => router.push("/waiting-list")}
                className="bg-amber-600 hover:bg-amber-700 rounded-full"
              >
                Retour à la liste d'attente
              </Button>
            </div>
          </main>
        </ShaderBackground>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#060515] via-[#0b0820] to-[#061018] text-slate-100 relative overflow-hidden pb-16 md:pb-0">
      <ShaderBackground>
        <Header isAnotherPage={true} />
        <main className="relative z-20 max-w-4xl mx-auto px-6 py-12 md:py-20">
          <Button
            variant="ghost"
            className="mb-6 text-white hover:text-amber-300"
            onClick={() => router.push("/pricing")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux offres
          </Button>

          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-white mb-4 leading-tight">
              <span className="font-medium italic instrument">Paiement</span> de
              votre abonnement
            </h1>
            <p className="text-sm sm:text-base font-light text-white/70 mb-6 max-w-xl leading-relaxed">
              Choisissez votre méthode de paiement et suivez les instructions
              pour finaliser votre achat.
            </p>
          </div>
          <div
            className="p-6 rounded-2xl mb-4  bg-white/5 border-white/10 backdrop-blur-2xl shadow-[0_0_40px_rgba(255,215,0,0.15)] overflow-hidden"
            style={{ filter: "url(#glass-effect)" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent pointer-events-none"></div>
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

            <div className="relative z-10">
              <h3 className="text-xl font-semibold text-white mb-5">
                Support client
              </h3>
              <p className="text-white/80 mb-5 text-sm leading-relaxed">
                Si vous rencontrez des difficultés avec le paiement, vous pouvez
                nous contacter directement :
              </p>
              <Button
                className="w-full bg-green-600 hover:bg-green-700 rounded-full"
                onClick={() => {
                  const number = (
                    paymentSettings.orangeMoneyNumber || "+237699000000"
                  ).replace(/\D/g, "");
                  if (number) {
                    window.open(
                      `https://wa.me/${number}?text=Bonjour, j'ai besoin d'aide pour effectuer un paiement.`,
                      "_blank",
                    );
                  }
                }}
                disabled={!paymentSettings.orangeMoneyNumber}
              >
                <Phone className="mr-2 h-4 w-4" />
                Contacter par WhatsApp
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Payment Form */}
            <section className="relative">
              <div
                className="p-6 rounded-2xl bg-white/5 border-white/10 backdrop-blur-2xl shadow-[0_0_40px_rgba(255,215,0,0.15)] overflow-hidden"
                style={{ filter: "url(#glass-effect)" }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent pointer-events-none"></div>
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                <div className="relative z-10">
                  <h3 className="text-xl font-semibold text-white mb-6">
                    Informations de paiement
                  </h3>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Package Selection */}
                    <div className="space-y-3">
                      <Label className="text-white">
                        Sélectionnez votre offre
                      </Label>
                      <RadioGroup
                        value={selectedPackage.name}
                        onValueChange={(value) => {
                          const pkg = PACKAGES.find((p) => p.name === value);
                          if (pkg) setSelectedPackage(pkg);
                        }}
                      >
                        {PACKAGES.map((pkg) => {
                          return (
                            <div
                              key={pkg.name}
                              className="flex items-center space-x-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                            >
                              <RadioGroupItem
                                value={pkg.name}
                                id={pkg.name}
                                className="border-white/50 text-amber-500"
                              />
                              <Label
                                htmlFor={pkg.name}
                                className="text-white flex justify-between w-full cursor-pointer"
                              >
                                <span>
                                  <span className="font-semibold text-base">
                                    {pkg.name}
                                  </span>
                                  <span className="block text-xs text-white/70 mt-1">
                                    {pkg.description}
                                  </span>
                                </span>
                                <span className="font-bold text-lg text-amber-300">
                                  {pkg.price.toLocaleString()} FCFA
                                </span>
                              </Label>
                            </div>
                          );
                        })}
                      </RadioGroup>
                    </div>

                    {/* Payment Method */}
                    <div className="space-y-4">
                      <Label className="text-white font-medium text-sm">
                        Méthode de paiement
                      </Label>
                      <RadioGroup
                        value={paymentMethod}
                        onValueChange={(value) =>
                          setPaymentMethod(value as PaymentMethod)
                        }
                      >
                        <div className="flex items-center space-x-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                          <RadioGroupItem
                            value="orange_money"
                            id="orange_money"
                            className="border-white/50 text-amber-500"
                          />
                          <Label
                            htmlFor="orange_money"
                            className="text-white flex items-center cursor-pointer"
                          >
                            <Wallet className="mr-2 h-4 w-4" />
                            Orange Money
                          </Label>
                        </div>
                        <div className="flex items-center space-x-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                          <RadioGroupItem
                            value="mtn_mobile_money"
                            id="mtn_mobile_money"
                            className="border-white/50 text-amber-500"
                          />
                          <Label
                            htmlFor="mtn_mobile_money"
                            className="text-white flex items-center cursor-pointer"
                          >
                            <Wallet className="mr-2 h-4 w-4" />
                            MTN Mobile Money
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Payment Instructions */}
                    <div className="p-4 bg-amber-900/20 rounded-lg border border-amber-800/50">
                      <h4 className="font-bold text-amber-300 mb-3 text-lg">
                        Instructions de paiement
                      </h4>
                      <p className="text-sm text-white/80 mb-3">
                        Effectuez un transfert de{" "}
                        <span className="font-bold text-amber-300">
                          {selectedPackage.price.toLocaleString()} FCFA
                        </span>{" "}
                        vers le numéro suivant :
                      </p>
                      <div className="flex items-center justify-between bg-black/30 p-3 rounded">
                        <span className="font-mono text-lg">
                          {getPaymentNumber() || "Chargement..."}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            navigator.clipboard.writeText(getPaymentNumber())
                          }
                          className="text-amber-300 hover:text-amber-200"
                        >
                          Copier
                        </Button>
                      </div>
                      <p className="text-xs text-white/60 mt-2">
                        Après le paiement, veuillez fournir une capture d'écran
                        de la transaction.
                      </p>
                    </div>

                    {/* Transaction Details */}
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <Label
                          htmlFor="phone"
                          className="text-white font-medium text-sm"
                        >
                          Numéro de téléphone utilisé pour le paiement
                        </Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3.5 h-4 w-4 text-white/50" />
                          <Input
                            id="phone"
                            placeholder="+237XXXXXXXX"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40 rounded-xl py-3"
                          />
                        </div>
                        {errors.phoneNumber && (
                          <p className="text-sm text-red-400">
                            {errors.phoneNumber}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="transaction"
                          className="text-white font-medium text-sm"
                        >
                          ID de transaction (optionnel)
                        </Label>
                        <Input
                          id="transaction"
                          placeholder="Entrez l'ID de transaction"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          className="bg-white/5 border-white/20 text-white placeholder:text-white/40 rounded-xl py-3"
                        />
                      </div>
                    </div>

                    {/* Screenshot Upload */}
                    <div className="space-y-3">
                      <Label className="text-white font-medium text-sm">
                        Capture d'écran de la transaction
                      </Label>
                      <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center bg-white/5">
                        {previewUrl ? (
                          <div className="space-y-4">
                            <img
                              src={previewUrl}
                              alt="Preview"
                              className="max-h-40 mx-auto rounded-lg"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setScreenshot(null);
                                setPreviewUrl(null);
                                setErrors((prev) => {
                                  const newErrors = { ...prev };
                                  delete newErrors.screenshot;
                                  return newErrors;
                                });
                              }}
                              className="text-white border-white/30 hover:bg-white/10 rounded-full"
                            >
                              Changer l'image
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <FileImage className="mx-auto h-12 w-12 text-white/40" />
                            <div className="space-y-3">
                              <p className="text-sm text-white/70">
                                Glissez-déposez une capture d'écran ou cliquez
                                pour sélectionner
                              </p>
                              <Button
                                type="button"
                                variant="outline"
                                className="text-white border-white/30 hover:bg-white/10 rounded-full"
                                onClick={() =>
                                  document
                                    .getElementById("screenshot-upload")
                                    ?.click()
                                }
                              >
                                <Upload className="mr-2 h-4 w-4" />
                                Sélectionner un fichier
                              </Button>
                              <input
                                id="screenshot-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      {errors.screenshot && (
                        <p className="text-sm text-red-400">
                          {errors.screenshot}
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full px-6 py-4 rounded-full bg-amber-400 text-black font-semibold shadow-xl hover:brightness-95 disabled:opacity-50 text-base"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Traitement en cours...
                        </>
                      ) : (
                        "Soumettre le paiement"
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            </section>

            {/* Package Preview and Support */}
            <aside className="relative">
              <div
                className="p-6 rounded-2xl bg-white/5 border-white/10 backdrop-blur-2xl shadow-[0_0_40px_rgba(255,215,0,0.15)] overflow-hidden mb-6"
                style={{ filter: "url(#glass-effect)" }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent pointer-events-none"></div>
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                <div className="relative z-10">
                  <h3 className="text-xl font-semibold text-white mb-6">
                    Votre sélection
                  </h3>

                  <div className="space-y-5">
                    <div className="flex justify-between items-center p-5 bg-white/5 rounded-xl">
                      <div>
                        <h4 className="font-bold text-xl">
                          {selectedPackage.name}
                        </h4>
                        <p className="text-sm text-white/70 mt-1">
                          {selectedPackage.description}
                        </p>
                      </div>
                      <span className="text-2xl font-bold text-amber-300">
                        {selectedPackage.price.toLocaleString()} FCFA
                      </span>
                    </div>

                    <div className="pt-5 border-t border-white/10">
                      <div className="flex justify-between py-2">
                        <span className="text-white/80">Sous-total</span>
                        <span className="font-medium">
                          {selectedPackage.price.toLocaleString()} FCFA
                        </span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-white/80">
                          Frais de traitement
                        </span>
                        <span className="font-medium">0 FCFA</span>
                      </div>
                      <div className="flex justify-between pt-4 mt-4 border-t border-white/10">
                        <span className="text-xl font-bold">Total</span>
                        <span className="text-xl font-bold text-amber-300">
                          {selectedPackage.price.toLocaleString()} FCFA
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </main>
        <PulsingCircle />
        <MobileNavigation />
      </ShaderBackground>

      {/* Extra styles */}
      <style>{`
        @keyframes slow-float { 0% { transform: translateY(0px) } 50% { transform: translateY(-8px) } 100% { transform: translateY(0px) } }
        .animate-slow-float { animation: slow-float 8s ease-in-out infinite; }
        .shadow-glow { box-shadow: 0 6px 30px rgba(255, 150, 200, 0.08), 0 8px 60px rgba(0,0,0,0.6) }
      `}</style>
    </div>
  );
}