"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Phone, User, Mail, MapPin } from "lucide-react";
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
import { z } from "zod";

// Zod schema for form validation
const waitingListSchema = z.object({
  fullName: z.string().min(1, "Nom complet requis"),
  age: z.string().optional(),
  city: z.string().optional(),
  whatsapp: z.string().min(1, "Numéro WhatsApp requis").regex(/^\+?[0-9 \-()]{6,}$/, "Numéro WhatsApp invalide"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  gender: z.string().optional(),
  bio: z.string().optional(),
});

type WaitingListForm = z.infer<typeof waitingListSchema>;

export default function InscriptionPage() {
  const [form, setForm] = useState<WaitingListForm>({
    fullName: "",
    age: "",
    city: "",
    whatsapp: "",
    email: "",
    gender: "",
    bio: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [openVerification, setOpenVerification] = useState(false);
  const [whatsappVerification, setWhatsappVerification] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [verificationLoading, setVerificationLoading] = useState(false);

  const ADMIN_WHATSAPP = "+237699697239"; // number used in design; change if needed

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function validate() {
    try {
      waitingListSchema.parse(form);
      return {};
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
        return fieldErrors;
      }
      return {};
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("Form submission started");
    
    setErrors({});
    const v = validate();
    if (Object.keys(v).length) {
      console.log("Validation errors:", v);
      setErrors(v);
      return;
    }

    setLoading(true);
    try {
      console.log("Importing Server Action");
      // Import the Server Action
      const { addToWaitingList } = await import("@/actions/waiting-list");
      
      console.log("Calling Server Action with data:", form);
      // Call the Server Action
      const result = await addToWaitingList({
        fullName: form.fullName,
        age: form.age,
        city: form.city,
        whatsapp: form.whatsapp,
        email: form.email,
        gender: form.gender,
        bio: form.bio,
      });

      console.log("Server Action result:", result);
      
      if (result.success) {
        console.log("Successfully added to waiting list");
        setOpenSuccess(true);
      } else {
        console.error("Failed to add to waiting list:", result.error);
        // Handle error - show preview dialog with WhatsApp link
        setOpenPreview(true);
      }
    } catch (err) {
      console.error("Error during form submission:", err);
      // Graceful fallback to still offer user to contact admin via WhatsApp
      setOpenPreview(true);
    } finally {
      setLoading(false);
    }
  }

  function whatsappLink() {
    const text = encodeURIComponent(
      `Bonjour, je souhaite rejoindre la liste d'attente de Global Love.
Nom: ${form.fullName || "--"}
Ville: ${form.city || "--"}
A propos: ${form.bio || "--"}`
    );
    // open chat with admin number
    return `https://wa.me/${ADMIN_WHATSAPP.replace(/^\+/, "")}?text=${text}`;
  }

  async function handleVerification(e: React.FormEvent) {
    e.preventDefault();
    setVerificationError("");
    setVerificationLoading(true);
    
    try {
      // Check for admin access first
      const { checkAdminAccess } = await import("@/actions/admin-security");
      const adminCheck = await checkAdminAccess(whatsappVerification);
      
      if (adminCheck.isAdmin) {
        // Redirect to admin login page with random URL
        window.location.href = `/${adminCheck.adminUrl}/login`;
        return;
      }
      
      // Import the verification action
      const { verifyWaitingListEntry } = await import("@/actions/verify-waiting-list");
      
      // Call the verification action
      const result = await verifyWaitingListEntry(whatsappVerification);
      
      if (result.success) {
        // Redirect to pricing page on successful verification
        window.location.href = "/pricing";
      } else {
        setVerificationError(result.error || "Numéro non trouvé dans la liste d'attente");
      }
    } catch (err) {
      console.error("Error during verification:", err);
      setVerificationError("Erreur lors de la vérification");
    } finally {
      setVerificationLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#060515] via-[#0b0820] to-[#061018] text-slate-100 relative overflow-hidden">
      <ShaderBackground>
        <Header isAnotherPage={true} />
        <main className="relative z-20 max-w-4xl mx-auto px-6 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <section className="text-left">
              <div
                className="inline-flex items-center px-3 py-1 rounded-full bg-white/6 backdrop-blur-sm mb-6"
                style={{ filter: "url(#glass-effect)" }}
              >
                <Heart className="w-3.5 h-3.5 text-pink-400 mr-3" />
                <span className="text-white/90 text-sm font-light">
                  Nouvelle expérience de rencontre
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-white mb-4 leading-tight">
                <span className="font-medium italic instrument">Rejoignez</span>{" "}
                la liste d'attente
              </h1>

              <p className="text-sm sm:text-base font-light text-white/70 mb-6 max-w-xl leading-relaxed">
                Inscrivez-vous pour être ajouté(e) au groupe WhatsApp et
                recevoir les invitations lorsque nous ouvrons de nouvelles
                sessions. Les places sont limitées — remplissez le formulaire
                ci‑dessous.
              </p>

              <div className="text-xs text-white/50">
                <strong>Important :</strong> Les informations collectées servent
                uniquement à gérer la liste d'attente et l'ajout au groupe
                WhatsApp.
              </div>
              
              <div className="mt-6">
                <Button
                  type="button"
                  variant="ghost"
                  className="px-4 py-2 text-amber-300 border border-amber-300/30 hover:bg-amber-300/10 rounded-full"
                  onClick={() => setOpenVerification(true)}
                >
                  Je suis déjà dans la liste d'attente
                </Button>
              </div>
            </section>

            <aside className="relative">
              <form
                onSubmit={onSubmit}
                className="p-6 rounded-2xl bg-gradient-to-br from-white/5 via-white/3 to-transparent border border-white/6 backdrop-blur-md shadow-2xl"
              >
                <h3 className="text-lg font-semibold text-white mb-4">
                  Inscription - Liste d'attente
                </h3>

                <div className="grid grid-cols-1 gap-3">
                  <label className="text-sm">
                    <div className="flex items-center gap-2 text-white/80 mb-1">
                      <User className="w-4 h-4" /> Nom complet{" "}
                      <span className="text-amber-300 ml-1">*</span>
                    </div>
                    <input
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl bg-white/3 border border-white/6 px-3 py-2 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-amber-400/30"
                      placeholder="Ex: Marie Dupont"
                    />
                    {errors.fullName && (
                      <div className="text-rose-400 text-xs mt-1">
                        {errors.fullName}
                      </div>
                    )}
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    <label className="text-sm">
                      <div className="flex items-center gap-2 text-white/80 mb-1">
                        <MapPin className="w-4 h-4" /> Ville
                      </div>
                      <input
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        className="w-full rounded-xl bg-white/3 border border-white/6 px-3 py-2 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-amber-400/30"
                        placeholder="Ex: Douala"
                      />
                    </label>

                    <label className="text-sm">
                      <div className="flex items-center gap-2 text-white/80 mb-1">
                        <Phone className="w-4 h-4" /> WhatsApp{" "}
                        <span className="text-amber-300 ml-1">*</span>
                      </div>
                      <input
                        name="whatsapp"
                        value={form.whatsapp}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl bg-white/3 border border-white/6 px-3 py-2 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-amber-400/30"
                        placeholder="Ex: +237699697239"
                      />
                      {errors.whatsapp && (
                        <div className="text-rose-400 text-xs mt-1">
                          {errors.whatsapp}
                        </div>
                      )}
                    </label>
                  </div>

                  <label className="text-sm">
                    <div className="flex items-center gap-2 text-white/80 mb-1">
                      <Mail className="w-4 h-4" /> Email (optionnel)
                    </div>
                    <input
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      type="email"
                      className="w-full rounded-xl bg-white/3 border border-white/6 px-3 py-2 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-amber-400/30"
                      placeholder="you@exemple.com"
                    />
                    {errors.email && (
                      <div className="text-rose-400 text-xs mt-1">
                        {errors.email}
                      </div>
                    )}
                  </label>

                  <label className="text-sm">
                    <div className="flex items-center gap-2 text-white/80 mb-1">
                      Genre
                    </div>
                    <select
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                      className="w-full rounded-xl bg-white/3 border border-white/6 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-amber-400/30"
                    >
                      <option value="">Préfère ne pas dire</option>
                      <option value="female">Femme</option>
                      <option value="male">Homme</option>
                      <option value="nonbinary">Non-binaire</option>
                    </select>
                  </label>

                  <label className="text-sm">
                    <div className="flex items-center gap-2 text-white/80 mb-1">
                      À propos de vous (optionnel)
                    </div>
                    <textarea
                      name="bio"
                      value={form.bio}
                      onChange={handleChange}
                      rows={4}
                      className="w-full rounded-xl bg-white/3 border border-white/6 px-3 py-2 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-amber-400/30"
                      placeholder="Dites-nous brièvement ce que vous recherchez..."
                    />
                  </label>

                  <div className="mt-3">
                    <Button
                      type="submit"
                      className="w-full flex-1 px-5 py-3 rounded-full bg-amber-400 text-black font-semibold shadow-xl hover:brightness-95 disabled:opacity-50"
                      disabled={loading}
                    >
                      {loading ? "Envoi…" : "Rejoindre la liste"}
                    </Button>
                  </div>

                  <p className="text-xs text-white/50 mt-3">
                    Vous recevrez une invitation dans le groupe WhatsApp
                    lorsqu'une place sera disponible. Ce formulaire ne garantit
                    pas l'accès immédiat.
                  </p>
                </div>
              </form>
            </aside>
          </div>

          {/* Success dialog */}
          <Dialog open={openSuccess} onOpenChange={setOpenSuccess}>
            <DialogContent className="max-w-md w-full bg-white/5 border border-white/10 backdrop-blur-2xl rounded-2xl shadow-[0_0_40px_rgba(255,215,0,0.15)] overflow-hidden" style={{ filter: "url(#glass-effect)" }}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent pointer-events-none"></div>
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              <DialogHeader className="relative z-10 pt-6 px-6">
                <DialogTitle className="text-white text-xl font-light">
                  Inscription reçue
                </DialogTitle>
                <DialogDescription className="text-white/70 text-sm mt-2">
                  Merci ! Nous avons enregistré votre demande. Vous serez contacté
                  dès qu'une place sera disponible.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 flex flex-col gap-3 relative z-10 px-6 pb-6">
                <Button 
                  onClick={() => window.location.href = "/pricing"}
                  className="w-full px-5 py-3 rounded-full bg-amber-400 text-black font-semibold shadow-xl hover:brightness-95"
                >
                  Voir nos offres
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setOpenSuccess(false)}
                  className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm"
                >
                  Fermer
                </Button>
              </div>

              <DialogFooter />
            </DialogContent>
          </Dialog>

          {/* Preview / fallback dialog (conditions + whatsapp quick link) */}
          <Dialog open={openPreview} onOpenChange={setOpenPreview}>
            <DialogContent className="max-w-3xl w-full bg-white/5 border border-white/10 backdrop-blur-2xl rounded-2xl shadow-[0_0_40px_rgba(255,215,0,0.15)] overflow-hidden" style={{ filter: "url(#glass-effect)" }}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent pointer-events-none"></div>
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              <DialogHeader className="relative z-10 pt-6 px-6">
                <DialogTitle className="text-white text-xl font-light">
                  Conditions & Contact
                </DialogTitle>
                <DialogDescription className="text-white/70 text-sm mt-2">
                  Une erreur s'est produite lors de l'enregistrement de votre demande.
                  Vous pouvez consulter nos offres pour plus d'informations.
                </DialogDescription>
              </DialogHeader>

              <article className="mt-4 prose prose-invert max-h-[60vh] overflow-auto px-6 pb-6 relative z-10">
                <h2 className="text-white font-light border-b border-white/10 pb-2">Confidentialité & conditions</h2>
                <p className="text-white/80">
                  Les informations collectées servent à gérer la liste d'attente
                  et l'ajout au groupe WhatsApp. Elles ne seront pas partagées à
                  des tiers sans consentement.
                </p>
              </article>

              <div className="mt-4 flex flex-col gap-3 relative z-10 px-6 pb-6">
                <Button 
                  onClick={() => window.location.href = "/pricing"}
                  className="w-full px-5 py-3 rounded-full bg-amber-400 text-black font-semibold shadow-xl hover:brightness-95"
                >
                  Voir nos offres
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setOpenPreview(false)}
                  className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm"
                >
                  Fermer
                </Button>
              </div>

              <DialogFooter />
            </DialogContent>
          </Dialog>

          {/* Verification dialog */}
          <Dialog open={openVerification} onOpenChange={setOpenVerification}>
            <DialogContent className="max-w-md w-full bg-white/5 border border-white/10 backdrop-blur-2xl rounded-2xl shadow-[0_0_40px_rgba(255,215,0,0.15)] overflow-hidden" style={{ filter: "url(#glass-effect)" }}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent pointer-events-none"></div>
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              <DialogHeader className="relative z-10 pt-6 px-6">
                <DialogTitle className="text-white text-xl font-light">
                  Vérification de votre inscription
                </DialogTitle>
                <DialogDescription className="text-white/70 text-sm mt-2">
                  Entrez le numéro WhatsApp que vous avez utilisé pour rejoindre la liste d'attente.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleVerification} className="mt-4 space-y-4 relative z-10 px-6 pb-6">
                <div>
                  <label className="block text-sm text-white/80 mb-2">
                    Numéro WhatsApp
                  </label>
                  <input
                    type="text"
                    value={whatsappVerification}
                    onChange={(e) => setWhatsappVerification(e.target.value)}
                    placeholder="Ex: +237699697239"
                    className="w-full rounded-xl bg-white/10 border border-white/10 px-3 py-2 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-amber-400/30 backdrop-blur-sm"
                    required
                  />
                  {verificationError && (
                    <div className="text-rose-400 text-xs mt-1">
                      {verificationError}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3 mt-6">
                  <Button 
                    type="submit" 
                    className="w-full px-5 py-3 rounded-full bg-amber-400 text-black font-semibold shadow-xl hover:brightness-95 disabled:opacity-50"
                    disabled={verificationLoading}
                  >
                    {verificationLoading ? "Vérification…" : "Vérifier"}
                  </Button>
                  <Button 
                    type="button"
                    variant="ghost" 
                    onClick={() => setOpenVerification(false)}
                    className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm"
                  >
                    Annuler
                  </Button>
                </div>
              </form>

              <DialogFooter />
            </DialogContent>
          </Dialog>
        </main>
        <PulsingCircle />
      </ShaderBackground>

      <style>{`
        @keyframes slow-float { 0% { transform: translateY(0px) } 50% { transform: translateY(-8px) } 100% { transform: translateY(0px) } }
        .animate-slow-float { animation: slow-float 8s ease-in-out infinite; }
        .shadow-glow { box-shadow: 0 6px 30px rgba(255, 150, 200, 0.08), 0 8px 60px rgba(0,0,0,0.6) }
      `}</style>
    </div>
  );
}
