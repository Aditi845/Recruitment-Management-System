const companies = [
  {name:"Google", jobs:120},
  {name:"Amazon", jobs:95},
  {name:"Microsoft", jobs:80},
  {name:"Infosys", jobs:60},
];

const Companies = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-4xl font-bold text-center mb-10">
        Top Hiring Companies
      </h1>

      <div className="grid md:grid-cols-4 gap-6">
        {companies.map(c => (
          <div
            key={c.name}
            className="bg-white p-6 rounded-xl shadow text-center hover:scale-105 transition"
          >
            <h2 className="text-xl font-bold">{c.name}</h2>
            <p className="text-gray-600 mt-2">
              {c.jobs} Open Positions
            </p>
            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
              View Jobs
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Companies;
