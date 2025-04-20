import React, { useEffect, useState } from 'react';

const App = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const formID = "251074309767967";
  const apiKey = "1bd04b0cb7e62c17a93d891d67b80344";
  const endpoint = `https://api.jotform.com/form/${formID}/payment-info?apiKey=${apiKey}`;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(endpoint);
        const data = await response.json();
        
        if (data?.content?.products) {
          setProducts(
            data.content.products.map((p, i) => ({
              ...p,
              id: p.id || `product-${i}`,
            }))
          );
        }
        
      } catch (error) {
        console.error("Veri çekme hatası:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [endpoint]);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      return existing 
        ? prev.map(item => 
            item.id === product.id 
              ? { ...item, quantity: item.quantity + 1 } 
              : item
          )
        : [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const toggleExpand = (productId) => {
    setExpandedProduct(expandedProduct === productId ? null : productId);
  };

  const calculateTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // filtreleme işlemi
  const filteredProducts = products.filter(product => {
    const searchLower = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchLower) ||
      (product.description && product.description.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div style={{ 
      padding: "20px", 
      fontFamily: "Arial", 
      maxWidth: "1200px", 
      margin: "0 auto",
      minHeight: "100vh"
    }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Ürünler</h1>

      // search bar 
      <div style={{
        margin: "0 auto 30px auto",
        maxWidth: "500px",
        position: "relative"
      }}>
        <input
          type="text"
          placeholder="Ürün ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 20px",
            fontSize: "16px",
            border: "1px solid #ddd",
            borderRadius: "25px",
            outline: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            style={{
              position: "absolute",
              right: "15px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "18px",
              color: "#999"
            }}
          >
            ×
          </button>
        )}
      </div>

      {loading ? (
        <p style={{ textAlign: "center" }}>Yükleniyor...</p>
      ) : filteredProducts.length > 0 ? (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "25px",
          padding: "10px"
        }}>
          {filteredProducts.map((product) => {
            const imageUrl = product.images || product.images?.large || product.images?.medium;
            const finalImageUrl = imageUrl?.split('?')[0];
            const isExpanded = expandedProduct === product.id;

            return (
              <div
                key={product.id}
                onClick={() => toggleExpand(product.id)}
                style={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "12px",
                  padding: "20px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  backgroundColor: isExpanded ? "#f8f9fa" : "white",
                  boxShadow: isExpanded ? "0 10px 25px rgba(0,0,0,0.1)" : "0 2px 8px rgba(0,0,0,0.05)",
                  position: "relative",
                  zIndex: isExpanded ? 10 : 1,
                  transform: isExpanded ? "scale(1.03)" : "scale(1)"
                }}
              >
                {finalImageUrl ? (
                  <div style={{
                    height: isExpanded ? "300px" : "200px",
                    marginBottom: "15px",
                    overflow: "hidden",
                    borderRadius: "8px"
                  }}>
                    <img
                      src={finalImageUrl}
                      alt={product.name}
                      style={{ 
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "all 0.3s ease"
                      }}
                    />
                  </div>
                ) : (
                  <div style={{ 
                    height: "200px", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    backgroundColor: "#f5f5f5",
                    borderRadius: "8px",
                    marginBottom: "15px"
                  }}>
                    <p>Görsel mevcut değil</p>
                  </div>
                )}

                <h2 style={{ margin: "0 0 10px 0", fontSize: "1.2rem" }}>
                  {product.name}
                </h2>
                
                {isExpanded && (
                  <>
                    <p style={{ margin: "0 0 15px 0", color: "#555" }}>
                      {product.description || "Açıklama bulunmamaktadır."}
                    </p>
                    
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}>
                      <p style={{ fontSize: "1.3rem", fontWeight: "bold" }}>
                        Price: {product.price} {product.currency}
                      </p>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        style={{
                          padding: "10px 20px",
                          backgroundColor: "#4CAF50",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "1rem",
                          fontWeight: "600"
                        }}
                      >
                        Sepete Ekle
                      </button>
                    </div>
                  </>
                )}

                {!isExpanded && (
                  <p style={{ margin: "10px 0 0 0", fontWeight: "bold" }}>
                    Price: {product.price} {product.currency}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p style={{ textAlign: "center", color: "red" }}>
          {searchTerm ? "Aramanızla eşleşen ürün bulunamadı." : "Ürün bulunamadı."}
        </p>
      )}

      
      <div style={{ 
        marginTop: "50px", 
        padding: "25px",
        border: "1px solid #e0e0e0",
        borderRadius: "12px",
        backgroundColor: "#f8f9fa"
      }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Sepetiniz</h2>
        {cart.length > 0 ? (
          <div>
            {cart.map((item) => (
              <div 
                key={item.id} 
                style={{ 
                  display: "flex", 
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px",
                  borderBottom: "1px solid #e0e0e0"
                }}
              >
                <div>
                  <h3 style={{ margin: 0 }}>{item.name}</h3>
                  <p style={{ margin: "5px 0" }}>
                    {item.price} {item.currency} × {item.quantity} = {item.price * item.quantity} {item.currency}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  style={{
                    backgroundColor: "#f44336",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "8px 15px",
                    cursor: "pointer"
                  }}
                >
                  Kaldır
                </button>
              </div>
            ))}
            <h3 style={{ textAlign: "right", marginTop: "20px" }}>
              Toplam: {calculateTotalPrice()} {cart[0]?.currency || ''}
            </h3>
          </div>
        ) : (
          <p style={{ textAlign: "center" }}>Sepetiniz boş.</p>
        )}
      </div>
    </div>
  );
};

export default App;













