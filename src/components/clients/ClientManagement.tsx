import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientForm from "./ClientForm";
import ClientList from "./ClientList";
import DebtorsList from "./DebtorsList";
import {
  getClients,
  createClient,
  updateClient,
  deleteClient,
  getAppointments,
} from "@/lib/queries";
import { Database } from "@/types/database.types";

type Client = Database["public"]["Tables"]["clients"]["Row"];
type Appointment = Database["public"]["Tables"]["appointments"]["Row"] & {
  services: Database["public"]["Tables"]["services"]["Row"];
  clients: Client;
};

const ClientManagement = () => {
  const [selectedClient, setSelectedClient] = React.useState<Client | null>(
    null,
  );
  const [clients, setClients] = React.useState<Client[]>([]);
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);

  // Fetch clients and appointments on component mount
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsData, appointmentsData] = await Promise.all([
          getClients(),
          getAppointments(),
        ]);
        setClients(clientsData);
        setAppointments(appointmentsData as Appointment[]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (clientData: {
    firstName: string;
    lastName: string;
    phone: string;
  }) => {
    try {
      if (selectedClient) {
        const updatedClient = await updateClient(selectedClient.id, {
          first_name: clientData.firstName,
          last_name: clientData.lastName,
          phone: clientData.phone,
        });
        setClients((prev) =>
          prev.map((client) =>
            client.id === selectedClient.id ? updatedClient : client,
          ),
        );
      } else {
        const newClient = await createClient({
          first_name: clientData.firstName,
          last_name: clientData.lastName,
          phone: clientData.phone,
        });
        setClients((prev) => [...prev, newClient]);
      }
      setSelectedClient(null);
    } catch (error) {
      console.error("Error saving client:", error);
    }
  };

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
  };

  const handleDelete = async (clientId: string) => {
    try {
      await deleteClient(clientId);
      setClients((prev) => prev.filter((client) => client.id !== clientId));
      if (selectedClient?.id === clientId) {
        setSelectedClient(null);
      }
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  const handlePaymentUpdate = async () => {
    // Refresh appointments after payment status update
    try {
      const appointmentsData = await getAppointments();
      setAppointments(appointmentsData as Appointment[]);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  return (
    <div className="w-full h-full bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Zarządzanie Klientami</h1>

        <Tabs defaultValue="clients" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="clients">Lista Klientów</TabsTrigger>
            <TabsTrigger value="debtors">Dłużnicy</TabsTrigger>
          </TabsList>

          <TabsContent value="clients">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-4">
                <ClientForm
                  onSubmit={handleSubmit}
                  initialValues={
                    selectedClient
                      ? {
                          firstName: selectedClient.first_name,
                          lastName: selectedClient.last_name,
                          phone: selectedClient.phone,
                        }
                      : undefined
                  }
                  isEditing={!!selectedClient}
                />
              </div>

              <div className="lg:col-span-8">
                <ClientList
                  clients={clients.map((client) => ({
                    id: client.id,
                    name: client.first_name,
                    surname: client.last_name,
                    phone: client.phone,
                  }))}
                  onEdit={(listClient) =>
                    handleEdit({
                      id: listClient.id,
                      first_name: listClient.name,
                      last_name: listClient.surname,
                      phone: listClient.phone,
                      created_at: "", // These are required by the type but not needed for edit
                      updated_at: "",
                    })
                  }
                  onDelete={handleDelete}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="debtors">
            <DebtorsList
              appointments={appointments}
              onPaymentUpdate={handlePaymentUpdate}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClientManagement;
