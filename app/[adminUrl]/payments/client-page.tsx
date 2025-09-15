"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle,
  Clock,
  XCircle,
  Wallet,
  Upload,
  Settings,
  Eye,
  Image as ImageIcon,
  ExternalLink,
  Save,
} from "lucide-react";
import AdminPageWrapper from "@/components/admin/admin-page-wrapper";
import ImageUpload from "@/components/admin/image-upload";

interface ImgBBData {
  id: string;
  title: string;
  url_viewer: string;
  url: string;
  display_url: string;
  width: string;
  height: string;
  size: string;
  time: string;
  expiration: string;
  image: {
    filename: string;
    name: string;
    mime: string;
    extension: string;
    url: string;
  };
  thumb: {
    filename: string;
    name: string;
    mime: string;
    extension: string;
    url: string;
  };
  medium: {
    filename: string;
    name: string;
    mime: string;
    extension: string;
    url: string;
  };
  delete_url: string;
}

type Payment = {
  id: number;
  amount: number;
  currency: string;
  paymentMethod: string;
  transactionId: string | null;
  status: string;
  screenshotPath: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  waitingList: {
    id: number;
    fullName: string;
    whatsapp: string;
    email: string | null;
  };
};

type PaymentSettings = {
  id: number;
  orangeMoneyNumber: string | null;
  mtnMoneyNumber: string | null;
};

