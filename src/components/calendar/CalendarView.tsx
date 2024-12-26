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
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import {
  getAppointments,
  createAppointment,
  updateAppointment,
  getClients,
  getServices,
  deleteAppointment,
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
  const [selectedAppointment, setSelectedAppointment] =
    React.useState<AppointmentWithDetails | null>(null);
  const { toast } = useToast();

  // Extract all appointment dates for calendar indicators
  const appointmentDates = React.useMemo(() => {
    return appointments.map((apt) => new Date(apt.date));
  }, [appointments]);

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

  // Group appointments by client and date
  const groupedAppointments = appointments.reduce(
    (acc, apt) => {
      const key = `${apt.clients.id}-${apt.date}-${apt.time}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(apt);
      return acc;
    },
    {} as Record<string, AppointmentWithDetails[]>,
  );

  // Format appointments with combined services
  const formattedAppointments = Object.values(groupedAppointments).map(
    (group) => {
      const firstApt = group[0];
      return {
        id: firstApt.id,
        clientName: `${firstApt.clients?.first_name} ${firstApt.clients?.last_name}`,
        serviceName: group.map((apt) => apt.services.name).join(", "),
        serviceColor: firstApt.services.color,
        duration: firstApt.services.duration.toString(),
        time: firstApt.time,
        date: new Date(firstApt.date),
        notes: firstApt.notes || "",
        isPaid: firstApt.is_paid,
        services: group.map((apt) => ({
          name: apt.services.name,
          duration: apt.services.duration,
        })),
        clientId: firstApt.clients.id,
        serviceId: firstApt.services.id,
      };
    },
  );

  const handleAppointmentSubmit = async (appointmentData: {
    clientId: string;
    serviceIds: string[];
    date: string;
    time: string;
  }) => {
    try {
      if (selectedAppointment) {
        // Update existing appointment
        await updateAppointment(selectedAppointment.id, {
          client_id: appointmentData.clientId,
          service_id: appointmentData.serviceIds[0], // For now, just update with the first service
          date: appointmentData.date,
          time: appointmentData.time,
        });

        toast({
          title: "Wizyta zaktualizowana",
          description: "Pomyślnie zaktualizowano wizytę",
        });
      } else {
        // Create new appointments for each service
        await Promise.all(
          appointmentData.serviceIds.map((serviceId) =>
            createAppointment({
              client_id: appointmentData.clientId,
              service_id: serviceId,
              date: appointmentData.date,
              time: appointmentData.time,
              is_paid: false,
            }),
          ),
        );

        toast({
          title: "Wizyta dodana",
          description: "Pomyślnie dodano nową wizytę",
        });
      }

      await fetchAppointments();
      setShowAppointmentForm(false);
      setSelectedAppointment(null);
    } catch (error) {
      console.error("Error managing appointment:", error);
      toast({
        title: "Błąd",
        description: selectedAppointment
          ? "Nie udało się zaktualizować wizyty"
          : "Nie udało się dodać wizyty",
        variant: "destructive",
      });
    }
  };

  const handleEditAppointment = (appointment: AppointmentWithDetails) => {
    setSelectedAppointment(appointment);
    setShowAppointmentForm(true);
  };

  const handleDeleteAppointment = async (appointmentId: string) => {
    try {
      await deleteAppointment(appointmentId);
      await fetchAppointments();
      toast({
        title: "Wizyta usunięta",
        description: "Pomyślnie usunięto wizytę",
      });
    } catch (error) {
      console.error("Error deleting appointment:", error);
      toast({
        title: "Błąd",
        description: "Nie udało się usunąć wizyty",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full bg-gray-50 p-4 space-y-4">
      {/* Header Section */}
      <div className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h2 className="text-2xl font-semibold">
            Harmonogram na {format(selectedDate, "d MMMM yyyy", { locale: pl })}
          </h2>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="text-xl font-medium text-gray-600">
              {format(currentDate, "HH:mm")}
            </div>
            <Button
              onClick={() => {
                setSelectedAppointment(null);
                setShowAppointmentForm(true);
              }}
              className="flex items-center gap-2 w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" />
              Nowa wizyta
            </Button>
          </div>
        </div>

        {/* Timeline - Hidden on Mobile */}
        <div className="hidden md:block">
          <AppointmentTimeline
            appointments={formattedAppointments}
            selectedDate={selectedDate}
          />
        </div>
      </div>

      <Dialog
        open={showAppointmentForm}
        onOpenChange={(open) => {
          setShowAppointmentForm(open);
          if (!open) setSelectedAppointment(null);
        }}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <AppointmentForm
            onSubmit={handleAppointmentSubmit}
            clients={clients}
            services={services}
            selectedDate={selectedDate}
            appointmentDates={appointmentDates}
            onCancel={() => {
              setShowAppointmentForm(false);
              setSelectedAppointment(null);
            }}
            initialValues={
              selectedAppointment
                ? {
                    clientId: selectedAppointment.clients.id,
                    serviceIds: [selectedAppointment.services.id],
                    date: selectedAppointment.date,
                    time: selectedAppointment.time,
                  }
                : undefined
            }
          />
        </DialogContent>
      </Dialog>

      {/* Split View Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Calendar Picker */}
        <Card className="p-4 bg-white order-1 lg:order-none">
          <div className="text-center mb-4 text-lg font-medium text-gray-600">
            {format(currentDate, "EEEE, d MMMM yyyy", { locale: pl })}
          </div>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="rounded-md mx-auto"
            modifiers={{
              booked: appointmentDates,
            }}
            modifiersStyles={{
              booked: {
                backgroundColor: "#f3f4f6",
                fontWeight: "bold",
              },
            }}
            locale={pl}
          />
        </Card>

        {/* Appointment List */}
        <div className="lg:col-span-2 order-2 lg:order-none">
          <AppointmentList
            appointments={formattedAppointments}
            selectedDate={selectedDate}
            onAppointmentUpdate={fetchAppointments}
            onEdit={handleEditAppointment}
            onDelete={handleDeleteAppointment}
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
