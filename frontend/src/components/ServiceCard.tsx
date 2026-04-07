import { ArrowRight } from 'lucide-react';

interface ServiceCardProps {
  name: string;
  services?: string[];
}

export default function ServiceCard({ name, services }: ServiceCardProps) {
  return (
    <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow mb-4">
      <h4 className="font-medium text-blue-800">{name}</h4>
      {services && (
        <ul className="mt-2 space-y-1">
          {services.map((service, i) => (
            <li key={i} className="text-gray-600 flex items-center">
              <ArrowRight className="w-4 h-4 mr-1" /> {service}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}