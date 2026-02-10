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

  if (loading) return <p>Loading properties...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Properties</h1>

      {properties.length === 0 && <p>No properties available</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {properties.map((property) => {
          const isSelected = compareList.includes(property._id);
          const isDisabled = !isSelected && compareList.length >= 3;

          return (
            <div
              key={property._id}
              style={{
                padding: "1rem",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            >
              <Link
                to={`/property/${property._id}`}
                style={{
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

              <button
                onClick={() =>
                  isSelected
                    ? removeFromCompare(property._id)
                    : addToCompare(property._id)
                }
                disabled={isDisabled}
                style={{
                  marginTop: "0.5rem",
                  padding: "0.4rem 0.8rem",
                  borderRadius: "6px",
                  border: "1px solid #2563eb",
                  background: isSelected ? "#2563eb" : "white",
                  color: isSelected ? "white" : "#2563eb",
                  cursor: isDisabled ? "not-allowed" : "pointer",
                  opacity: isDisabled ? 0.5 : 1,
                }}
              >
                {isSelected ? "Remove from Compare" : "Add to Compare"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PropertyList;
