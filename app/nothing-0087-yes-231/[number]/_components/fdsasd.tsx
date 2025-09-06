"use client";

import { Trash2, Save, Phone, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
interface WhatsAppNumber {
  id: string;
  number: string;
  label: string;
  isActive: boolean;
}
export function ADSASAD() {
  const [numbers, setNumbers] = useState<WhatsAppNumber[]>([]);
  const [newNumber, setNewNumber] = useState({ number: "", label: "" });
  const [isLoading, setIsLoading] = useState(true);

  // Load numbers from localStorage on component mount
  useEffect(() => {
    const savedNumbers = localStorage.getItem("whatsapp-numbers");
    if (savedNumbers) {
      setNumbers(JSON.parse(savedNumbers));
    } else {
      // Default numbers if none exist
      const defaultNumbers: WhatsAppNumber[] = [
        {
          id: "1",
          number: String(
            process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
              process.env.WHATSAPP_NUMBER,
          ),
          label: "Support Principal",
          isActive: true,
        },
        { id: "2", number: "", label: "Support Secondaire", isActive: false },
        { id: "3", number: "", label: "Support Tertiaire", isActive: false },
      ];
      setNumbers(defaultNumbers);
      localStorage.setItem("whatsapp-numbers", JSON.stringify(defaultNumbers));
    }
    setIsLoading(false);
  }, []);

  // Save numbers to localStorage
  const saveNumbers = () => {
    localStorage.setItem("whatsapp-numbers", JSON.stringify(numbers));
    alert("Numéros sauvegardés avec succès !");
  };

  // Add new number
  const addNumber = () => {
    if (newNumber.number && newNumber.label && numbers.length < 3) {
      const newId = Date.now().toString();
      const updatedNumbers = [
        ...numbers,
        {
          id: newId,
          number: newNumber.number,
          label: newNumber.label,
          isActive: true,
        },
      ];
      setNumbers(updatedNumbers);
      setNewNumber({ number: "", label: "" });
    }
  };

  // Update existing number
  const updateNumber = (
    id: string,
    field: keyof WhatsAppNumber,
    value: string | boolean,
  ) => {
    setNumbers(
      numbers.map((num) => (num.id === id ? { ...num, [field]: value } : num)),
    );
  };

  // Delete number
  const deleteNumber = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce numéro ?")) {
      setNumbers(numbers.filter((num) => num.id !== id));
    }
  };

  // Get active numbers for preview
  const activeNumbers = numbers.filter((num) => num.isActive && num.number);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-2xl md:text-3xl font-light">
              Administration Global Love
            </h1>
          </div>
          <button
            onClick={saveNumbers}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            Sauvegarder
          </button>
        </div>

        {/* Current Numbers Management */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-8">
          <h2 className="text-xl font-medium mb-6 flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Gestion des Numéros WhatsApp
          </h2>

          <div className="space-y-4">
            {numbers.map((number, index) => (
              <div
                key={number.id}
                className="flex flex-col md:flex-row gap-4 p-4 bg-white/5 rounded-lg border border-white/10"
              >
                <div className="flex-1">
                  <label className="block text-sm text-white/70 mb-2">
                    Libellé #{index + 1}
                  </label>
                  <input
                    type="text"
                    value={number.label}
                    onChange={(e) =>
                      updateNumber(number.id, "label", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40"
                    placeholder="Ex: Support Principal"
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-sm text-white/70 mb-2">
                    Numéro WhatsApp
                  </label>
                  <input
                    type="text"
                    value={number.number}
                    onChange={(e) =>
                      updateNumber(number.id, "number", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40"
                    placeholder="Ex: 33123456789"
                  />
                </div>

                <div className="flex items-end gap-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={number.isActive}
                      onChange={(e) =>
                        updateNumber(number.id, "isActive", e.target.checked)
                      }
                      className="rounded"
                    />
                    Actif
                  </label>

                  <button
                    onClick={() => deleteNumber(number.id)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Preview Section */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h2 className="text-xl font-medium mb-4">Aperçu de la Redirection</h2>

          <div className="space-y-4">
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <h3 className="font-medium text-blue-300 mb-2">
                Numéros Actifs ({activeNumbers.length}/3)
              </h3>
              {activeNumbers.length > 0 ? (
                <ul className="space-y-2">
                  {activeNumbers.map((num) => (
                    <li
                      key={num.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-white/80">
                        {num.label}: +{num.number}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-white/60 text-sm">
                  Aucun numéro actif configuré
                </p>
              )}
            </div>

            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <h3 className="font-medium text-yellow-300 mb-2">
                Fonctionnement
              </h3>
              <p className="text-white/70 text-sm">
                Quand un visiteur clique sur "Contactez-nous", le système
                choisira aléatoirement un des numéros actifs pour répartir les
                contacts. Assurez-vous d'avoir au moins un numéro actif
                configuré.
              </p>
            </div>

            {activeNumbers.length > 0 && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <h3 className="font-medium text-green-300 mb-2">
                  Test de Redirection
                </h3>
                <button
                  onClick={() => {
                    const randomNumber =
                      activeNumbers[
                        Math.floor(Math.random() * activeNumbers.length)
                      ];
                    window.open(
                      `https://wa.me/${randomNumber.number}?text=Test%20depuis%20l'admin`,
                      "_blank",
                    );
                  }}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm transition-colors"
                >
                  Tester la Redirection Aléatoire
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
