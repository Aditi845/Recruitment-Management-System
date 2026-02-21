import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  const categories = [
    { title: "Software Development", jobs: "120+ Jobs", icon: "💻" },
    { title: "Data Science", jobs: "80+ Jobs", icon: "📊" },
    { title: "UI/UX Design", jobs: "60+ Jobs", icon: "🎨" },
    { title: "Digital Marketing", jobs: "95+ Jobs", icon: "📢" },
    { title: "Finance", jobs: "70+ Jobs", icon: "💰" },
    { title: "Human Resources", jobs: "50+ Jobs", icon: "👥" },
    { title: "Customer Support", jobs: "40+ Jobs", icon: "🎧" },
    { title: "Content Writing", jobs: "65+ Jobs", icon: "✍️" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* ================= HERO WITH BACKGROUND IMAGE ================= */}
      <div
        className="relative h-[90vh] flex items-center justify-center text-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Content */}
        <div className="relative text-white px-6">
          <h1 className="text-5xl font-bold mb-4">
            Recruitment Management System
          </h1>

          <p className="text-lg max-w-2xl mx-auto mb-8">
            Discover jobs, connect with recruiters, and manage hiring
            efficiently — all in one modern platform.
          </p>

          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition shadow-lg"
          >
            Get Started
          </button>

          <p className="mt-4">
            New here?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-blue-300 cursor-pointer font-semibold"
            >
              Create an account
            </span>
          </p>
        </div>
      </div>

      {/* ================= FEATURES ================= */}
      <div className="py-16 px-6 bg-white">
        <h2 className="text-3xl font-bold text-center mb-10">
          Why Choose Our Portal?
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-gray-100 p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">🚀 Fast Hiring</h3>
            <p className="text-gray-600">
              Apply instantly and connect with recruiters quickly.
            </p>
          </div>

          <div className="bg-gray-100 p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">🌎 Remote Jobs</h3>
            <p className="text-gray-600">
              Access remote and hybrid opportunities worldwide.
            </p>
          </div>

          <div className="bg-gray-100 p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">💼 Verified Companies</h3>
            <p className="text-gray-600">
              Work only with trusted and verified employers.
            </p>
          </div>
        </div>
      </div>

      {/* ================= POPULAR JOB CATEGORIES ================= */}
      <div className="py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">
          Popular Job Categories
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {categories.map((cat, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl text-center shadow hover:shadow-xl transition cursor-pointer"
            >
              <div className="text-4xl mb-3">{cat.icon}</div>
              <h3 className="font-semibold text-lg">{cat.title}</h3>
              <p className="text-gray-500">{cat.jobs}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <footer className="bg-gray-900 text-gray-300 text-center py-6">
        <p>© 2026 Recruitment Management System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