export default function AdminPaymentPage({
  initialPayments,
}: {
  initialPayments: Payment[];
}) {
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState("verified");
  const [notes, setNotes] = useState("");
  const [settings, setSettings] = useState<PaymentSettings | null>(null);
  const [openSettingsDialog, setOpenSettingsDialog] = useState(false);
  const [orangeMoneyNumber, setOrangeMoneyNumber] = useState("");
  const [mtnMoneyNumber, setMtnMoneyNumber] = useState("");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadingPayment, setUploadingPayment] = useState<Payment | null>(
    null,
  );

  // In a real app, you would fetch this data from the server
  useEffect(() => {
    // Mock settings - in a real app, this would come from the server
    setSettings({
      id: 1,
      orangeMoneyNumber: "+237699697239",
      mtnMoneyNumber: "+237678123456",
    });

    setOrangeMoneyNumber("+237699697239");
    setMtnMoneyNumber("+237678123456");
  }, []);

  const handleUpdateStatus = async () => {
    if (selectedPayment) {
      // Import the update function
      const { updatePaymentStatus } = await import("@/actions/payment");

      // Update the payment status
      const result = await updatePaymentStatus(
        selectedPayment.id,
        newStatus,
        notes,
      );

      if (result.success && result.data) {
        // Update the local state
        setPayments(
          payments.map((payment) =>
            payment.id === selectedPayment.id
              ? { ...payment, status: newStatus, notes }
              : payment,
          ),
        );

        setOpenStatusDialog(false);
      }
    }
  };

  const handleSaveSettings = async () => {
    // Import the update function
    const { updatePaymentSettings } = await import("@/actions/payment");

    // Update the payment settings
    const result = await updatePaymentSettings({
      orangeMoneyNumber,
      mtnMoneyNumber,
    });

    if (result.success && result.data) {
      // Update the local state
      if (settings) {
        setSettings({
          ...settings,
          orangeMoneyNumber: result.data.orangeMoneyNumber,
          mtnMoneyNumber: result.data.mtnMoneyNumber,
        });
      }
    }

    setOpenSettingsDialog(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "verified":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "En attente";
      case "verified":
        return "Vérifié";
      case "completed":
        return "Complété";
      default:
        return "Rejeté";
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case "orange_money":
        return "Orange Money";
      case "mtn_mobile_money":
        return "MTN Mobile Money";
      default:
        return method;
    }
  };

  const handleViewImage = (payment: Payment) => {
    setSelectedPayment(payment);
    setImageDialogOpen(true);
  };

  const handleUploadImage = (payment: Payment) => {
    setUploadingPayment(payment);
    setUploadDialogOpen(true);
  };

  const handleImageUpload = async (
    imageUrl: string,
    imageData: ImgBBData | null,
  ) => {
    if (uploadingPayment && imageUrl) {
      try {
        // Import the update function
        const { updatePaymentScreenshot } = await import("@/actions/payment");

        // Update the payment with the new screenshot URL
        const result = await updatePaymentScreenshot(
          uploadingPayment.id,
          imageUrl,
        );

        if (result.success) {
          // Update the local state
          setPayments(
            payments.map((payment) =>
              payment.id === uploadingPayment.id
                ? { ...payment, screenshotPath: imageUrl }
                : payment,
            ),
          );

          // Close the dialog
          setUploadDialogOpen(false);
          setUploadingPayment(null);
        }
      } catch (error) {
        console.error("Error updating payment screenshot:", error);
      }
    }
  };

  return (
    <AdminPageWrapper
      title="Gestion des Paiements"
      description="Gérez et vérifiez les paiements des utilisateurs"
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Paiements</h1>
            <p className="text-gray-600">
              Gérez et vérifiez les paiements des utilisateurs
            </p>
          </div>
          <Button
            onClick={() => setOpenSettingsDialog(true)}
            className="flex items-center"
          >
            <Settings className="mr-2 h-4 w-4" />
            Paramètres de paiement
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Client
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Montant
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Méthode
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Statut
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {payment.waitingList.fullName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {payment.waitingList.whatsapp}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.amount.toLocaleString()} {payment.currency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Wallet className="mr-2 h-4 w-4" />
                        {getPaymentMethodText(payment.paymentMethod)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(payment.status)}
                        <span className="ml-2 text-sm font-medium">
                          {getStatusText(payment.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(
                        new Date(payment.createdAt),
                        "dd MMM yyyy HH:mm",
                        { locale: fr },
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button
                        variant="outline"
                        size="sm"
                        className="mr-2"
                        onClick={() => {
                          setSelectedPayment(payment);
                          setNewStatus(payment.status);
                          setNotes(payment.notes || "");
                          setOpenStatusDialog(true);
                        }}
                      >
                        Mettre à jour
                      </Button>
                      {payment.screenshotPath ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewImage(payment)}
                          className="mr-2"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUploadImage(payment)}
                          className="mr-2"
                        >
                          <Upload className="h-4 w-4" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Status Update Dialog */}
      <Dialog open={openStatusDialog} onOpenChange={setOpenStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mettre à jour le statut du paiement</DialogTitle>
            <DialogDescription>
              Mettre à jour le statut du paiement pour{" "}
              {selectedPayment?.waitingList.fullName}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="status">Statut</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="verified">Vérifié</SelectItem>
                  <SelectItem value="completed">Complété</SelectItem>
                  <SelectItem value="rejected">Rejeté</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ajoutez des notes sur cette transaction..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenStatusDialog(false)}
            >
              Annuler
            </Button>
            <Button onClick={handleUpdateStatus}>Mettre à jour</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={openSettingsDialog} onOpenChange={setOpenSettingsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Paramètres de paiement</DialogTitle>
            <DialogDescription>
              Configurez les numéros de téléphone pour les paiements
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
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
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenSettingsDialog(false)}
            >
              Annuler
            </Button>
            <Button onClick={handleSaveSettings}>Sauvegarder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Viewer Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Justificatif de paiement</DialogTitle>
            <DialogDescription>
              Justificatif pour {selectedPayment?.waitingList.fullName}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedPayment?.screenshotPath ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <img
                    src={selectedPayment.screenshotPath}
                    alt="Justificatif de paiement"
                    className="max-w-full h-auto rounded-lg border"
                  />
                </div>
                <div className="flex justify-center space-x-2">
                  <Button
                    onClick={() =>
                      window.open(
                        selectedPayment.screenshotPath || "",
                        "_blank",
                      )
                    }
                    variant="outline"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Ouvrir dans un nouvel onglet
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500">
                Aucun justificatif disponible
              </p>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setImageDialogOpen(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Télécharger un justificatif</DialogTitle>
            <DialogDescription>
              Télécharger un justificatif de paiement pour{" "}
              {uploadingPayment?.waitingList.fullName}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <ImageUpload
              onImageUploadedAction={handleImageUpload}
              currentImageUrl={uploadingPayment?.screenshotPath || undefined}
            />
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                setUploadDialogOpen(false);
                setUploadingPayment(null);
              }}
              variant="outline"
            >
              Annuler
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPageWrapper>
  );
}
