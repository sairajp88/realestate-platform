import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_BASE_URL;

function SellerDashboard() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    area: "",
    city: "",
    locality: "",
    amenities: "",
    sellerContact: "",
  });

  const token = localStorage.getItem("token");

  const fetchMyProperties = async () => {
    setLoading(true);          // ✅ FIX 1
    setError("");              // ✅ FIX 2

    try {
      const res = await fetch(`${API}/property/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to fetch properties");
        return;
      }

      setProperties(data);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProperties();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API}/property`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          amenities: form.amenities
            ? form.amenities.split(",").map((a) => a.trim())
            : [],
        }),
      });

      if (!res.ok) {
        setError("Failed to add property");
        return;
      }

      // ✅ Reset form
      setForm({
        title: "",
        description: "",
        price: "",
        area: "",
        city: "",
        locality: "",
        amenities: "",
        sellerContact: "",
      });

      // ✅ FIX 3 — force refetch
      fetchMyProperties();
    } catch {
      setError("Something went wrong");
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1>Hello 👋</h1>
        <small>Your properties and listings</small>
      </div>

      {/* Add property */}
      <div
        style={{
          background: "var(--bg-muted)",
          borderRadius: "16px",
          padding: "1rem",
          marginBottom: "2rem",
        }}
      >
        <h3>Add property</h3>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          <input name="title" placeholder="Title" value={form.title} onChange={handleChange} />
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
          <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} />
          <input name="area" type="number" placeholder="Area (sqft)" value={form.area} onChange={handleChange} />
          <input name="city" placeholder="City" value={form.city} onChange={handleChange} />
          <input name="locality" placeholder="Locality" value={form.locality} onChange={handleChange} />
          <input name="amenities" placeholder="Amenities (comma separated)" value={form.amenities} onChange={handleChange} />
          <input
            name="sellerContact"
            placeholder="Seller Contact (Phone / Email)"
            value={form.sellerContact}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            style={{
              padding: "0.6rem",
              borderRadius: "12px",
              background: "var(--text-primary)",
              color: "var(--bg-main)",
              fontWeight: 500,
            }}
          >
            Add property
          </button>
        </form>

        {error && <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}
      </div>

      {/* My listings */}
      <h3>My listings</h3>

      {loading ? (
        <p>Loading properties...</p>
      ) : properties.length === 0 ? (
        <div>
          <p>No properties yet.</p>
          <small>Add your first property to get started.</small>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {properties.map((p) => (
            <div
              key={p._id}
              style={{
                background: "var(--bg-muted)",
                borderRadius: "16px",
                padding: "1rem",
              }}
            >
              <h3>{p.title}</h3>
              <p style={{ fontWeight: 500 }}>₹ {p.price}</p>
              <small>
                {p.area} sqft · {p.locality}, {p.city}
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SellerDashboard;
