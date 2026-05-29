import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { 
  LayoutDashboard, UserCircle, Briefcase, Bookmark, LifeBuoy, 
  CheckCircle2, Clock, XCircle, Video, FileText, Camera, Save, Phone, MapPin, Mail, ExternalLink, RefreshCw
} from "lucide-react";

const CandidateDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState("overview");
  
  const [stats, setStats] = useState({
    appliedJobs: 0,
    underReview: 0,
    shortlisted: 0,
    interviews: 0,
  });
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [tickets, setTickets] = useState([]);
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
      const [statsRes, appsRes, profileRes, ticketsRes] = await Promise.all([
        API.get("/applications/candidate/stats").catch(() => ({ data: { stats: {} } })),
        API.get("/applications/me").catch(() => ({ data: { applications: [] } })),
        API.get("/users/me").catch(() => ({ data: { user: {} } })),
        API.get("/contact/my-tickets").catch(() => ({ data: { messages: [] } })),
      ]);

      setStats(statsRes.data?.stats || {});
      setApplications(appsRes.data?.applications || []);
      setTickets(ticketsRes.data?.messages || []);

      const userData = profileRes.data?.user || {};
      const cp = userData.candidateProfile || {};
      
      setSavedJobs(userData.savedJobs || []);
      
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
      toast.error("Failed to load dashboard data");
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
      toast.success("Profile updated successfully");
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Profile update failed");
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
      toast.success("Resume uploaded successfully");
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Resume upload failed");
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
      toast.success("Profile photo uploaded");
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Photo upload failed");
    } finally {
      setPhotoUploading(false);
    }
  };

  const removeSavedJob = async (jobId) => {
    try {
      const res = await API.put("/users/me/saved-jobs", { jobId });
      setSavedJobs(res.data.savedJobs || []);
      toast.info("Job removed from saved list");
      await loadData(); // Reload to get populated jobs
    } catch (err) {
      toast.error("Failed to remove saved job");
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "profile", label: "Profile", icon: UserCircle },
    { id: "applications", label: "Applications", icon: Briefcase },
    { id: "saved", label: "Saved Jobs", icon: Bookmark },
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
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-black text-xl border border-blue-200">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="font-bold text-gray-900 line-clamp-1">{user?.name}</h2>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">Candidate</span>
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
                <div>
                  <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome back, {user?.name.split(' ')[0]}</h1>
                  <p className="text-gray-500">Here is what's happening with your job search today.</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <Briefcase className="text-blue-500 mb-4" size={28} />
                    <div className="text-3xl font-black text-gray-900 mb-1">{stats.appliedJobs}</div>
                    <div className="text-sm font-semibold text-gray-400">Total Applied</div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <Clock className="text-amber-500 mb-4" size={28} />
                    <div className="text-3xl font-black text-gray-900 mb-1">{stats.underReview}</div>
                    <div className="text-sm font-semibold text-gray-400">Under Review</div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <CheckCircle2 className="text-green-500 mb-4" size={28} />
                    <div className="text-3xl font-black text-gray-900 mb-1">{stats.shortlisted}</div>
                    <div className="text-sm font-semibold text-gray-400">Shortlisted</div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <Video className="text-purple-500 mb-4" size={28} />
                    <div className="text-3xl font-black text-gray-900 mb-1">{stats.interviews}</div>
                    <div className="text-sm font-semibold text-gray-400">Interviews</div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl shadow-blue-900/20 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                   <div className="relative z-10">
                     <h3 className="text-2xl font-bold mb-2">Need a competitive edge?</h3>
                     <p className="text-blue-100 max-w-lg">Check out our Career Services to build a professional PDF resume and practice with AI flashcards.</p>
                   </div>
                   <button onClick={() => navigate('/services')} className="relative z-10 bg-white text-blue-700 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors whitespace-nowrap shadow-lg">
                     Explore Services
                   </button>
                </div>
              </div>
            )}

            {/* 2. PROFILE TAB */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-extrabold text-gray-900 mb-2">My Profile</h2>
                  <p className="text-gray-500">Update your information to stand out to recruiters.</p>
                </div>

                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                  <form onSubmit={saveProfile} className="space-y-6 max-w-3xl">
                    
                    <div className="flex flex-col md:flex-row gap-6 mb-8">
                       <div className="w-24 h-24 rounded-2xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative group">
                          {profile.profilePhoto ? (
                             <img src={`http://localhost:5000${profile.profilePhoto}`} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                             <UserCircle className="text-gray-400 w-12 h-12" />
                          )}
                          <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                            <Camera size={20} className="mb-1" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Change</span>
                            <input type="file" accept="image/*" className="hidden" onChange={uploadPhoto} />
                          </label>
                       </div>
                       <div className="flex flex-col justify-center">
                          <h3 className="font-bold text-gray-900 text-xl">{user?.name}</h3>
                          <p className="text-gray-500 text-sm mb-3">{user?.email}</p>
                          <label className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-semibold text-sm cursor-pointer hover:bg-blue-100 border border-blue-100 transition-colors">
                            {resumeUploading ? <RefreshCw className="animate-spin w-4 h-4" /> : <FileText className="w-4 h-4" />}
                            {profile.resumeFile ? "Update Resume (PDF)" : "Upload Resume (PDF)"}
                            <input type="file" accept="application/pdf" className="hidden" onChange={uploadResume} />
                          </label>
                          {profile.resumeFile && (
                            <a href={`http://localhost:5000${profile.resumeFile}`} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline mt-2 inline-flex items-center gap-1">
                              View current resume <ExternalLink size={10} />
                            </a>
                          )}
                       </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input name="phone" value={profile.phone} onChange={handleProfileChange} className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Core Skills</label>
                        <input name="skills" value={profile.skills} onChange={handleProfileChange} placeholder="e.g. React, Node.js, Python" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Education</label>
                        <input name="education" value={profile.education} onChange={handleProfileChange} placeholder="e.g. BS Computer Science, MIT" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Experience</label>
                        <textarea name="experience" value={profile.experience} onChange={handleProfileChange} placeholder="Describe your past roles..." rows="4" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-end">
                      <button type="submit" disabled={profileLoading} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition flex items-center gap-2 shadow-md shadow-blue-200 disabled:opacity-70">
                        {profileLoading ? <RefreshCw className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* 3. APPLICATIONS TAB */}
            {activeTab === "applications" && (
              <div className="space-y-6">
                 <div>
                  <h2 className="text-3xl font-extrabold text-gray-900 mb-2">My Applications</h2>
                  <p className="text-gray-500">Track the status of roles you have applied for.</p>
                </div>

                {applications.length === 0 ? (
                  <div className="bg-white p-12 rounded-3xl text-center border border-gray-200 shadow-sm">
                    <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-700">No applications yet.</h3>
                    <button onClick={() => navigate('/jobs')} className="mt-4 text-blue-600 font-bold hover:underline">Browse open jobs</button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.map((app) => (
                      <div key={app._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-4">
                          <div>
                            <h3 className="font-bold text-xl text-gray-900">{app.job?.title || "Job Unavailable"}</h3>
                            <div className="text-sm font-medium text-gray-500 flex items-center gap-1 mt-1">
                              <Building2 size={14} /> {app.job?.companyName} • <MapPin size={14} className="ml-2" /> {app.job?.location}
                            </div>
                          </div>
                          <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
                            app.status === 'applied' ? 'bg-gray-100 text-gray-600 border-gray-200' :
                            app.status === 'under_review' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                            app.status === 'shortlisted' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                            app.status === 'interview' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                            app.status === 'hired' ? 'bg-green-100 text-green-700 border-green-200' :
                            'bg-red-100 text-red-700 border-red-200'
                          }`}>
                            {app.status.replace('_', ' ')}
                          </div>
                        </div>

                        {app.interview?.date && (
                          <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-4 rounded-xl">
                            <h4 className="font-bold text-blue-800 flex items-center gap-2 mb-3">
                              <Video size={18} /> Interview Scheduled
                            </h4>
                            <div className="grid md:grid-cols-3 gap-4 text-sm text-blue-900">
                              <div><span className="font-semibold text-blue-700/70 block text-xs uppercase tracking-wider mb-0.5">Date & Time</span> {app.interview.date} at {app.interview.time}</div>
                              <div><span className="font-semibold text-blue-700/70 block text-xs uppercase tracking-wider mb-0.5">Mode</span> {app.interview.mode || "Not specified"}</div>
                              {app.interview.meetingLink && (
                                <div>
                                  <span className="font-semibold text-blue-700/70 block text-xs uppercase tracking-wider mb-0.5">Link</span>
                                  <a href={app.interview.meetingLink} target="_blank" rel="noreferrer" className="text-blue-600 font-bold hover:underline flex items-center gap-1">
                                    Join Meeting <ExternalLink size={12}/>
                                  </a>
                                </div>
                              )}
                            </div>
                            {app.interview.notes && <p className="text-sm mt-3 text-blue-800 bg-white/50 p-2 rounded-lg border border-blue-100/50"><strong>Note:</strong> {app.interview.notes}</p>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 4. SAVED JOBS TAB */}
            {activeTab === "saved" && (
              <div className="space-y-6">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Saved Jobs</h2>
                    <p className="text-gray-500">Jobs you've bookmarked for later.</p>
                  </div>
                  <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold border border-blue-200">
                    {savedJobs.length} Saved
                  </div>
                </div>

                {savedJobs.length === 0 ? (
                  <div className="bg-white p-12 rounded-3xl text-center border border-gray-200 shadow-sm">
                    <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-700">No saved jobs.</h3>
                    <button onClick={() => navigate('/jobs')} className="mt-4 text-blue-600 font-bold hover:underline">Explore open roles</button>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {savedJobs.map((job) => (
                      <div key={job._id || job} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between group">
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-gray-500 border border-gray-200">
                              {job.companyName?.charAt(0) || "J"}
                            </div>
                            <button onClick={() => removeSavedJob(job._id)} className="text-gray-400 hover:text-red-500 bg-gray-50 p-2 rounded-full transition-colors" title="Remove">
                              <XCircle size={20} />
                            </button>
                          </div>
                          <h3 className="font-bold text-xl text-gray-900 mb-1 line-clamp-1">{job.title || "Job Title"}</h3>
                          <p className="text-gray-500 text-sm font-medium mb-4">{job.companyName || "Company"}</p>
                          <div className="flex flex-wrap gap-2 mb-6">
                            <span className="text-xs font-semibold text-gray-600 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">{job.location || "Location"}</span>
                            <span className="text-xs font-semibold text-gray-600 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">{job.type || "Type"}</span>
                          </div>
                        </div>
                        <button onClick={() => navigate(`/jobs?search=${encodeURIComponent(job.title || "")}`)} className="w-full py-2.5 bg-blue-50 text-blue-600 font-bold rounded-xl hover:bg-blue-100 transition-colors">
                          View Details
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 5. SUPPORT TAB */}
            {activeTab === "support" && (
              <div className="space-y-6">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Support Tickets</h2>
                    <p className="text-gray-500">Track your requests with our support team.</p>
                  </div>
                  <button onClick={() => navigate('/contact')} className="bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-md">
                    New Ticket
                  </button>
                </div>

                {tickets.length === 0 ? (
                  <div className="bg-white p-12 rounded-3xl text-center border border-gray-200 shadow-sm">
                    <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-700">No support tickets.</h3>
                    <p className="text-gray-500 mt-2">Need help? Create a new ticket.</p>
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

export default CandidateDashboard;
