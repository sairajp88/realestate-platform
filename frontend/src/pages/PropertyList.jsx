import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useCompare } from "../context/CompareContext";

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { compareList, addToCompare, removeFromCompare } = useCompare();

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

  if (loading) {
    return <p>Loading properties…</p>; // skeletons come later
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h1>Properties</h1>
        <small>Browse available listings</small>
      </div>

      {properties.length === 0 && (
        <p>No properties available.</p>
      )}

      {/* Property list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {properties.map((property) => {
          const isSelected = compareList.includes(property._id);
          const isDisabled = !isSelected && compareList.length >= 3;

          return (
            <div
              key={property._id}
              style={{
                background: "var(--bg-muted)",
                borderRadius: "16px",
                padding: "1rem",
                boxShadow:
                  "0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)",
                transition: "transform 0.1s ease",
              }}
            >
              <Link
                to={`/property/${property._id}`}
                style={{ display: "block" }}
              >
                {/* Title */}
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

                {/* Price */}
                <p
                  style={{
                    fontWeight: 500,
                    marginBottom: "0.5rem",
                  }}
                >
                  ₹ {property.price}
                </p>

                {/* Meta info */}
                <small>
                  {property.area} sqft · {property.locality}, {property.city}
                </small>
              </Link>

              {/* Compare action */}
              <button
                onClick={() =>
                  isSelected
                    ? removeFromCompare(property._id)
                    : addToCompare(property._id)
                }
                disabled={isDisabled}
                style={{
                  marginTop: "0.75rem",
                  padding: "0.4rem 0.75rem",
                  borderRadius: "999px",
                  fontSize: "0.85rem",
                  background: isSelected
                    ? "var(--text-primary)"
                    : "transparent",
                  color: isSelected
                    ? "var(--bg-main)"
                    : "var(--text-primary)",
                  border: "1px solid var(--border-subtle)",
                  opacity: isDisabled ? 0.5 : 1,
                }}
              >
                {isSelected ? "Remove from compare" : "Add to compare"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PropertyList;
