import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Code, Database, Palette, Megaphone, 
  Landmark, Users, HeadphonesIcon, Edit3, 
  ArrowRight, Zap, Globe, ShieldCheck, MapPin, Briefcase 
} from "lucide-react";
import API from "../services/api";

const Landing = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ jobs: 0, companies: 0 });
  const [latestJobs, setLatestJobs] = useState([]);

  const categories = [
    { title: "Software Dev", jobs: "120+ Jobs", icon: <Code size={32}/>, color: "bg-blue-100 text-blue-600" },
    { title: "Data Science", jobs: "80+ Jobs", icon: <Database size={32}/>, color: "bg-indigo-100 text-indigo-600" },
    { title: "UI/UX Design", jobs: "60+ Jobs", icon: <Palette size={32}/>, color: "bg-pink-100 text-pink-600" },
    { title: "Marketing", jobs: "95+ Jobs", icon: <Megaphone size={32}/>, color: "bg-orange-100 text-orange-600" },
    { title: "Finance", jobs: "70+ Jobs", icon: <Landmark size={32}/>, color: "bg-green-100 text-green-600" },
    { title: "HR", jobs: "50+ Jobs", icon: <Users size={32}/>, color: "bg-purple-100 text-purple-600" },
    { title: "Support", jobs: "40+ Jobs", icon: <HeadphonesIcon size={32}/>, color: "bg-red-100 text-red-600" },
    { title: "Writing", jobs: "65+ Jobs", icon: <Edit3 size={32}/>, color: "bg-teal-100 text-teal-600" },
  ];

  useEffect(() => {
    const load = async () => {
      try {
        const [jobsRes, companiesRes] = await Promise.all([
          API.get("/jobs"),
          API.get("/companies"),
        ]);
        const jobs = jobsRes.data?.jobs || [];
        const companies = companiesRes.data?.companies || [];
        setStats({ jobs: jobs.length, companies: companies.length });
        setLatestJobs(jobs.slice(0, 6));
      } catch (_err) {
        setLatestJobs([]);
      }
    };
    load();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white min-h-[90vh] flex items-center">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 -left-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-40 left-1/2 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 text-blue-300 font-semibold text-sm mb-6 border border-blue-400/30">
              🚀 The Ultimate Hiring Platform
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
              Find Your Dream Job.<br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Build Your Dream Team.</span>
            </h1>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Discover opportunities, connect with top recruiters, and manage your entire hiring pipeline efficiently — all in one modern platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={() => navigate("/register")} className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] hover:-translate-y-1 flex items-center justify-center gap-2">
                Get Started Free <ArrowRight size={20} />
              </button>
              <button onClick={() => navigate("/jobs")} className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-bold text-lg transition-all backdrop-blur-md hover:-translate-y-1">
                Explore Open Roles
              </button>
            </div>
            <p className="mt-6 text-sm text-gray-400">
              Already have an account? <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-4">Sign in here</Link>
            </p>
          </motion.div>
        </div>
      </section>

      {/* ================= LIVE STATS BANNER ================= */}
      <section className="relative z-20 -mt-12 px-6">
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100 flex flex-col md:flex-row justify-around items-center gap-8 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          <div className="text-center px-8 w-full">
            <motion.div initial={{ scale: 0.5, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} className="text-5xl font-black text-gray-900 mb-1">{stats.jobs}</motion.div>
            <div className="text-sm font-bold text-blue-600 uppercase tracking-widest">Active Jobs</div>
          </div>
          <div className="text-center px-8 w-full pt-8 md:pt-0">
            <motion.div initial={{ scale: 0.5, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-5xl font-black text-gray-900 mb-1">{stats.companies}</motion.div>
            <div className="text-sm font-bold text-indigo-600 uppercase tracking-widest">Companies Hiring</div>
          </div>
          <div className="text-center px-8 w-full pt-8 md:pt-0">
            <motion.div initial={{ scale: 0.5, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-5xl font-black text-gray-900 mb-1">24/7</motion.div>
            <div className="text-sm font-bold text-green-500 uppercase tracking-widest">Candidate Support</div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Our Portal?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">We provide the tools you need to accelerate your career or find the perfect candidate.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div whileHover={{ y: -10 }} className="bg-white p-8 rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100 transition-all group">
              <div className="bg-orange-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500 group-hover:text-white transition-colors text-orange-600">
                <Zap size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Fast Hiring</h3>
              <p className="text-gray-600 leading-relaxed">Apply instantly with your saved profile and connect with verified recruiters faster than ever before.</p>
            </motion.div>

            <motion.div whileHover={{ y: -10 }} className="bg-white p-8 rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100 transition-all group">
              <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors text-blue-600">
                <Globe size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Remote Opportunities</h3>
              <p className="text-gray-600 leading-relaxed">Access thousands of remote and hybrid roles worldwide. Work from anywhere with top global companies.</p>
            </motion.div>

            <motion.div whileHover={{ y: -10 }} className="bg-white p-8 rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100 transition-all group">
              <div className="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-500 group-hover:text-white transition-colors text-green-600">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Verified Employers</h3>
              <p className="text-gray-600 leading-relaxed">Every company on our platform is strictly vetted to ensure a safe, spam-free, and high-quality job search experience.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= POPULAR JOB CATEGORIES ================= */}
      <section className="py-24 px-6 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Explore by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">Find the role that perfectly matches your skills and passions.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                onClick={() => navigate(`/jobs?search=${encodeURIComponent(cat.title)}`)}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-blue-200 transition-all cursor-pointer group flex flex-col items-center text-center"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:-translate-y-2 ${cat.color}`}>
                  {cat.icon}
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{cat.title}</h3>
                <p className="text-sm font-semibold text-gray-400 bg-gray-50 px-3 py-1 rounded-full">{cat.jobs}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= LATEST JOBS ================= */}
      <section className="py-24 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Latest Opportunities</h2>
              <p className="text-gray-600">Fresh jobs posted recently by top companies.</p>
            </div>
            <button
              onClick={() => navigate("/jobs")}
              className="flex items-center gap-2 text-blue-600 font-bold hover:text-blue-800 transition px-6 py-3 bg-blue-50 rounded-full hover:bg-blue-100"
            >
              View All Jobs <ArrowRight size={18} />
            </button>
          </div>

          {latestJobs.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl text-center border border-gray-200 shadow-sm">
              <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-700">No jobs posted yet.</h3>
              <p className="text-gray-500">Check back soon for new opportunities.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestJobs.map((job) => (
                <motion.div 
                  key={job._id} 
                  whileHover={{ y: -5 }}
                  className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center font-bold text-xl text-gray-500 border border-gray-100 shadow-inner">
                        {job.companyName.charAt(0).toUpperCase()}
                      </div>
                      <span className="bg-green-50 text-green-700 border border-green-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {job.status === "open" ? "Actively Hiring" : "Closed"}
                      </span>
                    </div>
                    
                    <h3 className="font-bold text-xl text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                    <p className="text-gray-600 font-medium mb-4">{job.companyName}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                        <MapPin size={12} /> {job.location}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                        <Briefcase size={12} /> {job.type}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/jobs?search=${encodeURIComponent(job.title || "")}`)}
                    className="w-full py-3 bg-white border-2 border-blue-100 text-blue-600 rounded-xl font-bold group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors"
                  >
                    View Details
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-black text-white mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">R</div>
              RMS Portal
            </h3>
            <p className="text-gray-400 leading-relaxed max-w-sm">
              Empowering candidates to find their dream roles and enabling recruiters to build world-class teams with cutting edge technology.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Platform</h4>
            <ul className="space-y-3">
              <li><Link to="/jobs" className="hover:text-white transition-colors">Browse Jobs</Link></li>
              <li><Link to="/companies" className="hover:text-white transition-colors">Top Companies</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Career Services</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Company</h4>
            <ul className="space-y-3">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 pt-8 border-t border-gray-800 text-center text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} Recruitment Management System. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-white cursor-pointer">Twitter</span>
            <span className="hover:text-white cursor-pointer">LinkedIn</span>
            <span className="hover:text-white cursor-pointer">GitHub</span>
          </div>
        </div>
      </footer>
      
      {/* Background Blob Animation */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
};

export default Landing;
