import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useCompare } from "../context/CompareContext";

const API = import.meta.env.VITE_API_BASE_URL;

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { compareList, addToCompare, removeFromCompare } = useCompare();

  const isSelected = compareList.includes(id);
  const isDisabled = !isSelected && compareList.length >= 3;

  useEffect(() => {
    if (!id) return;

    const fetchProperty = async () => {
      try {
        const res = await axios.get(`${API}/property/${id}`);
        setProperty(res.data);
      } catch {
        setError("Property not found");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) return <p>Loading property...</p>;
  if (error) return <p>{error}</p>;
  if (!property) return null;

  /* Capsule button styles */
  const capsuleStyle = (state) => ({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0.55rem 1.1rem",
    fontSize: "0.8rem",
    borderRadius: "999px",
    fontWeight: 500,
    border: "none",
    cursor: state === "disabled" ? "not-allowed" : "pointer",
    background:
      state === "selected"
        ? "var(--text-primary)"
        : "var(--bg-muted)",
    color:
      state === "selected"
        ? "var(--bg-main)"
        : "var(--text-primary)",
    opacity: state === "disabled" ? 0.45 : 1,
    transition: "all 0.15s ease",
  });

  const buttonState = isDisabled
    ? "disabled"
    : isSelected
    ? "selected"
    : "default";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      {/* Back link */}
      <Link
        to="/"
        style={{
          fontSize: "0.75rem",
          opacity: 0.65,
          textDecoration: "none",
        }}
      >
        ← Back to listings
      </Link>

      {/* Header card */}
      <div
        style={{
          background: "var(--bg-muted)",
          borderRadius: "20px",
          padding: "1.25rem",
        }}
      >
        <h1 style={{ fontSize: "1.4rem", marginBottom: "0.4rem" }}>
          {property.title}
        </h1>

        <p style={{ fontWeight: 600, marginBottom: "0.25rem" }}>
          ₹ {property.price}
        </p>

        <small style={{ opacity: 0.7 }}>
          {property.area} sqft · {property.locality}, {property.city}
        </small>

        {/* Compare action */}
        <div style={{ marginTop: "1rem" }}>
          <button
            onClick={() =>
              isSelected ? removeFromCompare(id) : addToCompare(id)
            }
            disabled={isDisabled}
            style={capsuleStyle(buttonState)}
          >
            {isSelected ? "Selected for compare" : "Add to compare"}
          </button>
        </div>
      </div>

      {/* Description */}
      <div
        style={{
          background: "var(--bg-main)",
          borderRadius: "18px",
          padding: "1.25rem",
        }}
      >
        <h3 style={{ marginBottom: "0.5rem" }}>Description</h3>
        <p style={{ lineHeight: 1.6, opacity: 0.85 }}>
          {property.description}
        </p>
      </div>

      {/* Amenities */}
      {property.amenities?.length > 0 && (
        <div
          style={{
            background: "var(--bg-muted)",
            borderRadius: "18px",
            padding: "1.25rem",
          }}
        >
          <h3 style={{ marginBottom: "0.6rem" }}>Amenities</h3>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.4rem",
            }}
          >
            {property.amenities.map((a, i) => (
              <span
                key={i}
                style={{
                  background: "var(--bg-main)",
                  borderRadius: "999px",
                  padding: "0.3rem 0.6rem",
                  fontSize: "0.75rem",
                  opacity: 0.85,
                }}
              >
                {a}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Seller contact */}
      <div
        style={{
          background: "var(--bg-muted)",
          borderRadius: "18px",
          padding: "1.25rem",
        }}
      >
        <h3 style={{ marginBottom: "0.35rem" }}>Seller Contact</h3>
        <small style={{ opacity: 0.75 }}>
          {property.sellerContact || "Not available"}
        </small>
      </div>
    </div>
  );
};

export default PropertyDetail;
