import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ApplyJobModal from "./ApplyJobModal";

const JobCard = ({ job }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const handleApply = async () => {
    // not logged in
    if (!user) {
      alert("Please login as candidate to apply");
      navigate("/login");
      return;
    }

    if (user.role !== "candidate") {
      alert("Only candidates can apply for jobs");
      return;
    }

    setShowModal(true);
  };

  return (
    <>
    <div className="bg-white p-6 rounded-xl shadow">

      <h2 className="text-xl font-bold">{job.title}</h2>
      <p>{job.companyName}</p>
      <p className="text-gray-500">{job.location}</p>
      <p className="text-sm text-gray-500 mt-1">{job.type}</p>

      <button
        onClick={handleApply}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Apply
      </button>

    </div>
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
