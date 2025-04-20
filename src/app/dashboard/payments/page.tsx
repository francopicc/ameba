import { getClients } from "@/lib/db/clients"
import ClientSelector from "@/components/ClientSelector"
import Sidebar from "@/components/ui/Sidebar"

export default async function DashboardPayments() {
  const clients = await getClients()

  return (
    <main className="p-4">
        <div className="ml-[20em] mt-10">
            <h1 className="text-2xl font-bold mb-4">Payments</h1>
            <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg">
                <thead className="bg-stone-100">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Payment Method</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-stone-200">
                <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-900">#12345</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-900">2023-10-20</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-900">John Doe</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-900">$100.00</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-900">Service payment</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <span className="p-1 px-3 text-xs bg-green-100 text-green-800 rounded-full">Completed</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-900">John Doe</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-900">Credit Card</td>
                </tr>
                <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-900">#12345</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-900">2023-10-20</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-900">John Doe</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-900">$100.00</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-900">Service payment</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <span className="p-1 px-3 text-xs bg-amber-100 text-amber-800 rounded-full">Processing</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-900">John Doe</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-900">Credit Card</td>
                </tr>
                </tbody>
            </table>
            </div>
        </div>
    </main>
  )
}
