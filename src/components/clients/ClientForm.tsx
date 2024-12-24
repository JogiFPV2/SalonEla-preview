import React from "react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { User, Phone } from "lucide-react";

interface ClientFormProps {
  onSubmit?: (client: {
    firstName: string;
    lastName: string;
    phone: string;
  }) => void;
  initialValues?: {
    firstName: string;
    lastName: string;
    phone: string;
  };
  isEditing?: boolean;
}

const ClientForm = ({
  onSubmit = () => {},
  initialValues = {
    firstName: "",
    lastName: "",
    phone: "",
  },
  isEditing = false,
}: ClientFormProps) => {
  const [formData, setFormData] = React.useState(initialValues);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="w-[400px] p-4 bg-white shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Imię
          </Label>
          <Input
            id="firstName"
            placeholder="Jan"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Nazwisko
          </Label>
          <Input
            id="lastName"
            placeholder="Kowalski"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Numer Telefonu
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+48 123 456 789"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="w-full"
          />
        </div>

        <Button type="submit" className="w-full">
          {isEditing ? "Aktualizuj Klienta" : "Dodaj Klienta"}
        </Button>
      </form>
    </Card>
  );
};

export default ClientForm;
