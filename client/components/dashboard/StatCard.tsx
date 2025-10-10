interface StatCardProps {
  title: string;
  value: number;
  color: 'blue' | 'green' | 'red';
}

const colorMap = {
  blue: 'bg-blue-600',
  green: 'bg-green-600',
  red: 'bg-red-600',
};

export default function StatCard({ title, value, color }: StatCardProps) {
  return (
    <div className={`text-white p-4 rounded-lg shadow-md ${colorMap[color]}`}>
      <h3 className="text-sm uppercase">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value.toLocaleString()}</p>
    </div>
  );
}