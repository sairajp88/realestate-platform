import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useCompare } from "../context/CompareContext";

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { compareList, addToCompare, removeFromCompare } = useCompare();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/property`
        );
        setProperties(res.data);
      } catch {
        setError("Failed to load properties");
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  if (loading) return <p>Loading properties...</p>;
  if (error) return <p>{error}</p>;

  const capsuleStyle = (state) => ({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0.35rem 0.75rem",
    fontSize: "0.75rem",
    borderRadius: "999px",
    background:
      state === "selected"
        ? "var(--text-primary)"
        : "var(--bg-main)",
    color:
      state === "selected"
        ? "var(--bg-main)"
        : "var(--text-primary)",
    opacity: state === "disabled" ? 0.4 : 1,
  });

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h1>Properties</h1>
        <small>Browse available listings</small>
      </div>

      {/* Seller shortcut */}
      {user?.role === "seller" && (
        <div style={{ marginBottom: "1.25rem" }}>
          <Link
            to="/seller/dashboard"
            style={{ fontSize: "0.8rem", opacity: 0.7 }}
          >
            Go to seller dashboard →
          </Link>
        </div>
      )}

      {/* Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {properties.map((property) => {
          const isSelected = compareList.includes(property._id);
          const isDisabled = !isSelected && compareList.length >= 3;

          const state = isDisabled
            ? "disabled"
            : isSelected
            ? "selected"
            : "default";

          return (
            <div
              key={property._id}
              style={{
                padding: "1rem",
                borderRadius: "18px",
                background: "var(--bg-muted)",
              }}
            >
              <Link to={`/property/${property._id}`}>
                <h3>{property.title}</h3>
                <p>₹ {property.price}</p>
                <small>
                  {property.area} sqft · {property.locality},{" "}
                  {property.city}
                </small>
              </Link>

              <div style={{ marginTop: "0.75rem" }}>
                <button
                  onClick={() =>
                    isSelected
                      ? removeFromCompare(property._id)
                      : addToCompare(property._id)
                  }
                  disabled={isDisabled}
                  style={capsuleStyle(state)}
                >
                  {isSelected ? "Selected" : "Add to compare"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PropertyList;
