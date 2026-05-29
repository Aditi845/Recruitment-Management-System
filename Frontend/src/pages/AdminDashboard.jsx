import { useEffect, useMemo, useState } from "react";
import API from "../services/api";

const tabs = ["Users", "Jobs", "Companies", "Applications", "Contacts"];

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    jobs: 0,
    companies: 0,
    applications: 0,
    contacts: 0,
  });
  const [data, setData] = useState({
    users: [],
    jobs: [],
    companies: [],
    applications: [],
    contacts: [],
  });
  const [activeTab, setActiveTab] = useState("Users");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [
        statsRes,
        usersRes,
        jobsRes,
        companiesRes,
        applicationsRes,
        contactsRes,
      ] = await Promise.all([
        API.get("/admin/dashboard"),
        API.get("/admin/users"),
        API.get("/admin/jobs"),
        API.get("/admin/companies"),
        API.get("/admin/applications"),
        API.get("/contact"),
      ]);

      setStats({
        ...(statsRes.data?.stats || {}),
        contacts: contactsRes.data?.messages?.length || 0,
      });
      setData({
        users: usersRes.data?.users || [],
        jobs: jobsRes.data?.jobs || [],
        companies: companiesRes.data?.companies || [],
        applications: applicationsRes.data?.applications || [],
        contacts: contactsRes.data?.messages || [],
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateContactStatus = async (id, status) => {
    try {
      await API.patch(`/contact/${id}/status`, { status });
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return data[activeTab.toLowerCase()] || [];

    return (data[activeTab.toLowerCase()] || []).filter((item) =>
      JSON.stringify(item).toLowerCase().includes(query)
    );
  }, [activeTab, data, search]);

  return (
    <div className="p-10 bg-gray-100 min-h-screen space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Admin Dashboard</h2>
        <button onClick={loadData} className="border px-4 py-2 rounded">
          Refresh
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded">{error}</div>}

      <div className="grid md:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded shadow text-center">
          <div className="text-2xl font-bold">{stats.users}</div>
          <div className="text-gray-600">Users</div>
        </div>
        <div className="bg-white p-5 rounded shadow text-center">
          <div className="text-2xl font-bold">{stats.jobs}</div>
          <div className="text-gray-600">Jobs</div>
        </div>
        <div className="bg-white p-5 rounded shadow text-center">
          <div className="text-2xl font-bold">{stats.companies}</div>
          <div className="text-gray-600">Companies</div>
        </div>
        <div className="bg-white p-5 rounded shadow text-center">
          <div className="text-2xl font-bold">{stats.applications}</div>
          <div className="text-gray-600">Applications</div>
        </div>
        <div className="bg-white p-5 rounded shadow text-center">
          <div className="text-2xl font-bold">{stats.contacts}</div>
          <div className="text-gray-600">Contacts</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow space-y-4">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded ${
                activeTab === tab ? "bg-blue-600 text-white" : "border"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search ${activeTab.toLowerCase()}...`}
          className="border p-2 rounded w-full md:max-w-md"
        />
      </div>

      {loading && <div>Loading data...</div>}

      {!loading && activeTab === "Users" && (
        <div className="bg-white p-4 rounded shadow">
          <div className="grid grid-cols-3 gap-3 text-sm font-semibold border-b pb-2">
            <div>Name</div>
            <div>Email</div>
            <div>Role</div>
          </div>
          <div className="space-y-2 pt-2 text-sm">
            {filteredRows.map((u) => (
              <div key={u._id} className="grid grid-cols-3 gap-3">
                <div>{u.name}</div>
                <div>{u.email}</div>
                <div>{u.role}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && activeTab === "Jobs" && (
        <div className="bg-white p-4 rounded shadow">
          <div className="grid grid-cols-4 gap-3 text-sm font-semibold border-b pb-2">
            <div>Title</div>
            <div>Company</div>
            <div>Status</div>
            <div>Posted By</div>
          </div>
          <div className="space-y-2 pt-2 text-sm">
            {filteredRows.map((j) => (
              <div key={j._id} className="grid grid-cols-4 gap-3">
                <div>{j.title}</div>
                <div>{j.companyName}</div>
                <div>{j.status}</div>
                <div>{j.postedBy?.name || "-"}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && activeTab === "Companies" && (
        <div className="bg-white p-4 rounded shadow">
          <div className="grid grid-cols-4 gap-3 text-sm font-semibold border-b pb-2">
            <div>Name</div>
            <div>Website</div>
            <div>Location</div>
            <div>Recruiter</div>
          </div>
          <div className="space-y-2 pt-2 text-sm">
            {filteredRows.map((c) => (
              <div key={c._id} className="grid grid-cols-4 gap-3">
                <div>{c.name}</div>
                <div>{c.website || "-"}</div>
                <div>{c.location || "-"}</div>
                <div>{c.recruiter?.name || "-"}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && activeTab === "Applications" && (
        <div className="bg-white p-4 rounded shadow">
          <div className="grid grid-cols-4 gap-3 text-sm font-semibold border-b pb-2">
            <div>Candidate</div>
            <div>Job</div>
            <div>Status</div>
            <div>Applied At</div>
          </div>
          <div className="space-y-2 pt-2 text-sm">
            {filteredRows.map((a) => (
              <div key={a._id} className="grid grid-cols-4 gap-3">
                <div>{a.candidate?.name || "-"}</div>
                <div>{a.job?.title || "-"}</div>
                <div>{a.status}</div>
                <div>{new Date(a.appliedAt || a.createdAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && activeTab === "Contacts" && (
        <div className="bg-white p-4 rounded shadow overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-7 gap-3 text-sm font-semibold border-b pb-2">
              <div>Ticket ID</div>
              <div>User Details</div>
              <div>Subject / Message</div>
              <div>Category / Priority</div>
              <div>Attachments</div>
              <div>Status</div>
              <div>Actions</div>
            </div>
            <div className="space-y-3 pt-2 text-sm">
              {filteredRows.map((c) => (
                <div key={c._id} className="grid grid-cols-7 gap-3 items-start border-b border-gray-50 pb-3">
                  <div className="font-mono text-xs font-bold text-blue-600">{c.ticketId || c._id.substring(0, 8)}</div>
                  <div>
                    <div className="font-semibold">{c.name}</div>
                    <div className="text-xs text-gray-500 break-all">{c.email}</div>
                  </div>
                  <div>
                    <div className="font-medium">{c.subject}</div>
                    <div className="text-xs text-gray-500 line-clamp-2" title={c.message}>{c.message}</div>
                  </div>
                  <div>
                    <div className="text-xs bg-gray-100 rounded px-2 py-1 inline-block mb-1">{c.category}</div>
                    <div>
                      <span className={`text-xs font-bold ${c.priority === 'High' ? 'text-red-600' : c.priority === 'Medium' ? 'text-amber-600' : 'text-green-600'}`}>
                        {c.priority || "Medium"}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs">
                    {c.attachments?.length > 0 ? (
                      <span className="text-blue-600 font-semibold">{c.attachments.length} files</span>
                    ) : (
                      <span className="text-gray-400">None</span>
                    )}
                  </div>
                  <div>
                    <span
                      className={`inline-flex rounded px-2 py-1 text-xs font-semibold ${
                        c.emailStatus === "sent"
                          ? "bg-green-50 text-green-700"
                          : c.emailStatus === "failed"
                          ? "bg-red-50 text-red-700"
                          : c.emailStatus === "not_configured"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                      title={c.emailError || c.emailStatus}
                    >
                      Mail: {c.emailStatus || "pending"}
                    </span>
                  </div>
                  <div>
                    <select
                      value={c.status}
                      onChange={(e) => updateContactStatus(c._id, e.target.value)}
                      className="border p-1 rounded text-xs w-full mb-1"
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                    {c.history && c.history.length > 0 && (
                      <div className="text-[10px] text-gray-400">
                        Last updated: {new Date(c.history[c.history.length-1].updatedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
