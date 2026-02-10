import { Routes, Route } from "react-router-dom";

import AppLayout from "./layout/AppLayout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import PropertyList from "./pages/PropertyList";
import PropertyDetail from "./pages/PropertyDetail";
import ComparePage from "./pages/ComparePage";
import SellerDashboard from "./pages/SellerDashboard";

import CompareBar from "./components/CompareBar";
import SellerRoute from "./components/SellerRoute";

function App() {
  return (
    <>
      <CompareBar />

      <AppLayout>
        <Routes>
          <Route path="/" element={<PropertyList />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/seller/dashboard"
            element={
              <SellerRoute>
                <SellerDashboard />
              </SellerRoute>
            }
          />
        </Routes>
      </AppLayout>
    </>
  );
}

export default App;
