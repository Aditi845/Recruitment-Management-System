import { useEffect, useState } from "react";
import JobCard from "../components/JobCard";
import API from "../services/api";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    company: "",
    type: "",
  });

  const fetchJobs = async (query = filters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(query).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      const res = await API.get(`/jobs?${params.toString()}`);
      setJobs(res.data?.jobs || []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-4xl font-bold mb-6">Find Jobs</h1>

      <div className="bg-white p-4 rounded shadow mb-6 grid md:grid-cols-5 gap-3">
        <input
          name="search"
          value={filters.search}
          onChange={handleFilterChange}
          placeholder="Search by title"
          className="border p-2 rounded"
        />
        <input
          name="location"
          value={filters.location}
          onChange={handleFilterChange}
          placeholder="Location"
          className="border p-2 rounded"
        />
        <input
          name="company"
          value={filters.company}
          onChange={handleFilterChange}
          placeholder="Company"
          className="border p-2 rounded"
        />
        <select
          name="type"
          value={filters.type}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        >
          <option value="">All Types</option>
          <option value="Full Time">Full Time</option>
          <option value="Part Time">Part Time</option>
          <option value="Internship">Internship</option>
          <option value="Remote">Remote</option>
          <option value="Contract">Contract</option>
        </select>
        <button
          onClick={() => fetchJobs(filters)}
          className="bg-blue-600 text-white rounded px-4 py-2"
        >
          Search
        </button>
      </div>

      {loading && <p>Loading jobs...</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {!loading && !error && jobs.length === 0 && (
        <div className="bg-white p-6 rounded shadow">No jobs found.</div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <JobCard key={job._id} job={job} />
        ))}
      </div>
    </div>
  );
};

export default Jobs;
