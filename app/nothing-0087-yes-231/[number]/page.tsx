import { notFound } from "next/navigation";
import { ADSASAD } from "./_components/fdsasd";

export default async function AdminPage({
  params,
}: {
  params: Promise<{ number: string }>;
}) {
  const { number } = await params;
  
  // Get environment variables
  const localNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER_LOCAL || "doulun";
  const internationalNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER_INTERNATIONAL || "doulun";
  
  // Check if environment variables are set
  if (!localNumber || !internationalNumber) {
    throw new Error("WhatsApp numbers are not properly configured in environment variables");
  }
  
  // Check if the provided number matches either the local or international number
  if (number !== localNumber && number !== internationalNumber) {
    return (
      <>
        Invalid number. Expected {localNumber} or {internationalNumber}, got {number}
      </>
    );
  }

  return <ADSASAD />;
}
