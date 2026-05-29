import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ApplyJobModal from "./ApplyJobModal";
import { toast } from "react-toastify";
import { MapPin, Briefcase, Bookmark, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const JobCard = ({ job, isSaved, onToggleSave }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const handleApply = async () => {
    // Authentication Validation
    if (!user) {
      toast.error("Please log in as a candidate to apply for jobs", {
        position: "top-center",
        autoClose: 3000
      });
      navigate("/login");
      return;
    }

    if (user.role !== "candidate") {
      toast.error("Only candidates can apply for jobs.", {
        position: "top-center"
      });
      return;
    }

    setShowModal(true);
  };

  const handleSave = () => {
    // Authentication Validation
    if (!user) {
      toast.error("Please log in to save jobs", {
        position: "top-center",
        autoClose: 3000
      });
      navigate("/login");
      return;
    }
    
    if (onToggleSave) {
      onToggleSave(job);
    }
  };

  return (
    <>
      <motion.div 
        whileHover={{ y: -5 }}
        className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between h-full relative overflow-hidden"
      >
        {/* Subtle background decoration */}
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-50 group-hover:bg-blue-100 transition-colors pointer-events-none"></div>

        <div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center font-black text-2xl text-blue-600 border border-blue-100 shadow-inner">
              {job.companyName.charAt(0).toUpperCase()}
            </div>
            
            {onToggleSave && (
              <button
                onClick={handleSave}
                className="text-gray-400 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-blue-50"
                title={isSaved ? "Remove from saved" : "Save Job"}
              >
                <Bookmark 
                  size={24} 
                  className={isSaved ? "fill-blue-600 text-blue-600" : ""} 
                />
              </button>
            )}
          </div>
          
          <div className="relative z-10">
            <h2 className="font-bold text-xl text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-700 transition-colors">
              {job.title}
            </h2>
            <p className="text-gray-500 font-medium mb-5">{job.companyName}</p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                <MapPin size={14} className="text-gray-400" /> {job.location}
              </span>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                <Briefcase size={14} className="text-gray-400" /> {job.type}
              </span>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-2">
          {job.status === "closed" ? (
             <div className="w-full py-3 px-4 bg-gray-100 text-gray-500 rounded-xl font-bold text-center border border-gray-200">
               Position Closed
             </div>
          ) : (
            <button
              onClick={handleApply}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md shadow-blue-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              Apply Now <CheckCircle2 size={18} />
            </button>
          )}
        </div>
      </motion.div>

      {showModal && (
        <ApplyJobModal
          job={job}
          user={user}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default JobCard;
