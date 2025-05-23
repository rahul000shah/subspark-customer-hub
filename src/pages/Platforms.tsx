
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Plus, Loader2, Trash2, Pencil } from "lucide-react";
import { getPlatforms, deletePlatform } from "@/services/platformService";
import { PlatformForm } from "@/components/platforms/PlatformForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Platform } from "@/types";

const Platforms = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentPlatform, setCurrentPlatform] = useState<Platform | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingPlatformId, setDeletingPlatformId] = useState<string | null>(null);
  
  const { data: platforms = [], isLoading, refetch } = useQuery({
    queryKey: ['platforms'],
    queryFn: getPlatforms
  });

  const filteredPlatforms = platforms.filter(platform => 
    platform.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    platform.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string, name: string) => {
    setIsDeleting(true);
    setDeletingPlatformId(id);
    
    try {
      console.log(`Starting deletion of platform: ${name} (${id})`);
      const success = await deletePlatform(id, name);
      
      if (success) {
        console.log(`Platform ${name} deleted successfully`);
        await refetch(); // Refresh the data after successful deletion
      } else {
        console.error(`Failed to delete platform ${name}`);
      }
    } catch (error) {
      console.error("Error in handleDelete:", error);
    } finally {
      setIsDeleting(false);
      setDeletingPlatformId(null);
    }
  };
  
  const handleEdit = (platform: Platform) => {
    setCurrentPlatform(platform);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Platforms</h1>
          <p className="text-muted-foreground">Manage your platform database</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="sm:w-auto">
              <Plus className="mr-2 h-4 w-4" /> Add Platform
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[475px]">
            <DialogHeader>
              <DialogTitle>Add New Platform</DialogTitle>
            </DialogHeader>
            <PlatformForm onSuccess={() => {
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
              placeholder="Search platforms..."
              className="w-full pl-8 bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading platforms...</span>
            </div>
          ) : filteredPlatforms.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlatforms.map((platform) => (
                    <TableRow key={platform.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {platform.logoUrl && (
                            <img 
                              src={platform.logoUrl} 
                              alt={platform.name} 
                              className="h-6 w-6 object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          )}
                          {platform.name}
                        </div>
                      </TableCell>
                      <TableCell>{platform.description || "-"}</TableCell>
                      <TableCell className="text-right flex justify-end space-x-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(platform)}>
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
                              <AlertDialogTitle>Delete Platform</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {platform.name}? This action cannot be undone and will remove all associated subscriptions.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                className="bg-destructive text-destructive-foreground"
                                onClick={() => handleDelete(platform.id, platform.name)}
                                disabled={isDeleting && deletingPlatformId === platform.id}
                              >
                                {isDeleting && deletingPlatformId === platform.id ? 
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10">
              <h3 className="text-lg font-medium">No platforms found</h3>
              <p className="text-muted-foreground mt-1">
                {searchQuery ? "Try a different search term" : "Add your first platform to get started"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Edit Platform Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[475px]">
          <DialogHeader>
            <DialogTitle>Edit Platform</DialogTitle>
          </DialogHeader>
          {currentPlatform && (
            <PlatformForm 
              platform={currentPlatform}
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

export default Platforms;
