import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";

const Login = () => {
  const navigate = useNavigate();
  const { login, setAuthToken } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberEmail, setRememberEmail] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "candidate",
  });

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberEmail");
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
      setRememberEmail(true);
    }
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const redirectByRole = (role) => {
    if (role === "recruiter") return navigate("/recruiter");
    if (role === "admin") return navigate("/admin");
    navigate("/candidate");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegister) {
        const res = await API.post("/auth/register", formData);
        alert(res.data?.message || "Registered successfully. Please login.");
        setIsRegister(false);
        setFormData((prev) => ({ ...prev, password: "" }));
      } else {
        const res = await API.post("/auth/login", {
          email: formData.email,
          password: formData.password,
        });

        setAuthToken(res.data.token);
        login(res.data.user);
        redirectByRole(res.data.user.role);
      }

      if (rememberEmail) {
        localStorage.setItem("rememberEmail", formData.email);
      } else {
        localStorage.removeItem("rememberEmail");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-[400px]">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isRegister ? "Register" : "Login"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <input
              name="name"
              placeholder="Full Name"
              className="w-full border p-2 rounded"
              onChange={handleChange}
              value={formData.name}
              required
            />
          )}

          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded"
            onChange={handleChange}
            value={formData.email}
            required
          />

          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full border p-2 rounded"
            onChange={handleChange}
            value={formData.password}
            required
          />

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
              />
              Show password
            </label>
            {!isRegister && (
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberEmail}
                  onChange={(e) => setRememberEmail(e.target.checked)}
                />
                Remember email
              </label>
            )}
          </div>

          {isRegister && (
            <select
              name="role"
              className="w-full border p-2 rounded"
              onChange={handleChange}
              value={formData.role}
            >
              <option value="candidate">Candidate</option>
              <option value="recruiter">Recruiter</option>
            </select>
          )}

          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Please wait..." : isRegister ? "Register" : "Login"}
          </button>
        </form>

        <p className="text-center mt-4">
          {isRegister ? "Already have account?" : "New user?"}
          <span
            onClick={() => setIsRegister((prev) => !prev)}
            className="text-blue-600 ml-2 cursor-pointer"
          >
            {isRegister ? "Login" : "Register"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
