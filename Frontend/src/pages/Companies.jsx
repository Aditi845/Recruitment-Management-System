import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const Companies = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyJobs, setCompanyJobs] = useState([]);
  const [ratingInput, setRatingInput] = useState({});

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

  return (
    <div className="min-h-screen bg-gray-100 p-10 space-y-8">
      <h1 className="text-4xl font-bold text-center">Companies</h1>

      {loading && <p>Loading companies...</p>}

      <div className="grid md:grid-cols-3 gap-6">
        {companies.map((c) => (
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
