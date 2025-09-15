"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Phone, Save, Loader2 } from "lucide-react";
import {
  getCustomerServiceNumbers,
  updateCustomerServiceNumbers,
} from "@/actions/customer-service";
import AdminPageWrapper from "@/components/admin/admin-page-wrapper";

type CustomerServiceNumbers = {
  id: number;
  orangeMoneyNumber: string | null;
  mtnMoneyNumber: string | null;
};

export default function CustomerServicePage() {
  const [numbers, setNumbers] = useState<CustomerServiceNumbers | null>(null);
  const [orangeMoneyNumber, setOrangeMoneyNumber] = useState("");
  const [mtnMoneyNumber, setMtnMoneyNumber] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchNumbers = async () => {
      try {
        const result = await getCustomerServiceNumbers();
        if (result.success && result.data) {
          setNumbers({
            id: 1, // dummy id since the action doesn't return an id
            orangeMoneyNumber: result.data.whatsappNumber,
            mtnMoneyNumber: result.data.supportNumber,
          });
          setOrangeMoneyNumber(result.data.whatsappNumber || "");
          setMtnMoneyNumber(result.data.supportNumber || "");
        }
      } catch (error) {
        console.error("Error fetching customer service numbers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNumbers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const result = await updateCustomerServiceNumbers({
        whatsappNumber: orangeMoneyNumber,
        supportNumber: mtnMoneyNumber,
      });

      if (result.success) {
        // Refresh the numbers
        const refreshResult = await getCustomerServiceNumbers();
        if (refreshResult.success && refreshResult.data) {
          setNumbers({
            id: 1,
            orangeMoneyNumber: refreshResult.data.whatsappNumber,
            mtnMoneyNumber: refreshResult.data.supportNumber,
          });
        }
      }
    } catch (error) {
      console.error("Error updating customer service numbers:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminPageWrapper
        title="Service Client"
        description="Configurez les numéros de téléphone pour le service client"
      >
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <Loader2 className="animate-spin h-8 w-8 mx-auto mb-4 text-amber-400" />
            <p className="text-gray-600">Chargement des paramètres...</p>
          </div>
        </div>
      </AdminPageWrapper>
    );
  }

  return (
    <AdminPageWrapper
      title="Service Client"
      description="Configurez les numéros de téléphone pour le service client"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="mr-2 h-5 w-5" />
              Numéros de téléphone
            </CardTitle>
            <CardDescription>
              Configurez les numéros de service client
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="orange-money">Numéro Orange Money</Label>
                  <Input
                    id="orange-money"
                    value={orangeMoneyNumber}
                    onChange={(e) => setOrangeMoneyNumber(e.target.value)}
                    placeholder="Entrez le numéro Orange Money"
                  />
                </div>

                <div>
                  <Label htmlFor="mtn-money">Numéro MTN Mobile Money</Label>
                  <Input
                    id="mtn-money"
                    value={mtnMoneyNumber}
                    onChange={(e) => setMtnMoneyNumber(e.target.value)}
                    placeholder="Entrez le numéro MTN Mobile Money"
                  />
                </div>
              </div>

              <Button type="submit" disabled={isSaving} className="w-full">
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Sauvegarder les modifications
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Ces numéros seront utilisés dans toute l'application pour
              permettre aux utilisateurs de contacter le service client via
              WhatsApp. Assurez-vous qu'ils sont corrects et actifs.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminPageWrapper>
  );
}
