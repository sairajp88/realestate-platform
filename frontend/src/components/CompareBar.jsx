import { Link } from "react-router-dom";
import { useCompare } from "../context/CompareContext";

const CompareBar = () => {
  const { compareList } = useCompare();

  if (compareList.length < 2) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "0",
        left: "0",
        right: "0",
        padding: "0.75rem 1rem",
        background: "#111827",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 50,
      }}
    >
      <span>
        Compare selected ({compareList.length})
      </span>

      <Link
        to="/compare"
        style={{
          background: "#2563eb",
          color: "white",
          padding: "0.5rem 1rem",
          borderRadius: "6px",
          textDecoration: "none",
        }}
      >
        Compare
      </Link>
    </div>
  );
};

export default CompareBar;
