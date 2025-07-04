import { getCurrentSession } from "@/actions/auth";
import SalesCampaignBanner from "@/components/layout/SalesCampaignBanner";
import ProductGrid from "@/components/product/ProductGrid";
import { getAllProducts } from "@/sanity/lib/client";

export default async function Home() {
    const { user } = await getCurrentSession();

    const products = await getAllProducts();

    return (
        <div>
            <SalesCampaignBanner />

            <section className="container mx-auto py-8">
                <ProductGrid products={products} />
            </section>
        </div>
    );
}
