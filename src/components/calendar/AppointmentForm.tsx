import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, ChevronDown, ChevronUp, X, Clock } from "lucide-react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { Database } from "@/types/database.types";

type Client = Database["public"]["Tables"]["clients"]["Row"];
type Service = Database["public"]["Tables"]["services"]["Row"];

type AppointmentFormProps = {
  onSubmit: (appointment: {
    clientId: string;
    serviceIds: string[];
    date: string;
    time: string;
  }) => void;
  clients: Client[];
  services: Service[];
  selectedDate?: Date;
  onCancel: () => void;
};

const AppointmentForm = ({
  onSubmit,
  clients,
  services,
  selectedDate = new Date(),
  onCancel,
}: AppointmentFormProps) => {
  const [date, setDate] = React.useState<Date>(selectedDate);
  const [time, setTime] = React.useState("09:00");
  const [selectedServices, setSelectedServices] = React.useState<Service[]>([]);
  const [selectedClient, setSelectedClient] = React.useState<Client | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = React.useState("");
  const [showAllClients, setShowAllClients] = React.useState(false);

  const filteredClients = clients.filter((client) =>
    `${client.first_name} ${client.last_name} ${client.phone}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedClient && selectedServices.length > 0) {
      onSubmit({
        clientId: selectedClient.id,
        serviceIds: selectedServices.map((service) => service.id),
        date: format(date, "yyyy-MM-dd"),
        time,
      });
    }
  };

  const toggleService = (service: Service) => {
    setSelectedServices((prev) =>
      prev.some((s) => s.id === service.id)
        ? prev.filter((s) => s.id !== service.id)
        : [...prev, service],
    );
  };

  const totalDuration = selectedServices.reduce(
    (total, service) => total + service.duration,
    0,
  );

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-8">
          {/* Left Column - Date & Time */}
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Data</Label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                className="rounded-md border mt-2"
                locale={pl}
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Godzina</Label>
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                step="60"
                className="mt-2"
              />
            </div>
          </div>

          {/* Right Column - Services & Client */}
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Wybrane usługi</Label>
              <div className="space-y-2">
                {selectedServices.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-center justify-between p-2 rounded-md border"
                    style={{ backgroundColor: service.color + "33" }}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: service.color }}
                      />
                      <span>{service.name}</span>
                      <span className="text-sm text-gray-500">
                        ({service.duration} min)
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleService(service)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {selectedServices.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 p-2 bg-gray-50 rounded-md">
                    <Clock className="h-4 w-4" />
                    Łączny czas: {totalDuration} min
                  </div>
                )}
              </div>
              <ScrollArea className="h-[200px] border rounded-md p-1.5">
                <div className="space-y-2">
                  {services
                    .filter(
                      (s) => !selectedServices.some((ss) => ss.id === s.id),
                    )
                    .map((service) => (
                      <button
                        key={service.id}
                        type="button"
                        className="w-full flex items-center justify-between p-2 rounded-md hover:bg-gray-100"
                        onClick={() => toggleService(service)}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: service.color }}
                          />
                          <span>{service.name}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {service.duration} min
                        </span>
                      </button>
                    ))}
                </div>
              </ScrollArea>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Klient</Label>
              {selectedClient ? (
                <div className="flex items-center justify-between p-2 rounded-md border">
                  <span>
                    {selectedClient.first_name} {selectedClient.last_name}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedClient(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Szukaj klienta..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  {(searchTerm || showAllClients) && (
                    <ScrollArea className="h-[200px] border rounded-md p-1.5">
                      <div className="space-y-2">
                        {filteredClients.map((client) => (
                          <button
                            key={client.id}
                            type="button"
                            className="w-full text-left p-2 rounded-md hover:bg-gray-100"
                            onClick={() => {
                              setSelectedClient(client);
                              setSearchTerm("");
                            }}
                          >
                            <div className="font-medium">
                              {client.first_name} {client.last_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {client.phone}
                            </div>
                          </button>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowAllClients(!showAllClients)}
                  >
                    {showAllClients ? (
                      <>
                        <ChevronUp className="h-4 w-4 mr-2" />
                        Ukryj listę klientów
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4 mr-2" />
                        Pokaż wszystkich klientów
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Anuluj
          </Button>
          <Button
            type="submit"
            disabled={!selectedClient || selectedServices.length === 0}
          >
            Dodaj wizytę
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;
