import ForlawCards from "@/components/ForlawCards";

export default function ForLawyers() {
  return (
    <div>
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="text-center space-y-6">
          <h1 className="text-5xl md:text-4xl font-extrabold text-black bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent animate-pulse">Coming Soon...</h1>
            <h3 className="text-3xl md:text-3xl font-extrabold text-gray-800">For Lawyers</h3>
            <p className="text-lg md:text-xl text-gray-600">
              Case Management System built for India
            </p>
            <p className="text-blue-600 font-semibold text-lg">
              Add-Assign-Track-Record
            </p>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start my-8 space-y-6 md:space-y-0 md:space-x-6">
            <div className="w-full md:w-1/6 xl:w-1/6 grid grid-cols-1 gap-6 sm:w-1/4">
              <ForlawCards name={"DOCS"} img={"/forlawyers/ic1Doc.png"} />
              <ForlawCards name={"TimeSheets"} img={"/forlawyers/ic2Doc.png"} />
              <ForlawCards name={"Dashboard"} img={"/forlawyers/ic3Doc.png"} />
              <ForlawCards name={"Lists"} img={"/forlawyers/ic4Doc.png"} />
            </div>
            <div className="w-full md:w-2/3 lg:w-2/3 sm:w-3/4">
              <img
                src="/forlawyers dashboard.png"
                alt="Case Management Dashboard"
                className="w-full h-auto rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </div>
      <section className="bg-white py-16">
        <div className="container mx-auto px-6 md:px-12 lg:px-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
            Manage Cases Efficiently & Boost Productivity
          </h1>
          <h3 className="text-xl md:text-2xl text-gray-700 mb-12">
            All in One Place
          </h3>
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/3 xl:w-2/3 text-left space-y-6">
              <p className="text-gray-800 text-lg leading-relaxed">
                Assign cases to your team, plan unique teams for every case, centralize case monitoring, and record audit trails of every case with individual dashboards.
              </p>
              <div className="flex flex-wrap md:w-[70%] gap-4">
                <button className="px-6 py-3 hover:border-black bg-black text-white rounded-lg shadow-md hover:bg-white hover:text-black hover:shadow-lg transition duration-300">
                  Create Tasks
                </button>
                <button className="px-6 py-3 bg-black text-white rounded-lg shadow-md hover:bg-white hover:text-black hover:shadow-lg transition duration-300">
                  Generate Documents
                </button>
                <button className="px-6 py-3 bg-black text-white rounded-lg shadow-md hover:bg-white hover:text-black hover:shadow-lg transition duration-300">
                  Assign Cases
                </button>
                <button className="px-6 py-3 bg-black text-white rounded-lg shadow-md hover:bg-white hover:text-black hover:shadow-lg transition duration-300">
                  Maintain Case History
                </button>
              </div>
              <p className="text-gray-900 font-semibold text-lg mt-8">
                Automated Dashboards with actionable insights
              </p>
            </div>
            <div className="md:w-[70%] xl:w-2/3 mt-8 md:mt-0">
              <img
                src="/forlawyers dashboard.png"
                alt="Case Management Dashboard"
                className="w-full h-auto rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
