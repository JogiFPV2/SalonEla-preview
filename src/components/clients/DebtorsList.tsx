import React from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAppointments, updateAppointment } from "@/lib/queries";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { AppointmentWithDetails } from "../calendar/CalendarView";
import { useToast } from "@/components/ui/use-toast";

const DebtorsList = () => {
  const [unpaidAppointments, setUnpaidAppointments] = React.useState<
    AppointmentWithDetails[]
  >([]);
  const { toast } = useToast();

  const fetchUnpaidAppointments = async () => {
    try {
      const appointments = await getAppointments();
      const unpaid = (appointments as AppointmentWithDetails[]).filter(
        (apt) => !apt.is_paid,
      );
      setUnpaidAppointments(unpaid);
    } catch (error) {
      console.error("Error fetching unpaid appointments:", error);
    }
  };

  React.useEffect(() => {
    fetchUnpaidAppointments();
  }, []);

  const handleMarkAsPaid = async (appointmentId: string) => {
    try {
      await updateAppointment(appointmentId, { is_paid: true });
      await fetchUnpaidAppointments();
      toast({
        title: "Zaktualizowano",
        description: "Wizyta została oznaczona jako opłacona",
      });
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast({
        title: "Błąd",
        description: "Nie udało się zaktualizować statusu płatności",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-4">
      <h2 className="text-xl font-semibold mb-4">Lista nieopłaconych wizyt</h2>
      <ScrollArea className="h-[600px]">
        <div className="space-y-4">
          {unpaidAppointments.map((appointment) => (
            <Card key={appointment.id} className="p-4 bg-red-50">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: appointment.services.color }}
                    />
                    <span className="font-medium">
                      {appointment.clients.first_name}{" "}
                      {appointment.clients.last_name}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {appointment.services.name} -{" "}
                    {format(new Date(appointment.date), "d MMMM yyyy", {
                      locale: pl,
                    })}{" "}
                    {appointment.time.slice(0, 5)}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="destructive" className="text-sm">
                    {appointment.services.duration} min -{" "}
                    {appointment.services.price || "0"} zł
                  </Badge>
                  <Button
                    size="sm"
                    onClick={() => handleMarkAsPaid(appointment.id)}
                  >
                    Oznacz jako opłacone
                  </Button>
                </div>
              </div>
            </Card>
          ))}
          {unpaidAppointments.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              Brak nieopłaconych wizyt
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default DebtorsList;
