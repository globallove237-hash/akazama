import ShaderBackground from "@/components/shader-background";
import Header from "@/components/header";

export default function PaymentLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#060515] via-[#0b0820] to-[#061018] text-slate-100 relative overflow-hidden">
      <ShaderBackground>
        <Header isAnotherPage={true} />
        <div
          className="absolute inset-0 z-[-10] size-full max-h-102 opacity-50"
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
              Chargement de la page de paiement...
            </p>
          </div>
        </main>
      </ShaderBackground>
    </div>
  );
}