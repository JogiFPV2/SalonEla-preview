import React from "react";
import { Card } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import { Database } from "@/types/database.types";

type Client = Database["public"]["Tables"]["clients"]["Row"];
type Service = Database["public"]["Tables"]["services"]["Row"];
type Appointment = Database["public"]["Tables"]["appointments"]["Row"] & {
  services: Service;
  clients: Client;
};

type DebtorsListProps = {
  appointments?: Appointment[];
  onPaymentUpdate?: (appointmentId: string, isPaid: boolean) => void;
};

// Price calculation constants
const PRICE_PER_MINUTE = 3; // 3 PLN per minute
const MIN_SERVICE_PRICE = 50; // Minimum price for any service

const calculateServicePrice = (duration: number): number => {
  const basePrice = duration * PRICE_PER_MINUTE;
  return Math.max(basePrice, MIN_SERVICE_PRICE);
};

const formatPrice = (price: number): string => {
  return `${price.toFixed(0)} PLN`;
};

const DebtorsList = ({
  appointments = [],
  onPaymentUpdate = () => {},
}: DebtorsListProps) => {
  // Filter unpaid appointments
  const unpaidAppointments = appointments.filter(
    (appointment) => !appointment.is_paid,
  );

  // Group appointments by client
  const debtsByClient = unpaidAppointments.reduce(
    (acc, appointment) => {
      const clientId = appointment.clients.id;
      if (!acc[clientId]) {
        acc[clientId] = {
          client: appointment.clients,
          appointments: [],
          totalDebt: 0,
        };
      }
      acc[clientId].appointments.push(appointment);
      const servicePrice = calculateServicePrice(appointment.services.duration);
      acc[clientId].totalDebt += servicePrice;
      return acc;
    },
    {} as Record<
      string,
      { client: Client; appointments: Appointment[]; totalDebt: number }
    >,
  );

  return (
    <Card className="w-full p-4 bg-white shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Lista Dłużników</h2>
      <ScrollArea className="h-[400px]">
        <div className="space-y-6">
          {Object.entries(debtsByClient).map(([clientId, data]) => (
            <div key={clientId} className="border-b pb-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium">
                    {data.client.first_name} {data.client.last_name}
                  </h3>
                  <p className="text-sm text-gray-500">{data.client.phone}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-red-600">
                    Należność: {formatPrice(data.totalDebt)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Liczba wizyt: {data.appointments.length}
                  </p>
                </div>
              </div>

              <div className="space-y-2 mt-2">
                {data.appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
                  >
                    <div>
                      <p className="font-medium">{appointment.services.name}</p>
                      <p className="text-sm text-gray-500">
                        {appointment.date} {appointment.time}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-medium">
                        {formatPrice(
                          calculateServicePrice(appointment.services.duration),
                        )}
                      </p>
                      <Button
                        variant={
                          appointment.is_paid ? "outline" : "destructive"
                        }
                        size="sm"
                        onClick={() =>
                          onPaymentUpdate(appointment.id, !appointment.is_paid)
                        }
                        className="flex items-center gap-2"
                      >
                        {appointment.is_paid ? (
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
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default DebtorsList;
