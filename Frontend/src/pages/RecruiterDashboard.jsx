import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import RecruiterApplicantsPanel from "../components/RecruiterApplicantsPanel";

const RecruiterDashboard = () => {
  const [stats, setStats] = useState({
    jobsPosted: 0,
    applications: 0,
    shortlisted: 0,
    interviewsScheduled: 0,
  });
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [statsRes, jobsRes] = await Promise.all([
        API.get("/jobs/recruiter/dashboard/stats"),
        API.get("/jobs/recruiter/my-jobs"),
      ]);
      setStats(statsRes.data?.stats || {});
      setJobs(jobsRes.data?.jobs || []);
    } catch (_err) {
      // simple fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleJobStatus = async (job) => {
    try {
      const nextStatus = job.status === "open" ? "closed" : "open";
      await API.put(`/jobs/${job._id}`, { status: nextStatus });
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update job");
    }
  };

  const deleteJob = async (jobId) => {
    const ok = window.confirm("Delete this job?");
    if (!ok) return;

    try {
      await API.delete(`/jobs/${jobId}`);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete job");
    }
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Recruiter Dashboard</h1>
        <Link to="/post-job" className="bg-blue-600 text-white px-6 py-3 rounded">
          Post New Job
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 shadow rounded-xl">Jobs Posted: {loading ? "..." : stats.jobsPosted}</div>
        <div className="bg-white p-6 shadow rounded-xl">Applications: {loading ? "..." : stats.applications}</div>
        <div className="bg-white p-6 shadow rounded-xl">Shortlisted: {loading ? "..." : stats.shortlisted}</div>
        <div className="bg-white p-6 shadow rounded-xl">Interviews: {loading ? "..." : stats.interviewsScheduled}</div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Manage Jobs</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <div key={job._id} className="bg-white p-5 rounded shadow space-y-2">
              <div className="font-semibold">{job.title}</div>
              <div className="text-sm text-gray-600">{job.companyName}</div>
              <div className="text-sm text-gray-600">{job.location} | {job.type}</div>
              <div className="text-sm">Status: {job.status}</div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => toggleJobStatus(job)}
                  className="px-3 py-2 rounded bg-amber-500 text-white"
                >
                  {job.status === "open" ? "Close Job" : "Open Job"}
                </button>
                <button
                  onClick={() => deleteJob(job._id)}
                  className="px-3 py-2 rounded bg-red-600 text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {!loading && jobs.length === 0 && (
            <div className="bg-white p-5 rounded shadow">No jobs posted yet.</div>
          )}
        </div>
      </div>

      <RecruiterApplicantsPanel />
    </div>
  );
};

export default RecruiterDashboard;
