import ProductList from "@/components/ProductList";

export default async function DashboardProduct () {
    return (
        <main>
            <div className="ml-[20em] mt-10 max-w-4xl">
                <ProductList />
            </div>
        </main>
    )
}