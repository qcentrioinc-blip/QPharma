import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const {
    items,
    wishlistItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    removeFromWishlist,
    addToCart,
    cartView,
    setCartView,
  } = useCart();

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[120] bg-black/35"
            onClick={onClose}
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 32 }}
            className="fixed right-0 top-0 z-[121] flex h-full w-full max-w-full flex-col bg-white shadow-2xl sm:max-w-[430px]"
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4 sm:px-6">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-500">
                  {cartView === 'wishlist' ? 'Wishlist' : 'Bulk order request'}
                </p>
                <h2 className="text-lg font-semibold text-black">
                  {cartView === 'wishlist'
                    ? `${wishlistItems.length} ${wishlistItems.length === 1 ? 'saved item' : 'saved items'}`
                    : `${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
                </h2>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-black"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex border-b border-gray-200 px-4 sm:px-6">
              <button
                type="button"
                onClick={() => setCartView('cart')}
                className={`flex-1 px-3 py-3 text-sm font-semibold transition-colors ${cartView === 'cart' ? 'border-b-2 border-[#5E8D49] text-[#5E8D49]' : 'text-gray-500 hover:text-black'}`}
              >
                Cart ({items.reduce((sum, item) => sum + item.quantity, 0)})
              </button>
              <button
                type="button"
                onClick={() => setCartView('wishlist')}
                className={`flex-1 px-3 py-3 text-sm font-semibold transition-colors ${cartView === 'wishlist' ? 'border-b-2 border-[#5E8D49] text-[#5E8D49]' : 'text-gray-500 hover:text-black'}`}
              >
                Wishlist ({wishlistItems.length})
              </button>
            </div>

            {cartView === 'cart' ? (
              items.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                  <div className="mb-4 rounded-full bg-gray-100 p-4">
                    <ShoppingBag className="h-7 w-7 text-gray-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-black">Your quote list is empty</h3>
                  <p className="mt-2 max-w-xs text-sm leading-6 text-gray-500">
                    Request bulk quantities from Organic, Herbal, or Nutraceutical to build your wholesale order list.
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-6 rounded-full bg-[#5E8D49] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#4f793d]"
                  >
                    Continue shopping
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
                    <ul className="space-y-4">
                      {items.map((item) => (
                        <li key={`${item.category}-${item.id}`} className="rounded-2xl border border-gray-200 p-3">
                          <div className="flex gap-3">
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
                              <img src={item.image || '/Global/Logo.png'} alt={item.title} className="h-full w-full object-cover" />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="text-sm font-semibold text-black">{item.title}</p>
                                  <p className="text-xs text-gray-500">{item.category}</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeFromCart(item.id, item.category)}
                                  className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-red-600"
                                  aria-label={`Remove ${item.title}`}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>

                              <div className="mt-3 flex items-center justify-between gap-3">
                                <div className="flex items-center overflow-hidden rounded-full border border-gray-200">
                                  <button type="button" onClick={() => updateQuantity(item.id, item.category, item.quantity - 1)} className="flex h-8 w-8 items-center justify-center text-gray-700 transition-colors hover:bg-gray-100" aria-label={`Decrease quantity for ${item.title}`}>
                                    <Minus className="h-4 w-4" />
                                  </button>
                                  <span className="min-w-8 text-center text-sm font-semibold text-black">{item.quantity}</span>
                                  <button type="button" onClick={() => updateQuantity(item.id, item.category, item.quantity + 1)} className="flex h-8 w-8 items-center justify-center text-gray-700 transition-colors hover:bg-gray-100" aria-label={`Increase quantity for ${item.title}`}>
                                    <Plus className="h-4 w-4" />
                                  </button>
                                </div>

                                <div className="rounded-full bg-[#f8fbf3] px-3 py-1 text-xs font-semibold text-[#2f5f1d]">Quote on request</div>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t border-gray-200 bg-white p-4 sm:p-6">
                    <div className="mb-4 rounded-2xl border border-[#eef2e7] bg-[#f8fbf3] p-3 text-sm text-[#4b4b4b]">
                      <p className="font-semibold text-[#2f5f1d]">Pricing is shared on request</p>
                      <p className="mt-1 text-xs text-[#6b6b6b]">We will prepare a quote for your pharmacy after reviewing your order volume.</p>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row">
                      <button type="button" onClick={clearCart} className="flex-1 rounded-full border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100">Clear cart</button>
                      <button type="button" onClick={onClose} className="flex-1 rounded-full bg-[#5E8D49] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#4f793d]">Continue browsing</button>
                    </div>
                  </div>
                </>
              )
            ) : wishlistItems.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                <div className="mb-4 rounded-full bg-gray-100 p-4">
                  <Heart className="h-7 w-7 text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-black">Your wishlist is empty</h3>
                <p className="mt-2 max-w-xs text-sm leading-6 text-gray-500">Tap the heart on any product to save it here for later.</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
                <ul className="space-y-4">
                  {wishlistItems.map((item) => (
                    <li key={`wish-${item.category}-${item.id}`} className="rounded-2xl border border-gray-200 p-3">
                      <div className="flex gap-3">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
                          <img src={item.image || '/Global/Logo.png'} alt={item.title} className="h-full w-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-black">{item.title}</p>
                          <p className="text-xs text-gray-500">{item.category}</p>
                          <div className="mt-3 flex items-center justify-between gap-3">
                            <button type="button" onClick={() => { addToCart(item); setCartView('cart'); }} className="rounded-full bg-[#5E8D49] px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#4f793d]">Add to request list</button>
                            <button type="button" onClick={() => removeFromWishlist(item.id, item.category)} className="text-sm font-medium text-gray-500 transition-colors hover:text-red-600">Remove</button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
