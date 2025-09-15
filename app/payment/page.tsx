import { Suspense } from "react";
import PaymentForm from "@/components/payment-form";
import PaymentLoading from "./loading";

export default function PaymentPage() {
  return (
    <Suspense fallback={<PaymentLoading />}>
      <PaymentForm />
    </Suspense>
  );
}
