import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Briefcase, Building2, MapPin, DollarSign, Clock, Star, 
  FileText, CheckCircle2, Eye, EyeOff, Save, ArrowLeft 
} from "lucide-react";

const PostJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [job, setJob] = useState({
    title: "",
    companyName: "",
    location: "",
    salary: "",
    type: "",
    experienceLevel: "",
    skillsRequired: "",
    description: "",
  });
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    try {
      const draft = JSON.parse(localStorage.getItem("jobDraft") || "null");
      if (draft) setJob(draft);
    } catch {
      // ignore
    }
  }, []);

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post("/jobs", job);
      toast.success("Job posted successfully!");
      localStorage.removeItem("jobDraft");
      navigate("/recruiter");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  const saveDraft = () => {
    localStorage.setItem("jobDraft", JSON.stringify(job));
    toast.info("Draft saved locally");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      
      <div className="w-full max-w-4xl mb-8 flex justify-between items-center">
        <button 
          onClick={() => navigate('/recruiter')} 
          className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors font-medium"
        >
          <ArrowLeft size={20} /> Back to Dashboard
        </button>
      </div>

      <div className="w-full max-w-4xl grid md:grid-cols-5 gap-8">
        
        {/* FORM SECTION */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`bg-white p-8 rounded-3xl shadow-sm border border-gray-100 ${showPreview ? 'md:col-span-3' : 'md:col-span-5'}`}
        >
          <div className="mb-8 border-b border-gray-100 pb-6 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Post a New Job</h2>
              <p className="text-gray-500">Reach thousands of targeted candidates immediately.</p>
            </div>
            
            <button
              type="button"
              onClick={() => setShowPreview((prev) => !prev)}
              className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors ${showPreview ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {showPreview ? <><EyeOff size={16}/> Hide Preview</> : <><Eye size={16}/> Show Preview</>}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Job Title *</label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input name="title" required value={job.title} onChange={handleChange} placeholder="e.g. Senior Frontend Developer" className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Company Name *</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input name="companyName" required value={job.companyName} onChange={handleChange} placeholder="e.g. Acme Corp" className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Location *</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input name="location" required value={job.location} onChange={handleChange} placeholder="e.g. San Francisco, CA or Remote" className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Salary Range</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input name="salary" value={job.salary} onChange={handleChange} placeholder="e.g. $120k - $150k" className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Job Type *</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <select name="type" required value={job.type} onChange={handleChange} className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none">
                    <option value="" disabled>Select Job Type</option>
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Experience Level</label>
                <div className="relative">
                  <Star className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input name="experienceLevel" value={job.experienceLevel} onChange={handleChange} placeholder="e.g. 3-5 Years" className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Required Skills</label>
                <div className="relative">
                  <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input name="skillsRequired" value={job.skillsRequired} onChange={handleChange} placeholder="e.g. React, Node, CSS" className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Job Description *</label>
                <textarea name="description" required value={job.description} onChange={handleChange} placeholder="Detail the responsibilities, requirements, and benefits..." rows="5" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"></textarea>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex flex-col-reverse sm:flex-row gap-4 justify-end">
              
              <button
                type="button"
                onClick={() => setShowPreview((prev) => !prev)}
                className="md:hidden flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl"
              >
                {showPreview ? "Hide Preview" : "Show Preview"}
              </button>

              <button
                type="button"
                onClick={saveDraft}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                <Save size={18} /> Save Draft
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Posting..." : <><CheckCircle2 size={20} /> Publish Job</>}
              </button>
            </div>
          </form>
        </motion.div>

        {/* PREVIEW SECTION */}
        <AnimatePresence>
          {showPreview && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="md:col-span-2 space-y-6"
            >
              <div className="sticky top-10">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Eye size={16} /> Live Candidate Preview
                </h3>
                
                {/* Mock Job Card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                  <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center font-black text-2xl text-blue-600 border border-blue-100 shadow-inner">
                      {job.companyName ? job.companyName.charAt(0).toUpperCase() : "?"}
                    </div>
                  </div>
                  
                  <div className="relative z-10">
                    <h2 className="font-bold text-xl text-gray-900 mb-1 line-clamp-1">
                      {job.title || "Job Title"}
                    </h2>
                    <p className="text-gray-500 font-medium mb-5">{job.companyName || "Company Name"}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                        <MapPin size={14} className="text-gray-400" /> {job.location || "Location"}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                        <Briefcase size={14} className="text-gray-400" /> {job.type || "Type"}
                      </span>
                      {job.salary && (
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
                          <DollarSign size={14} className="text-green-500" /> {job.salary}
                        </span>
                      )}
                    </div>

                    {job.skillsRequired && (
                      <div className="mb-6">
                         <div className="text-xs font-bold text-gray-400 mb-2 uppercase">Skills</div>
                         <div className="flex flex-wrap gap-1">
                            {job.skillsRequired.split(',').map((skill, i) => (
                               <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">{skill.trim()}</span>
                            ))}
                         </div>
                      </div>
                    )}
                    
                    {job.description && (
                      <div className="mb-6 border-t border-gray-100 pt-4">
                        <p className="text-sm text-gray-600 line-clamp-4">{job.description}</p>
                      </div>
                    )}
                  </div>

                  <div className="relative z-10 mt-2">
                    <button disabled className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-200 text-gray-500 rounded-xl font-bold cursor-not-allowed">
                      Apply Now (Preview)
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default PostJob;
