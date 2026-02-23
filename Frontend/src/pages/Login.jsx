import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", formData);

      localStorage.setItem("token", res.data.token);
      login(res.data.user);

      if (res.data.user.role === "recruiter")
        navigate("/recruiter");
      else
        navigate("/candidate");

    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow-lg w-[400px]">

        <h2 className="text-2xl font-bold text-center mb-6">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded"
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full border p-2 rounded"
            onChange={handleChange}
            required
          />

          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Login
          </button>
        </form>

        <p className="text-center mt-4">
          Don’t have an account?
          <span
            onClick={() => navigate("/register")}
            className="text-blue-600 ml-2 cursor-pointer font-semibold"
          >
            Register
          </span>
        </p>

      </div>
    </div>
  );
};

export default Login;