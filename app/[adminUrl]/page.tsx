"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import AdminPageWrapper from "@/components/admin/admin-page-wrapper";

export default function AdminDashboard() {
  const params = useParams();
  const adminUrl = params.adminUrl as string;

  return (
    <AdminPageWrapper
      title="Tableau de bord administrateur"
      description="Gérez votre application depuis ce tableau de bord"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href={`/${adminUrl}/waiting-list`}
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Liste d'attente
          </h2>
          <p className="text-gray-600">
            Gérer les inscriptions à la liste d'attente
          </p>
        </Link>

        <Link
          href={`/${adminUrl}/payments`}
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Paiements
          </h2>
          <p className="text-gray-600">Gérer les paiements et transactions</p>
        </Link>

        <Link
          href={`/${adminUrl}/customer-service`}
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Service Client
          </h2>
          <p className="text-gray-600">Configurer les numéros WhatsApp</p>
        </Link>
      </div>
    </AdminPageWrapper>
  );
}
