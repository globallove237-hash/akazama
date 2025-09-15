"use client";

import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
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
  User,
  Mail,
  Phone,
  Calendar,
  Filter,
} from "lucide-react";
import AdminPageWrapper from "@/components/admin/admin-page-wrapper";

type WaitingListEntry = {
  id: number;
  fullName: string;
  whatsapp: string;
  email: string | null;
  age: string | null;
  city: string | null;
  gender: string | null;
  bio: string | null;
  notes: string | null;
  invitedAt: Date | null;
  joinedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export default function AdminWaitingListClientPage({
  initialData,
}: {
  initialData: WaitingListEntry[];
}) {
  const [data, setData] = useState(initialData);
  const [filteredData, setFilteredData] = useState(initialData);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedEntry, setSelectedEntry] = useState<WaitingListEntry | null>(
    null,
  );
  const [openDialog, setOpenDialog] = useState(false);
  const [newStatus, setNewStatus] = useState("approved");

  // Filter data based on invitation status
  const applyFilter = (status: string) => {
    setStatusFilter(status);
    if (status === "all") {
      setFilteredData(data);
    } else if (status === "invited") {
      setFilteredData(data.filter((entry) => entry.invitedAt !== null));
    } else if (status === "not_invited") {
      setFilteredData(data.filter((entry) => entry.invitedAt === null));
    }
  };

  const handleStatusChange = async (entry: WaitingListEntry) => {
    try {
      // Import the update function
      const { inviteToApp } = await import("@/actions/waiting-list");

      // Invite the user to the app
      const result = await inviteToApp(entry.id);

      if (result.success && result.data) {
        // Update the local state
        setFilteredData(
          filteredData.map((item) =>
            item.id === entry.id
              ? { ...item, invitedAt: result.data.invitedAt }
              : item,
          ),
        );
        setData(
          data.map((item) =>
            item.id === entry.id
              ? { ...item, invitedAt: result.data.invitedAt }
              : item,
          ),
        );
        alert(`Utilisateur ${entry.fullName} invité avec succès!`);
      } else {
        alert("Erreur lors de l'invitation de l'utilisateur");
      }
    } catch (error) {
      console.error("Error inviting user:", error);
      alert("Erreur lors de l'invitation de l'utilisateur");
    }
  };

  const handleUpdateStatus = async () => {
    if (selectedEntry) {
      // In a real app, you would call the server action here
      // const { updateWaitingListStatus } = await import("@/actions/waiting-list");
      // const result = await updateWaitingListStatus(selectedEntry.id, newStatus);

      // For now, just close the dialog
      setOpenDialog(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "approved":
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
      case "approved":
        return "Approuvé";
      case "completed":
        return "Complété";
      default:
        return "Rejeté";
    }
  };

  return (
    <AdminPageWrapper
      title="Liste d'attente"
      description="Gérez les inscriptions à la liste d'attente"
    >
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Inscriptions</h2>
            <p className="text-sm text-gray-500">
              Liste des utilisateurs inscrits
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={statusFilter} onValueChange={applyFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="invited">Invités</SelectItem>
                <SelectItem value="not_invited">Non invités</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Utilisateur
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Contact
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
                  Date d'inscription
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
              {filteredData.map((entry) => (
                <tr key={entry.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {entry.fullName}
                        </div>
                        {entry.city && (
                          <div className="text-sm text-gray-500">
                            {entry.city}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {entry.whatsapp}
                    </div>
                    {entry.email && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Mail className="mr-1 h-4 w-4" />
                        {entry.email}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-yellow-500" />
                      <span className="ml-2 text-sm font-medium">
                        Inscription
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4" />
                      {format(new Date(entry.createdAt), "dd MMM yyyy HH:mm", {
                        locale: fr,
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange(entry)}
                    >
                      Mettre à jour
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Update Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mettre à jour le statut</DialogTitle>
            <DialogDescription>
              Mettre à jour le statut pour {selectedEntry?.fullName}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Statut
              </label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="approved">Approuvé</SelectItem>
                  <SelectItem value="completed">Complété</SelectItem>
                  <SelectItem value="rejected">Rejeté</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleUpdateStatus}>Mettre à jour</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPageWrapper>
  );
}
