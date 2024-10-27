"use client"
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import Checkboxes from "@/components/Checkboxes";
import LoadingSpinner from "./LoadingSpinner";

interface City {
  id: number;
  name: string;
}

interface Lawyer {
  id: number;
  profile_picture: string;
  city__name: string;
  name: string;
  ratings_average: number;
  reviews_count: number;
  practice: string;
}

interface FormData {
  specializations: number[];
}

interface Errors {
  specializations?: string;
}

interface Practice {
  id: number;
  practice_name: string;
  specializations: {
    id: number;
    specialization_name: string;
  }[];
}

export default function LawyerDirectory() {
  const [formData, setFormData] = useState<FormData>({ 
    specializations: []
  });
  const [errors, setErrors] = useState<Errors>({});

  const [allLawyers, setAllLawyers] = useState<Lawyer[]>([]);
  const [filteredLawyers, setFilteredLawyers] = useState<Lawyer[]>([]);
  const [displayedLawyers, setDisplayedLawyers] = useState<Lawyer[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const lawyersPerPage = 12;

  const [cities, setCities] = useState<City[]>([]);
  const [practices, setPractices] = useState<Practice[]>([]);
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showArea, setShowArea] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const [fieldsResponse, lawyersResponse] = await Promise.all([
          axios.get("https://api.legalbooks.in/api/v1/register/fields?role=lawyer"),
          axios.post("https://api.legalbooks.in/api/v1/lawyer-directory/search")
        ]);

        const allCities = fieldsResponse.data.data.states.flatMap((state: any) => state.cities);
        setCities(allCities);
        setPractices(fieldsResponse.data.data.practices);

        const apiLawyers: Lawyer[] = lawyersResponse.data.data;
        setAllLawyers(apiLawyers);
        setFilteredLawyers(apiLawyers);
        setDisplayedLawyers(apiLawyers.slice(0, lawyersPerPage));
      } catch (error) {
        console.error("Error fetching initial data:", error);
        setApiError("Failed to fetch initial data. Please try again later.");
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const getImageSrc = (profilePicture: string, name: string): string => {
    if (profilePicture && profilePicture.startsWith('http')) {
      return profilePicture;
    } else if (profilePicture) {
      return `https://api.legalbooks.in/media/${profilePicture}`;
    } else {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=144`;
    }
  };
  
  const filterLawyers = () => {
    let filtered = allLawyers;

    if (formData.specializations.length > 0) {
      filtered = filtered.filter(lawyer => 
        formData.specializations.some(spec => lawyer.practice.includes(spec.toString()))
      );
    }

    if (selectedCityId) {
      filtered = filtered.filter(lawyer => lawyer.city__name === cities.find(city => city.id === selectedCityId)?.name);
    }

    setFilteredLawyers(filtered);
    setDisplayedLawyers(filtered.slice(0, lawyersPerPage));
    setCurrentPage(1);
  };

  const loadMore = () => {
    setCurrentPage(prevPage => prevPage + 1);
    const nextLawyers = filteredLawyers.slice(0, (currentPage + 1) * lawyersPerPage);
    setDisplayedLawyers(nextLawyers);
  };

  const handleAreaofPractice = () => {
    setShowArea(true);
  };

  const handleSelection = (selectedSpecializations: number[]) => {
    setFormData(prev => ({ ...prev, specializations: selectedSpecializations }));
    setShowArea(false);
  };

  const renderStars = (rating: number) => {
    const roundedRating = Math.round(rating);
    return (
      <div className="text-yellow-400 text-xl mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star}>
            {star <= roundedRating ? '★' : '☆'}
          </span>
        ))}
      </div>
    );
  };

  return (
    <section className="text-center py-16 bg-gray-100 min-h-screen relative">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-extrabold mb-10 text-black tracking-tight">Search For Lawyer</h1>
    
        <div className="mb-16">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="w-full md:w-72" id="search-custom-lawyer-container">
              <button
                type="button"
                className="w-full p-4 border border-green-300 bg-white rounded-md shadow-md outline-none hover:border-green-400 transition-all duration-300 text-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                onClick={handleAreaofPractice}
              >
                {formData.specializations.length > 0 ? `${formData.specializations.length} specialization(s) selected` : "Select Specializations"}
              </button>
              {errors.specializations && <p className="text-red-500 text-xs mt-1">{errors.specializations}</p>}
            </div>

            <div className="w-full md:w-72">
              <select
                className="w-full p-4 border border-green-300 bg-white rounded-md shadow-md outline-none hover:border-green-400 transition-all duration-300 text-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                onChange={(e) => setSelectedCityId(Number(e.target.value) || null)}
                value={selectedCityId || ""}
                disabled={isLoading}
              >
                <option value="">Select a City</option>
                {!isLoading && cities.map((city) => (
                  <option key={city.id} value={city.id}>{city.name}</option>
                ))}
              </select>
            </div>

            <button 
              className="w-full md:w-auto bg-green-600 text-white p-4 px-10 rounded-md shadow-md hover:bg-green-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
              onClick={filterLawyers}
            >
              Search
            </button>
          </div>
        </div>
    
        {isError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{apiError}</span>
          </div>
        )}

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {displayedLawyers.length > 0 ? (
              displayedLawyers.map((lawyer) => (
                <a 
                  href={`/lawyers-directory/lawyer-info?id=${lawyer.id}`}
                  key={lawyer.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-xl cursor-pointer"
                >
                  <div className="bg-green-600 text-white w-full text-lg font-semibold p-4 transition-all duration-300">
                    {lawyer.practice || "General Practice"}
                  </div>
                  <div className="p-6">
                    <div className="relative w-36 h-36 mx-auto mb-6">
                      <Image
                        src={getImageSrc(lawyer.profile_picture, lawyer.name)}
                        alt={lawyer.name}
                        width={144}
                        height={144}
                        className="rounded-full border-4 border-white shadow-lg"
                      />
                    </div>
                    <h3 className="text-2xl font-bold mb-2 text-green-800">{lawyer.name}</h3>
                    <p className="mb-3 text-green-600">{lawyer.city__name}</p>
                    {renderStars(lawyer.ratings_average)}
                    <p className="text-sm text-green-500 font-medium">{lawyer.reviews_count} Reviews</p>
                  </div>
                </a>
              ))
            ) : (
              <div className="col-span-full text-center">No lawyers found. Try adjusting your search criteria.</div>
            )}
          </div>
        )}

        {!isLoading && displayedLawyers.length < filteredLawyers.length && (
          <div className="mt-10 text-center">
            <button 
              onClick={loadMore}
              className="bg-green-600 text-white py-2 px-6 rounded-xl shadow-md hover:bg-green-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
            >
              Load More
            </button>
          </div>
        )}
      </div>

      {showArea && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <Checkboxes 
              options={practices}
              selected={formData.specializations}
              onChange={handleSelection}
              onSubmit={() => setShowArea(false)}
              onClose={() => setShowArea(false)}
            />
          </div>
        </div>
      )}
    </section>
  );
}