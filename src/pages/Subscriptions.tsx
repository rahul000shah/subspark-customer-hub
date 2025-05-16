
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Plus } from "lucide-react";

const Subscriptions = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscriptions</h1>
          <p className="text-muted-foreground">Manage your subscription database</p>
        </div>
        <Button className="sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Add Subscription
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search subscriptions..."
              className="w-full pl-8 bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-center py-10">
        <div className="text-center">
          <h2 className="text-xl font-medium">Coming Soon</h2>
          <p className="text-muted-foreground mt-1">
            The subscriptions management page is under development
          </p>
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;
