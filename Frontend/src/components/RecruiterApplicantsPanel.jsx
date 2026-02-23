import { useEffect, useState } from "react";
import API from "../services/api";

const statusOptions = [
  "Applied",
  "Under Review",
  "Shortlisted",
  "Interview Scheduled",
  "Selected",
  "Rejected",
];

const RecruiterApplicantsPanel = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [interviewForm, setInterviewForm] = useState({});

  const loadApplications = async () => {
    try {
      const res = await API.get("/applications/recruiter/all");
      setApplications(res.data?.applications || []);
    } catch (_err) {
      // keep empty for simple UI
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/applications/${id}/status`, { status });
      loadApplications();
    } catch (err) {
      alert(err.response?.data?.message || "Status update failed");
    }
  };

  const scheduleInterview = async (id) => {
    try {
      await API.patch(`/applications/${id}/interview`, interviewForm[id] || {});
      alert("Interview scheduled");
      loadApplications();
    } catch (err) {
      alert(err.response?.data?.message || "Interview scheduling failed");
    }
  };

  const setInterviewValue = (id, key, value) => {
    setInterviewForm((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [key]: value },
    }));
  };

  if (loading) return <div className="bg-white p-6 rounded shadow">Loading applicants...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Applicants</h2>

      {applications.length === 0 && (
        <div className="bg-white p-6 rounded shadow">No applications received yet.</div>
      )}

      {applications.map((app) => (
        <div key={app._id} className="bg-white p-6 rounded shadow space-y-3">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
            <div>
              <div className="font-semibold">{app.applicantName}</div>
              <div className="text-sm text-gray-600">{app.applicantEmail} | {app.applicantPhone}</div>
              <div className="text-sm text-gray-600">
                Job: {app.job?.title} ({app.job?.companyName})
              </div>
              <div className="text-sm text-gray-600">
                Applied: {new Date(app.appliedAt || app.createdAt).toLocaleString()}
              </div>
              {app.resumeFile && (
                <a
                  href={`http://localhost:5000${app.resumeFile}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 text-sm"
                >
                  Download Resume
                </a>
              )}
            </div>

            <div className="flex items-center gap-2">
              <select
                value={app.status}
                onChange={(e) => updateStatus(app._id, e.target.value)}
                className="border p-2 rounded"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-5 gap-2">
            <input
              type="date"
              className="border p-2 rounded"
              value={interviewForm[app._id]?.date || app.interview?.date || ""}
              onChange={(e) => setInterviewValue(app._id, "date", e.target.value)}
            />
            <input
              type="time"
              className="border p-2 rounded"
              value={interviewForm[app._id]?.time || app.interview?.time || ""}
              onChange={(e) => setInterviewValue(app._id, "time", e.target.value)}
            />
            <select
              className="border p-2 rounded"
              value={interviewForm[app._id]?.mode || app.interview?.mode || ""}
              onChange={(e) => setInterviewValue(app._id, "mode", e.target.value)}
            >
              <option value="">Mode</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
            <input
              placeholder="Meeting link"
              className="border p-2 rounded"
              value={interviewForm[app._id]?.meetingLink || app.interview?.meetingLink || ""}
              onChange={(e) => setInterviewValue(app._id, "meetingLink", e.target.value)}
            />
            <button
              onClick={() => scheduleInterview(app._id)}
              className="bg-blue-600 text-white rounded px-3 py-2"
            >
              Schedule
            </button>
          </div>

          <textarea
            placeholder="Notes"
            className="w-full border p-2 rounded"
            value={interviewForm[app._id]?.notes || app.interview?.notes || ""}
            onChange={(e) => setInterviewValue(app._id, "notes", e.target.value)}
          />
        </div>
      ))}
    </div>
  );
};

export default RecruiterApplicantsPanel;
