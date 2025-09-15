"use client";

import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { getCustomerServiceNumbers } from "@/actions/customer-service";

interface WhatsAppContactProps {
  message?: string;
  buttonText?: string;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  disabled?: boolean;
}

export default function WhatsAppContact({
  message = "Bonjour, j'ai besoin d'aide.",
  buttonText = "Contacter par WhatsApp",
  className = "bg-green-600 hover:bg-green-700",
  variant = "default",
  size = "default",
  disabled = false
}: WhatsAppContactProps) {
  const [whatsappNumber, setWhatsappNumber] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchWhatsAppNumber() {
      try {
        const result = await getCustomerServiceNumbers();
        if (result.success && result.data?.whatsappNumber) {
          setWhatsappNumber(result.data.whatsappNumber);
        }
      } catch (error) {
        console.error("Error fetching WhatsApp number:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchWhatsAppNumber();
  }, []);

  const handleWhatsAppContact = () => {
    if (!whatsappNumber) return;
    
    const number = whatsappNumber.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${number}?text=${encodedMessage}`, '_blank');
  };

  return (
    <Button
      onClick={handleWhatsAppContact}
      className={className}
      variant={variant}
      size={size}
      disabled={disabled || isLoading || !whatsappNumber}
    >
      <Phone className="mr-2 h-4 w-4" />
      {buttonText}
    </Button>
  );
}