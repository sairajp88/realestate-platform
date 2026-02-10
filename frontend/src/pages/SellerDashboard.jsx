import { useEffect, useState } from "react";

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
  });

  const token = localStorage.getItem("token");

  const fetchMyProperties = async () => {
    try {
      const res = await fetch("http://localhost:5000/property/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message);
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
      const res = await fetch("http://localhost:5000/property", {
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

      if (!res.ok) return setError("Failed to add property");

      setForm({
        title: "",
        description: "",
        price: "",
        area: "",
        city: "",
        locality: "",
        amenities: "",
      });

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
      </div>

      <h3>My listings</h3>

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {[1, 2].map((i) => (
            <div
              key={i}
              style={{
                background: "var(--bg-muted)",
                borderRadius: "16px",
                height: "88px",
              }}
            />
          ))}
        </div>
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
