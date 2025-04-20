import React, { useState, useEffect } from 'react';

const App = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const increaseQuantity = (productId) => {
    setCart(prev => prev.map(item => 
      item.id === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    ));
  };

  const decreaseQuantity = (productId) => {
    setCart(prev => prev.map(item => 
      item.id === productId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    ));
  };

  const calculateTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const filteredProducts = products.filter(product => {
    const searchLower = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchLower) ||
      (product.description && product.description.toLowerCase().includes(searchLower))
    );
  });

  const handleSubmit = async () => {
    const formData = cart.map(item => ({
      product_name: item.name,
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity,
    }));

    const payload = {
      submission: {
        form_id: formID,
        answers: formData,
      },
    };

    try {
      const response = await fetch(`https://api.jotform.com/form/${formID}/submissions?apiKey=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Sepet başarıyla gönderildi!");
      } else {
        console.error("Hata:", result);
        alert("Sepet gönderilemedi.");
      }
    } catch (error) {
      console.error("Gönderme hatası:", error);
      alert("Sepet gönderilemedi.");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial", maxWidth: "1200px", margin: "0 auto", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Ürünler</h1>

      {/* Search Bar */}
      <div style={{ margin: "0 auto 30px auto", maxWidth: "500px", position: "relative" }}>
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
      </div>

      {loading ? (
        <p style={{ textAlign: "center" }}>Yükleniyor...</p>
      ) : filteredProducts.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "25px", padding: "10px" }}>
          {filteredProducts.map((product) => {
            return (
              <div key={product.id} style={{ border: "1px solid #e0e0e0", borderRadius: "12px", padding: "20px", cursor: "pointer" }}>
                <img src={product.image} alt={product.name} style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px", marginBottom: "15px" }} />
                <h2 style={{ margin: "0 0 10px 0", fontSize: "1.2rem" }}>{product.name}</h2>
                <p style={{ margin: "0 0 15px 0", color: "#555" }}>{product.description || "Açıklama bulunmamaktadır."}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p style={{ fontSize: "1.3rem", fontWeight: "bold" }}>
                    Fiyat: {product.price} {product.currency}
                  </p>
                  <button
                    onClick={() => addToCart(product)}
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
              </div>
            );
          })}
        </div>
      ) : (
        <p style={{ textAlign: "center", color: "red" }}>
          {searchTerm ? "Aramanızla eşleşen ürün bulunamadı." : "Ürün bulunamadı."}
        </p>
      )}

      {/* Cart Section */}
      <div style={{ marginTop: "50px", padding: "25px", border: "1px solid #e0e0e0", borderRadius: "12px", backgroundColor: "#f8f9fa" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Sepetiniz</h2>
        {cart.length > 0 ? (
          <div>
            {cart.map((item) => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", borderBottom: "1px solid #e0e0e0" }}>
                <div>
                  <h3 style={{ margin: 0 }}>{item.name}</h3>
                  <p style={{ margin: "5px 0" }}>
                    {item.price} {item.currency} × {item.quantity} = {item.price * item.quantity} {item.currency}
                  </p>
                </div>
                <div>
                  <button onClick={() => increaseQuantity(item.id)} style={{ marginRight: "10px", padding: "5px 10px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "6px" }}>+</button>
                  <button onClick={() => decreaseQuantity(item.id)} style={{ marginRight: "10px", padding: "5px 10px", backgroundColor: "#FF5722", color: "white", border: "none", borderRadius: "6px" }}>-</button>
                  <button onClick={() => removeFromCart(item.id)} style={{ padding: "5px 10px", backgroundColor: "#f44336", color: "white", border: "none", borderRadius: "6px" }}>Sil</button>
                </div>
              </div>
            ))}
            <h3 style={{ textAlign: "right", marginTop: "20px" }}>
              Toplam: {calculateTotalPrice()} {cart[0]?.currency}
            </h3>
          </div>
        ) : (
          <p style={{ textAlign: "center" }}>Sepetiniz boş.</p>
        )}
      </div>

      {/* Submit Button */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button
          onClick={handleSubmit}
          style={{
            padding: "12px 24px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "600"
          }}
        >
          Siparişi Gönder
        </button>
      </div>
    </div>
  );
};

export default App;


















