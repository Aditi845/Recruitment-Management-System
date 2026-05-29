import { useEffect, useState, useRef } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Bell, BrainCircuit, TrendingUp, Download,
  ChevronRight, ChevronLeft, CheckCircle, Search, MapPin,
  Briefcase, Activity, AlertCircle, RefreshCw
} from "lucide-react";
import html2pdf from "html2pdf.js";

const questionBank = {
  Frontend: [
    { q: "Explain the box model in CSS.", a: "The CSS box model defines the rectangular boxes generated for elements. It consists of: Content (text/images), Padding (transparent space around content), Border (wraps padding), and Margin (transparent space outside border)." },
    { q: "What are React hooks and when do you use useEffect?", a: "Hooks let you use state and React features without writing a class. useEffect is used for side effects in function components, like data fetching, manual DOM mutations, and setting up subscriptions." },
    { q: "How do you optimize rendering performance in React?", a: "Techniques include using React.memo to prevent unnecessary re-renders, useMemo/useCallback for caching complex calculations and functions, implementing virtualization for long lists, and lazy loading components." },
    { q: "Explain event delegation in JavaScript.", a: "Event delegation involves attaching a single event listener to a parent element to listen for events that bubble up from its children. This is memory-efficient and works for dynamically added children." },
  ],
  Backend: [
    { q: "What is REST and how do you design clean APIs?", a: "REST is an architectural style for networked applications. Clean APIs use standard HTTP methods (GET, POST, PUT, DELETE), descriptive resource-based URLs, stateless communication, and standard status codes." },
    { q: "Explain indexes in databases and when to use them.", a: "Indexes are special data structures that improve the speed of data retrieval operations on a table at the cost of additional writes and storage space. Use them on columns frequently used in WHERE clauses or JOINs." },
    { q: "How do you secure a Node.js API?", a: "Use helmet for security headers, express-rate-limit to prevent brute force, bcrypt for password hashing, JWT for authentication, input validation (e.g. express-validator), and proper CORS configuration." },
    { q: "Describe the difference between SQL and NoSQL databases.", a: "SQL databases are relational, use structured schemas, and are ideal for complex queries and ACID transactions. NoSQL databases are non-relational, flexible, scale horizontally, and are better for unstructured data and rapid development." },
  ],
  "Data / ML": [
    { q: "Explain the bias-variance tradeoff.", a: "It's the tradeoff between a model's ability to minimize errors on training data (bias) vs its ability to minimize errors on unseen test data (variance). High bias causes underfitting; high variance causes overfitting." },
    { q: "What is feature scaling and why is it important?", a: "Feature scaling standardizes the range of independent variables. It's crucial for algorithms that calculate distances (like KNN or SVM) or use gradient descent, ensuring all features contribute equally to the result." },
    { q: "How do you evaluate a classification model?", a: "Common metrics include Accuracy (overall correctness), Precision (exactness), Recall (completeness), F1-Score (harmonic mean of Precision/Recall), and the ROC-AUC curve to evaluate class separation." },
    { q: "Explain cross-validation.", a: "A resampling procedure used to evaluate models on a limited data sample. The most common is k-fold, where data is split into k subsets. The model is trained on k-1 subsets and tested on the remaining one, repeated k times." },
  ],
  HR: [
    { q: "Tell me about yourself.", a: "Keep it professional and concise. Focus on your current role, key achievements from past roles relevant to the position you're applying for, and briefly touch on what you're looking for next." },
    { q: "Describe a difficult team situation and how you handled it.", a: "Use the STAR method (Situation, Task, Action, Result). Focus on your communication, empathy, and problem-solving skills to resolve the conflict while keeping the project on track." },
    { q: "Why are you interested in this role?", a: "Connect your personal career goals with the company's mission and the specific responsibilities of the role. Show that you've researched the company and understand how you can add value." },
    { q: "Where do you see yourself in 3 years?", a: "Focus on your professional growth and how it aligns with the company's trajectory. Discuss taking on more responsibility, mastering specific skills, or potentially moving into leadership." },
  ],
};

