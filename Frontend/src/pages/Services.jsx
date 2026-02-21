const Services = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-10 text-center">

      <h1 className="text-4xl font-bold mb-10">Our Services</h1>

      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white p-6 shadow rounded-xl">
          <h3 className="font-bold text-xl mb-2">Resume Builder</h3>
          <p>Create professional resumes easily.</p>
        </div>

        <div className="bg-white p-6 shadow rounded-xl">
          <h3 className="font-bold text-xl mb-2">Job Alerts</h3>
          <p>Get notified about new openings.</p>
        </div>

        <div className="bg-white p-6 shadow rounded-xl">
          <h3 className="font-bold text-xl mb-2">Career Guidance</h3>
          <p>Expert career suggestions.</p>
        </div>

        <div className="bg-white p-6 shadow rounded-xl">
          <h3 className="font-bold text-xl mb-2">Skill Assessment</h3>
          <p>Test and improve your skills.</p>
        </div>

        <div className="bg-white p-6 shadow rounded-xl">
          <h3 className="font-bold text-xl mb-2">Recruitment Tools</h3>
          <p>Manage candidates efficiently.</p>
        </div>

      </div>

    </div>
  );
};

export default Services;
