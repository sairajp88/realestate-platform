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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to add property");
        return;
      }

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
      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h1>Hello 👋</h1>
        <small>Your properties and listings</small>
      </div>

      {/* Add Property */}
      <div
        style={{
          background: "var(--bg-muted)",
          borderRadius: "16px",
          padding: "1rem",
          marginBottom: "2rem",
        }}
      >
        <h3 style={{ marginBottom: "0.75rem" }}>Add property</h3>

        {error && <p>{error}</p>}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          <input name="title" placeholder="Title" value={form.title} onChange={handleChange} />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />
          <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} />
          <input name="area" type="number" placeholder="Area (sqft)" value={form.area} onChange={handleChange} />
          <input name="city" placeholder="City" value={form.city} onChange={handleChange} />
          <input name="locality" placeholder="Locality" value={form.locality} onChange={handleChange} />
          <input
            name="amenities"
            placeholder="Amenities (comma separated)"
            value={form.amenities}
            onChange={handleChange}
          />

          <button
            type="submit"
            style={{
              marginTop: "0.5rem",
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

      {/* My Listings */}
      <div>
        <h3 style={{ marginBottom: "0.75rem" }}>My listings</h3>

        {loading ? (
          <p>Loading your listings…</p>
        ) : properties.length === 0 ? (
          <p>You have not added any properties yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {properties.map((property) => (
              <div
                key={property._id}
                style={{
                  background: "var(--bg-muted)",
                  borderRadius: "16px",
                  padding: "1rem",
                  boxShadow:
                    "0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)",
                }}
              >
                <h3
                  style={{
                    marginBottom: "0.25rem",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {property.title}
                </h3>

                <p style={{ fontWeight: 500, marginBottom: "0.5rem" }}>
                  ₹ {property.price}
                </p>

                <small>
                  {property.area} sqft · {property.locality}, {property.city}
                </small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SellerDashboard;
