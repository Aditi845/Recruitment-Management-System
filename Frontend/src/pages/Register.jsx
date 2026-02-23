import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "candidate",
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
      await API.post("/auth/register", formData);
      alert("Registered successfully!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow-lg w-[400px]">

        <h2 className="text-2xl font-bold text-center mb-6">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="name"
            placeholder="Full Name"
            className="w-full border p-2 rounded"
            onChange={handleChange}
            required
          />

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

          <select
            name="role"
            className="w-full border p-2 rounded"
            onChange={handleChange}
          >
            <option value="candidate">Register as Candidate</option>
            <option value="recruiter">Register as Recruiter</option>
          </select>

          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Register
          </button>
        </form>

        <p className="text-center mt-4">
          Already have an account?
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 ml-2 cursor-pointer font-semibold"
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
};

export default Register;