"use client";

import { useState, useEffect } from "react";
import { Home, Wallet, CreditCard, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileNavigation() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);

  // Hide navigation when scrolling down, show when scrolling up
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return pathname === "/" || pathname === "/dashboard";
    }
    return pathname.startsWith(path);
  };

  return (
    <div
      className={`md:hidden fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="bg-black/80 backdrop-blur-xl border-t border-white/10">
        <div className="grid grid-cols-2">
          <Link
            href="/dashboard"
            className={`flex flex-col items-center justify-center py-3 px-2 ${
              isActive("/dashboard")
                ? "text-amber-400"
                : "text-white/60 hover:text-white/80"
            } transition-colors`}
          >
            <Home className="h-5 w-5 mb-1" />
            <span className="text-xs">Accueil</span>
          </Link>
          <Link
            href="/pricing"
            className={`flex flex-col items-center justify-center py-3 px-2 ${
              isActive("/pricing")
                ? "text-amber-400"
                : "text-white/60 hover:text-white/80"
            } transition-colors`}
          >
            <CreditCard className="h-5 w-5 mb-1" />
            <span className="text-xs">Offres</span>
          </Link>
          ``        </div>
      </div>
    </div>
  );
}
