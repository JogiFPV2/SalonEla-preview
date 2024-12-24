import React from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format, isSameDay, parse } from "date-fns";
import { pl } from "date-fns/locale";

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

type AppointmentTimelineProps = {
  appointments?: Appointment[];
  selectedDate?: Date;
};

const defaultAppointments: Appointment[] = [
  {
    id: "1",
    clientName: "Anna Kowalska",
    serviceName: "Strzyżenie i Stylizacja",
    serviceColor: "#FFB5E8",
    duration: "60",
    time: "9:00",
    date: new Date(2024, 0, 15),
    notes: "",
    isPaid: false,
  },
  {
    id: "2",
    clientName: "Michał Nowak",
    serviceName: "Koloryzacja",
    serviceColor: "#B5EAEA",
    duration: "120",
    time: "10:30",
    date: new Date(2024, 0, 15),
    notes: "Preferuje ciemniejsze odcienie",
    isPaid: true,
  },
  {
    id: "3",
    clientName: "Ewa Wiśniewska",
    serviceName: "Manicure",
    serviceColor: "#FFE4E1",
    duration: "45",
    time: "13:00",
    date: new Date(2024, 0, 16),
    notes: "",
    isPaid: false,
  },
];

const AppointmentTimeline = ({
  appointments = defaultAppointments,
  selectedDate = new Date(),
}: AppointmentTimelineProps) => {
  const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8AM to 7PM

  // Filter appointments for selected date
  const todayAppointments = appointments.filter((apt) =>
    isSameDay(apt.date, selectedDate),
  );

  const getTimeInMinutes = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const calculatePosition = (time: string, duration: string) => {
    const startMinutes = getTimeInMinutes(time);
    const startOfDay = 8 * 60; // 8:00 AM in minutes
    const totalMinutes = 12 * 60; // 12 hours in minutes

    const left = ((startMinutes - startOfDay) / totalMinutes) * 100;
    const width = (Number(duration) / totalMinutes) * 100;

    return { left, width };
  };

  const getEndTime = (startTime: string, durationMinutes: string) => {
    const startMinutes = getTimeInMinutes(startTime);
    const endMinutes = startMinutes + Number(durationMinutes);
    const hours = Math.floor(endMinutes / 60);
    const minutes = endMinutes % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <Card className="w-full bg-white p-3 overflow-hidden shadow-sm">
      <ScrollArea className="h-[150px]">
        <div className="relative min-w-[800px]">
          {/* Time indicators */}
          <div className="flex border-b border-gray-200 pb-2">
            {hours.map((hour) => (
              <div
                key={hour}
                className="flex-1 text-sm text-gray-500 text-center"
              >
                {hour}:00
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div className="relative h-24 mt-2">
            {/* Hour lines */}
            <div className="absolute inset-0 flex">
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="flex-1 border-l border-gray-100 h-full"
                />
              ))}
            </div>

            {/* Appointments */}
            {todayAppointments.map((appointment) => {
              const { left, width } = calculatePosition(
                appointment.time,
                appointment.duration,
              );
              const endTime = getEndTime(
                appointment.time,
                appointment.duration,
              );

              return (
                <TooltipProvider key={appointment.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className="absolute h-12 rounded-md cursor-pointer transition-all hover:brightness-95"
                        style={{
                          left: `${left}%`,
                          width: `${width}%`,
                          backgroundColor: appointment.serviceColor,
                          top: "0.5rem",
                        }}
                      >
                        <div className="p-2 h-full flex flex-col justify-center overflow-hidden">
                          <div className="font-medium text-xs truncate">
                            {appointment.clientName}
                          </div>
                          <div className="text-xs truncate">
                            {appointment.serviceName}
                          </div>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="p-2 space-y-1">
                        <p className="font-semibold">
                          {appointment.clientName}
                        </p>
                        <p>{appointment.serviceName}</p>
                        <p className="text-sm text-gray-500">
                          {appointment.time.slice(0, 5)} - {endTime.slice(0, 5)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {appointment.duration} min
                        </p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        </div>
      </ScrollArea>
    </Card>
  );
};

export default AppointmentTimeline;
