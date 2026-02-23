import { useEffect, useState } from "react";
import API from "../services/api";

const CandidateDashboard = () => {
  const [stats, setStats] = useState({
    appliedJobs: 0,
    underReview: 0,
    shortlisted: 0,
    interviews: 0,
  });
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [profile, setProfile] = useState({
    phone: "",
    skills: "",
    education: "",
    experience: "",
    profilePhoto: "",
    resumeFile: "",
  });

  const loadData = async () => {
    try {
      const [statsRes, appsRes, profileRes] = await Promise.all([
        API.get("/applications/candidate/stats"),
        API.get("/applications/me"),
        API.get("/users/me"),
      ]);

      setStats(statsRes.data?.stats || {});
      setApplications(appsRes.data?.applications || []);

      const cp = profileRes.data?.user?.candidateProfile || {};
      setProfile((prev) => ({
        ...prev,
        phone: cp.phone || "",
        skills: Array.isArray(cp.skills) ? cp.skills.join(", ") : "",
        education: cp.education || "",
        experience: cp.experience || "",
        profilePhoto: cp.profilePhoto || "",
        resumeFile: cp.resumeFile || "",
      }));
    } catch (_err) {
      // keep simple fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleProfileChange = (e) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const payload = {
        phone: profile.phone,
        skills: profile.skills,
        education: profile.education,
        experience: profile.experience,
      };
      await API.put("/users/me/candidate-profile", payload);
      alert("Profile updated");
      await loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Profile update failed");
    } finally {
      setProfileLoading(false);
    }
  };

  const uploadResume = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const form = new FormData();
    form.append("resume", file);

    setResumeUploading(true);
    try {
      await API.post("/users/me/candidate-profile/resume", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Resume uploaded");
      await loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Resume upload failed");
    } finally {
      setResumeUploading(false);
    }
  };

  const uploadPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const form = new FormData();
    form.append("photo", file);

    setPhotoUploading(true);
    try {
      await API.post("/users/me/candidate-profile/photo", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Profile photo uploaded");
      await loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Photo upload failed");
    } finally {
      setPhotoUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10 space-y-8">
      <h1 className="text-3xl font-bold">Candidate Dashboard</h1>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white p-6 shadow rounded">Applied: {loading ? "..." : stats.appliedJobs || 0}</div>
        <div className="bg-white p-6 shadow rounded">Under Review: {loading ? "..." : stats.underReview || 0}</div>
        <div className="bg-white p-6 shadow rounded">Shortlisted: {loading ? "..." : stats.shortlisted || 0}</div>
        <div className="bg-white p-6 shadow rounded">Interviews: {loading ? "..." : stats.interviews || 0}</div>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Profile Management</h2>

        <form onSubmit={saveProfile} className="grid md:grid-cols-2 gap-4">
          <input
            name="phone"
            value={profile.phone}
            onChange={handleProfileChange}
            placeholder="Phone"
            className="border p-2 rounded"
          />
          <input
            name="skills"
            value={profile.skills}
            onChange={handleProfileChange}
            placeholder="Skills (comma separated)"
            className="border p-2 rounded"
          />
          <input
            name="education"
            value={profile.education}
            onChange={handleProfileChange}
            placeholder="Education"
            className="border p-2 rounded"
          />
          <input
            name="experience"
            value={profile.experience}
            onChange={handleProfileChange}
            placeholder="Experience"
            className="border p-2 rounded"
          />

          <div className="md:col-span-2 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={profileLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
            >
              {profileLoading ? "Saving..." : "Save Profile"}
            </button>

            <label className="border px-4 py-2 rounded cursor-pointer">
              {resumeUploading ? "Uploading..." : "Upload Resume (PDF)"}
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={uploadResume}
              />
            </label>

            <label className="border px-4 py-2 rounded cursor-pointer">
              {photoUploading ? "Uploading..." : "Upload Photo"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={uploadPhoto}
              />
            </label>

            {profile.resumeFile && (
              <a
                href={`http://localhost:5000${profile.resumeFile}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600"
              >
                View Resume
              </a>
            )}

            {profile.profilePhoto && (
              <img
                src={`http://localhost:5000${profile.profilePhoto}`}
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover border"
              />
            )}
          </div>
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Applied Jobs (Status + Interview Schedule)</h2>

        <div className="space-y-3">
          {!loading && applications.length === 0 && (
            <div className="bg-white p-6 rounded shadow">No applications yet. Go apply from Jobs page.</div>
          )}

          {applications.map((app) => (
            <div key={app._id} className="bg-white p-6 rounded shadow">
              <div className="font-semibold">{app.job?.title || "Job"}</div>
              <div className="text-sm text-gray-600">
                {app.job?.companyName} ({app.job?.location})
              </div>
              <div className="text-sm mt-2">Status: {app.status}</div>

              {app.interview?.date && (
                <div className="mt-3 text-sm bg-blue-50 p-3 rounded space-y-1">
                  <div className="font-medium">Interview Schedule</div>
                  <div>Date: {app.interview.date}</div>
                  <div>Time: {app.interview.time}</div>
                  <div>Mode: {app.interview.mode || "-"}</div>
                  {app.interview.meetingLink && (
                    <div>
                      Link:{" "}
                      <a
                        className="text-blue-600"
                        href={app.interview.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Join Interview
                      </a>
                    </div>
                  )}
                  {app.interview.notes && <div>Notes: {app.interview.notes}</div>}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;
