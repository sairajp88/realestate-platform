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

      // Reset form
      setForm({
        title: "",
        description: "",
        price: "",
        area: "",
        city: "",
        locality: "",
        amenities: "",
      });

      // Refresh listings
      fetchMyProperties();
    } catch {
      setError("Something went wrong");
    }
  };

  return (
    <div>
      <h2>Seller Dashboard</h2>

      <h3>Add Property</h3>

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />

        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
        />

        <input
          name="area"
          type="number"
          placeholder="Area (sqft)"
          value={form.area}
          onChange={handleChange}
        />

        <input
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
        />

        <input
          name="locality"
          placeholder="Locality"
          value={form.locality}
          onChange={handleChange}
        />

        <input
          name="amenities"
          placeholder="Amenities (comma separated)"
          value={form.amenities}
          onChange={handleChange}
        />

        <button type="submit">Add Property</button>
      </form>

      <hr />

      <h3>My Listings</h3>

      {loading ? (
        <p>Loading your listings...</p>
      ) : properties.length === 0 ? (
        <p>You have not added any properties yet.</p>
      ) : (
        <ul>
          {properties.map((property) => (
            <li key={property._id}>
              <strong>{property.title}</strong> — ₹{property.price}
              <br />
              {property.city}, {property.locality} · {property.area} sqft
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SellerDashboard;
