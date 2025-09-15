"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { acceptConditions, checkConditionsAccepted } from "@/actions/condition";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import ShaderBackground from "@/components/shader-background";
import Header from "@/components/header";
import PulsingCircle from "@/components/pulsing-circle";

export default function ConditionPageGlam() {
  const [accepted, setAccepted] = useState(false);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingConditions, setIsCheckingConditions] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  // Check if conditions are already accepted
  useEffect(() => {
    async function checkExistingConditions() {
      try {
        const result = await checkConditionsAccepted();
        if (result.accepted) {
          // If conditions already accepted, redirect to waiting list
          router.push("/waiting-list");
          return;
        }
      } catch (error) {
        console.error("Error checking conditions:", error);
      } finally {
        setIsCheckingConditions(false);
      }
    }

    checkExistingConditions();
  }, [router]);

  const handleAcceptAndContinue = async () => {
    if (!accepted) return;

    setIsLoading(true);
    setError("");

    try {
      const result = await acceptConditions();

      if (result.success) {
        router.push("/waiting-list");
      } else {
        setError(result.error || "Erreur lors de l'acceptation des conditions");
      }
    } catch (err) {
      setError("Erreur lors de l'acceptation des conditions");
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking conditions
  if (isCheckingConditions) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#060515] via-[#0b0820] to-[#061018] text-slate-100 relative overflow-hidden">
        <ShaderBackground>
          <Header isAnotherPage={true} />
          <main className="relative z-20 max-w-4xl mx-auto px-6 py-12 md:py-20 flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
              <p className="text-white/70">Vérification des conditions...</p>
            </div>
          </main>
          <PulsingCircle />
        </ShaderBackground>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#060515] via-[#0b0820] to-[#061018] text-slate-100 relative overflow-hidden">
      <div className="h-screen relative z-10">
        <ShaderBackground>
          <Header isAnotherPage={true} />
          <main className="relative z-20 max-w-4xl mx-auto px-6 py-12 md:py-20">
            {/* Hero / Intro */}
            <div className="grid md:grid-cols-2 gap-10 items-start">
              <section className="text-left">
                <div
                  className="inline-flex items-center px-3 py-1 rounded-full bg-white/6 backdrop-blur-sm mb-6 relative"
                  style={{ filter: "url(#glass-effect)" }}
                >
                  <div className="absolute top-0 left-1 right-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full" />
                  <Heart className="w-3.5 h-3.5 text-pink-400 mr-3" />
                  <span className="text-white/90 text-sm font-light relative z-10">
                    Nouvelle expérience de rencontre
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-white mb-4 leading-tight">
                  <span className="font-thin italic instrument">Trouvez</span>{" "}
                  l'Amour
                  <br />
                  <span className="font-light text-white/95">Authentique</span>
                </h1>

                <p className="text-sm sm:text-base font-light text-white/70 mb-6 max-w-xl leading-relaxed">
                  Découvrez des connexions sincères avec{" "}
                  <strong>Global Love</strong>. Notre plateforme combine une
                  sélection humaine, un accompagnement premium et une
                  confidentialité renforcée pour favoriser des rencontres qui
                  comptent vraiment.
                </p>

                <div className="flex items-center gap-4 flex-wrap"></div>
              </section>

              {/* Right column: consent card */}
              <aside className="relative">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 via-white/3 to-transparent border border-white/6 backdrop-blur-md shadow-2xl">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Accord & Conditions
                  </h3>
                  <p className="text-sm text-white/70 mb-4">
                    Veuillez lire attentivement nos conditions de
                    confidentialité et accepter avant de continuer.
                  </p>

                  <label className="flex items-start gap-3">
                    <Checkbox
                      checked={accepted}
                      onCheckedChange={(v) => setAccepted(Boolean(v))}
                    />
                    <div className="text-sm text-white/80">
                      <span>
                        J'ai lu et j'accepte les conditions de confidentialité
                        et de service.{" "}
                        <button
                          type="button"
                          onClick={() => setOpen(true)}
                          aria-haspopup="dialog"
                          aria-expanded={open}
                          className="p-0 m-0 text-amber-300 underline underline-offset-2 font-medium
                 hover:text-amber-200 focus:outline-none focus:ring-2
                 focus:ring-amber-400/30 rounded bg-transparent"
                        >
                          Lire les conditions
                        </button>
                      </span>
                    </div>
                  </label>

                  {error && (
                    <div className="mt-4 p-3 rounded-lg bg-red-900/20 border border-red-800/50">
                      <p className="text-sm text-red-400">{error}</p>
                    </div>
                  )}

                  <div className="mt-5 flex gap-3">
                    <Button
                      disabled={!accepted || isLoading}
                      onClick={handleAcceptAndContinue}
                      className="flex-1 px-5 py-3 rounded-full bg-amber-400 text-black font-semibold shadow-xl hover:brightness-95 disabled:opacity-50"
                    >
                      {isLoading ? "Traitement..." : "Confirmer et poursuivre"}
                    </Button>
                  </div>

                  <p className="text-xs text-white/50 mt-4">
                    Ce modèle doit être validé par un professionnel du droit
                    selon la juridiction applicable.
                  </p>
                </div>
              </aside>
            </div>

            {/* Legal modal with enhanced liquid glass effect */}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogContent
                className="max-w-3xl w-full bg-white/5 border border-white/10 backdrop-blur-2xl rounded-2xl shadow-[0_0_40px_rgba(255,215,0,0.15)] overflow-hidden relative"
                style={{ filter: "url(#glass-effect)" }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent pointer-events-none"></div>
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                <DialogHeader className="relative z-10 pt-6 px-6">
                  <DialogTitle className="text-white text-xl font-light">
                    Conditions de Confidentialité et de Service
                  </DialogTitle>
                  <DialogDescription className="text-white/70 text-sm">
                    Ce texte est un modèle juridique — faites-le valider par un
                    avocat compétent dans votre juridiction.
                  </DialogDescription>
                </DialogHeader>

                <article className="mt-4 prose prose-invert max-h-[60vh] overflow-auto px-6 pb-6 relative z-10 custom-scrollbar">
                  <h2 className="text-white font-light border-b border-white/10 pb-2">
                    1. Objet du présent document
                  </h2>
                  <p className="text-white/80">
                    Les présentes conditions régissent l’utilisation de la
                    plateforme « Global Love » (ci-après la « Plateforme »)...
                  </p>

                  <h2 className="text-white font-light border-b border-white/10 pb-2 mt-6">
                    2. Confidentialité des données
                  </h2>
                  <h3 className="text-white/90 font-light mt-4">
                    2.1 Collecte et traitement
                  </h3>
                  <p className="text-white/80">
                    Lors de l’inscription et de l’utilisation des services, nous
                    collectons des informations nécessaires au fonctionnement du
                    service : identité, coordonnées, préférences, données de
                    paiement, et éléments de profil.
                  </p>

                  <h3 className="text-white/90 font-light mt-4">
                    2.2 Finalités
                  </h3>
                  <p className="text-white/80">
                    Les finalités principales incluent la gestion des comptes,
                    le traitement des paiements, la mise en relation et
                    l’assistance client.
                  </p>

                  <h3 className="text-white/90 font-light mt-4">
                    2.3 Sécurité et limites
                  </h3>
                  <p className="text-white/80">
                    La Plateforme met en œuvre des mesures techniques et
                    organisationnelles appropriées pour protéger les données.
                    Toutefois, aucun système n’est infaillible : la Plateforme
                    ne peut garantir une sécurité absolue et ne saurait être
                    tenue pour responsable des événements indépendants de sa
                    volonté (intrusion malveillante, divulgation accidentelle,
                    etc.).
                  </p>

                  <h2 className="text-white font-light border-b border-white/10 pb-2 mt-6">
                    3. Absence de garantie sur les résultats
                  </h2>
                  <p className="text-white/80">
                    Les services fournis ont pour vocation de faciliter des
                    mises en relation ; en conséquence, la Plateforme ne
                    garantit pas l’aboutissement ou la réussite d’une rencontre
                    sentimentale. Toute promesse de réussite explicite ou
                    implicite est expressément exclue.
                  </p>

                  <h2 className="text-white font-light border-b border-white/10 pb-2 mt-6">
                    4. Conditions financières et politique de remboursement
                  </h2>
                  <h3 className="text-white/90 font-light mt-4">
                    4.1 Paiement
                  </h3>
                  <p className="text-white/80">
                    L’accès aux services est conditionné au paiement des frais
                    indiqués lors de l’inscription.
                  </p>

                  <h3 className="text-white/90 font-light mt-4">
                    4.2 Caractère non remboursable
                  </h3>
                  <p className="text-white/80">
                    Sauf disposition légale impérative contraire, toutes sommes
                    versées à la Plateforme sont réputées fermes, définitives et
                    non remboursables, quel que soit le résultat de la
                    prestation, la durée ou l’arrêt du service par
                    l’utilisateur.
                  </p>

                  <h3 className="text-white/90 font-light mt-4">
                    4.3 Renonciation au droit de rétractation
                  </h3>
                  <p className="text-white/80">
                    En raison du caractère immédiat, personnalisé et exécutoire
                    de la prestation, l’utilisateur peut être invité à renoncer
                    expressément à son droit de rétractation lors de la
                    validation du paiement conformément à la législation
                    applicable.
                  </p>

                  <h2 className="text-white font-light border-b border-white/10 pb-2 mt-6">
                    5. Engagements de l’utilisateur
                  </h2>
                  <p className="text-white/80">
                    L’utilisateur garantit l’exactitude et l’actualité des
                    informations fournies et s’engage à se comporter de manière
                    loyale et respectueuse envers les autres utilisateurs et le
                    personnel.
                  </p>

                  <h2 className="text-white font-light border-b border-white/10 pb-2 mt-6">
                    6. Limitation de responsabilité
                  </h2>
                  <p className="text-white/80">
                    La Plateforme, ses dirigeants et préposés ne sauraient être
                    tenus responsables des dommages directs ou indirects,
                    matériels ou immatériels, résultant de l’utilisation des
                    services, y compris des conséquences émotionnelles ou
                    financières liées à une rencontre ou à l’absence de
                    rencontre.
                  </p>

                  <h2 className="text-white font-light border-b border-white/10 pb-2 mt-6">
                    7. Loi applicable et juridiction
                  </h2>
                  <p className="text-white/80">
                    Les présentes conditions sont régies par la loi applicable
                    déterminée par le choix de l’éditeur ou par impératif légal.
                    Tout litige relatif à l’interprétation ou à l’exécution des
                    présentes sera soumis aux juridictions compétentes, après
                    tentative de résolution amiable.
                  </p>

                  <p className="italic text-white/60 text-sm mt-6">
                    NOTE : Ce texte constitue un modèle rédigé à titre
                    informatif. Il doit être revu et adapté par un avocat
                    compétent en fonction de la législation du pays
                    d’exploitation.
                  </p>
                </article>

                <DialogFooter className="relative z-10 px-6 pb-6">
                  <Button
                    variant="ghost"
                    onClick={() => setOpen(false)}
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm"
                  >
                    Fermer
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </main>
          <PulsingCircle />
        </ShaderBackground>
      </div>
      {/* Extra styles (keyframes + utility shadows) */}
      <style>{`
        @keyframes slow-float { 0% { transform: translateY(0px) } 50% { transform: translateY(-8px) } 100% { transform: translateY(0px) } }
        .animate-slow-float { animation: slow-float 8s ease-in-out infinite; }
        .shadow-glow { box-shadow: 0 6px 30px rgba(255, 150, 200, 0.08), 0 8px 60px rgba(0,0,0,0.6) }
        .prose-invert a { color: #FFD870 }
      `}</style>
    </div>
  );
}
