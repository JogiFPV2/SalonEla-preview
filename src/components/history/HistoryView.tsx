import React from "react";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { getAppointments } from "@/lib/queries";
import { AppointmentWithDetails } from "../calendar/CalendarView";

const HistoryView = () => {
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  const [appointments, setAppointments] = React.useState<
    AppointmentWithDetails[]
  >([]);

  const fetchAppointments = async () => {
    try {
      const appointmentsData = await getAppointments();
      setAppointments(appointmentsData as AppointmentWithDetails[]);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  React.useEffect(() => {
    fetchAppointments();
  }, []);

  const selectedDateAppointments = appointments.filter(
    (apt) =>
      format(new Date(apt.date), "yyyy-MM-dd") ===
      format(selectedDate, "yyyy-MM-dd"),
  );

  return (
    <div className="w-full h-full bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Historia wizyt</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            <Card className="p-4">
              <div className="text-center mb-4 text-lg font-medium text-gray-600">
                {format(selectedDate, "EEEE, d MMMM yyyy", { locale: pl })}
              </div>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md"
                locale={pl}
              />
            </Card>
          </div>

          <div className="lg:col-span-8">
            <Card className="p-4">
              <h2 className="text-xl font-semibold mb-4">
                Wizyty z dnia{" "}
                {format(selectedDate, "d MMMM yyyy", { locale: pl })}
              </h2>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {selectedDateAppointments.map((appointment) => (
                    <Card
                      key={appointment.id}
                      className={`p-4 ${appointment.is_paid ? "bg-green-50" : "bg-red-50"}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{
                                backgroundColor: appointment.services.color,
                              }}
                            />
                            <span className="font-medium">
                              {appointment.clients.first_name}{" "}
                              {appointment.clients.last_name}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {appointment.services.name} -{" "}
                            {appointment.time.slice(0, 5)}
                          </div>
                          {appointment.notes && (
                            <div className="text-sm text-gray-500 mt-2">
                              Notatki: {appointment.notes}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge
                            variant={
                              appointment.is_paid ? "default" : "destructive"
                            }
                            className="text-sm"
                          >
                            {appointment.is_paid ? "Opłacone" : "Nieopłacone"}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {appointment.services.duration} min
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))}
                  {selectedDateAppointments.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      Brak wizyt w tym dniu
                    </div>
                  )}
                </div>
              </ScrollArea>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryView;
