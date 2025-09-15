# Système de Paiement Global Love

## Structure

Le système de paiement comprend les composants suivants :

### Pages utilisateur
1. **Page de paiement** (`/app/payment/page.tsx`) - Interface pour effectuer les paiements
2. **Tableau de bord utilisateur** (`/app/dashboard/page.tsx`) - Suivi du statut des paiements

### Pages administrateur
1. **Gestion des paiements** (`/app/admin/payments/page.tsx`) - Interface d'administration pour gérer les paiements
2. **Paramètres de paiement** - Configuration des numéros de téléphone pour Orange Money et MTN Mobile Money

### Modèles de données
1. **Payment** - Enregistre les informations de paiement
2. **PaymentSettings** - Stocke les paramètres de paiement (numéros de téléphone)

### Actions serveur
1. **createPayment** - Crée un enregistrement de paiement
2. **updatePaymentStatus** - Met à jour le statut d'un paiement
3. **getPaymentSettings** - Récupère les paramètres de paiement
4. **updatePaymentSettings** - Met à jour les paramètres de paiement

## Fonctionnalités

### Pour les utilisateurs
- Choix entre trois offres : Essentiel (25 000 FCFA), Privilégié (50 000 FCFA), VIP Or (100 000 FCFA)
- Paiement via Orange Money ou MTN Mobile Money
- Téléchargement de capture d'écran de transaction
- Suivi du statut de paiement en temps réel
- Support client via WhatsApp

### Pour les administrateurs
- Visualisation de tous les paiements
- Mise à jour du statut des paiements (en attente, vérifié, complété, rejeté)
- Configuration des numéros de téléphone pour les paiements
- Visualisation des captures d'écran

## Workflow

1. L'utilisateur sélectionne une offre et une méthode de paiement
2. L'utilisateur effectue le paiement vers le numéro affiché
3. L'utilisateur télécharge une capture d'écran de la transaction
4. L'utilisateur soumet le formulaire
5. L'administrateur vérifie la transaction et met à jour le statut
6. L'utilisateur reçoit une notification et peut accéder aux services

## Configuration

Les numéros de téléphone pour les paiements sont configurables dans l'interface d'administration.