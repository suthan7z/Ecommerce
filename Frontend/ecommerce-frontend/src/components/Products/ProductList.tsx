import React, { useEffect, useState } from 'react';
import { Product } from '../../types';
import { getProducts } from '../../services/productService';
import ProductCard from './ProductCard';

interface ProductListProps {
    onAddToCart: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({ onAddToCart }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await getProducts();
                setProducts(data);
            } catch (err) {
                setError('Failed to fetch products');
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading products...</div>;
    }

    if (error) {
        return <div className="text-center text-red-600 p-4">{error}</div>;
    }

    if (products.length === 0) {
        return <div className="text-center text-slate-600 p-4">No products available</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900">Our Products</h2>
                <p className="text-slate-600">{products.length} products</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map(product => (
                    <ProductCard key={product._id || product.id} product={product} onAddToCart={onAddToCart} />
                ))}
            </div>
        </div>
    );
};

export default ProductList;