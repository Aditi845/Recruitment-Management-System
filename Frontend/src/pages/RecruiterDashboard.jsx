import { Link } from "react-router-dom";

const RecruiterDashboard = () => {
  return (
    <div className="p-10 bg-gray-100 min-h-screen">

      <h1 className="text-3xl font-bold mb-6">
        Recruiter Dashboard
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mb-10">

        <div className="bg-white p-6 shadow rounded-xl">
          Jobs Posted: 4
        </div>

        <div className="bg-white p-6 shadow rounded-xl">
          Applications Received: 23
        </div>

        <div className="bg-white p-6 shadow rounded-xl">
          Candidates Shortlisted: 6
        </div>

      </div>

      <Link
        to="/post-job"
        className="bg-blue-600 text-white px-6 py-3 rounded"
      >
        Post New Job
      </Link>

    </div>
  );
};

export default RecruiterDashboard;
