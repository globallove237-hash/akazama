"use client";

import { Heart } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function HeroContent() {
  const router = useRouter();

  return (
    <main className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-auto z-20 max-w-lg">
      <div className="text-left">
        <div
          className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 backdrop-blur-sm mb-4 relative"
          style={{
            filter: "url(#glass-effect)",
          }}
        >
          <div className="absolute top-0 left-1 right-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full" />
          <Heart className="w-3 h-3 text-pink-400 mr-2" />
          <span className="text-white/90 text-xs font-light relative z-10">
            Nouvelle expérience de rencontre
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl md:leading-16 tracking-tight font-light text-white mb-4">
          <span className="font-thin italic instrument">Trouvez</span> l'Amour
          <br />
          <span className="font-light tracking-tight text-white">
            Authentique
          </span>
        </h1>

        <p className="text-xs sm:text-sm font-light text-white/70 mb-6 leading-relaxed max-w-md">
          Découvrez des connexions sincères avec Global Love. Notre plateforme
          vous met en relation avec des célibataires compatibles du monde
          entier, pour des rencontres qui comptent vraiment.
        </p>

        <div className="flex items-center gap-4 flex-wrap">
          <Button
            onClick={() => router.push("/condition")}
            rel="noopener noreferrer"
            className="px-6 sm:px-8 py-3 rounded-full bg-white text-black font-normal text-xs sm:text-sm transition-all duration-200 hover:bg-white/90 cursor-pointer"
          >
            Commencer
          </Button>
        </div>
      </div>
    </main>
  );
}
