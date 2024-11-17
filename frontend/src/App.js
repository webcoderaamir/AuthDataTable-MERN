import React from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate, Navigate } from "react-router-dom";
import EmployeeDashboard from "./components/Dashboard";
import Login from "./components/Login";
import Register from "./components/Register";

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <div className="row">
          <div className="col-lg col-md col-sm card card-right">
            <Routes>
              {/* Define routes for Login, Register, and Dashboard */}
              <Route path="/" element={<Login />} exact />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={<ProtectedRoute><EmployeeDashboard className="EmployeeDashboard" /></ProtectedRoute>}
              />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

const Navbar = () => {
  const navigate = useNavigate();

  // Logout function to clear token and redirect to login page
  function logout() {
    localStorage.removeItem('token'); 
    navigate('/');
  }

  const isLoggedIn = localStorage.getItem('token');

  return (
    <nav className="navbar">
      <span className="navbar-brand mb-0 h1">
        <h1>Dashboard</h1>
      </span>
      <div className="nav-links">
        {isLoggedIn && (
          <button onClick={logout} className="btn btn-danger">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

// ProtectedRoute component to protect routes like /dashboard
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('token');
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default App;
