import { notFound } from "next/navigation";
import { ADSASAD } from "./_components/fdsasd";

export default async function AdminPage({
  params,
}: {
  params: Promise<{ number: string }>;
}) {
  const { number } = await params;
  if (
    number !== process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
    number !== process.env.WHATSAPP_NUMBER
  )
    return (
      <>
        {process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}
        non
        {number}
      </>
    );

  return <ADSASAD />;
}
