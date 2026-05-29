import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import RecruiterApplicantsPanel from "../components/RecruiterApplicantsPanel";
import { useAuth } from "../context/AuthContext";
import { 
  LayoutDashboard, Briefcase, Users, Video, LifeBuoy, 
  PlusCircle, CheckCircle2, XCircle, Calendar, MapPin, 
  Mail, ExternalLink, Power, RefreshCw
} from "lucide-react";

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    jobsPosted: 0,
    applications: 0,
    shortlisted: 0,
    interviewsScheduled: 0,
  });
  const [jobs, setJobs] = useState([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [statsRes, jobsRes, appsRes, ticketsRes] = await Promise.all([
        API.get("/jobs/recruiter/dashboard/stats").catch(() => ({ data: { stats: {} } })),
        API.get("/jobs/recruiter/my-jobs").catch(() => ({ data: { jobs: [] } })),
        API.get("/applications/recruiter/all").catch(() => ({ data: { applications: [] } })),
        API.get("/contact/my-tickets").catch(() => ({ data: { messages: [] } })),
      ]);
      setStats(statsRes.data?.stats || {});
      setJobs(jobsRes.data?.jobs || []);
      setTickets(ticketsRes.data?.messages || []);
      
      const upcoming = (appsRes.data?.applications || [])
        .filter((app) => app.interview?.date)
        .map((app) => ({
          id: app._id,
          jobTitle: app.job?.title || "Job",
          candidate: app.applicantName || app.candidate?.name || "Candidate",
          date: app.interview?.date,
          time: app.interview?.time || "",
          mode: app.interview?.mode || "",
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5);
      setUpcomingInterviews(upcoming);
    } catch (_err) {
      toast.error("Failed to load dashboard data");
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
      toast.success(`Job marked as ${nextStatus}`);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update job status");
    }
  };

  const deleteJob = async (jobId) => {
    const ok = window.confirm("Are you sure you want to permanently delete this job?");
    if (!ok) return;

    try {
      await API.delete(`/jobs/${jobId}`);
      toast.success("Job deleted successfully");
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete job");
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "jobs", label: "Manage Jobs", icon: Briefcase },
    { id: "applicants", label: "Applicants", icon: Users },
    { id: "interviews", label: "Interviews", icon: Video },
    { id: "support", label: "Support", icon: LifeBuoy },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2 text-blue-600 font-semibold text-lg">
          <RefreshCw className="animate-spin" /> Loading your dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 md:min-h-screen p-6 shadow-sm z-10 flex-shrink-0">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-black text-xl border border-indigo-200">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="font-bold text-gray-900 line-clamp-1">{user?.name}</h2>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">Recruiter</span>
          </div>
        </div>
        
        <nav className="flex md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 snap-x hide-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all min-w-[140px] md:min-w-0 snap-start ${
                  isActive 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200 font-bold" 
                  : "bg-transparent text-gray-600 hover:bg-gray-100 font-medium"
                }`}
              >
                <Icon size={20} />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
             <h1 className="text-3xl font-extrabold text-gray-900">
                {tabs.find(t => t.id === activeTab)?.label}
             </h1>
          </div>
          <Link 
            to="/post-job" 
            className="bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 flex items-center gap-2"
          >
            <PlusCircle size={20} /> Post New Job
          </Link>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* 1. OVERVIEW TAB */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <Briefcase className="text-blue-500 mb-4" size={28} />
                    <div className="text-3xl md:text-4xl font-black text-gray-900 mb-1">{stats.jobsPosted}</div>
                    <div className="text-sm font-semibold text-gray-400">Active Jobs</div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <Users className="text-indigo-500 mb-4" size={28} />
                    <div className="text-3xl md:text-4xl font-black text-gray-900 mb-1">{stats.applications}</div>
                    <div className="text-sm font-semibold text-gray-400">Total Applicants</div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <CheckCircle2 className="text-green-500 mb-4" size={28} />
                    <div className="text-3xl md:text-4xl font-black text-gray-900 mb-1">{stats.shortlisted}</div>
                    <div className="text-sm font-semibold text-gray-400">Shortlisted</div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <Video className="text-purple-500 mb-4" size={28} />
                    <div className="text-3xl md:text-4xl font-black text-gray-900 mb-1">{stats.interviewsScheduled}</div>
                    <div className="text-sm font-semibold text-gray-400">Interviews Setup</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Quick Glance Jobs */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-lg text-gray-900">Recent Postings</h3>
                      <button onClick={() => setActiveTab('jobs')} className="text-sm text-blue-600 font-bold hover:underline">View All</button>
                    </div>
                    {jobs.length === 0 ? (
                      <div className="text-center py-6 text-gray-500 text-sm">No jobs posted yet.</div>
                    ) : (
                      <div className="space-y-3">
                        {jobs.slice(0, 3).map(job => (
                          <div key={job._id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                            <div>
                              <div className="font-bold text-gray-900">{job.title}</div>
                              <div className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={12}/> {job.location}</div>
                            </div>
                            <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded ${job.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{job.status}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Quick Glance Interviews */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-lg text-gray-900">Upcoming Interviews</h3>
                      <button onClick={() => setActiveTab('interviews')} className="text-sm text-blue-600 font-bold hover:underline">View All</button>
                    </div>
                    {upcomingInterviews.length === 0 ? (
                      <div className="text-center py-6 text-gray-500 text-sm">No interviews scheduled.</div>
                    ) : (
                      <div className="space-y-3">
                        {upcomingInterviews.slice(0, 3).map(item => (
                          <div key={item.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                             <div>
                              <div className="font-bold text-gray-900">{item.candidate}</div>
                              <div className="text-xs text-gray-500 font-medium">{item.jobTitle}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs font-bold text-blue-600">{item.date}</div>
                              <div className="text-xs text-gray-500">{item.time}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 2. MANAGE JOBS TAB */}
            {activeTab === "jobs" && (
              <div className="space-y-6">
                {jobs.length === 0 ? (
                  <div className="bg-white p-12 rounded-3xl text-center border border-gray-200 shadow-sm">
                    <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-700">No jobs posted yet.</h3>
                    <p className="text-gray-500 mt-2 mb-6">Create your first job listing to start receiving applications.</p>
                    <Link to="/post-job" className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition">Post a Job</Link>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map((job) => (
                      <div key={job._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all flex flex-col justify-between group">
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full ${job.status === 'open' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
                              {job.status}
                            </span>
                            <button onClick={() => deleteJob(job._id)} className="text-gray-400 hover:text-red-600 bg-gray-50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" title="Delete Job">
                              <XCircle size={18} />
                            </button>
                          </div>
                          
                          <h3 className="font-bold text-xl text-gray-900 mb-1">{job.title}</h3>
                          <div className="text-sm font-medium text-gray-500 mb-4 flex items-center gap-1.5"><Building2 size={14}/> {job.companyName}</div>
                          
                          <div className="flex flex-wrap gap-2 mb-6">
                            <span className="text-xs font-semibold text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-100 flex items-center gap-1"><MapPin size={12}/> {job.location}</span>
                            <span className="text-xs font-semibold text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-100">{job.type}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => toggleJobStatus(job)}
                          className={`w-full py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors ${
                            job.status === "open" 
                            ? "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200" 
                            : "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                          }`}
                        >
                          <Power size={18} /> {job.status === "open" ? "Close Job" : "Re-open Job"}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. APPLICANTS TAB */}
            {activeTab === "applicants" && (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <RecruiterApplicantsPanel />
              </div>
            )}

            {/* 4. INTERVIEWS TAB */}
            {activeTab === "interviews" && (
              <div className="space-y-6">
                {upcomingInterviews.length === 0 ? (
                  <div className="bg-white p-12 rounded-3xl text-center border border-gray-200 shadow-sm">
                    <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-700">No upcoming interviews.</h3>
                    <p className="text-gray-500 mt-2">Schedule interviews from the Applicants tab.</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                      <h3 className="font-bold text-gray-900">Scheduled Interviews</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {upcomingInterviews.map((item) => (
                        <div key={item.id} className="p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                              {item.candidate.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900 text-lg">{item.candidate}</h4>
                              <p className="text-sm text-gray-500 font-medium">{item.jobTitle}</p>
                            </div>
                          </div>
                          
                          <div className="flex flex-col sm:items-end gap-1 bg-white sm:bg-transparent p-3 sm:p-0 rounded-lg border sm:border-none border-gray-200">
                            <div className="flex items-center gap-2 text-gray-900 font-bold">
                              <Calendar size={16} className="text-blue-500"/> {item.date}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Clock size={14} /> {item.time || "Time TBD"} {item.mode && `• ${item.mode}`}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 5. SUPPORT TAB */}
            {activeTab === "support" && (
              <div className="space-y-6">
                <div className="flex justify-end">
                  <Link to="/contact" className="bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-md">
                    New Ticket
                  </Link>
                </div>

                {tickets.length === 0 ? (
                  <div className="bg-white p-12 rounded-3xl text-center border border-gray-200 shadow-sm">
                    <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-700">No support tickets.</h3>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tickets.map((ticket) => (
                      <div key={ticket._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4" style={{borderLeftColor: ticket.status === 'resolved' ? '#16a34a' : ticket.status === 'in_progress' ? '#d97706' : '#2563eb'}}>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-bold text-lg text-gray-900">{ticket.subject}</h3>
                            <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${ticket.status === 'resolved' ? 'bg-green-100 text-green-700' : ticket.status === 'in_progress' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                              {ticket.status.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 font-mono mb-3">ID: {ticket.ticketId || ticket._id.substring(0,8)}</p>
                          <p className="text-gray-700 text-sm line-clamp-2 bg-gray-50 p-3 rounded-lg border border-gray-100">{ticket.message}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Created</div>
                          <div className="font-medium text-gray-900">{new Date(ticket.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
          </motion.div>
        </AnimatePresence>
      </main>
      
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default RecruiterDashboard;
