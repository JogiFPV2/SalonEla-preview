import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

type ServiceFormProps = {
  onSubmit?: (service: {
    name: string;
    duration: number;
    color: string;
  }) => void;
  initialValues?: {
    name: string;
    duration: number;
    color: string;
  };
  isEditing?: boolean;
};

const PASTEL_COLORS = [
  "#FFB3BA",
  "#BAFFC9",
  "#BAE1FF",
  "#FFFFBA",
  "#FFB3F7",
  "#E0BBE4",
  "#957DAD",
  "#D4A5A5",
  "#9E8FB2",
  "#A8E6CF",
  "#FFD3B6",
  "#FFC8A2",
];

const ServiceForm = ({
  onSubmit = () => {},
  initialValues = {
    name: "",
    duration: 30,
    color: PASTEL_COLORS[0],
  },
  isEditing = false,
}: ServiceFormProps) => {
  const [name, setName] = React.useState(initialValues.name);
  const [duration, setDuration] = React.useState(initialValues.duration);
  const [color, setColor] = React.useState(initialValues.color);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, duration, color });
  };

  return (
    <Card className="w-[400px] p-4 bg-white shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="service-name">Nazwa Usługi</Label>
          <Input
            id="service-name"
            placeholder="Wprowadź nazwę usługi"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="service-duration">Czas trwania (minuty)</Label>
          <div className="relative">
            <Input
              id="service-duration"
              type="number"
              min="5"
              step="5"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="pl-10"
            />
            <Clock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Kolor</Label>
          <div className="grid grid-cols-6 gap-2">
            {PASTEL_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                className={`w-8 h-8 rounded-full border-2 ${color === c ? "border-black" : "border-transparent"}`}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full">
          {isEditing ? "Aktualizuj Usługę" : "Dodaj Usługę"}
        </Button>
      </form>
    </Card>
  );
};

export default ServiceForm;
