import { useState } from 'react';
import Products from './pages/Products';
import Checkout from './pages/Checkout';
import './styles/global.css';

function App() {
  const [cart, setCart] = useState([]);
  const [step, setStep] = useState('products');
  const [orderNumber, setOrderNumber] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);

  function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantidade: item.quantidade + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantidade: 1 }]);
    }
  }

  function removeFromCart(id) {
    setCart(cart.filter(item => item.id !== id));
  }

  function goToCheckout() {
    if (cart.length === 0) return;
    setCartOpen(false);
    setStep('checkout');
  }

  function handleSuccess(orderId) {
    setOrderNumber(orderId);
    setCart([]);
    setStep('success');
  }

  const totalItems = cart.reduce((acc, item) => acc + item.quantidade, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-mark">◆</span>
            <span className="logo-text">LUMIÈRE</span>
          </div>

          <nav className="nav">
            <span
              className={`nav-item ${step === 'products' ? 'active' : ''}`}
              onClick={() => step !== 'success' && setStep('products')}
            >
              Coleção
            </span>
          </nav>

          <button
            className="cart-btn"
            onClick={() => setCartOpen(!cartOpen)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {totalItems > 0 && (
              <span className="cart-count">{totalItems}</span>
            )}
          </button>
        </div>
      </header>

      <div className={`cart-overlay ${cartOpen ? 'open' : ''}`} onClick={() => setCartOpen(false)} />
      <aside className={`cart-drawer ${cartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h3>Seu Carrinho</h3>
          <button className="close-btn" onClick={() => setCartOpen(false)}>✕</button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <span>Nenhum item adicionado</span>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.imagem} alt={item.nome} className="cart-item-img" />
                <div className="cart-item-info">
                  <span className="cart-item-name">{item.nome}</span>
                  <span className="cart-item-qty">Qtd: {item.quantidade}</span>
                  <span className="cart-item-price">
                    R$ {(item.preco * item.quantidade).toFixed(2)}
                  </span>
                </div>
                <button className="remove-btn" onClick={() => removeFromCart(item.id)}>✕</button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total</span>
              <span className="total-price">R$ {totalPrice.toFixed(2)}</span>
            </div>
            <button className="checkout-btn" onClick={goToCheckout}>
              Finalizar Compra
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        )}
      </aside>

      <main className="main">
        {step === 'products' && (
          <Products addToCart={addToCart} />
        )}

        {step === 'checkout' && (
          <Checkout cart={cart} totalPrice={totalPrice} onSuccess={handleSuccess} />
        )}

        {step === 'success' && (
          <div className="success-page">
            <div className="success-card">
              <div className="success-icon">✦</div>
              <h2>Pedido Confirmado</h2>
              <p className="success-subtitle">Obrigado pela sua compra</p>
              <div className="order-number-box">
                <span className="order-label">Número do Pedido</span>
                <span className="order-number">#{orderNumber}</span>
              </div>
              <p className="success-msg">
                Você receberá um e-mail com os detalhes do seu pedido em breve.
              </p>
              <button className="back-btn" onClick={() => setStep('products')}>
                Continuar Comprando
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;