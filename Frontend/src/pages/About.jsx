const About = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-4xl font-bold text-center mb-8">
        About Recruitment Management System
      </h1>

      <p className="max-w-4xl mx-auto text-lg text-gray-700 text-center">
        Recruitment Management System is a MERN stack based platform
        designed to simplify hiring processes. Candidates can search,
        apply and track jobs while recruiters can post openings and
        manage applicants efficiently.
      </p>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6 mt-12">

        <div className="bg-white p-6 shadow rounded-xl">
          Smart Job Matching
        </div>

        <div className="bg-white p-6 shadow rounded-xl">
          Role Based Dashboards
        </div>

        <div className="bg-white p-6 shadow rounded-xl">
          Easy Hiring Workflow
        </div>

      </div>

      {/* Tech Stack */}
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Technology Used</h2>
        <p>MERN Stack — MongoDB, Express, React, Node.js</p>
      </div>

    </div>
  );
};

export default About;
