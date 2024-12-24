import React from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  User,
  Scissors,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format, isSameDay } from "date-fns";
import { pl } from "date-fns/locale";
import { updateAppointment } from "@/lib/queries";

type Appointment = {
  id: string;
  clientName: string;
  serviceName: string;
  serviceColor: string;
  duration: string;
  time: string;
  date: Date;
  notes?: string;
  isPaid?: boolean;
};

type AppointmentListProps = {
  appointments?: Appointment[];
  selectedDate?: Date;
  onAppointmentUpdate?: () => void;
};

const AppointmentList = ({
  appointments = [],
  selectedDate = new Date(),
  onAppointmentUpdate = () => {},
}: AppointmentListProps) => {
  const [expandedNotes, setExpandedNotes] = React.useState<string[]>([]);
  const [editedNotes, setEditedNotes] = React.useState<Record<string, string>>(
    {},
  );

  // Initialize edited notes when appointments change or when a note section is expanded
  const initializeNotes = (appointmentId: string) => {
    const appointment = appointments.find((apt) => apt.id === appointmentId);
    if (appointment && !editedNotes[appointmentId]) {
      setEditedNotes((prev) => ({
        ...prev,
        [appointmentId]: appointment.notes || "",
      }));
    }
  };

  // Group appointments by date
  const groupedAppointments = appointments.reduce(
    (acc, appointment) => {
      const dateKey = format(appointment.date, "yyyy-MM-dd");
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(appointment);
      return acc;
    },
    {} as Record<string, Appointment[]>,
  );

  // Sort dates
  const sortedDates = Object.keys(groupedAppointments).sort();

  const toggleNotes = (id: string) => {
    if (!expandedNotes.includes(id)) {
      initializeNotes(id);
    }
    setExpandedNotes((prev) =>
      prev.includes(id)
        ? prev.filter((noteId) => noteId !== id)
        : [...prev, id],
    );
  };

  const handleNotesChange = (id: string, value: string) => {
    setEditedNotes((prev) => ({ ...prev, [id]: value }));
  };

  const saveNotes = async (id: string) => {
    try {
      await updateAppointment(id, { notes: editedNotes[id] });
      onAppointmentUpdate();
    } catch (error) {
      console.error("Error updating notes:", error);
    }
  };

  const togglePaymentStatus = async (id: string) => {
    const appointment = appointments.find((apt) => apt.id === id);
    if (!appointment) return;

    try {
      await updateAppointment(id, { is_paid: !appointment.isPaid });
      onAppointmentUpdate();
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  return (
    <div className="bg-white w-full p-3 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-3">Wizyty</h2>
      <ScrollArea className="h-[calc(100%-2rem)]">
        <div className="space-y-6">
          {sortedDates.map((dateKey) => (
            <div key={dateKey} className="space-y-4">
              <h3 className="text-lg font-medium text-gray-600 sticky top-0 bg-white py-2">
                {format(new Date(dateKey), "EEEE, d MMMM yyyy", { locale: pl })}
              </h3>
              {groupedAppointments[dateKey].map((appointment) => {
                const isSelectedDay = isSameDay(appointment.date, selectedDate);

                return (
                  <Card
                    key={appointment.id}
                    className={cn(
                      "p-4 hover:shadow-lg transition-all",
                      appointment.isPaid
                        ? "bg-green-50 hover:bg-green-100"
                        : "bg-red-50 hover:bg-red-100",
                      !isSelectedDay && "opacity-30",
                    )}
                  >
                    <div className="flex items-start gap-6">
                      {/* Time Column */}
                      <div className="text-2xl font-bold text-gray-700 w-20">
                        {appointment.time.slice(0, 5)}
                      </div>

                      {/* Main Content */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{
                                backgroundColor: appointment.serviceColor,
                              }}
                            />
                            <div>
                              <div className="flex items-center space-x-2">
                                <User className="w-4 h-4 text-gray-500" />
                                <span className="font-medium">
                                  {appointment.clientName}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2 text-gray-600">
                                <Scissors className="w-4 h-4" />
                                <span>{appointment.serviceName}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <Badge
                              variant="secondary"
                              className="flex items-center space-x-1"
                            >
                              <Clock className="w-4 h-4" />
                              <span>{appointment.duration} min</span>
                            </Badge>
                            <Button
                              variant={
                                appointment.isPaid ? "outline" : "destructive"
                              }
                              size="sm"
                              onClick={() =>
                                togglePaymentStatus(appointment.id)
                              }
                              className="flex items-center gap-2"
                            >
                              {appointment.isPaid ? (
                                <>
                                  <CheckCircle2 className="w-4 h-4" />
                                  Opłacone
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-4 h-4" />
                                  Nieopłacone
                                </>
                              )}
                            </Button>
                            <button
                              onClick={() => toggleNotes(appointment.id)}
                              className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
                            >
                              Notatki
                              {expandedNotes.includes(appointment.id) ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Notes Section */}
                        {expandedNotes.includes(appointment.id) && (
                          <div className="mt-4 space-y-2">
                            <Textarea
                              placeholder="Dodaj notatki do wizyty..."
                              value={editedNotes[appointment.id] || ""}
                              onChange={(e) =>
                                handleNotesChange(
                                  appointment.id,
                                  e.target.value,
                                )
                              }
                              className="min-h-[100px]"
                            />
                            <div className="flex justify-end">
                              <Button
                                size="sm"
                                onClick={() => saveNotes(appointment.id)}
                              >
                                Zapisz notatki
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default AppointmentList;
