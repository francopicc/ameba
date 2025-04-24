"use server"
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { getProductInformation } from "./product";

export async function getPayments({ owner_id }: { owner_id: string }) {
    // Validación mejorada
    if (!owner_id || typeof owner_id !== 'string' || owner_id.trim() === '') {
        throw new Error('Valid Owner ID is required');
    }

    const cookieStore = await cookies();

    try {
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            );
                        } catch {
                            // The `setAll` method was called from a Server Component.
                            // This can be ignored if you have middleware refreshing
                            // user sessions.
                        }
                    },
                },
            }
        );


        // Realiza la consulta
        const { data, error } = await supabase
            .from('payments')
            .select('*')
            .eq('client_id', owner_id)
            .order('created_at', { ascending: false });

        // Manejo explícito de errores
        if (error) {
            console.error('Supabase query error:', error);
            throw new Error(`Failed to fetch payments: ${error.message}`);
        }


        // Si no hay error pero tampoco hay datos, retornamos array vacío
        if (!data || data.length === 0) {
            return { success: true, data: [] };
        }

        // Procesar los pagos con la información del producto
        const formattedData = await Promise.all(data.map(async (payment) => {
            // Obtener información del producto solo si existe product_id
            let productName = '-';
            
            if (payment.product_id) {
                try {
                    const productInfo = await getProductInformation({ id: payment.product_id });
                    productName = productInfo?.name || '-';
                } catch (err) {
                    console.error(`Error fetching product info for ID ${payment.product_id}:`, err);
                }
            }

            return {
                id: payment.id,
                order_id: payment.order_id || payment.id,
                date: payment.created_at ? new Date(payment.created_at).toLocaleDateString() : '-',
                client: payment.client_name || '-',
                amount: payment.amount || 0,
                description: payment.description || '-',
                status: payment.status || 'Pending',
                name: productName, // Usamos el nombre del producto desde la función getProductInformation
                payment_method: payment.payment_method || '-',
                email: payment.email || '-',
                product_id: payment.product_id || null
            };
        }));

        return { success: true, data: formattedData };
    } catch (error: any) {
        console.error('Error in getPayments:', error);
        throw new Error(`Payment fetch failed: ${error.message}`);
    }
}

export async function getTotalPaymentStats({ owner_id }: { owner_id: string }) {
    try {
        const result = await getPayments({ owner_id });

        if (!result.success) {
            throw new Error("Failed to fetch payments.");
        }

        const payments = result.data;

        const totalSales = payments.length;
        const totalRevenue = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
        console.log(totalSales)
        return {
            success: true,
            stats: {
                totalSales,
                totalRevenue
            }
        };
    } catch (error: any) {
        console.error('Error in getTotalPaymentStats:', error);
        return {
            success: false,
            message: error.message || 'An error occurred while calculating payment stats.'
        };
    }
}
