import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [isRegister, setIsRegister] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    // ===== REGISTER =====
    if (isRegister) {
      const users = JSON.parse(localStorage.getItem("users")) || [];

      users.push(formData);

      localStorage.setItem("users", JSON.stringify(users));

      alert("Registered Successfully! Please login.");
      setIsRegister(false);
      return;
    }

    // ===== LOGIN =====
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const foundUser = users.find(
      (u) =>
        u.email === formData.email &&
        u.password === formData.password
    );

    if (!foundUser) {
      alert("Invalid credentials");
      return;
    }

    // ✅ LOGIN WITH CORRECT ROLE
    login(foundUser);

    // ✅ Redirect based on role
    if (foundUser.role === "recruiter") {
      navigate("/recruiter");
    } else {
      navigate("/candidate");
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
              required
            />
          )}

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

          {/* ROLE SELECT ONLY DURING REGISTER */}
          {isRegister && (
            <select
              name="role"
              className="w-full border p-2 rounded"
              onChange={handleChange}
            >
              <option value="candidate">Candidate</option>
              <option value="recruiter">Recruiter</option>
            </select>
          )}

          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            {isRegister ? "Register" : "Login"}
          </button>
        </form>

        <p className="text-center mt-4">
          {isRegister ? "Already have account?" : "New user?"}
          <span
            onClick={() => setIsRegister(!isRegister)}
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
