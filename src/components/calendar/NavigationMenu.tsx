import { Calendar, Users, Scissors, History } from "lucide-react";
import { Link } from "react-router-dom";

const NavigationMenu = () => {
  const menuItems = [
    { icon: Calendar, label: "Terminarz", path: "/" },
    { icon: Users, label: "Klienci", path: "/clients" },
    { icon: Scissors, label: "Usługi", path: "/services" },
    { icon: History, label: "Historia", path: "/history" },
  ];

  return (
    <div className="w-full bg-white shadow-sm mb-6">
      <div className="max-w-7xl mx-auto">
        <nav className="flex space-x-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default NavigationMenu;
