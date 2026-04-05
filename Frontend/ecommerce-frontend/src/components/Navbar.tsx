import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const { cart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl transition-all duration-200 no-underline ${
      isActive ? 'text-indigo-400 bg-indigo-400/10' : 'text-slate-400 hover:text-white hover:bg-white/5'
    }`;

  return (
    <nav className="sticky top-0 z-[100] border-b border-white/5 bg-slate-900/90 backdrop-blur-xl" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">

        {/* Logo */}
        <Link to="/" className="group flex items-center gap-2.5 no-underline">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/20">
            <span className="text-sm font-black text-white">S</span>
          </div>
          <span className="text-xl font-black tracking-tight text-white" style={{ fontFamily: "'Fraunces', serif" }}>
            Shop<span className="text-indigo-400">Easy</span>
          </span>
        </Link>

        {/* Desktop Navigation (Shows on screens >= 640px) */}
        <div className="hidden sm:flex items-center gap-2">
          <NavLink to="/products" className={linkClass}>Products</NavLink>
          
          {user ? (
            <>
              {user.role === 'admin' && (
                <NavLink to="/admin" className={linkClass}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                  </svg>
                  <span>Admin</span>
                </NavLink>
              )}
              <NavLink to="/cart" className={linkClass}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                <span>Cart</span>
                {itemCount > 0 && (
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-indigo-500 px-1.5 text-[10px] font-black text-white">
                    {itemCount}
                  </span>
                )}
              </NavLink>

              <NavLink to="/profile" className={linkClass}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>Profile</span>
              </NavLink>
            </>
          ) : (
            <Link to="/auth" className="ml-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-2 text-sm font-bold text-white transition no-underline">
              Login
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button (Only visible on screens < 640px) */}
        <button 
          onClick={() => setMobileOpen(!mobileOpen)} 
          className="flex sm:hidden h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-300 border-none outline-none cursor-pointer"
        >
           <span className="text-xl">{mobileOpen ? '✕' : '☰'}</span>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-white/5 bg-slate-900/95 px-6 py-4 flex flex-col gap-2">
          <MobileLink to="/products" onClick={() => setMobileOpen(false)}>Products</MobileLink>
          {user ? (
            <>
              {user.role === 'admin' && (
                <MobileLink to="/admin" onClick={() => setMobileOpen(false)}>Admin Dashboard</MobileLink>
              )}
              <MobileLink to="/cart" onClick={() => setMobileOpen(false)}>
                Cart {itemCount > 0 && `(${itemCount})`}
              </MobileLink>
              <MobileLink to="/profile" onClick={() => setMobileOpen(false)}>Profile</MobileLink>
            </>
          ) : (
            <MobileLink to="/auth" onClick={() => setMobileOpen(false)} accent>Login / Register</MobileLink>
          )}
        </div>
      )}
    </nav>
  );
};

const MobileLink: React.FC<{ to: string; onClick: () => void; children: React.ReactNode; accent?: boolean }> = ({ to, onClick, children, accent }) => (
  <Link 
    to={to} 
    onClick={onClick}
    className={`py-3 px-4 rounded-xl text-sm font-bold no-underline transition ${accent ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
  >
    {children}
  </Link>
);

export default Navbar;
