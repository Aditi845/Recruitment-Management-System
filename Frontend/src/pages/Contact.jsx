import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Phone, Mail, HelpCircle, FileText, ChevronDown, CheckCircle2, Loader2, Paperclip, X, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import API from "../services/api";

const contactOptions = [
  {
    icon: HelpCircle,
    title: "General Support",
    value: "support@rmsportal.com",
    note: "For account help, login issues, and platform questions.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Mail,
    title: "Recruiter Assistance",
    value: "recruiters@rmsportal.com",
    note: "For posting jobs, managing applicants, and hiring workflow support.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: Phone,
    title: "Call Us",
    value: "+1 (800) 555-0199",
    note: "Monday to Friday, 9:00 AM to 6:00 PM.",
    color: "bg-amber-50 text-amber-600",
  },
];

const faqs = [
  {
    q: "How long does it take to get a response?",
    a: "We typically respond to all support tickets within 24 hours during business days."
  },
  {
    q: "Can I update an existing ticket?",
    a: "Yes! You can reply directly to the confirmation email we send you, and it will update your ticket."
  },
  {
    q: "How do I attach multiple files?",
    a: "You can attach up to 3 files (max 5MB each) when submitting a new ticket using the attachment icon."
  }
];

const initialForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
  category: "General Support",
  priority: "Medium",
};

const Contact = () => {
  const [form, setForm] = useState(initialForm);
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // AI Suggestions State
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  // Auto-fetch AI suggestions based on message
  useEffect(() => {
    if (form.message.length < 10) {
      setAiSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setIsTyping(true);
      try {
        const res = await API.post("/contact/ai-suggest", { message: form.message });
        setAiSuggestions(res.data?.suggestions || []);
      } catch (error) {
        console.error("AI suggest failed", error);
      } finally {
        setIsTyping(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 800);
    return () => clearTimeout(debounceTimer);
  }, [form.message]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (attachments.length + files.length > 3) {
      toast.warning("You can only attach up to 3 files.");
      return;
    }
    
    const validFiles = files.filter(f => f.size <= 5 * 1024 * 1024);
    if (validFiles.length !== files.length) {
      toast.warning("Some files were skipped. Max size is 5MB.");
    }
    
    setAttachments(prev => [...prev, ...validFiles]);
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const submitMessage = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
      toast.error("Please complete every required field.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    Object.keys(form).forEach(key => formData.append(key, form[key]));
    attachments.forEach(file => formData.append("attachments", file));

    try {
      const res = await API.post("/contact", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      const isSuccess = res.status === 201;
      if (isSuccess) {
        toast.success(`Ticket ${res.data?.ticket?.id} submitted successfully!`);
      } else {
        toast.warning(res.data?.message || "Ticket saved but email failed to send.");
      }
      
      setForm(initialForm);
      setAttachments([]);
      setAiSuggestions([]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              How can we <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">help you?</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
              Our team is here to provide you with the best support. Browse our FAQs or send us a message directly.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Form Section */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/80 backdrop-blur-xl border border-slate-200/60 shadow-xl rounded-2xl p-8"
            >
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <Send className="w-6 h-6 text-blue-600" />
                  Submit a Ticket
                </h2>
                <p className="text-slate-500 mt-2">Fill out the form below and we'll get back to you shortly.</p>
              </div>

              <form onSubmit={submitMessage} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Category</label>
                    <div className="relative">
                      <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none"
                      >
                        <option value="General Support">General Support</option>
                        <option value="Billing & Payments">Billing & Payments</option>
                        <option value="Technical Issue">Technical Issue</option>
                        <option value="Feature Request">Feature Request</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Priority</label>
                    <div className="relative">
                      <select
                        name="priority"
                        value={form.priority}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="Brief description of your issue"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    required
                  />
                </div>

                <div className="space-y-2 relative">
                  <label className="text-sm font-semibold text-slate-700 flex justify-between">
                    Message
                    {isTyping && <span className="text-xs text-blue-500 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Analyzing...</span>}
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Provide as much detail as possible..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                    required
                  />

                  {/* AI Smart Assistant Overlay */}
                  <AnimatePresence>
                    {aiSuggestions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute z-10 bottom-[calc(100%+10px)] left-0 right-0 bg-white border border-blue-200 rounded-xl shadow-2xl p-4 overflow-hidden"
                      >
                        <div className="flex items-center gap-2 mb-3 text-blue-700 font-semibold border-b border-blue-100 pb-2">
                          <AlertCircle className="w-5 h-5" />
                          <span>AI Assistant Suggestion</span>
                        </div>
                        <div className="space-y-3">
                          {aiSuggestions.map((sug, idx) => (
                            <div key={idx} className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                              <h4 className="font-bold text-slate-800">{sug.title}</h4>
                              <p className="text-sm text-slate-600 mt-1">{sug.description}</p>
                              {sug.actionUrl && (
                                <a href={sug.actionUrl} className="mt-2 inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800">
                                  {sug.actionText} <ChevronDown className="w-4 h-4 ml-1 -rotate-90" />
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Attachments */}
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors border border-slate-200">
                      <Paperclip className="w-4 h-4" />
                      Attach Files
                      <input type="file" multiple className="hidden" onChange={handleFileChange} />
                    </label>
                    <span className="text-xs text-slate-500">Max 3 files, 5MB each.</span>
                  </div>
                  
                  {attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {attachments.map((file, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-xs font-medium">
                          <FileText className="w-3 h-3" />
                          <span className="max-w-[150px] truncate">{file.name}</span>
                          <button type="button" onClick={() => removeAttachment(idx)} className="hover:text-red-500 transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    {loading ? "Sending..." : "Submit Ticket"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Options Cards */}
            <div className="space-y-4">
              {contactOptions.map((opt, idx) => {
                const Icon = opt.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + idx * 0.1 }}
                    className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4"
                  >
                    <div className={`p-3 rounded-xl \${opt.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{opt.title}</h3>
                      <p className="font-medium text-slate-800 my-1">{opt.value}</p>
                      <p className="text-sm text-slate-500">{opt.note}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* FAQ Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl"
            >
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Quick Answers
              </h3>
              <div className="space-y-4">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="border-b border-slate-800 pb-4 last:border-0 last:pb-0">
                    <h4 className="font-semibold text-slate-200 mb-1">{faq.q}</h4>
                    <p className="text-sm text-slate-400">{faq.a}</p>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