const Services = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("resume");
  const [isHoveringCard, setIsHoveringCard] = useState(false);
  const printRef = useRef();

  // --- Resume Builder State ---
  const [resume, setResume] = useState({
    name: "", email: "", phone: "", summary: "",
    skills: "", education: "", experience: "", projects: "", links: ""
  });
  const [generatingPDF, setGeneratingPDF] = useState(false);

  // --- Job Alerts State ---
  const [alerts, setAlerts] = useState(() => {
    try { return JSON.parse(localStorage.getItem("jobAlerts") || "[]"); }
    catch { return []; }
  });
  const [alertForm, setAlertForm] = useState({ search: "", location: "", type: "" });
  const [alertResults, setAlertResults] = useState([]);
  const [alertLoading, setAlertLoading] = useState(false);

  // --- Interview Prep State ---
  const [activeRole, setActiveRole] = useState("Frontend");
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [prepProgress, setPrepProgress] = useState(() => {
    try { return JSON.parse(localStorage.getItem("prepProgress") || "{}"); }
    catch { return {}; }
  });

  // --- Salary Insights State ---
  const [salaryQuery, setSalaryQuery] = useState({ search: "", location: "" });
  const [salaryStats, setSalaryStats] = useState(null);
  const [salaryLoading, setSalaryLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    API.get("/users/me")
      .then((res) => {
        const cp = res.data?.user?.candidateProfile || {};
        setResume((prev) => ({
          ...prev,
          name: user.name || prev.name,
          email: user.email || prev.email,
          phone: cp.phone || "",
          skills: Array.isArray(cp.skills) ? cp.skills.join(", ") : "",
          education: cp.education || "",
          experience: cp.experience || "",
        }));
      })
      .catch(() => { });
  }, [user]);

  useEffect(() => { localStorage.setItem("jobAlerts", JSON.stringify(alerts)); }, [alerts]);
  useEffect(() => { localStorage.setItem("prepProgress", JSON.stringify(prepProgress)); }, [prepProgress]);

  // --- Resume Logic ---
  const downloadPDF = async () => {
    setGeneratingPDF(true);
    const element = printRef.current;

    // Temporarily make it visible for html2pdf
    element.style.display = "block";

    const opt = {
      margin: 0.5,
      filename: `${resume.name.replace(/\s+/g, '_') || 'My'}_Resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    try {
      await html2pdf().set(opt).from(element).save();
    } finally {
      element.style.display = "none";
      setGeneratingPDF(false);
    }
  };

  // --- Alerts Logic ---
  const addAlert = () => {
    if (!alertForm.search && !alertForm.location && !alertForm.type) return;
    const next = [{ id: Date.now().toString(), active: true, ...alertForm }, ...alerts];
    setAlerts(next);
    setAlertForm({ search: "", location: "", type: "" });
  };

  const toggleAlert = (id) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  const runAlert = async (alert) => {
    setAlertLoading(true);
    try {
      const params = new URLSearchParams();
      if (alert.search) params.append("search", alert.search);
      if (alert.location) params.append("location", alert.location);
      if (alert.type) params.append("type", alert.type);
      const res = await API.get(`/jobs?${params.toString()}`);
      setAlertResults(res.data?.jobs || []);
    } catch (_err) {
      setAlertResults([]);
    } finally {
      setAlertLoading(false);
    }
  };

  // --- Interview Logic ---
  const activeQuestions = questionBank[activeRole] || [];
  const handleNextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setFlashcardIndex((prev) => (prev + 1) % activeQuestions.length);
    }, 150);
  };
  const handlePrevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setFlashcardIndex((prev) => (prev === 0 ? activeQuestions.length - 1 : prev - 1));
    }, 150);
  };
  const markAsKnown = () => {
    setPrepProgress((prev) => {
      const roleSet = new Set(prev[activeRole] || []);
      roleSet.add(activeQuestions[flashcardIndex].q);
      return { ...prev, [activeRole]: Array.from(roleSet) };
    });
    handleNextCard();
  };
  const completedCount = new Set(prepProgress[activeRole] || []).size;
  const progressPercent = activeQuestions.length > 0 ? (completedCount / activeQuestions.length) * 100 : 0;

  // --- Salary Logic ---
  const parseSalaryValues = (salary) => {
    if (!salary) return [];
    const cleaned = salary.replace(/,/g, "");
    const matches = cleaned.match(/\d+(\.\d+)?/g);
    if (!matches) return [];
    let multiplier = 1;
    if (/k/i.test(cleaned) && Math.max(...matches.map(Number)) < 1000) multiplier = 1000;
    if (/lpa|lakh/i.test(cleaned)) multiplier = 100000;
    return matches.map((n) => Number(n) * multiplier).filter((n) => Number.isFinite(n));
  };

  const getSalaryInsights = async () => {
    if (!salaryQuery.search && !salaryQuery.location) return;
    setSalaryLoading(true);
    setSalaryStats(null);
    try {
      const params = new URLSearchParams();
      if (salaryQuery.search) params.append("search", salaryQuery.search);
      if (salaryQuery.location) params.append("location", salaryQuery.location);
      const res = await API.get(`/jobs?${params.toString()}`);
      const jobs = res.data?.jobs || [];
      const values = jobs.flatMap((job) => parseSalaryValues(job.salary));

      if (values.length === 0) {
        setSalaryStats({ count: 0 });
      } else {
        const min = Math.min(...values);
        const max = Math.max(...values);
        const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);

        let demand = "Medium";
        if (jobs.length > 20) demand = "High 🔥";
        else if (jobs.length < 5) demand = "Low ❄️";

        setSalaryStats({ count: jobs.length, min, max, avg, demand });
      }
    } catch (_err) {
      setSalaryStats({ count: 0 });
    } finally {
      setSalaryLoading(false);
    }
  };

  const tabs = [
    { id: "resume", icon: FileText, label: "Resume Builder" },
    { id: "prep", icon: BrainCircuit, label: "Interview Prep" },
    { id: "salary", icon: TrendingUp, label: "Salary Insights" },
    { id: "alerts", icon: Bell, label: "Job Alerts" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">

      {/* Hidden Resume Template for PDF Generation */}
      <div style={{ display: 'none' }}>
        <div ref={printRef} className="p-10 font-sans text-gray-800 bg-white" style={{ width: '800px', minHeight: '1050px' }}>
          <h1 className="text-4xl font-bold text-gray-900 border-b-2 border-blue-600 pb-2 mb-2 uppercase tracking-wider">{resume.name || 'Your Name'}</h1>
          <div className="flex gap-4 text-sm text-gray-600 mb-6">
            {resume.email && <span>{resume.email}</span>}
            {resume.phone && <span>• {resume.phone}</span>}
            {resume.links && <span>• {resume.links}</span>}
          </div>

          {resume.summary && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-800 uppercase tracking-widest mb-2">Professional Summary</h2>
              <p className="text-sm leading-relaxed">{resume.summary}</p>
            </div>
          )}

          {resume.skills && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-800 uppercase tracking-widest mb-2">Skills</h2>
              <p className="text-sm leading-relaxed">{resume.skills}</p>
            </div>
          )}

          {resume.experience && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-800 uppercase tracking-widest mb-2">Experience</h2>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{resume.experience}</p>
            </div>
          )}

          {resume.projects && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-800 uppercase tracking-widest mb-2">Projects</h2>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{resume.projects}</p>
            </div>
          )}

          {resume.education && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-800 uppercase tracking-widest mb-2">Education</h2>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{resume.education}</p>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600 mb-4">
            Career Services
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Supercharge your job search with our suite of premium AI-powered tools. Build a resume, prepare for interviews, and track market salaries all in one place.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 relative">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-colors duration-300 z-10 ${isActive
                  ? "text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-blue-300"
                  }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 bg-blue-600 rounded-full shadow-lg shadow-blue-200 -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
                <Icon size={18} className="relative z-10" />
                <span className="relative z-10">{tab.label}</span>
              </motion.button>
            )
          })}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-6 md:p-10"
          >

            {/* 1. RESUME BUILDER */}
            {activeTab === "resume" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Professional PDF Resume Builder</h2>
                  <p className="text-gray-500">Fill in your details to instantly generate a beautifully formatted, ATS-friendly PDF resume.</p>
                </div>

                <motion.div
                  variants={{ show: { transition: { staggerChildren: 0.1 } } }}
                  initial="hidden" animate="show"
                  className="grid md:grid-cols-2 gap-6"
                >
                  <div className="space-y-4">
                    {[
                      { name: "name", placeholder: "Full Name", val: resume.name },
                      { name: "email", placeholder: "Email Address", val: resume.email },
                      { name: "phone", placeholder: "Phone Number", val: resume.phone },
                      { name: "links", placeholder: "LinkedIn / Portfolio Links", val: resume.links },
                    ].map(field => (
                      <motion.input
                        key={field.name}
                        variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } }}
                        whileFocus={{ scale: 1.02 }}
                        name={field.name} value={field.val}
                        onChange={(e) => setResume(p => ({ ...p, [field.name]: e.target.value }))}
                        placeholder={field.placeholder}
                        className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                      />
                    ))}
                    <motion.textarea
                      variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } }}
                      whileFocus={{ scale: 1.02 }}
                      name="summary" value={resume.summary} onChange={(e) => setResume(p => ({ ...p, summary: e.target.value }))} placeholder="Professional Summary" rows="3" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow resize-none"
                    ></motion.textarea>
                  </div>
                  <div className="space-y-4">
                    {[
                      { name: "skills", placeholder: "Core Skills (comma separated)", rows: 2, val: resume.skills },
                      { name: "experience", placeholder: "Work Experience (Company, Role, Dates, Achievements)", rows: 3, val: resume.experience },
                      { name: "projects", placeholder: "Key Projects", rows: 2, val: resume.projects },
                      { name: "education", placeholder: "Education (Degree, University, Year)", rows: 2, val: resume.education },
                    ].map(field => (
                      <motion.textarea
                        key={field.name}
                        variants={{ hidden: { opacity: 0, x: 20 }, show: { opacity: 1, x: 0 } }}
                        whileFocus={{ scale: 1.02 }}
                        name={field.name} value={field.val}
                        onChange={(e) => setResume(p => ({ ...p, [field.name]: e.target.value }))}
                        placeholder={field.placeholder} rows={field.rows}
                        className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow resize-none"
                      ></motion.textarea>
                    ))}
                  </div>
                </motion.div>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={downloadPDF}
                    disabled={generatingPDF}
                    className="relative flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-blue-200 hover:shadow-xl transition-all disabled:opacity-70 group overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                    {generatingPDF ? <RefreshCw className="animate-spin relative z-10" /> : <Download size={20} className="relative z-10 group-hover:animate-bounce" />}
                    <span className="relative z-10">{generatingPDF ? "Generating PDF..." : "Download Beautiful PDF"}</span>
                  </motion.button>
                </div>
              </div>
            )}

            {/* 2. INTERVIEW PREP */}
            {activeTab === "prep" && (
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Interactive Flashcards</h2>
                    <p className="text-gray-500">Master the most common interview questions for your field.</p>
                  </div>
                  <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
                    {Object.keys(questionBank).map((role) => (
                      <button
                        key={role}
                        onClick={() => { setActiveRole(role); setFlashcardIndex(0); setIsFlipped(false); }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeRole === role ? "bg-white text-blue-700 shadow" : "text-gray-600 hover:text-gray-900"
                          }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    className="bg-green-500 h-full"
                  />
                </div>
                <div className="text-sm font-medium text-gray-500 text-right">
                  Mastered: {completedCount} / {activeQuestions.length}
                </div>

                {/* Flashcard 3D Scene */}
                <div className="perspective-1000 relative w-full max-w-3xl mx-auto h-80"
                  onMouseEnter={() => setIsHoveringCard(true)}
                  onMouseLeave={() => setIsHoveringCard(false)}>

                  <motion.div
                    className="w-full h-full preserve-3d cursor-pointer"
                    onClick={() => setIsFlipped(!isFlipped)}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6, type: "spring", stiffness: 200, damping: 20 }}
                  >
                    {/* Front */}
                    <div className="absolute inset-0 backface-hidden bg-white border-2 border-blue-100 rounded-3xl shadow-xl flex flex-col justify-center items-center p-10 text-center">
                      <BrainCircuit className="text-blue-200 w-16 h-16 mb-6 absolute top-6 right-6 opacity-50" />
                      <span className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-4">Question {flashcardIndex + 1} of {activeQuestions.length}</span>
                      <h3 className="text-2xl font-bold text-gray-800 leading-snug">
                        {activeQuestions[flashcardIndex]?.q}
                      </h3>
                      <p className="mt-8 text-sm text-gray-400">Click to reveal answer</p>
                    </div>

                    {/* Back */}
                    <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl shadow-xl flex flex-col justify-center items-center p-10 text-center rotate-y-180">
                      <CheckCircle className="text-white/20 w-16 h-16 mb-6 absolute top-6 right-6" />
                      <span className="text-blue-200 font-bold tracking-widest uppercase text-sm mb-4">Suggested Answer</span>
                      <p className="text-lg font-medium leading-relaxed">
                        {activeQuestions[flashcardIndex]?.a}
                      </p>
                    </div>
                  </motion.div>

                  {/* Navigation Arrows inside Card Hover */}
                  <AnimatePresence>
                    {isHoveringCard && (
                      <>
                        <motion.button
                          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                          onClick={(e) => { e.stopPropagation(); handlePrevCard(); }}
                          className="absolute left-[-20px] top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 text-gray-600 z-10 border border-gray-100"
                        >
                          <ChevronLeft size={24} />
                        </motion.button>
                        <motion.button
                          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                          onClick={(e) => { e.stopPropagation(); handleNextCard(); }}
                          className="absolute right-[-20px] top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 text-gray-600 z-10 border border-gray-100"
                        >
                          <ChevronRight size={24} />
                        </motion.button>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex justify-center gap-4 mt-8">
                  <button onClick={markAsKnown} className="bg-green-100 text-green-700 font-bold px-6 py-3 rounded-xl hover:bg-green-200 transition">
                    I know this
                  </button>
                  <button onClick={handleNextCard} className="bg-gray-100 text-gray-700 font-bold px-6 py-3 rounded-xl hover:bg-gray-200 transition">
                    Skip for now
                  </button>
                </div>
              </div>
            )}

            {/* 3. SALARY INSIGHTS */}
            {activeTab === "salary" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Market Salary Analytics</h2>
                  <p className="text-gray-500">Enter a job title and location to analyze current market rates from real job postings.</p>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <motion.div whileFocus={{ scale: 1.02 }} className="flex-1 relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input value={salaryQuery.search} onChange={(e) => setSalaryQuery(p => ({ ...p, search: e.target.value }))} placeholder="Job Title (e.g., Software Engineer)" className="w-full bg-gray-50 border border-gray-200 py-4 pl-12 pr-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" />
                  </motion.div>
                  <motion.div whileFocus={{ scale: 1.02 }} className="flex-1 relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input value={salaryQuery.location} onChange={(e) => setSalaryQuery(p => ({ ...p, location: e.target.value }))} placeholder="Location (e.g., Remote, New York)" className="w-full bg-gray-50 border border-gray-200 py-4 pl-12 pr-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" />
                  </motion.div>
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={getSalaryInsights} disabled={salaryLoading}
                    className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
                  >
                    {salaryLoading ? <RefreshCw className="animate-spin" size={20} /> : <Search size={20} />}
                    Analyze
                  </motion.button>
                </div>

                {salaryStats && salaryStats.count > 0 && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white mt-8 shadow-2xl relative overflow-hidden">
                    <Activity className="absolute -bottom-10 -right-10 w-64 h-64 text-white opacity-5" />

                    <div className="flex justify-between items-center mb-10 border-b border-gray-700 pb-6">
                      <div>
                        <h3 className="text-2xl font-bold">Estimated Compensation</h3>
                        <p className="text-gray-400 text-sm mt-1">Based on {salaryStats.count} recent local postings</p>
                      </div>
                      <div className="bg-gray-800 border border-gray-600 px-4 py-2 rounded-lg text-center">
                        <span className="block text-xs text-gray-400 uppercase tracking-wider mb-1">Market Demand</span>
                        <span className={`font-bold ${salaryStats.demand.includes('High') ? 'text-green-400' : salaryStats.demand.includes('Low') ? 'text-red-400' : 'text-amber-400'}`}>
                          {salaryStats.demand}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6 relative">
                      {/* Visual Bar connecting Min to Max */}
                      <div className="absolute top-1/2 left-[16.6%] right-[16.6%] h-2 bg-gray-700 rounded-full -translate-y-1/2 z-0 hidden md:block">
                        <div className="absolute top-0 bottom-0 left-1/2 w-[20%] bg-blue-500 rounded-full blur-md opacity-50 -translate-x-1/2"></div>
                      </div>

                      <motion.div whileHover={{ scale: 1.1, y: -5 }} className="text-center z-10 transition-transform cursor-default">
                        <div className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">Minimum</div>
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-3xl font-light">${(salaryStats.min).toLocaleString()}</motion.div>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} className="text-center z-10 bg-blue-600/20 border border-blue-500/30 rounded-2xl p-4 shadow-lg shadow-blue-900/20 backdrop-blur-sm transform -translate-y-4 transition-all hover:bg-blue-600/30 cursor-default">
                        <div className="text-blue-200 text-sm font-bold uppercase tracking-wider mb-2">Average Rate</div>
                        <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", delay: 0.3 }} className="text-4xl font-extrabold text-blue-400">${(salaryStats.avg).toLocaleString()}</motion.div>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.1, y: -5 }} className="text-center z-10 transition-transform cursor-default">
                        <div className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">Maximum</div>
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-3xl font-light">${(salaryStats.max).toLocaleString()}</motion.div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}

                {salaryStats && salaryStats.count === 0 && (
                  <div className="text-center py-10 bg-gray-50 rounded-2xl border border-gray-200">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-gray-800">No data found</h3>
                    <p className="text-gray-500">Try broadening your search terms or location.</p>
                  </div>
                )}
              </div>
            )}

            {/* 4. JOB ALERTS */}
            {activeTab === "alerts" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Smart Job Alerts</h2>
                  <p className="text-gray-500">Save specific job criteria and run them with a single click to find new opportunities instantly.</p>
                </div>

                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Create New Alert</h3>
                  <div className="grid md:grid-cols-4 gap-4">
                    <motion.input whileFocus={{ scale: 1.02 }} value={alertForm.search} onChange={(e) => setAlertForm(p => ({ ...p, search: e.target.value }))} placeholder="Job Role" className="w-full bg-white border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" />
                    <motion.input whileFocus={{ scale: 1.02 }} value={alertForm.location} onChange={(e) => setAlertForm(p => ({ ...p, location: e.target.value }))} placeholder="Location" className="w-full bg-white border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" />
                    <motion.select whileFocus={{ scale: 1.02 }} value={alertForm.type} onChange={(e) => setAlertForm(p => ({ ...p, type: e.target.value }))} className="w-full bg-white border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 transition-shadow">
                      <option value="">Any Type</option>
                      <option value="Full Time">Full Time</option>
                      <option value="Part Time">Part Time</option>
                      <option value="Internship">Internship</option>
                      <option value="Remote">Remote</option>
                    </motion.select>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={addAlert} className="bg-blue-600 text-white font-bold p-3 rounded-xl hover:bg-blue-700 shadow-md flex items-center justify-center gap-2">
                      <Bell size={18} /> Save Alert
                    </motion.button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Saved Alerts List */}
                  <div>
                    <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                      Your Active Alerts <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">{alerts.length}</span>
                    </h3>
                    <div className="flex flex-col">
                      {alerts.length === 0 && <p className="text-gray-500 text-sm mb-3">No alerts saved yet.</p>}
                      <AnimatePresence>
                        {alerts.map((alert) => (
                          <motion.div
                            layout
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                            whileHover={{ scale: 1.02 }}
                            key={alert.id}
                            className={`p-4 mb-3 rounded-xl border transition-colors ${alert.active ? 'bg-white border-gray-200 shadow-sm shadow-blue-100/50' : 'bg-gray-50 border-gray-200 opacity-60'}`}
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h4 className="font-bold text-gray-800">{alert.search || "Any Role"}</h4>
                                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                  <MapPin size={12} /> {alert.location || "Anywhere"} • <Briefcase size={12} /> {alert.type || "Any Type"}
                                </p>
                              </div>
                              <button onClick={() => toggleAlert(alert.id)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${alert.active ? 'bg-blue-600' : 'bg-gray-300'}`}>
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${alert.active ? 'translate-x-6' : 'translate-x-1'}`} />
                              </button>
                            </div>
                            <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-2">
                              <button onClick={() => runAlert(alert)} disabled={!alert.active || alertLoading} className="text-blue-600 text-sm font-semibold hover:text-blue-800 disabled:opacity-50">
                                Run Now &rarr;
                              </button>
                              <button onClick={() => setAlerts(alerts.filter(a => a.id !== alert.id))} className="text-red-500 text-xs hover:underline">
                                Delete
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Alert Results */}
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                    <h3 className="font-bold text-gray-700 mb-4">Latest Results</h3>
                    {alertLoading && <div className="flex items-center gap-2 text-blue-600"><RefreshCw className="animate-spin" size={16} /> Fetching matches...</div>}
                    {!alertLoading && alertResults.length === 0 && <p className="text-gray-500 text-sm">Run an alert to see results here.</p>}
                    {!alertLoading && alertResults.length > 0 && (
                      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                        {alertResults.map((job) => (
                          <div key={job._id} className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                            <h4 className="font-bold text-sm text-gray-800 line-clamp-1">{job.title}</h4>
                            <p className="text-xs text-gray-500 mt-1">{job.companyName} • {job.location}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* 3D CSS Helpers */}
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};

export default Services;
