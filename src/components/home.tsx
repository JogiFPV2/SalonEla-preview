import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ServiceManagement from "./services/ServiceManagement";
import ClientManagement from "./clients/ClientManagement";
import CalendarView from "./calendar/CalendarView";
import HistoryView from "./history/HistoryView";

interface HomeProps {
  activeTab?: string;
  onTabChange?: (value: string) => void;
}

const Home = ({
  activeTab = "calendar",
  onTabChange = () => {},
}: HomeProps) => {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-[1512px] mx-auto">
        <Tabs
          defaultValue={activeTab}
          onValueChange={onTabChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="calendar">Kalendarz</TabsTrigger>
            <TabsTrigger value="services">Usługi</TabsTrigger>
            <TabsTrigger value="clients">Klienci</TabsTrigger>
            <TabsTrigger value="history">Historia</TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="mt-0">
            <ServiceManagement />
          </TabsContent>

          <TabsContent value="clients" className="mt-0">
            <ClientManagement />
          </TabsContent>

          <TabsContent value="calendar" className="mt-0">
            <CalendarView />
          </TabsContent>

          <TabsContent value="history" className="mt-0">
            <HistoryView />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Home;
