import { useEffect, useState } from "react";
import axios from "axios";
import { useCompare } from "../context/CompareContext";
import { Link } from "react-router-dom";

const API = import.meta.env.VITE_API_BASE_URL;

const ComparePage = () => {
  const { compareList, clearCompare } = useCompare();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComparison = async () => {
      try {
        const res = await axios.post(`${API}/property/compare`, {
          propertyIds: compareList,
        });
        setProperties(res.data.properties);
      } catch {
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
      <div>
        <p>No comparison yet.</p>
        <small>Select at least two properties to compare.</small>

        <div style={{ marginTop: "0.75rem" }}>
          <Link to="/">
            <small>Browse properties</small>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) return <p>Loading comparison…</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h1>Compare</h1>
        <small>{properties.length} properties selected</small>
      </div>

      {/* Property header cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${properties.length}, 1fr)`,
          gap: "0.75rem",
          marginBottom: "1.75rem",
        }}
      >
        {properties.map((p) => (
          <div
            key={p._id}
            style={{
              background: "var(--bg-muted)",
              borderRadius: "16px",
              padding: "0.9rem",
            }}
          >
            <h3
              style={{
                fontSize: "0.95rem",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                marginBottom: "0.25rem",
              }}
            >
              {p.title}
            </h3>
            <small style={{ opacity: 0.7 }}>
              {p.locality}, {p.city}
            </small>
          </div>
        ))}
      </div>

      {/* Price row */}
      <CompareRow label="Price">
        {properties.map((p) => (
          <p key={p._id} style={{ fontWeight: 600 }}>
            ₹ {p.price}
          </p>
        ))}
      </CompareRow>

      {/* Area row */}
      <CompareRow label="Area">
        {properties.map((p) => (
          <p key={p._id}>{p.area} sqft</p>
        ))}
      </CompareRow>

      {/* Amenities row */}
      <CompareRow label="Amenities">
        {properties.map((p) => (
          <div
            key={p._id}
            style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}
          >
            {p.amenities && p.amenities.length > 0 ? (
              p.amenities.map((a, i) => (
                <span
                  key={i}
                  style={{
                    background: "var(--bg-muted)",
                    borderRadius: "999px",
                    padding: "0.25rem 0.55rem",
                    fontSize: "0.75rem",
                    opacity: 0.85,
                  }}
                >
                  {a}
                </span>
              ))
            ) : (
              <small style={{ opacity: 0.6 }}>None</small>
            )}
          </div>
        ))}
      </CompareRow>

      {/* Clear action */}
      <button
        onClick={clearCompare}
        style={{
          marginTop: "2rem",
          width: "100%",
          padding: "0.75rem",
          borderRadius: "16px",
          background: "var(--bg-muted)",
          fontWeight: 500,
        }}
      >
        Clear comparison
      </button>
    </div>
  );
};

/* Row wrapper */
function CompareRow({ label, children }) {
  return (
    <div style={{ marginBottom: "1.75rem" }}>
      <small
        style={{
          display: "block",
          marginBottom: "0.4rem",
          opacity: 0.7,
        }}
      >
        {label}
      </small>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${children.length}, 1fr)`,
          gap: "0.75rem",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default ComparePage;
