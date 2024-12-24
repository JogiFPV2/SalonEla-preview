import React from "react";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AppointmentTimeline from "./AppointmentTimeline";
import AppointmentList from "./AppointmentList";
import AppointmentForm from "./AppointmentForm";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import {
  getAppointments,
  createAppointment,
  getClients,
  getServices,
} from "@/lib/queries";
import { Database } from "@/types/database.types";

export type AppointmentWithDetails = {
  id: string;
  date: string;
  time: string;
  notes: string | null;
  is_paid: boolean;
  clients: {
    id: string;
    first_name: string;
    last_name: string;
  };
  services: {
    id: string;
    name: string;
    duration: number;
    color: string;
  };
};

type Client = Database["public"]["Tables"]["clients"]["Row"];
type Service = Database["public"]["Tables"]["services"]["Row"];

const CalendarView = () => {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [appointments, setAppointments] = React.useState<
    AppointmentWithDetails[]
  >([]);
  const [clients, setClients] = React.useState<Client[]>([]);
  const [services, setServices] = React.useState<Service[]>([]);
  const [showAppointmentForm, setShowAppointmentForm] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchAppointments = async () => {
    try {
      const appointmentsData = await getAppointments();
      setAppointments(appointmentsData as AppointmentWithDetails[]);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [appointmentsData, clientsData, servicesData] = await Promise.all(
          [getAppointments(), getClients(), getServices()],
        );
        setAppointments(appointmentsData as AppointmentWithDetails[]);
        setClients(clientsData);
        setServices(servicesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const formattedAppointments = appointments.map((apt) => ({
    id: apt.id,
    clientName: `${apt.clients?.first_name} ${apt.clients?.last_name}`,
    serviceName: apt.services.name,
    serviceColor: apt.services.color,
    duration: apt.services.duration.toString(),
    time: apt.time,
    date: new Date(apt.date),
    notes: apt.notes || "",
    isPaid: apt.is_paid,
  }));

  const handleAppointmentSubmit = async (appointmentData: {
    clientId: string;
    serviceIds: string[];
    date: string;
    time: string;
  }) => {
    try {
      await createAppointment({
        client_id: appointmentData.clientId,
        service_ids: appointmentData.serviceIds,
        date: appointmentData.date,
        time: appointmentData.time,
      });

      await fetchAppointments();
      setShowAppointmentForm(false);
      toast({
        title: "Wizyta dodana",
        description: "Pomyślnie dodano nową wizytę",
      });
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast({
        title: "Błąd",
        description: "Nie udało się dodać wizyty",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full bg-gray-50 p-4 space-y-4">
      {/* Timeline Section */}
      <div className="w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">
            Harmonogram na {format(selectedDate, "d MMMM yyyy", { locale: pl })}
          </h2>
          <div className="flex items-center gap-4">
            <div className="text-xl font-medium text-gray-600">
              {format(currentDate, "HH:mm")}
            </div>
            <Button
              onClick={() => setShowAppointmentForm(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nowa wizyta
            </Button>
          </div>
        </div>
        <AppointmentTimeline
          appointments={formattedAppointments}
          selectedDate={selectedDate}
        />
      </div>

      <Dialog open={showAppointmentForm} onOpenChange={setShowAppointmentForm}>
        <DialogContent className="max-w-2xl max-h-[75vh] w-[90vw] p-3">
          <DialogHeader>
            <DialogTitle>Nowa wizyta</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <AppointmentForm
              onSubmit={handleAppointmentSubmit}
              clients={clients}
              services={services}
              selectedDate={selectedDate}
              onCancel={() => setShowAppointmentForm(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Split View Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Calendar Picker */}
        <Card className="p-4 bg-white">
          <div className="text-center mb-4 text-lg font-medium text-gray-600">
            {format(currentDate, "EEEE, d MMMM yyyy", { locale: pl })}
          </div>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="rounded-md"
            locale={pl}
          />
        </Card>

        {/* Appointment List */}
        <div className="lg:col-span-2">
          <AppointmentList
            appointments={formattedAppointments}
            selectedDate={selectedDate}
            onAppointmentUpdate={fetchAppointments}
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
