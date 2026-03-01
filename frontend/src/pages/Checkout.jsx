import { useState } from 'react';
import { createOrder } from '../services/api';

const PAYMENT_OPTIONS = [
  {
    value: 'Pix',
    label: 'Pix',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    ),
    desc: 'Aprovação imediata'
  },
  {
    value: 'Cartão',
    label: 'Cartão',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    ),
    desc: 'Crédito ou débito'
  },
  {
    value: 'Boleto',
    label: 'Boleto',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/>
      </svg>
    ),
    desc: 'Prazo de 3 dias úteis'
  }
];

function Checkout({ cart, totalPrice, onSuccess }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [endereco, setEndereco] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('Pix');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!nome.trim()) e.nome = 'Nome é obrigatório';
    if (!email.trim() || !email.includes('@')) e.email = 'E-mail inválido';
    if (!endereco.trim()) e.endereco = 'Endereço é obrigatório';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      const response = await createOrder({
        nome, email, endereco, formaPagamento,
        produtos: cart.map(item => ({ id: item.id, quantidade: item.quantidade }))
      });
      onSuccess(response.numeroPedido);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="checkout-section">
      <div className="checkout-grid">
  
        <div className="checkout-form-wrap">
          <div className="checkout-header">
            <p className="section-eyebrow">Última etapa</p>
            <h2 className="section-title">Finalizar Pedido</h2>
            <div className="section-divider"><span>◆</span></div>
          </div>

          <form onSubmit={handleSubmit} className="checkout-form" noValidate>
            <div className="form-group">
              <label className="form-label">Nome completo</label>
              <input
                className={`form-input ${errors.nome ? 'error' : ''}`}
                placeholder="Seu nome"
                value={nome}
                onChange={e => { setNome(e.target.value); setErrors(p => ({...p, nome: ''})); }}
              />
              {errors.nome && <span className="form-error">{errors.nome}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">E-mail</label>
              <input
                className={`form-input ${errors.email ? 'error' : ''}`}
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={e => { setEmail(e.target.value); setErrors(p => ({...p, email: ''})); }}
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Endereço de entrega</label>
              <input
                className={`form-input ${errors.endereco ? 'error' : ''}`}
                placeholder="Rua, número, bairro, cidade"
                value={endereco}
                onChange={e => { setEndereco(e.target.value); setErrors(p => ({...p, endereco: ''})); }}
              />
              {errors.endereco && <span className="form-error">{errors.endereco}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Forma de pagamento</label>
              <div className="payment-options">
                {PAYMENT_OPTIONS.map(opt => (
                  <label
                    key={opt.value}
                    className={`payment-option ${formaPagamento === opt.value ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="pagamento"
                      value={opt.value}
                      checked={formaPagamento === opt.value}
                      onChange={() => setFormaPagamento(opt.value)}
                      style={{ display: 'none' }}
                    />
                    <span className="payment-icon">{opt.icon}</span>
                    <div>
                      <span className="payment-label">{opt.label}</span>
                      <span className="payment-desc">{opt.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <span className="btn-loading">
                  <span className="loading-dot" /><span className="loading-dot" /><span className="loading-dot" />
                </span>
              ) : (
                <>
                  Confirmar Pedido
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>

        <div className="order-summary">
          <h3 className="summary-title">Resumo do Pedido</h3>
          <div className="summary-items">
            {cart.map(item => (
              <div key={item.id} className="summary-item">
                <div className="summary-item-left">
                  <img src={item.imagem} alt={item.nome} className="summary-item-img" />
                  <div>
                    <span className="summary-item-name">{item.nome}</span>
                    <span className="summary-item-qty">Qtd: {item.quantidade}</span>
                  </div>
                </div>
                <span className="summary-item-price">
                  R$ {(item.preco * item.quantidade).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="summary-divider" />
          <div className="summary-total">
            <span>Total</span>
            <span className="summary-total-price">R$ {totalPrice.toFixed(2)}</span>
          </div>
          <p className="summary-note">
            ✦ Frete grátis para todo o Brasil
          </p>
        </div>
      </div>
    </section>
  );
}

export default Checkout;