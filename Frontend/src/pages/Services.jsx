import { useState } from "react";

const serviceItems = [
  {
    title: "Resume Builder",
    desc: "Create a basic ATS-friendly resume using your profile details and export-ready sections.",
    action: "Build Resume",
    resultTitle: "Resume Builder Demo",
    resultText: "Start by completing your profile, education, skills, and experience. The system can then generate a simple ATS-friendly resume preview.",
  },
  {
    title: "Job Alerts",
    desc: "Save your preferred role/location and get alerts for matching jobs.",
    action: "Set Alerts",
    resultTitle: "Job Alerts Setup",
    resultText: "Choose a job title, preferred city, and experience level. Matching openings can be shown in your dashboard notifications.",
  },
  {
    title: "Interview Prep",
    desc: "Practice common HR and technical interview questions by role.",
    action: "Start Prep",
    resultTitle: "Interview Prep Practice",
    resultText: "You can add role-based question sets (HR, technical, and scenario rounds) and track completed practice sessions.",
  },
  {
    title: "Salary Insights",
    desc: "Check basic salary ranges by role, experience and location.",
    action: "View Insights",
    resultTitle: "Salary Insights Preview",
    resultText: "Display salary ranges using job role, years of experience, and city. Later this can be connected to real datasets or APIs.",
  },
];

const Services = () => {
  const [activeService, setActiveService] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-4xl font-bold mb-10 text-center">Services</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {serviceItems.map((item) => (
          <div key={item.title} className="bg-white p-6 shadow rounded-xl">
            <h3 className="font-bold text-xl mb-2">{item.title}</h3>
            <p className="text-gray-600 mb-4">{item.desc}</p>
            <button
              onClick={() => setActiveService(item)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {item.action}
            </button>
          </div>
        ))}
      </div>

      {activeService && (
        <div className="bg-blue-50 border border-blue-200 mt-8 p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold text-blue-700 mb-2">
            {activeService.resultTitle}
          </h2>
          <p className="text-gray-700">{activeService.resultText}</p>
        </div>
      )}

      <div className="bg-white mt-8 p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-3">Note</h2>
        <p className="text-gray-600">
          These are simple demo features for a recruitment platform portfolio project. You can expand
          them later with templates, saved alerts, question banks and salary analytics.
        </p>
      </div>
    </div>
  );
};

export default Services;
