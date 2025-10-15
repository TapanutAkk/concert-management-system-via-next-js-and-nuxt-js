'use client';

const NEST_JS_API_URL = 'http://localhost:3001';

export default function AdminHistoryPage() {
    return (
        <div className="w-auto">
            <table className="border-collapse border border-gray-400 table-auto">
                <thead>
                    <tr>
                        <th className="border border-gray-300">Date time</th>
                        <th className="border border-gray-300">Username</th>
                        <th className="border border-gray-300">Concert Name</th>
                        <th className="border border-gray-300">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border border-gray-300">12/09/2024 15:00:00</td>
                        <td className="border border-gray-300">Jack Smile</td>
                        <td className="border border-gray-300">Concert A</td>
                        <td className="border border-gray-300">Cancel</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-300">12/09/2024 10:39:20</td>
                        <td className="border border-gray-300">Jack Smile</td>
                        <td className="border border-gray-300">Concert A</td>
                        <td className="border border-gray-300">Reserve</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}