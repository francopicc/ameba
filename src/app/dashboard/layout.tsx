import ClientSideDashboard from '@/components/ClIentWrapper';
import { getClients } from '@/lib/db/clients';
import { ReactNode } from 'react';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const clients = await getClients();

  return <ClientSideDashboard clients={clients}>{children}</ClientSideDashboard>;
}