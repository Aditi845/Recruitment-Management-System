import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const featuredCompanies = [
  {
    id: "tcs",
    name: "Tata Consultancy Services",
    website: "https://www.tcs.com",
    about: "Global IT services and consulting company with roles in software development, testing, cloud, and enterprise solutions.",
    jobsCount: 12,
    avgRating: 4.2,
    followersCount: 145,
    location: "India / Global",
  },
  {
    id: "infosys",
    name: "Infosys",
    website: "https://www.infosys.com",
    about: "Digital services and consulting organization offering opportunities in engineering, data, AI, and enterprise platforms.",
    jobsCount: 9,
    avgRating: 4.1,
    followersCount: 112,
    location: "India / Global",
  },
  {
    id: "wipro",
    name: "Wipro",
    website: "https://www.wipro.com",
    about: "Technology services company with openings across software, infrastructure, cybersecurity, and business transformation roles.",
    jobsCount: 7,
    avgRating: 4.0,
    followersCount: 98,
    location: "India / Global",
  },
  {
    id: "accenture",
    name: "Accenture",
    website: "https://www.accenture.com",
    about: "Consulting and technology services company hiring for cloud, analytics, security, product engineering, and strategy roles.",
    jobsCount: 15,
    avgRating: 4.3,
    followersCount: 173,
    location: "Global",
  },
  {
    id: "google",
    name: "Google",
    website: "https://careers.google.com",
    about: "Product and platform company with roles in software engineering, UX, data, AI/ML, SRE, and product management.",
    jobsCount: 10,
    avgRating: 4.6,
    followersCount: 220,
    location: "Global",
  },
  {
    id: "microsoft",
    name: "Microsoft",
    website: "https://careers.microsoft.com",
    about: "Cloud and product engineering opportunities across Azure, developer tools, AI, security, and enterprise software.",
    jobsCount: 11,
    avgRating: 4.5,
    followersCount: 205,
    location: "Global",
  },
];

