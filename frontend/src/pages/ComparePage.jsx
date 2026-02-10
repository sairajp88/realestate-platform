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
      <div style={{ marginBottom: "1.5rem" }}>
        <h1>Compare</h1>
        <small>{properties.length} properties selected</small>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${properties.length}, 1fr)`,
          gap: "0.75rem",
          marginBottom: "1.5rem",
        }}
      >
        {properties.map((p) => (
          <div
            key={p._id}
            style={{
              background: "var(--bg-muted)",
              borderRadius: "14px",
              padding: "0.75rem",
            }}
          >
            <h3
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {p.title}
            </h3>
            <small>
              {p.locality}, {p.city}
            </small>
          </div>
        ))}
      </div>

      <CompareRow label="Price">
        {properties.map((p) => (
          <p key={p._id} style={{ fontWeight: 500 }}>
            ₹ {p.price}
          </p>
        ))}
      </CompareRow>

      <CompareRow label="Area">
        {properties.map((p) => (
          <p key={p._id}>{p.area} sqft</p>
        ))}
      </CompareRow>

      <CompareRow label="Amenities">
        {properties.map((p) => (
          <div key={p._id} style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {p.amenities && p.amenities.length > 0 ? (
              p.amenities.map((a, i) => (
                <span
                  key={i}
                  style={{
                    background: "var(--bg-muted)",
                    borderRadius: "999px",
                    padding: "0.25rem 0.5rem",
                    fontSize: "0.75rem",
                  }}
                >
                  {a}
                </span>
              ))
            ) : (
              <small>None</small>
            )}
          </div>
        ))}
      </CompareRow>

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

function CompareRow({ label, children }) {
  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <small style={{ marginBottom: "0.25rem", display: "block" }}>
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
