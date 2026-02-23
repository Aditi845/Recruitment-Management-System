import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const JobCard = ({ job }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleApply = () => {
    // not logged in
    if (!user) {
      alert("Please login as candidate to apply");
      navigate("/login");
      return;
    }

    // recruiter cannot apply
    if (user.role === "recruiter") {
      alert("Recruiters cannot apply for jobs");
      return;
    }

    // save applied job
    const appliedJobs =
      JSON.parse(localStorage.getItem("appliedJobs")) || [];

    appliedJobs.push(job);

    localStorage.setItem(
      "appliedJobs",
      JSON.stringify(appliedJobs)
    );

    alert("Applied successfully!");
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">

      <h2 className="text-xl font-bold">{job.title}</h2>
      <p>{job.company}</p>
      <p className="text-gray-500">{job.location}</p>

      <button
        onClick={handleApply}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Apply
      </button>

    </div>
  );
};

export default JobCard;