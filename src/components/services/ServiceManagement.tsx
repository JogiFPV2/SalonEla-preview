import React from "react";
import ServiceForm from "./ServiceForm";
import ServiceList from "./ServiceList";
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from "@/lib/queries";
import { Database } from "@/types/database.types";

type Service = Database["public"]["Tables"]["services"]["Row"];

const ServiceManagement = () => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [selectedService, setSelectedService] = React.useState<Service | null>(
    null,
  );
  const [services, setServices] = React.useState<Service[]>([]);

  // Fetch services on component mount
  React.useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices();
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);

  const handleServiceSubmit = async (serviceData: {
    name: string;
    duration: number;
    color: string;
  }) => {
    try {
      if (selectedService) {
        const updatedService = await updateService(
          selectedService.id,
          serviceData,
        );
        setServices((prev) =>
          prev.map((service) =>
            service.id === selectedService.id ? updatedService : service,
          ),
        );
      } else {
        const newService = await createService(serviceData);
        setServices((prev) => [...prev, newService]);
      }
      setSelectedService(null);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving service:", error);
    }
  };

  const handleEdit = (service: Service) => {
    setSelectedService(service);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteService(id);
      setServices((prev) => prev.filter((service) => service.id !== id));
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  return (
    <div className="w-full h-full min-h-[800px] bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Zarządzanie Usługami</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            <ServiceForm
              onSubmit={handleServiceSubmit}
              initialValues={
                selectedService
                  ? {
                      name: selectedService.name,
                      duration: selectedService.duration,
                      color: selectedService.color,
                    }
                  : undefined
              }
              isEditing={isEditing}
            />
          </div>

          <div className="lg:col-span-8">
            <ServiceList
              services={services}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceManagement;
