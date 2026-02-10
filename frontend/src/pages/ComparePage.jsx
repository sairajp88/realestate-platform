import { useEffect, useState } from "react";
import axios from "axios";
import { useCompare } from "../context/CompareContext";
import { Link } from "react-router-dom";

const ComparePage = () => {
  const { compareList, clearCompare } = useCompare();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComparison = async () => {
      try {
        const res = await axios.post(
          "http://localhost:5000/property/compare",
          { propertyIds: compareList }
        );
        setProperties(res.data.properties);
      } catch (err) {
        setError("Failed to load comparison");
      } finally {
        setLoading(false);
      }
    };

    if (compareList.length >= 2) {
      fetchComparison();
    }
  }, [compareList]);

  if (compareList.length < 2) {
    return (
      <div style={{ padding: "1rem" }}>
        <p>Select at least 2 properties to compare.</p>
        <Link to="/">Go back</Link>
      </div>
    );
  }

  if (loading) return <p>Loading comparison...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Compare Properties</h1>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          overflowX: "auto",
          marginTop: "1rem",
        }}
      >
        {properties.map((property) => (
          <div
            key={property._id}
            style={{
              minWidth: "250px",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "1rem",
            }}
          >
            <h3>{property.title}</h3>
            <p><strong>Price:</strong> ₹ {property.price}</p>
            <p><strong>Area:</strong> {property.area} sqft</p>
            <p>
              <strong>Location:</strong>{" "}
              {property.locality}, {property.city}
            </p>

            <strong>Amenities:</strong>
            <ul>
              {property.amenities?.length
                ? property.amenities.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))
                : <li>None</li>}
            </ul>
          </div>
        ))}
      </div>

      <button
        onClick={clearCompare}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          borderRadius: "6px",
          border: "1px solid #ef4444",
          background: "white",
          color: "#ef4444",
        }}
      >
        Clear Comparison
      </button>
    </div>
  );
};

export default ComparePage;
