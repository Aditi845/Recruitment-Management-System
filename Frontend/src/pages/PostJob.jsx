import { useState } from "react";

const PostJob = () => {

  const [job, setJob] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    type: "",
    experience: "",
    description: "",
  });

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(job); // later goes to backend
    alert("Job Posted Successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-10">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">
          Post a New Job
        </h2>

        {/* Job Title */}
        <input
          name="title"
          placeholder="Job Title"
          onChange={handleChange}
          className="w-full p-3 border rounded mb-4"
        />

        {/* Company */}
        <input
          name="company"
          placeholder="Company Name"
          onChange={handleChange}
          className="w-full p-3 border rounded mb-4"
        />

        {/* Location */}
        <input
          name="location"
          placeholder="Location"
          onChange={handleChange}
          className="w-full p-3 border rounded mb-4"
        />

        {/* Salary */}
        <input
          name="salary"
          placeholder="Salary"
          onChange={handleChange}
          className="w-full p-3 border rounded mb-4"
        />

        {/* Job Type */}
        <select
          name="type"
          onChange={handleChange}
          className="w-full p-3 border rounded mb-4"
        >
          <option value="">Select Job Type</option>
          <option>Full Time</option>
          <option>Part Time</option>
          <option>Internship</option>
          <option>Remote</option>
        </select>

        {/* Experience */}
        <input
          name="experience"
          placeholder="Experience Required"
          onChange={handleChange}
          className="w-full p-3 border rounded mb-4"
        />

        {/* Description */}
        <textarea
          name="description"
          placeholder="Job Description"
          rows="4"
          onChange={handleChange}
          className="w-full p-3 border rounded mb-6"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
        >
          Post Job
        </button>
      </form>

    </div>
  );
};

export default PostJob;
