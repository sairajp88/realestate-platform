import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useCompare } from "../context/CompareContext";

const PropertyDetail = () => {
  const { id } = useParams();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { compareList, addToCompare, removeFromCompare } = useCompare();

  const isSelected = compareList.includes(id);
  const isDisabled = !isSelected && compareList.length >= 3;

  useEffect(() => {
    // ✅ Guard: do not fetch until id exists
    if (!id) return;

    const fetchProperty = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/property/${id}`
        );
        setProperty(res.data);
      } catch {
        setError("Property not found");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  // Extra safety
  if (!id) return null;

  if (loading) return <p>Loading property...</p>;
  if (error) return <p>{error}</p>;
  if (!property) return null;

  const capsuleStyle = (state) => ({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0.4rem 0.9rem",
    fontSize: "0.8rem",
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

  const state = isDisabled
    ? "disabled"
    : isSelected
    ? "selected"
    : "default";

  return (
    <div>
      <Link to="/" style={{ fontSize: "0.75rem", opacity: 0.7 }}>
        ← Back to listings
      </Link>

      <div style={{ margin: "1rem 0" }}>
        <h1>{property.title}</h1>
        <p>₹ {property.price}</p>
        <small>
          {property.area} sqft · {property.locality}, {property.city}
        </small>
      </div>

      {/* Compare capsule */}
      <button
        onClick={() =>
          isSelected ? removeFromCompare(id) : addToCompare(id)
        }
        disabled={isDisabled}
        style={capsuleStyle(state)}
      >
        {isSelected ? "Selected" : "Add to compare"}
      </button>

      <div style={{ marginTop: "1.75rem" }}>
        <h3>Description</h3>
        <p>{property.description}</p>
      </div>

      {property.amenities?.length > 0 && (
        <div style={{ marginTop: "1.5rem" }}>
          <h3>Amenities</h3>
          <small>{property.amenities.join(" · ")}</small>
        </div>
      )}
    </div>
  );
};

export default PropertyDetail;
