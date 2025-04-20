import React, { useEffect, useState } from 'react';

const App = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [expandedProduct, setExpandedProduct] = useState(null);

  const formID = "251074309767967";
  const apiKey = "1bd04b0cb7e62c17a93d891d67b80344";
  const endpoint = `https://api.jotform.com/form/${formID}/payment-info?apiKey=${apiKey}`;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(endpoint);
        const data = await response.json();
        
        if (data?.content?.products) {
          setProducts(data.content.products.map((p, i) => ({ 
            ...p, 
            id: p.id || `product-${i}` 
          })));
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

  return (
    <div style={{ 
      padding: "20px", 
      fontFamily: "Arial", 
      maxWidth: "1200px", 
      margin: "0 auto",
      minHeight: "100vh"
    }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>Jotform Ürünleri</h1>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>Yükleniyor...</p>
        </div>
      ) : products.length > 0 ? (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "25px",
          padding: "10px"
        }}>
          {products.map((product) => {
            const imageUrl = product.images || product.images?.large || product.images?.medium;
            const finalImageUrl = imageUrl?.split('?')[0];
            const isExpanded = expandedProduct === product.id;

            return (
              <div
                key={product.id}
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
                onClick={() => toggleExpand(product.id)}
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

                <h2 style={{ 
                  margin: "0 0 10px 0",
                  fontSize: "1.2rem",
                  color: "#333"
                }}>
                  {product.name} 
                  
                </h2>
                
                {isExpanded && (
                  <div style={{ marginTop: "15px" }}>
                    <p style={{ 
                      margin: "0 0 15px 0",
                      color: "#555",
                      lineHeight: "1.5"
                    }}>
                      {product.description || "Açıklama bulunmamaktadır."}
                    </p>
                    
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "20px"
                    }}>
                      <p style={{ 
                        fontSize: "1.3rem", 
                        fontWeight: "bold",
                        color: "#2c3e50"
                      }}>
                        {product.price} {product.currency}
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
                          fontWeight: "600",
                          transition: "background-color 0.2s",
                          ":hover": {
                            backgroundColor: "#3e8e41"
                          }
                        }}
                      >
                        Sepete Ekle
                      </button>
                    </div>
                  </div>
                )}

                {!isExpanded && (
                  <p style={{ 
                    margin: "10px 0 0 0",
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    color: "#2c3e50"
                  }}>
                    {product.price} {product.currency}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p style={{ color: "red", fontSize: "1.1rem" }}>Ürün bulunamadı.</p>
        </div>
      )}

      {/* Sepet Bölümü */}
      <div style={{ 
        marginTop: "50px", 
        padding: "25px",
        border: "1px solid #e0e0e0",
        borderRadius: "12px",
        backgroundColor: "#f8f9fa",
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
      }}>
        <h2 style={{ 
          textAlign: "center", 
          marginBottom: "25px",
          color: "#333"
        }}>
          Sepetiniz
        </h2>
        
        {cart.length > 0 ? (
          <div>
            {cart.map((item) => (
              <div 
                key={item.id} 
                style={{ 
                  display: "flex", 
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "15px",
                  borderBottom: "1px solid #e0e0e0",
                  ":last-child": {
                    borderBottom: "none"
                  }
                }}
              >
                <div style={{ flex: 1 }}>
                  <h3 style={{ 
                    margin: 0, 
                    fontSize: "1.1rem",
                    color: "#333"
                  }}>
                    {item.name}
                  </h3>
                  <p style={{ 
                    margin: "5px 0 0 0",
                    color: "#666"
                  }}>
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
                    cursor: "pointer",
                    fontWeight: "600",
                    transition: "background-color 0.2s",
                    ":hover": {
                      backgroundColor: "#d32f2f"
                    }
                  }}
                >
                  Kaldır
                </button>
              </div>
            ))}
            
            <div style={{ 
              marginTop: "25px",
              paddingTop: "15px",
              borderTop: "1px solid #ddd",
              textAlign: "right"
            }}>
              <h3 style={{ 
                fontSize: "1.3rem",
                color: "#2c3e50"
              }}>
                Toplam: {calculateTotalPrice()} {cart[0]?.currency || ''}
              </h3>
            </div>
          </div>
        ) : (
          <p style={{ 
            textAlign: "center", 
            color: "#666",
            fontSize: "1.1rem"
          }}>
            Sepetiniz boş.
          </p>
        )}
      </div>
    </div>
  );
};

export default App;













