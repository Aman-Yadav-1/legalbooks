'use client'
import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";

interface Lawyer {
  id: number;
  profile_picture: string;
  city__name: string;
  name: string;
  ratings_average: number;
  reviews_count: number;
  practice: string;
}

export default function LawyersMainPage() {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [displayedLawyers, setDisplayedLawyers] = useState<Lawyer[]>([]);
  const [showLoadMore, setShowLoadMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLawyers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.post("https://api.legalbooks.in/api/v1/lawyer-directory/search", {});
        if (response.data.status && response.data.status_code === 200) {
          const fetchedLawyers = response.data.data;
          setLawyers(fetchedLawyers);
          setDisplayedLawyers(fetchedLawyers.slice(0, 4));
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        console.error("Error fetching lawyers:", error);
        setError("Failed to fetch lawyers. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLawyers();
  }, []);

  const loadMore = () => {
    setDisplayedLawyers(lawyers.slice(0, 8));
    setShowLoadMore(false);
  };

  const getImageSrc = (profilePicture: string, name: string): string => {
    if (profilePicture) {
      return `https://api.legalbooks.in/media/${profilePicture}`;
    } else {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=144`;
    }
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

  if (isLoading) {
    return <div className="text-center py-16">Loading lawyers...</div>;
  }

  if (error) {
    return <div className="text-center py-16 text-red-500">{error}</div>;
  }

  return (
    <section className="text-center py-16 bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-extrabold mb-10 text-black tracking-tight">Our Lawyers</h1>
        
        {displayedLawyers.length === 0 ? (
          <div className="text-center py-16">No lawyers found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {displayedLawyers.map((lawyer) => (
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
            ))}
          </div>
        )}

        {showLoadMore && lawyers.length > displayedLawyers.length && (
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
    </section>
  );
}