"use client";

import { useState } from "react";
import { Heart, Globe, Shield, Sparkles, X, Menu } from "lucide-react";
import { createWhatsAppLink } from "@/lib/whatsapp-manager";
import Link from "next/link";

export default function Header({
  isAnotherPage,
  isAuthenticated,
  user,
}: {
  isAnotherPage?: boolean;
  isAuthenticated?: boolean;
  user?: any;
}) {
  const [showModal, setShowModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const contactLink = "/condition";
  const startLink = "/condition";

  return (
    <>
      <header className="relative z-20 flex items-center justify-between p-4 md:p-6">
        <div className="flex items-center">
          <svg
            fill="currentColor"
            viewBox="0 0 120 60"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="size-8 md:size-10 text-white"
          >
            <path d="M30 45C30 45 15 35 15 25C15 20 18 15 25 15C27 15 29 16 30 18C31 16 33 15 35 15C42 15 45 20 45 25C45 35 30 45 30 45Z" />
            <circle
              cx="30"
              cy="25"
              r="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.6"
            />
            <path
              d="M12 25 L48 25"
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.6"
            />
            <path
              d="M30 7 Q20 25 30 43 Q40 25 30 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.6"
            />
            <text
              x="65"
              y="35"
              className="text-base md:text-lg font-bold fill-current"
            >
              GL
            </text>
          </svg>
          <Link
            href="/"
            className="ml-2 text-white font-semibold text-base md:text-lg"
          >
            Global Love
          </Link>
        </div>

        {isAuthenticated ? (
          <div className="flex items-center space-x-3">
            <Link
              href="/dashboard"
              className="hidden md:flex items-center text-white/80 hover:text-white text-xs font-light px-3 py-2 rounded-full hover:bg-white/10 transition-all duration-200"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
              Mon Compte
            </Link>
            <div className="md:hidden">
              <Link href="/dashboard">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
        ) : isAnotherPage ? (
          ""
        ) : (
          <>
            <nav className="hidden md:flex items-center space-x-2">
              <button
                onClick={() => setShowModal(true)}
                className="text-white/80 hover:text-white text-xs font-light px-3 py-2 rounded-full hover:bg-white/10 transition-all duration-200"
              >
                En savoir plus
              </button>
            </nav>

            <div className="hidden md:block">
              <div
                id="gooey-btn"
                className="relative flex items-center group"
                style={{ filter: "url(#gooey-filter)" }}
              >
                <button className="absolute right-0 px-2.5 py-2 rounded-full bg-white text-black font-normal text-xs transition-all duration-300 hover:bg-white/90 cursor-pointer h-8 flex items-center justify-center -translate-x-10 group-hover:-translate-x-19 z-0">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 17L17 7M17 7H7M17 7V17"
                    />
                  </svg>
                </button>
                <a
                  href={contactLink}
                  className="px-6 py-2 rounded-full bg-white text-black font-normal text-xs transition-all duration-300 hover:bg-white/90 cursor-pointer h-8 flex items-center z-10"
                >
                  Contactez-nous
                </a>
              </div>
            </div>

            <button
              onClick={() => setShowMobileMenu(true)}
              className="md:hidden text-white p-2"
            >
              <Menu className="w-6 h-6" />
            </button>
          </>
        )}
      </header>

      {showMobileMenu && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 md:hidden">
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-4">
              <span className="text-white font-semibold text-lg">Menu</span>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="text-white p-2"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 flex flex-col justify-center items-center space-y-8">
              <button
                onClick={() => {
                  setShowModal(true);
                  setShowMobileMenu(false);
                }}
                className="text-white text-lg font-light"
              >
                En savoir plus
              </button>
              <a
                href={contactLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 rounded-full bg-white text-black font-medium text-sm transition-all duration-300 hover:bg-white/90"
              >
                Contactez-nous
              </a>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 max-w-md w-full border border-white/20 mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg md:text-xl font-semibold text-white">
                À propos de Global Love
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4 text-white/80 text-sm">
              <div className="flex items-center gap-3">
                <Heart className="w-4 h-4 text-pink-400 flex-shrink-0" />
                <div>
                  <strong>Rencontres authentiques</strong> - Connectez-vous avec
                  des personnes qui partagent vos valeurs
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <div>
                  <strong>Communauté mondiale</strong> - Rencontrez des
                  célibataires du monde entier
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-green-400 flex-shrink-0" />
                <div>
                  <strong>Sécurité garantie</strong> - Profils vérifiés et
                  conversations protégées
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                <div>
                  <strong>Algorithme intelligent</strong> - Des suggestions
                  personnalisées pour vous
                </div>
              </div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a
                href={startLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-4 py-2 bg-white text-black rounded-full text-center text-sm font-medium hover:bg-white/90 transition-colors"
              >
                Commencer
              </a>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-white/30 text-white rounded-full text-sm hover:bg-white/10 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
