import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/property/${id}`
        );
        setProperty(res.data);
      } catch (err) {
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

  return (
    <div style={{ padding: "1rem" }}>
      <Link to="/">← Back to listings</Link>

      <h1>{property.title}</h1>
      <p>₹ {property.price}</p>
      <p>{property.area} sqft</p>
      <p>
        {property.locality}, {property.city}
      </p>

      <h3>Description</h3>
      <p>{property.description}</p>

      {property.amenities && property.amenities.length > 0 && (
        <>
          <h3>Amenities</h3>
          <ul>
            {property.amenities.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </>
      )}

      {property.sellerId?.name && (
        <>
          <h3>Seller</h3>
          <p>{property.sellerId.name}</p>
        </>
      )}
    </div>
  );
};

export default PropertyDetail;
