import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState("candidate");

  const handleSubmit = (e) => {
    e.preventDefault();

    const userData = {
      name: "Demo User",
      role: role,
    };

    login(userData);

    // Redirect based on role
    if (role === "recruiter") {
      navigate("/recruiter");
    } else {
      navigate("/candidate");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow-lg w-[400px]">

        <h2 className="text-2xl font-bold text-center mb-6">
          {isRegister ? "Create Account" : "Login"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {isRegister && (
            <input
              type="text"
              placeholder="Full Name"
              className="w-full border p-2 rounded"
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded"
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-2 rounded"
            required
          />

          {/* ROLE SELECTION (IMPORTANT) */}
          {isRegister && (
            <div>
              <p className="font-semibold mb-2">Register As:</p>

              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="candidate"
                    checked={role === "candidate"}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  Candidate
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="recruiter"
                    onChange={(e) => setRole(e.target.value)}
                  />
                  Recruiter
                </label>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {isRegister ? "Register" : "Login"}
          </button>
        </form>

        <p className="text-center mt-4">
          {isRegister ? "Already have an account?" : "New user?"}

          <span
            onClick={() => setIsRegister(!isRegister)}
            className="text-blue-600 cursor-pointer ml-2"
          >
            {isRegister ? "Login" : "Register"}
          </span>
        </p>

      </div>
    </div>
  );
};

export default Login;
