import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axios.get("http://localhost:5000/property");
        setProperties(res.data);
      } catch (err) {
        setError("Failed to load properties");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) return <p>Loading properties...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Properties</h1>

      {properties.length === 0 && <p>No properties available</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {properties.map((property) => (
          <Link
            key={property._id}
            to={`/property/${property._id}`}
            style={{
              padding: "1rem",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <h3>{property.title}</h3>
            <p>₹ {property.price}</p>
            <p>{property.area} sqft</p>
            <p>
              {property.locality}, {property.city}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PropertyList;
