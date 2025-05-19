import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Plus, Loader2, Trash2, Pencil } from "lucide-react";
import { getSubscriptionsWithDetails, deleteSubscription } from "@/services/subscriptionService";
import { SubscriptionForm } from "@/components/subscriptions/SubscriptionForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Subscription, Platform, Customer } from "@/types";

const Subscriptions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState<(Subscription & { platform: Platform; customer: Customer }) | null>(null);
  
  const { data: subscriptions = [], isLoading, refetch } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: getSubscriptionsWithDetails
  });

  const filteredSubscriptions = subscriptions.filter(subscription => 
    subscription.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subscription.platform.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subscription.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subscription.notes?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string, expiryDate: string) => {
    if (status === 'expired' || status === 'cancelled') return 'destructive';
    
    const now = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.floor((expiry.getTime() - now.getTime()) / (1000 * 3600 * 24));
    
    if (daysUntilExpiry <= 7) return 'warning';
    return 'success';
  };

  const handleDelete = async (id: string) => {
    console.log(`Initiating deletion of subscription with id: ${id}`);
    const success = await deleteSubscription(id);
    console.log(`Subscription deletion ${success ? 'successful' : 'failed'}`);
    
    if (success) {
      await refetch();
    }
  };

  const handleEdit = (subscription: Subscription & { platform: Platform; customer: Customer }) => {
    setCurrentSubscription(subscription);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscriptions</h1>
          <p className="text-muted-foreground">Manage your subscription database</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="sm:w-auto">
              <Plus className="mr-2 h-4 w-4" /> Add Subscription
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Subscription</DialogTitle>
            </DialogHeader>
            <SubscriptionForm onSuccess={() => {
              setIsAddDialogOpen(false);
              refetch();
            }} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search subscriptions..."
              className="w-full pl-8 bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading subscriptions...</span>
            </div>
          ) : filteredSubscriptions.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubscriptions.map((subscription) => {
                    const statusColor = getStatusColor(subscription.status, subscription.expiryDate) as "default" | "destructive" | "success" | "warning";
                    const daysUntilExpiry = Math.floor((new Date(subscription.expiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                    
                    return (
                      <TableRow key={subscription.id}>
                        <TableCell className="font-medium">{subscription.customer.name}</TableCell>
                        <TableCell>{subscription.platform.name}</TableCell>
                        <TableCell className="capitalize">{subscription.type}</TableCell>
                        <TableCell>₹{parseFloat(subscription.cost.toString()).toFixed(2)}</TableCell>
                        <TableCell>{format(new Date(subscription.expiryDate), "MMM dd, yyyy")}</TableCell>
                        <TableCell>
                          <Badge variant={statusColor}>
                            {subscription.status === 'active' 
                              ? `${daysUntilExpiry > 0 ? `${daysUntilExpiry} days` : 'Expires today'}` 
                              : subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right flex justify-end space-x-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(subscription)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Subscription</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete the {subscription.platform.name} subscription for {subscription.customer.name}? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  className="bg-destructive text-destructive-foreground"
                                  onClick={() => handleDelete(subscription.id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10">
              <h3 className="text-lg font-medium">No subscriptions found</h3>
              <p className="text-muted-foreground mt-1">
                {searchQuery ? "Try a different search term" : "Add your first subscription to get started"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Edit Subscription Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Subscription</DialogTitle>
          </DialogHeader>
          {currentSubscription && (
            <SubscriptionForm 
              subscription={currentSubscription}
              isEditing={true}
              onSuccess={() => {
                setIsEditDialogOpen(false);
                refetch();
              }} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Subscriptions;
