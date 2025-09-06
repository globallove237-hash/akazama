interface WhatsAppNumber {
  id: string;
  number: string;
  label: string;
  isActive: boolean;
}

export function getRandomWhatsAppNumber(): string {
  // Check if we're in the browser environment
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    // Fallback to default number if we're on the server or localStorage is not available
    return "237699697239";
  }

  // Get numbers from localStorage
  const savedNumbers = localStorage.getItem("whatsapp-numbers");

  if (!savedNumbers) {
    // Fallback to default number if no configuration exists
    return "237699697239";
  }

  const numbers: WhatsAppNumber[] = JSON.parse(savedNumbers);
  const activeNumbers = numbers.filter((num) => num.isActive && num.number);

  if (activeNumbers.length === 0) {
    // Fallback to default if no active numbers
    return "237699697239";
  }

  // Return random active number
  const randomIndex = Math.floor(Math.random() * activeNumbers.length);
  return activeNumbers[randomIndex].number;
}

export function createWhatsAppLink(message: string): string {
  const number = getRandomWhatsAppNumber();
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${encodedMessage}`;
}
