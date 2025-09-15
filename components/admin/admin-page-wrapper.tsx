"use client";

import { ReactNode } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Home,
  Users,
  CreditCard,
  Phone,
  Settings,
} from "lucide-react";
import Link from "next/link";

interface AdminPageWrapperProps {
  children: ReactNode;
  title: string;
  description?: string;
  showBackButton?: boolean;
  backUrl?: string;
  actions?: ReactNode;
}

export default function AdminPageWrapper({
  children,
  title,
  description,
  showBackButton = true,
  backUrl,
  actions,
}: AdminPageWrapperProps) {
  const params = useParams();
  const router = useRouter();
  const adminUrl = params.adminUrl as string;

  const handleBack = () => {
    if (backUrl) {
      router.push(backUrl);
    } else {
      router.push(`/${adminUrl}`);
    }
  };

  const navigationItems = [
    {
      href: `/${adminUrl}`,
      icon: Home,
      label: "Tableau de bord",
      active: false,
    },
    {
      href: `/${adminUrl}/waiting-list`,
      icon: Users,
      label: "Liste d'attente",
      active: false,
    },
    {
      href: `/${adminUrl}/payments`,
      icon: CreditCard,
      label: "Paiements",
      active: false,
    },
    {
      href: `/${adminUrl}/customer-service`,
      icon: Phone,
      label: "Service Client",
      active: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              {showBackButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Button>
              )}
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
                {description && (
                  <p className="text-sm text-gray-600">{description}</p>
                )}
              </div>
            </div>
            {actions && (
              <div className="flex items-center space-x-3">{actions}</div>
            )}
          </div>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-1 py-3 overflow-x-auto">
            {navigationItems.map((item, index) => (
              <div key={item.href} className="flex items-center">
                <Link
                  href={item.href}
                  className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors whitespace-nowrap"
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Link>
                {index < navigationItems.length - 1 && (
                  <span className="text-gray-400 mx-2">/</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
