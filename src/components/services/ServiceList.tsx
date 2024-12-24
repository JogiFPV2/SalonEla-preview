import React from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Edit2, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

interface Service {
  id: string;
  name: string;
  duration: number;
  color: string;
}

interface ServiceListProps {
  services?: Service[];
  onEdit?: (service: Service) => void;
  onDelete?: (id: string) => void;
}

const defaultServices: Service[] = [
  {
    id: "1",
    name: "Strzyżenie",
    duration: 30,
    color: "#FFB5E8",
  },
  {
    id: "2",
    name: "Manicure",
    duration: 45,
    color: "#B5EAEA",
  },
  {
    id: "3",
    name: "Zabieg na twarz",
    duration: 60,
    color: "#E5D4FF",
  },
];

const ServiceList: React.FC<ServiceListProps> = ({
  services = defaultServices,
  onEdit = () => {},
  onDelete = () => {},
}) => {
  const [serviceToDelete, setServiceToDelete] = React.useState<Service | null>(
    null,
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Usługi</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <Card key={service.id} className="p-4 relative">
            <div
              className="w-4 h-4 rounded-full absolute top-4 right-4"
              style={{ backgroundColor: service.color }}
            />
            <h3 className="text-lg font-medium mb-2">{service.name}</h3>
            <p className="text-gray-600 mb-4">{service.duration} minut</p>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(service)}
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edytuj
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700"
                onClick={() => setServiceToDelete(service)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Usuń
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <AlertDialog
        open={!!serviceToDelete}
        onOpenChange={() => setServiceToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Czy jesteś pewien?</AlertDialogTitle>
            <AlertDialogDescription>
              Ta akcja trwale usunie usługę "{serviceToDelete?.name}". Tej
              operacji nie można cofnąć.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (serviceToDelete) {
                  onDelete(serviceToDelete.id);
                  setServiceToDelete(null);
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Usuń
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ServiceList;
