import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Target, LayoutDashboard, Briefcase, Code, Database, Server, Smartphone } from "lucide-react";
import API from "../services/api";

const About = () => {
  const [stats, setStats] = useState({ jobs: 0, companies: 0 });

  useEffect(() => {
    const load = async () => {
      try {
        const [jobsRes, companiesRes] = await Promise.all([
          API.get("/jobs"),
          API.get("/companies"),
        ]);
        setStats({
          jobs: jobsRes.data?.jobs?.length || 0,
          companies: companiesRes.data?.companies?.length || 0,
        });
      } catch (_err) {
        setStats({ jobs: 0, companies: 0 });
      }
    };
    load();
  }, []);

  const features = [
    {
      icon: <Target className="w-8 h-8 text-blue-500" />,
      title: "Smart Job Matching",
      description: "Our AI-driven algorithms connect the right candidates with the right roles instantly, reducing time-to-hire by 40%.",
    },
    {
      icon: <LayoutDashboard className="w-8 h-8 text-indigo-500" />,
      title: "Role Based Dashboards",
      description: "Dedicated, highly optimized portals for Candidates, Recruiters, and Admins to manage their specific workflows seamlessly.",
    },
    {
      icon: <Briefcase className="w-8 h-8 text-green-500" />,
      title: "Easy Hiring Workflow",
      description: "From posting a job to scheduling the final interview, manage the entire lifecycle in one unified, beautiful interface.",
    },
  ];

  const technologies = [
    { name: "MongoDB", icon: <Database size={20}/>, color: "text-green-600", bg: "bg-green-100" },
    { name: "Express.js", icon: <Server size={20}/>, color: "text-gray-700", bg: "bg-gray-200" },
    { name: "React 19", icon: <Code size={20}/>, color: "text-blue-500", bg: "bg-blue-100" },
    { name: "Node.js", icon: <Server size={20}/>, color: "text-green-700", bg: "bg-green-100" },
    { name: "Tailwind CSS", icon: <Smartphone size={20}/>, color: "text-cyan-500", bg: "bg-cyan-100" },
    { name: "Framer Motion", icon: <Code size={20}/>, color: "text-purple-500", bg: "bg-purple-100" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm mb-6 border border-blue-200 shadow-sm">
            About Our Platform
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700 mb-8 tracking-tight">
            Redefining the Future of Recruitment
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Recruitment Management System is a powerful, modern platform designed to eliminate the friction in hiring. We empower candidates to track their career growth while giving recruiters the tools they need to build incredible teams.
          </p>
        </motion.div>
      </section>

      {/* Live Impact Stats */}
      <section className="relative z-10 -mt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-200">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="text-center md:px-8 py-4 md:py-0">
                <div className="text-5xl font-black text-blue-600 mb-2">{stats.jobs}</div>
                <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">Open Roles</div>
              </motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="text-center md:px-8 py-4 md:py-0">
                <div className="text-5xl font-black text-indigo-600 mb-2">{stats.companies}</div>
                <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">Active Companies</div>
              </motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="text-center md:px-8 py-4 md:py-0">
                <div className="text-5xl font-black text-green-500 mb-2">99%</div>
                <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">Recruiter Satisfaction</div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Built for Scale and Speed</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Everything you need to manage your recruitment pipeline, packed into one beautifully designed platform.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-all"
              >
                <div className="bg-gray-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-gray-100">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Powered by Modern Technology</h2>
          <p className="text-gray-600 mb-12">Built on the robust MERN stack, enhanced with cutting-edge frontend tools for a seamless experience.</p>
          
          <div className="flex flex-wrap justify-center gap-4">
            {technologies.map((tech, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className={`flex items-center gap-3 px-6 py-3 rounded-full border border-gray-100 shadow-sm hover:shadow-md transition-shadow ${tech.bg}`}
              >
                <div className={tech.color}>{tech.icon}</div>
                <span className={`font-bold ${tech.color}`}>{tech.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer is handled by Landing page usually, but we can add a simple dark footer here or just let the layout handle it */}
    </div>
  );
};

export default About;
