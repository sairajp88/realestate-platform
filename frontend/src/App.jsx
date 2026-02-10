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
import AuthRedirect from "./components/AuthRedirect";

function App() {
  return (
    <>
      <CompareBar />

      <AppLayout>
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<PropertyList />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/compare" element={<ComparePage />} />

          {/* Auth pages (blocked if already logged in) */}
          <Route
            path="/login"
            element={
              <AuthRedirect>
                <Login />
              </AuthRedirect>
            }
          />
          <Route
            path="/register"
            element={
              <AuthRedirect>
                <Register />
              </AuthRedirect>
            }
          />

          {/* Seller-only */}
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
