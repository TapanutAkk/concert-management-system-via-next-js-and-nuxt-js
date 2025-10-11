import { User, Award, CircleX } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  color: 'blue' | 'green' | 'red';
  logo: 'seats' | 'reserve' | 'cancel';
}

const colorMap = {
  blue: 'bg-blue-600',
  green: 'bg-green-600',
  red: 'bg-red-600',
};

const logoMap = {
  seats: User,
  reserve: Award,
  cancel: CircleX,
};

export default function StatCard({ title, value, color, logo }: StatCardProps) {
  const IconComponent = logoMap[logo];

  return (
    <div className={`text-white text-center p-4 rounded-lg shadow-md flex flex-col items-center justify-center ${colorMap[color]}`}>
      <IconComponent className="h-6 w-6 mb-2" />
      <h3 className="text-sm">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value.toLocaleString()}</p>
    </div>
  );
}