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

const COLORS = [
  // Vibrant Colors
  "#FF0000", // Red
  "#00FF00", // Lime
  "#0000FF", // Blue
  "#FF00FF", // Magenta
  "#00FFFF", // Cyan
  "#FF8000", // Orange
  "#8000FF", // Purple
  "#FF0080", // Pink

  // Pastel Colors
  "#FFB3BA", // Pastel Red
  "#BAFFC9", // Pastel Green
  "#BAE1FF", // Pastel Blue
  "#FFB3F7", // Pastel Pink
  "#E0BBE4", // Pastel Purple
  "#957DAD", // Dusty Purple
  "#FEC8D8", // Light Pink
  "#FFDFD3", // Peach

  // Deep Colors
  "#800000", // Maroon
  "#008000", // Dark Green
  "#000080", // Navy
  "#800080", // Deep Purple
  "#008080", // Teal
  "#804000", // Brown
  "#400080", // Indigo
  "#804040", // Burgundy
];

const ServiceForm = ({
  onSubmit = () => {},
  initialValues = {
    name: "",
    duration: 30,
    color: COLORS[0],
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
          <div className="grid grid-cols-8 gap-2">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${color === c ? "border-black shadow-lg scale-110" : "border-transparent"}`}
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
