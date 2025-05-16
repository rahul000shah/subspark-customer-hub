
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Subscription, Platform, Customer } from "@/types";
import { format } from "date-fns";

interface RecentSubscriptionsProps {
  subscriptions: (Subscription & {
    platform: Platform;
    customer: Customer;
  })[];
  isLoading?: boolean;
}

const RecentSubscriptions = ({ subscriptions, isLoading = false }: RecentSubscriptionsProps) => {
  const getStatusColor = (status: string, expiryDate: string) => {
    if (status === 'expired') return 'destructive';
    
    const now = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.floor((expiry.getTime() - now.getTime()) / (1000 * 3600 * 24));
    
    if (daysUntilExpiry <= 7) return 'warning';
    return 'success';
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="h-8 w-48 animate-pulse rounded-md bg-muted"></div>
        <div className="rounded-md border">
          <div className="h-64 animate-pulse bg-muted"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Recent Subscriptions</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No recent subscriptions found
                </TableCell>
              </TableRow>
            ) : (
              subscriptions.map((subscription) => {
                const statusColor = getStatusColor(subscription.status, subscription.expiryDate);
                
                return (
                  <TableRow key={subscription.id}>
                    <TableCell>{subscription.customer.name}</TableCell>
                    <TableCell>{subscription.platform.name}</TableCell>
                    <TableCell className="capitalize">{subscription.type}</TableCell>
                    <TableCell>{format(new Date(subscription.expiryDate), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>
                      <Badge variant={statusColor as "success" | "warning" | "destructive"}>
                        {subscription.status === 'active' 
                          ? `Expires in ${Math.floor((new Date(subscription.expiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24))} days` 
                          : 'Expired'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RecentSubscriptions;
