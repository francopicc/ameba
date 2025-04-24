import DashboardClientWrapper from "@/components/StatsWrapper";
import { getClients } from "@/lib/db/clients";

export default async function DashboardHome() {
  const clients = await getClients()
  return (
    <DashboardClientWrapper clients={clients}/>
  )
}
