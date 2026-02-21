const JobCard = ({ job }) => {
  return (
    <div className="border rounded-lg p-5 shadow hover:shadow-lg">
      <h3 className="text-xl font-semibold">{job.title}</h3>
      <p className="text-gray-600">{job.company}</p>
      <p className="text-gray-500">{job.location}</p>

      <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
        Apply
      </button>
    </div>
  );
};

export default JobCard;
