import JobCard from "../components/JobCard";

const jobs = [
  { id: 1, title: "React Developer", company: "Infosys", location: "Pune", type:"Full Time"},
  { id: 2, title: "Backend Engineer", company: "TCS", location: "Hyderabad", type:"Remote"},
  { id: 3, title: "UI Designer", company: "Wipro", location: "Bangalore", type:"Internship"},
];

const Jobs = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-4xl font-bold mb-6">Find Jobs</h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded shadow mb-8 flex gap-4">
        <select className="border p-2 rounded">
          <option>All Categories</option>
          <option>IT</option>
          <option>Marketing</option>
        </select>

        <select className="border p-2 rounded">
          <option>Experience</option>
          <option>Fresher</option>
          <option>1-3 Years</option>
        </select>
      </div>

      {/* Job Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {jobs.map(job => (
          <JobCard key={job.id} job={job}/>
        ))}
      </div>

    </div>
  );
};

export default Jobs;
