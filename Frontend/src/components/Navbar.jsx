import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // make sure path

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md px-10 py-4">
      <div className="flex items-center justify-between">
        <div className="w-1/3">
          <Link to="/" className="text-2xl font-bold text-blue-600">RMS Portal</Link>
        </div>

        <div className="w-1/3 flex justify-center gap-8 font-medium">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <Link to="/jobs" className="hover:text-blue-600">Jobs</Link>
          <Link to="/companies" className="hover:text-blue-600">Companies</Link>
          <Link to="/services" className="hover:text-blue-600">Services</Link>
          <Link to="/about" className="hover:text-blue-600">About</Link>
        </div>

        <div className="w-1/3 flex justify-end gap-4 items-center">
          {user ? (
            <>
              {user.role === "recruiter" ? (
                <Link to="/recruiter" className="bg-blue-600 text-white px-4 py-2 rounded">Dashboard</Link>
              ) : (
                <Link to="/candidate" className="bg-blue-600 text-white px-4 py-2 rounded">Dashboard</Link>
              )}

              <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
            </>
          ) : (
            <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
