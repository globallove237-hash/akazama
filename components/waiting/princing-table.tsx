"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Heart, Users, Crown, Check, X } from "lucide-react";
import {
  type FeatureItem,
  PricingTable,
  PricingTableBody,
  PricingTableHeader,
  PricingTableHead,
  PricingTableRow,
  PricingTableCell,
  PricingTablePlan,
} from "@/components/ui/pricing-table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function PrincingTable() {
  const router = useRouter();
  const [whatsappNumber, setWhatsappNumber] = useState<string>("237699697239");

  useEffect(() => {
    // Fetch the WhatsApp number from the server
    const fetchWhatsAppNumber = async () => {
      try {
        const { getPricingWhatsAppNumber } = await import(
          "@/actions/pricing-whatsapp"
        );
        const number = await getPricingWhatsAppNumber();
        setWhatsappNumber(number);
      } catch (error) {
        console.error("Error fetching WhatsApp number:", error);
      }
    };

    fetchWhatsAppNumber();
  }, []);

  const handleSelectPlan = (plan: string) => {
    router.push(`/payment?plan=${encodeURIComponent(plan)}`);
  };

  const handleContactSupport = () => {
    const message = "Bonjour, je souhaite discuter des offres de Global Love.";
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, "_blank");
  };
  const PLANS = [
    {
      key: "essentiel",
      name: "Essentiel",
      badge: "Idéal pour débuter",
      price: "25 000 FCFA",
      icon: Heart,
      cta: "Commencer",
      accent: "outline",
    },
    {
      key: "privilegie",
      name: "Privilegie",
      badge: "Notre offre la plus populaire",
      price: "50 000 FCFA",
      icon: Users,
      cta: "Choisir cette offre",
      accent: "primary",
    },
    {
      key: "vip-or",
      name: "VIP Or",
      badge: "Expérience premium",
      price: "100 000 FCFA",
      icon: Crown,
      cta: "Passer au VIP",
      accent: "outline",
    },
  ];

  return (
    <>
      {/* ---------- DESKTOP TABLE (unchanged visual, shown on md+) ---------- */}
      <div className="hidden md:block">
        <PricingTable
          className="bg-transparent mx-auto z-20 my-5 max-w-4xl border-separate border-spacing-0 rounded-2xl overflow-hidden"
          style={{ filter: "url(#glass-effect)" }}
        >
          <PricingTableHeader>
            <PricingTableRow>
              <th className="p-6 text-left text-white/80 font-normal ">
                Fonctionnalités
              </th>
              {PLANS.map((plan) => (
                <th
                  key={plan.key}
                  className="p-6 text-center border-b border-white/10"
                >
                  <PricingTablePlan
                    name={plan.name}
                    badge={plan.badge}
                    price={plan.price}
                    icon={plan.icon}
                    className={cn(
                      "text-center mx-auto",
                      plan.key === "privilegie"
                        ? "ring-2 ring-amber-400/20 shadow-lg"
                        : "",
                    )}
                  >
                    <Button
                      variant={
                        plan.accent === "primary" ? undefined : "outline"
                      }
                      className={cn(
                        "w-full rounded-full",
                        plan.accent === "primary"
                          ? "bg-amber-400 text-black font-semibold shadow-xl hover:brightness-95"
                          : "border border-white/20 text-white hover:bg-white/10",
                      )}
                      size="sm"
                      onClick={() => handleSelectPlan(plan.name)}
                      aria-label={`Choisir le plan ${plan.name}`}
                    >
                      {plan.cta}
                    </Button>
                  </PricingTablePlan>
                </th>
              ))}
            </PricingTableRow>
          </PricingTableHeader>

          <PricingTableBody>
            {FEATURES.map((feature, index) => (
              <PricingTableRow key={index} className="border-b border-white/10">
                <PricingTableHead className="text-xs p-4 text-left text-white/80 font-normal">
                  {feature.label}
                </PricingTableHead>
                {feature.values.map((value, i) => (
                  <PricingTableCell key={i} className="text-xs p-4 text-center">
                    {typeof value === "boolean" ? (
                      value ? (
                        <span className="inline-flex items-center gap-1 text-emerald-300">
                          <Check className="w-4 h-4" aria-hidden />
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-white/50">
                          <X className="w-4 h-4" aria-hidden />
                        </span>
                      )
                    ) : (
                      <span className="text-white/70">{value}</span>
                    )}
                  </PricingTableCell>
                ))}
              </PricingTableRow>
            ))}
          </PricingTableBody>
        </PricingTable>
      </div>

      {/* ---------- MOBILE CARDS (stacked) ---------- */}
      <div className="md:hidden space-y-6 my-6 px-4">
        {PLANS.map((plan, idx) => (
          <article
            key={plan.key}
            className={cn(
              "rounded-2xl p-6 border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_0_40px_rgba(255,215,0,0.15)] overflow-hidden",
              plan.key === "privilegie"
                ? "ring-2 ring-amber-400/20 shadow-lg"
                : "",
            )}
            aria-labelledby={`plan-${plan.key}-title`}
            style={{ filter: "url(#glass-effect)" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent pointer-events-none"></div>
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

            <header className="flex items-start justify-between gap-3 relative z-10">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-white/10 p-2 backdrop-blur-sm">
                  <plan.icon className="w-5 h-5 text-amber-300" aria-hidden />
                </div>
                <div>
                  <h3
                    id={`plan-${plan.key}-title`}
                    className="text-lg font-semibold text-white"
                  >
                    {plan.name}
                  </h3>
                  <p className="text-sm text-white/70 mt-1">{plan.badge}</p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm text-white/80">Prix</div>
                <div className="mt-1 text-xl font-bold">{plan.price}</div>
              </div>
            </header>

            {/* features summary: compact list for mobile */}
            <ul className="mt-6 space-y-3 text-sm relative z-10">
              {FEATURES.map((f) => {
                // find index of current plan in features.values
                const planIndex = 0; // default
                // Each FEATURES row has 3 values corresponding to plans order
                const value = f.values[PLANS.indexOf(plan)];
                return (
                  <li
                    key={f.label}
                    className="flex items-center justify-between py-2 border-b border-white/5"
                  >
                    <span className="text-white/80">{f.label}</span>
                    <span className="ml-4">
                      {typeof value === "boolean" ? (
                        value ? (
                          <span className="inline-flex items-center gap-1 text-emerald-300">
                            <Check className="w-4 h-4" aria-hidden />
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-white/50">
                            <X className="w-4 h-4" aria-hidden />
                          </span>
                        )
                      ) : (
                        <span className="text-white/70">{value}</span>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 relative z-10">
              <Button
                onClick={() => handleSelectPlan(plan.name)}
                className={cn(
                  "w-full rounded-full",
                  plan.key === "privilegie"
                    ? "bg-amber-400 text-black font-semibold shadow-xl hover:brightness-95"
                    : "bg-white/10 hover:bg-white/20 text-white border border-white/20",
                )}
                aria-label={`Sélectionner ${plan.name}`}
              >
                {plan.cta}
              </Button>
            </div>
          </article>
        ))}
      </div>

      {/* WhatsApp Contact Section */}
      <div className="mt-12 text-center">
        <p className="text-white/80 mb-4">
          Vous ne trouvez pas l'offre qui vous convient ?
        </p>
        <Button
          onClick={handleContactSupport}
          className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-semibold shadow-xl"
        >
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Discuter avec le service client
        </Button>
      </div>
    </>
  );
}

/* ---------- FEATURES data same as before ---------- */
export const FEATURES: FeatureItem[] = [
  {
    label: "Accès à la communauté",
    values: [true, true, true],
  },
  {
    label: "Nombre de profils à voir",
    values: ["50 profils/mois", "150 profils/mois", "Profils illimités"],
  },
  {
    label: "Messagerie privée",
    values: [true, true, true],
  },
  {
    label: "Vidéo appel",
    values: [false, true, true],
  },
];
