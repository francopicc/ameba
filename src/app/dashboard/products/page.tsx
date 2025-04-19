import Sidebar from "@/components/ui/Sidebar"
import { getClients } from "@/lib/db/clients"
import ProductList from "@/components/ProductList";

export default async function DashboardProduct () {
    const clients = await getClients();
    return (
        <main>
            <div className="ml-[20em] mt-10 max-w-4xl">
                <ProductList />
            </div>
        </main>
    )
}