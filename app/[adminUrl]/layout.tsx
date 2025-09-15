"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Loader2 } from "lucide-react";
import { checkAdminSession } from "@/actions/admin-security";

export default function AdminDynamicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const router = useRouter();
  const [isValidating, setIsValidating] = useState(true);
  const [isValidAdmin, setIsValidAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoginPage, setIsLoginPage] = useState(false);
  const [isSecurityRefresh, setIsSecurityRefresh] = useState(false);
  const [currentPath, setCurrentPath] = useState("");
  const adminUrl = params.adminUrl as string;

  useEffect(() => {
    async function validateAdminUrl() {
      try {
        // Store current path for potential redirect after security refresh
        const path = window.location.pathname;
        setCurrentPath(path);
        
        // Check if we're on the login page
        const isLogin = path.endsWith("/login");
        setIsLoginPage(isLogin);

        // Check if admin URL is valid (32 character alphanumeric)
        const isValidUrlPattern = /^[a-zA-Z0-9]{32}$/.test(adminUrl);
        
        if (!isValidUrlPattern) {
          router.push("/");
          return;
        }

        setIsValidAdmin(true);

        // If on login page, don't check authentication
        if (isLogin) {
          setIsValidating(false);
          return;
        }

        // Check admin session
        const sessionResult = await checkAdminSession();
        setIsAuthenticated(sessionResult.isAuthenticated);
        
        // Check if admin URL in session matches current URL
        if (sessionResult.isAuthenticated && sessionResult.adminUrl && sessionResult.adminUrl !== adminUrl) {
          // URL has changed, redirect to new admin URL maintaining the same path
          setIsSecurityRefresh(true);
          const relativePath = path.replace(`/${adminUrl}`, "");
          setTimeout(() => {
            router.push(`/${sessionResult.adminUrl}${relativePath}`);
          }, 2000);
          return;
        }
        
        // If not authenticated, redirect to login
        if (!sessionResult.isAuthenticated) {
          router.push(`/${adminUrl}/login`);
          return;
        }
        
      } catch (error) {
        console.error("Error validating admin URL:", error);
        router.push("/");
      } finally {
        setIsValidating(false);
      }
    }

    validateAdminUrl();
  }, [adminUrl, router]);

  // Security routine check every 5 minutes
  useEffect(() => {
    if (!isAuthenticated || isLoginPage) return;

    const securityCheck = setInterval(async () => {
      try {
        const sessionResult = await checkAdminSession();
        if (sessionResult.isAuthenticated && sessionResult.adminUrl && sessionResult.adminUrl !== adminUrl) {
          // URL needs to be refreshed
          setIsSecurityRefresh(true);
          const relativePath = currentPath.replace(`/${adminUrl}`, "");
          setTimeout(() => {
            router.push(`/${sessionResult.adminUrl}${relativePath}`);
          }, 2000);
        }
      } catch (error) {
        console.error("Security check error:", error);
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(securityCheck);
  }, [isAuthenticated, isLoginPage, adminUrl, currentPath, router]);

  // Show loading while validating
  if (isValidating) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#060515] via-[#0b0820] to-[#061018] flex items-center justify-center">
        <div className="text-center text-white">
          <Loader2 className="animate-spin h-8 w-8 mx-auto mb-4 text-amber-400" />
          <p>Validation de l'accès administrateur...</p>
        </div>
      </div>
    );
  }

  // Show security refresh loader
  if (isSecurityRefresh) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#060515] via-[#0b0820] to-[#061018] flex items-center justify-center">
        <div className="text-center text-white max-w-md mx-auto">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 via-white/3 to-transparent border border-white/6 backdrop-blur-md shadow-2xl">
            <Shield className="h-12 w-12 text-amber-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Mise à jour de sécurité</h2>
            <p className="text-white/70 mb-4">
              Routine de sécurité en cours. Vous allez être redirigé vers la nouvelle URL sécurisée.
            </p>
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="animate-spin h-5 w-5 text-amber-400" />
              <span className="text-sm text-white/60">Redirection en cours...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If not valid admin URL, this will have redirected already
  if (!isValidAdmin) {
    return null;
  }

  // If on login page, just render children
  if (isLoginPage) {
    return <>{children}</>;
  }

  // If not authenticated and not on login page, redirect will happen
  if (!isAuthenticated) {
    return null;
  }

  // Render admin layout for authenticated users
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Shield className="h-6 w-6 text-amber-600 mr-2" />
                <h1 className="text-xl font-bold text-gray-900">Admin Global Love</h1>
              </div>
              <nav className="ml-6 flex space-x-8">
                <Link
                  href={`/${adminUrl}`}
                  className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Tableau de bord
                </Link>
                <Link
                  href={`/${adminUrl}/waiting-list`}
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Liste d'attente
                </Link>
                <Link
                  href={`/${adminUrl}/payments`}
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Paiements
                </Link>
                <Link
                  href={`/${adminUrl}/customer-service`}
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Service Client
                </Link>
              </nav>
            </div>
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  // Clear admin session and redirect
                  document.cookie = "admin-session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
                  document.cookie = "admin-url=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
                  router.push("/");
                }}
              >
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main>
        {children}
      </main>
    </div>
  );
}