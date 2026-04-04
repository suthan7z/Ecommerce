import React from 'react';
import CartView from '../components/Cart/CartView';

// Bug fix #11: removed duplicate empty-cart check
// CartView already handles the empty state — no need to check here too
const CartPage: React.FC = () => {
  return (
    <div className="mx-auto mt-8 max-w-6xl px-4 sm:px-6 lg:px-8">
      <CartView />
    </div>
  );
};

export default CartPage;
