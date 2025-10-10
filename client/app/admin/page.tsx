import StatCard from '@/components/dashboard/StatCard';
import ConcertListItem from '@/components/dashboard/ConcertListItem';
// const NU_XT_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'; 

// async function getStats() {
//   const res = await fetch(`${NU_XT_API_URL}/api/admin/stats`, {
//     cache: 'no-store',
//   });
//   if (!res.ok) {
//     throw new Error('Failed to fetch stats');
//   }
//   return res.json();
// }

// async function getConcerts() {
//   const res = await fetch(`${NU_XT_API_URL}/api/concerts`);
//   return res.json();
// }

const mockStats = {
  totalSeats: 1000,
  reserved: 350,
  cancelled: 25,
};

const mockConcerts = [
  { id: 1, name: 'Concert A', date: '2025-11-01', totalSeats: 250 },
  { id: 2, name: 'Concert B', date: '2025-12-15', totalSeats: 200 },
];

export default async function AdminHomePage() {
//   const [stats, concerts] = await Promise.all([getStats(), getConcerts()]);
    const stats = mockStats;
    const concerts = mockConcerts;
  
    return (
        <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard title="Total of seats" value={stats.totalSeats} color="blue" />
            <StatCard title="Reserve" value={stats.reserved} color="green" />
            <StatCard title="Cancel" value={stats.cancelled} color="red" />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
            {concerts.map((concert: any) => (
            <ConcertListItem key={concert.id} concert={concert} />
            ))}
        </div>
        </div>
    );
}