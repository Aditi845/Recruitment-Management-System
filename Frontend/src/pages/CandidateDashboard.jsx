const CandidateDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-3xl font-bold mb-8">
        Candidate Dashboard
      </h1>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">

        <div className="bg-white p-6 shadow rounded">
          Applied Jobs: 5
        </div>

        <div className="bg-white p-6 shadow rounded">
          Interviews: 2
        </div>

        <div className="bg-white p-6 shadow rounded">
          Saved Jobs: 7
        </div>

      </div>

      {/* Recommended Jobs */}
      <h2 className="text-2xl font-bold mb-4">
        Recommended Jobs
      </h2>

      <div className="bg-white p-6 rounded shadow">
        React Developer — Infosys (Pune)
        <button className="ml-4 bg-blue-600 text-white px-3 py-1 rounded">
          Apply
        </button>
      </div>

    </div>
  );
};

export default CandidateDashboard;
