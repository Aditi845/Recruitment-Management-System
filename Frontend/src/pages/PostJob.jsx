import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

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

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post("/jobs", job);
      alert("Job posted successfully!");
      navigate("/recruiter");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Post a New Job</h2>

        <input
          name="title"
          placeholder="Job Title"
          onChange={handleChange}
          value={job.title}
          className="w-full p-3 border rounded mb-4"
          required
        />

        <input
          name="companyName"
          placeholder="Company Name"
          onChange={handleChange}
          value={job.companyName}
          className="w-full p-3 border rounded mb-4"
          required
        />

        <input
          name="location"
          placeholder="Location"
          onChange={handleChange}
          value={job.location}
          className="w-full p-3 border rounded mb-4"
          required
        />

        <input
          name="salary"
          placeholder="Salary"
          onChange={handleChange}
          value={job.salary}
          className="w-full p-3 border rounded mb-4"
        />

        <select
          name="type"
          onChange={handleChange}
          value={job.type}
          className="w-full p-3 border rounded mb-4"
          required
        >
          <option value="">Select Job Type</option>
          <option value="Full Time">Full Time</option>
          <option value="Part Time">Part Time</option>
          <option value="Internship">Internship</option>
          <option value="Remote">Remote</option>
        </select>

        <input
          name="experienceLevel"
          placeholder="Experience Required"
          onChange={handleChange}
          value={job.experienceLevel}
          className="w-full p-3 border rounded mb-4"
        />

        <input
          name="skillsRequired"
          placeholder="Skills (comma separated)"
          onChange={handleChange}
          value={job.skillsRequired}
          className="w-full p-3 border rounded mb-4"
        />

        <textarea
          name="description"
          placeholder="Job Description"
          rows="4"
          onChange={handleChange}
          value={job.description}
          className="w-full p-3 border rounded mb-6"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Posting..." : "Post Job"}
        </button>
      </form>
    </div>
  );
};

export default PostJob;
