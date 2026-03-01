import { useEffect, useState } from 'react';
import { getProducts } from '../services/api';

function Products({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState({});

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  function handleAdd(product) {
    addToCart(product);
    setAdded(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAdded(prev => ({ ...prev, [product.id]: false }));
    }, 1200);
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <span>Carregando coleção...</span>
      </div>
    );
  }

  return (
    <section className="products-section">
      <div className="section-header">
        <p className="section-eyebrow">Nossa Coleção</p>
        <h2 className="section-title">Produtos Selecionados</h2>
        <div className="section-divider">
          <span>◆</span>
        </div>
      </div>

      <div className="products-grid">
        {products.map((product, i) => (
          <div
            key={product.id}
            className="product-card"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="product-image-wrap">
              <img src={product.imagem} alt={product.nome} className="product-image" />
              <div className="product-overlay">
                <button
                  className={`quick-add-btn ${added[product.id] ? 'added' : ''}`}
                  onClick={() => handleAdd(product)}
                >
                  {added[product.id] ? '✓ Adicionado' : 'Adicionar'}
                </button>
              </div>
            </div>

            <div className="product-info">
              <h3 className="product-name">{product.nome}</h3>
              <p className="product-description">{product.descricao}</p>
              <div className="product-footer">
                <span className="product-price">R$ {Number(product.preco).toFixed(2)}</span>
                <button
                  className={`add-btn ${added[product.id] ? 'added' : ''}`}
                  onClick={() => handleAdd(product)}
                >
                  {added[product.id] ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Products;