const Companies = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyJobs, setCompanyJobs] = useState([]);
  const [ratingInput, setRatingInput] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const loadCompanies = async () => {
    try {
      const res = await API.get("/companies");
      setCompanies(res.data?.companies || []);
    } catch (_err) {
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const viewCompanyJobs = async (company) => {
    setSelectedCompany(company);
    try {
      const res = await API.get(`/companies/${company._id}/jobs`);
      setCompanyJobs(res.data?.jobs || []);
    } catch (_err) {
      setCompanyJobs([]);
    }
  };

  const followCompany = async (companyId) => {
    if (!user) {
      alert("Login to follow a company");
      navigate("/login");
      return;
    }
    try {
      await API.post(`/companies/${companyId}/follow`);
      loadCompanies();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to follow company");
    }
  };

  const rateCompany = async (companyId) => {
    if (!user) {
      alert("Login to rate a company");
      navigate("/login");
      return;
    }

    try {
      await API.post(`/companies/${companyId}/rate`, {
        rating: ratingInput[companyId] || 5,
      });
      loadCompanies();
      alert("Rating submitted");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to rate company");
    }
  };

  const filteredCompanies = [...companies]
    .filter((company) => {
      const query = searchTerm.trim().toLowerCase();
      if (!query) return true;

      const name = company.name?.toLowerCase() || "";
      const about = company.about?.toLowerCase() || "";
      const website = company.website?.toLowerCase() || "";

      return name.includes(query) || about.includes(query) || website.includes(query);
    })
    .sort((a, b) => {
      if (sortBy === "jobs") return (b.jobsCount || 0) - (a.jobsCount || 0);
      if (sortBy === "followers") return (b.followersCount || 0) - (a.followersCount || 0);
      if (sortBy === "rating") return (b.avgRating || 0) - (a.avgRating || 0);
      return (a.name || "").localeCompare(b.name || "");
    });

  return (
    <div className="min-h-screen bg-gray-100 p-10 space-y-8">
      <h1 className="text-4xl font-bold text-center">Companies</h1>

      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Featured Companies (Provided by Us)</h2>
          <span className="text-sm text-gray-500">{featuredCompanies.length} companies</span>
        </div>
        

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredCompanies.map((company) => (
            <div
              key={company.id}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400" />

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-700 font-bold flex items-center justify-center border border-blue-200">
                  {company.name?.[0] || "C"}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{company.name}</h3>
                  <p className="text-xs text-gray-500">{company.location}</p>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-4 min-h-[80px]">
                {company.about}
              </p>

              <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                <div className="rounded-lg bg-gray-50 p-2 border border-gray-100">
                  <div className="text-xs text-gray-500">Jobs</div>
                  <div className="font-semibold text-gray-900">{company.jobsCount}</div>
                </div>
                <div className="rounded-lg bg-gray-50 p-2 border border-gray-100">
                  <div className="text-xs text-gray-500">Rating</div>
                  <div className="font-semibold text-gray-900">{company.avgRating}</div>
                </div>
                <div className="rounded-lg bg-gray-50 p-2 border border-gray-100">
                  <div className="text-xs text-gray-500">Followers</div>
                  <div className="font-semibold text-gray-900">{company.followersCount}</div>
                </div>
              </div>

              <div className="flex gap-2">
                <a
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 text-center bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                >
                  Visit Website
                </a>
                <button
                  onClick={() => navigate(`/jobs?company=${encodeURIComponent(company.name)}`)}
                  className="flex-1 border border-gray-300 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                >
                  Explore Jobs
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {loading && <p>Loading companies...</p>}

      <div className="bg-white p-4 rounded-xl shadow flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <input
          type="text"
          placeholder="Search by company name, website, or description"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded px-4 py-2 w-full md:max-w-xl"
        />

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Sort by</label>
          <select
            className="border rounded px-3 py-2"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Name</option>
            <option value="jobs">Open Jobs</option>
            <option value="followers">Followers</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </div>

      <div className="text-sm text-gray-600">
        Showing {filteredCompanies.length} of {companies.length} companies
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {filteredCompanies.map((c) => (
          <div key={c._id} className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center gap-3 mb-3">
              {c.logo ? (
                <img
                  src={`http://localhost:5000${c.logo}`}
                  alt={c.name}
                  className="w-12 h-12 rounded object-cover border"
                />
              ) : (
                <div className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center">
                  {c.name?.[0] || "C"}
                </div>
              )}
              <div>
                <h2 className="text-xl font-bold">{c.name}</h2>
                <p className="text-sm text-gray-600">{c.website || "No website added"}</p>
              </div>
            </div>

            <p className="text-gray-700 text-sm mb-3 line-clamp-3">
              {c.about || "Company profile coming soon."}
            </p>

            <div className="text-sm text-gray-600 space-y-1 mb-4">
              <div>Open Jobs: {c.jobsCount || 0}</div>
              <div>Rating: {c.avgRating || 0} / 5 ({c.ratings?.length || 0})</div>
              <div>Followers: {c.followersCount || 0}</div>
            </div>

            <div className="flex flex-wrap gap-2 mb-2">
              <button
                onClick={() => viewCompanyJobs(c)}
                className="bg-blue-600 text-white px-3 py-2 rounded"
              >
                Jobs by Company
              </button>
              <button
                onClick={() => followCompany(c._id)}
                className="bg-gray-800 text-white px-3 py-2 rounded"
              >
                Follow Company
              </button>
            </div>

            <div className="flex gap-2 items-center">
              <select
                className="border p-2 rounded"
                value={ratingInput[c._id] || 5}
                onChange={(e) =>
                  setRatingInput((prev) => ({ ...prev, [c._id]: Number(e.target.value) }))
                }
              >
                {[1, 2, 3, 4, 5].map((r) => (
                  <option key={r} value={r}>{r} Star</option>
                ))}
              </select>
              <button
                onClick={() => rateCompany(c._id)}
                className="border px-3 py-2 rounded"
              >
                Rate
              </button>
            </div>
          </div>
        ))}
      </div>

      {!loading && filteredCompanies.length === 0 && (
        <div className="bg-white p-6 rounded-xl shadow text-center text-gray-600">
          No companies matched your search. Try a different keyword.
        </div>
      )}

      {selectedCompany && (
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-4">Jobs by {selectedCompany.name}</h2>
          <div className="space-y-3">
            {companyJobs.length === 0 && <div>No open jobs for this company.</div>}
            {companyJobs.map((job) => (
              <div key={job._id} className="border rounded p-4">
                <div className="font-semibold">{job.title}</div>
                <div className="text-sm text-gray-600">
                  {job.location} | {job.type}
                </div>
                <button
                  onClick={() => navigate(`/jobs?company=${encodeURIComponent(selectedCompany.name)}`)}
                  className="mt-2 text-blue-600"
                >
                  Go to Jobs page
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Companies;
