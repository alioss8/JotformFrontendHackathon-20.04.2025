import React, { useEffect, useState } from 'react';

const App = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]); // Sepet için state

  const formID = "251074309767967"; // Form ID
  const apiKey = "1bd04b0cb7e62c17a93d891d67b80344"; // API Key
  const endpoint = `https://api.jotform.com/form/${formID}/payment-info?apiKey=${apiKey}`;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(endpoint);
        const data = await response.json();
        
        console.log("API Response:", data);

        if (data?.content?.products) {
          setProducts(data.content.products);
        } else {
          console.warn("Ürün bulunamadı.");
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
    setCart((prevCart) => [...prevCart, product]);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center" }}>Jotform Ürünleri</h1>

      {loading ? (
        <p style={{ textAlign: "center" }}>Yükleniyor...</p>
      ) : products.length > 0 ? (
        <div>
          <div 
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            {products.map((product) => {
              // API'den gelen görsel URL'sini kontrol et
              const imageUrl = product.image || product.images?.large || product.images?.medium;
              const finalImageUrl = imageUrl ? imageUrl.split('?')[0] : ''; // URL'deki gereksiz parametreleri kaldır

              return (
                <div
                  key={product.id}
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: "16px",
                    width: "30%",
                    boxSizing: "border-box",
                    textAlign: "center",
                    marginBottom: "20px",
                  }}
                >
                  {finalImageUrl ? (
                    <img
                      src={finalImageUrl}
                      alt={product.name || "Görsel Bulunamadı"}
                      style={{ width: "100%", height: "200px", objectFit: "cover", marginBottom: "10px" }}
                    />
                  ) : (
                    <p>Görsel mevcut değil</p>
                  )}
                  <h2>{product.name}</h2>
                  <p>{product.description}</p>
                  <p>
                    <strong>
                      {product.price} {product.currency}
                    </strong>
                  </p>

                  {/* Sepete ekle butonu */}
                  <button onClick={() => addToCart(product)} style={{ padding: "8px 16px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "4px" }}>
                    Sepete Ekle
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <p style={{ textAlign: "center", color: "red" }}>Ürün bulunamadı.</p>
      )}

      {/* Sepet Görünümü */}
      <div style={{ marginTop: "40px", textAlign: "center" }}>
        <h2>Sepetiniz</h2>
        {cart.length > 0 ? (
          <div>
            {cart.map((item, index) => (
              <div key={index} style={{ marginBottom: "10px" }}>
                <p>{item.name} - {item.price} {item.currency}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>Sepetiniz boş.</p>
        )}
      </div>
    </div>
  );
};

export default App;





















