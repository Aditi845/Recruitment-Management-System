const contactOptions = [
  {
    title: "General Support",
    value: "support@rmsportal.com",
    note: "For account help, login issues, and platform questions.",
  },
  {
    title: "Recruiter Assistance",
    value: "recruiters@rmsportal.com",
    note: "For posting jobs, managing applicants, and hiring workflow support.",
  },
  {
    title: "Call Us",
    value: "+1 (800) 555-0199",
    note: "Monday to Friday, 9:00 AM to 6:00 PM.",
  },
];

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4">Contact Us</h1>
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-10">
          Need help with applications, recruiter workflows, or account access?
          Reach out to our team and we will get back to you as soon as possible.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {contactOptions.map((item) => (
            <div key={item.title} className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-bold mb-2">{item.title}</h2>
              <p className="text-blue-600 font-medium mb-2">{item.value}</p>
              <p className="text-gray-600 text-sm">{item.note}</p>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-4">Send a Message</h2>
          <form className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              className="border rounded px-4 py-3"
            />
            <input
              type="email"
              placeholder="Email Address"
              className="border rounded px-4 py-3"
            />
            <input
              type="text"
              placeholder="Subject"
              className="border rounded px-4 py-3 md:col-span-2"
            />
            <textarea
              rows="5"
              placeholder="Write your message..."
              className="border rounded px-4 py-3 md:col-span-2"
            />
            <div className="md:col-span-2">
              <button
                type="button"
                onClick={() => alert("Contact form demo submitted")}
                className="bg-blue-600 text-white px-6 py-3 rounded"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
