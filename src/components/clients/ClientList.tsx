import React from "react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search, Edit2, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

type Client = {
  id: string;
  name: string;
  surname: string;
  phone: string;
};

interface ClientListProps {
  clients?: Client[];
  onEdit?: (client: Client) => void;
  onDelete?: (clientId: string) => void;
}

const defaultClients: Client[] = [
  {
    id: "1",
    name: "Anna",
    surname: "Kowalska",
    phone: "+48 123 456 789",
  },
  {
    id: "2",
    name: "Jan",
    surname: "Nowak",
    phone: "+48 987 654 321",
  },
  {
    id: "3",
    name: "Maria",
    surname: "Wiśniewska",
    phone: "+48 456 789 123",
  },
];

const ClientList = ({
  clients = defaultClients,
  onEdit = () => {},
  onDelete = () => {},
}: ClientListProps) => {
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredClients = clients.filter((client) =>
    `${client.name} ${client.surname} ${client.phone}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  return (
    <Card className="w-full p-4 bg-white shadow-sm">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <Input
            className="pl-10"
            placeholder="Szukaj klientów..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Imię</TableHead>
              <TableHead>Nazwisko</TableHead>
              <TableHead>Telefon</TableHead>
              <TableHead className="w-[100px]">Akcje</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>{client.name}</TableCell>
                <TableCell>{client.surname}</TableCell>
                <TableCell>{client.phone}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(client)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(client.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default ClientList;
