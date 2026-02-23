import { useEffect, useState } from "react";
import API from "../services/api";

const ApplyJobModal = ({ job, user, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    applicantName: "",
    applicantEmail: "",
    applicantPhone: "",
    coverLetter: "",
    resume: null,
  });

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      applicantName: user?.name || "",
      applicantEmail: user?.email || "",
    }));
  }, [user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const body = new FormData();
      body.append("applicantName", form.applicantName);
      body.append("applicantEmail", form.applicantEmail);
      body.append("applicantPhone", form.applicantPhone);
      body.append("coverLetter", form.coverLetter);
      if (form.resume) body.append("resume", form.resume);

      await API.post(`/applications/job/${job._id}/apply`, body, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Application submitted");
      onSuccess?.();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to apply");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Apply for {job.title}</h3>
          <button onClick={onClose} className="text-gray-500">X</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="applicantName"
            value={form.applicantName}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Full Name"
            required
          />
          <input
            name="applicantEmail"
            type="email"
            value={form.applicantEmail}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Email"
            required
          />
          <input
            name="applicantPhone"
            value={form.applicantPhone}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Phone"
            required
          />
          <textarea
            name="coverLetter"
            value={form.coverLetter}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Cover letter (optional)"
            rows="3"
          />
          <input
            name="resume"
            type="file"
            accept="application/pdf"
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyJobModal;
