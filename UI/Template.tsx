"use client";
import TemplateCard from "@/components/TemplateCard";
import React, { useState } from "react";

const data = [
  { text: "Rental Aggreement" },
  { text: "Vehicle Rentals" },
  { text: "Employer" },
  { text: "Subcontractor" },
  { text: "Accouting" },
  { text: "Demand Note" },
  { text: "Equipment License" },
  { text: "cofounder Aggrement" },
  { text: "Eviction Notice" },
  { text: "Fund Raising" },
  { text: "Loan Aggreement" },
  { text: "Patnership" },
];

const Template: React.FC = () => {
  const [search, setSearch] = useState("");

  return (
    <div className="bg-white p-8 my-4 mb-[-1%] text-center">
      <div className="mx-auto sm:max-w-xl md:max-w-full mb-10 mt-10 lg:max-w-screen-xl">
        <h1 className="text-3xl font-bold mb-8">
          Generate Documents From 10,000+ Templates
        </h1>
        <div className="flex justify-center mb-8 space-x-2">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            placeholder="Search for Editable documents such as Rental Agreements .... e.t.c."
            className="w-3/4 md:w-1/2 border border-gray-300 rounded-lg shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors">
            Search
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {data.map((item, idx) => (
            <TemplateCard key={idx} text={item.text} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Template;