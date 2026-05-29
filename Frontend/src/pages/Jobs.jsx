import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import JobCard from "../components/JobCard";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Search, MapPin, Building2, Briefcase, Filter, X } from "lucide-react";
import { toast } from "react-toastify";

const Jobs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    company: "",
    type: "",
  });

  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      if (user) {
        try {
          const res = await API.get("/users/me");
          setSavedJobs(res.data?.user?.savedJobs || []);
        } catch (err) {
          console.error("Failed to fetch saved jobs");
        }
      }
    };
    fetchSavedJobs();
  }, [user]);

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
    const params = new URLSearchParams(location.search);
    const nextFilters = {
      search: params.get("search") || "",
      location: params.get("location") || "",
      company: params.get("company") || "",
      type: params.get("type") || "",
    };
    setFilters(nextFilters);
    fetchJobs(nextFilters);
  }, [location.search]);

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSearch = () => {
    fetchJobs(filters);
  };

  const toggleSave = async (job) => {
    if (!user) {
      toast.error("Please log in to save jobs", { position: "top-center" });
      navigate("/login");
      return;
    }
    
    try {
      const res = await API.put("/users/me/saved-jobs", { jobId: job._id });
      setSavedJobs(res.data?.savedJobs || []);
      
      const isSaved = res.data?.message?.includes("removed");
      if (isSaved) {
        toast.info("Job removed from saved list");
      } else {
        toast.success("Job saved successfully");
      }
    } catch (err) {
      toast.error("Failed to update saved jobs");
    }
  };

  const savedMap = useMemo(() => {
    const map = new Map();
    savedJobs.forEach((job) => map.set(job._id, true));
    return map;
  }, [savedJobs]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-16 px-4 sm:px-6 lg:px-8 shadow-inner">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold mb-4"
          >
            Find Your Dream Job
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-blue-100 text-lg max-w-2xl mx-auto"
          >
            Browse thousands of active job openings from top companies around the world.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        
        {/* Unified Search Console */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 mb-12 flex flex-col md:flex-row gap-4"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Job title or keyword"
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 font-medium placeholder-gray-400"
            />
          </div>
          <div className="flex-1 relative hidden md:block">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Location"
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 font-medium placeholder-gray-400"
            />
          </div>
          
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="md:hidden flex items-center justify-center gap-2 py-4 px-6 bg-gray-100 rounded-xl text-gray-700 font-bold"
          >
            <Filter size={20} /> Filters
          </button>

          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 py-4 font-bold text-lg transition-colors shadow-md shadow-blue-200"
          >
            Search Jobs
          </button>
        </motion.div>

        {/* Expanded Filters (Mobile & Desktop) */}
        <motion.div 
          initial={false}
          animate={{ height: isFilterOpen ? "auto" : 0, opacity: isFilterOpen ? 1 : 0 }}
          className="overflow-hidden md:!h-auto md:!opacity-100 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 md:mb-10">
             <div className="flex-1 relative md:hidden">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="Location"
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="flex-1 relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                name="company"
                value={filters.company}
                onChange={handleFilterChange}
                placeholder="Company Name"
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="flex-1 relative">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none text-gray-700"
              >
                <option value="">Any Job Type</option>
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Saved Jobs Horizontal Scroll */}
        {user && savedJobs.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              Your Saved Jobs <span className="bg-blue-100 text-blue-700 py-0.5 px-2.5 rounded-full text-xs">{savedJobs.length}</span>
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar">
              {savedJobs.slice(0, 6).map((job) => (
                <div key={job._id} className="min-w-[280px] bg-white border border-gray-200 rounded-xl p-4 shadow-sm snap-start relative group">
                  <button onClick={() => toggleSave(job)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 bg-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <X size={16} />
                  </button>
                  <h3 className="font-bold text-gray-900 pr-6 line-clamp-1">{job.title}</h3>
                  <p className="text-sm text-gray-500">{job.companyName}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Job Results */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-4">
            {loading ? "Searching..." : `${jobs.length} Jobs Found`}
          </h2>

          {loading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-white p-6 rounded-2xl border border-gray-100 h-64 animate-pulse">
                  <div className="flex gap-4 mb-4">
                    <div className="w-14 h-14 bg-gray-200 rounded-xl"></div>
                    <div className="flex-1">
                       <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                       <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="flex gap-2 mb-6 mt-8">
                     <div className="h-8 bg-gray-200 rounded w-20"></div>
                     <div className="h-8 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="h-12 bg-gray-200 rounded-xl w-full"></div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-100 text-center font-medium">
              {error}
            </div>
          )}

          {!loading && !error && jobs.length === 0 && (
            <div className="bg-white p-12 rounded-3xl text-center border border-gray-200 shadow-sm">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-700">No jobs matched your criteria.</h3>
              <p className="text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
              <button 
                onClick={() => { setFilters({search:'', location:'', company:'', type:''}); fetchJobs({}); }}
                className="mt-6 px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}

          {!loading && !error && jobs.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {jobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  isSaved={savedMap.has(job._id)}
                  onToggleSave={toggleSave}
                />
              ))}
            </motion.div>
          )}
        </div>
      </div>
      
      {/* CSS for hiding scrollbar on the saved jobs list */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Jobs;
