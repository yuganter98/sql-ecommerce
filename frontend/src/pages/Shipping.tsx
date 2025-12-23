const Shipping = () => {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-bold text-gray-900 mb-8 font-heading text-center">Shipping & Returns</h1>

            <div className="space-y-12">
                <section>
                    <h2 className="text-2xl font-bold mb-4">Shipping Policy</h2>
                    <div className="prose prose-gray max-w-none text-gray-600">
                        <p className="mb-4">
                            We strive to deliver your order as quickly and efficiently as possible. All orders are processed within 1-2 business days.
                        </p>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Domestic Shipping</h3>
                        <ul className="list-disc pl-5 space-y-2 mb-4">
                            <li><strong>Standard Shipping:</strong> 3-5 business days - Free for orders over $100.</li>
                            <li><strong>Express Shipping:</strong> 1-2 business days - $15.00 flat rate.</li>
                        </ul>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">International Shipping</h3>
                        <p>
                            We ship internationally to most countries. Shipping times and costs vary depending on the destination and are calculated at checkout. Please note that customers are responsible for any customs duties or taxes.
                        </p>
                    </div>
                </section>

                <div className="border-t border-gray-200"></div>

                <section>
                    <h2 className="text-2xl font-bold mb-4">Return Policy</h2>
                    <div className="prose prose-gray max-w-none text-gray-600">
                        <p className="mb-4">
                            We want you to love your purchase. If you are not completely satisfied, you may return eligible items within 30 days of delivery.
                        </p>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Eligibility</h3>
                        <ul className="list-disc pl-5 space-y-2 mb-4">
                            <li>Items must be unused, unwashed, and in their original condition with tags attached.</li>
                            <li>Final sale items and gift cards are not eligible for return.</li>
                        </ul>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">How to Return</h3>
                        <ol className="list-decimal pl-5 space-y-2">
                            <li>Visit our Returns Portal and enter your order number and email.</li>
                            <li>Select the items you wish to return and the reason.</li>
                            <li>Print the prepaid shipping label and attach it to your package.</li>
                            <li>Drop off the package at the nearest carrier location.</li>
                        </ol>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Shipping;
