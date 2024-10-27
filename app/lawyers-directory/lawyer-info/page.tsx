"use client";

import React, { useEffect, useState, useRef, useCallback  } from 'react';
import axios from 'axios';
import { Bold, X } from 'lucide-react';
import  Login  from '@/app/login/page';

interface LawyerProfile {
  id: number | undefined;
  name: string;
  profile_photo: string;
  average_rating: number;
  specializations: {
    id: number;
    specialization_name: string;
    practice: string;
  }[];
  practice: string;
  email: string;
  mobile: string;
  experience_years: number;
  experience_months: number;
  about: string;
  address: string;
  courts: Array<string | { name: string }>;
  user_id: number | undefined;
}

interface NewReview {
  rating: number;
  review: string;
}


interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  isClickable?: boolean;
}

interface Review {
  id: string;
  rating: number;
  review: string;
  user: number;
  created_by: {
    id: number;
    name: string;
  };
  created_at?: string;
}

interface ReviewsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Review[];
}

interface ApiReview {
  id: string;
  rating: number;
  review: string;
  user: number;
  created_by: {
    id: number;
    name: string;
  };
}

interface UserData {
  id: number;
  name: string;
  email: string;
}

export default function LawyerProfile() {
  const [profile, setProfile] = useState<LawyerProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAddReview, setShowAddReview] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isCreatingReview, setIsCreatingReview] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [previousPage, setPreviousPage] = useState<string | null>(null);
  const [newReview, setNewReview] = useState<NewReview>({ rating: 0, review: '' });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [reviewsPerPage] = useState(5);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [animateReviews, setAnimateReviews] = useState(false);
  const [totalReviews, setTotalReviews] = useState(0);
  const [sortOption, setSortOption] = useState('latest');
  const [userId, setUserId] = useState<number | null>(null);
  const reviewPopupRef = useRef<HTMLDivElement>(null);
  const loginPopupRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [canSubmitReview, setCanSubmitReview] = useState(false);
  const [lawyerIdFromUrl, setLawyerIdFromUrl] = useState<string | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get('id');
    if (id) {
      setLawyerIdFromUrl(id);
      fetchLawyerProfile(id);
      fetchLawyerReviews(id, 1);
    } else {
      setError('No lawyer ID provided');
    }

    const userDetails = localStorage.getItem("user_details");
    if (userDetails) {
      setUser(JSON.parse(userDetails));
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  useEffect(() => {
    if (showLoginPopup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to ensure scroll is restored when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showLoginPopup]);
  
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (reviewPopupRef.current && !reviewPopupRef.current.contains(event.target as Node)) {
      setShowAddReview(false);
      setErrorMessage(null);
    }
  }, []);

  const handleLoginBackdropClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    // Get the clicked element
    const target = event.target as HTMLElement;
    
    // Check if the clicked element has the backdrop class or is the backdrop itself
    if (target.classList.contains('bg-black/50')) {
      setShowLoginPopup(false);
      setErrorMessage(null);
    }
  }, []);

  const handleAddReviewClick = () => {
    const userDetails = localStorage.getItem("user_details");
    if (userDetails) {
      setUser(JSON.parse(userDetails));
      setShowAddReview(true);
      setErrorMessage(null);
    } else {
      setShowLoginPopup(true);
    }
  };

  useEffect(() => {
    if (profile && profile.name) {
      setCanSubmitReview(true);
    }
  }, [profile]);

  const fetchLawyerProfile = useCallback(async (lawyerId: string) => {
    try {
      const response = await axios.get(`https://api.legalbooks.in/api/v1/lawyer-directory/profile/${lawyerId}`);
      if (response.data && response.data.data) {
        setProfile(response.data.data);
      } else {
        throw new Error('Invalid API response structure');
      }
    } catch (err) {
      console.error('Error fetching lawyer profile:', err);
      setError('Failed to fetch lawyer profile. Please try again.');
    }
  }, []);

  useEffect(() => {
    const checkLoginStatus = setInterval(() => {
      const userDetails = localStorage.getItem("user_details");
      if (userDetails && showLoginPopup) {
        clearInterval(checkLoginStatus);
        window.location.reload();
      }
    }, 500);

    return () => clearInterval(checkLoginStatus);
  }, [showLoginPopup]);
  
  const fetchLawyerReviews = async (lawyerId: string, page: number = 1) => {
    setIsLoadingReviews(true);
    setAnimateReviews(true);
    try {
      const response = await axios.get<ReviewsResponse>(`https://api.legalbooks.in/api/v1/reviews`, {
        params: {
          user: lawyerId,
          page,
          length: reviewsPerPage,
          sort: sortOption
        }
      });
      setTimeout(() => {
        setReviews(response.data.results);
        setNextPage(response.data.next);
        setPreviousPage(response.data.previous);
        setCurrentPage(page);
        setTotalReviews(response.data.count);
        setAnimateReviews(false);
      }, 300);
    } catch (error) {
      console.error('Error fetching lawyer reviews:', error);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get('id');
    if (id) {
      fetchLawyerReviews(id, newPage);
    }
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortOption = event.target.value;
    setSortOption(newSortOption);
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get('id');
    if (id) {
      fetchLawyerReviews(id, 1);
    }
  };
  
  const createReview = async () => {

    if (!canSubmitReview) {
      setErrorMessage('Please wait a moment before submitting a review.');
      return;
    }

    if (!newReview.review) {
      setErrorMessage('Please enter a review.');
      return;
    }

    if (!user) {
      setErrorMessage('Unable to submit review. User is not logged in.');
      return;
    }

    if (!profile) {
      setErrorMessage('Unable to submit review. Lawyer profile information is missing.');
      return;
    }

    const lawyerId = lawyerIdFromUrl || profile.id || profile.user_id;

    if (!lawyerId) {
      setErrorMessage('Unable to submit review. Lawyer ID is missing.');
      return;
    }

    try {
      setIsCreatingReview(true);
      setErrorMessage(null);

      const reviewData = {
        user: lawyerId,
        rating: Math.round(newReview.rating),
        review: newReview.review
      };

      const accessToken = localStorage.getItem('access_token');

      if (!accessToken) {
        setErrorMessage('Authentication token not found. Please log in again.');
        return;
      }

      console.log('Sending review data:', reviewData);

      const response = await axios.post<ApiReview>(
        'https://api.legalbooks.in/api/v1/reviews',
        reviewData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const newReviewObj: Review = {
        id: response.data.id,
        rating: response.data.rating,
        review: response.data.review,
        user: response.data.user,
        created_by: response.data.created_by,
        created_at: new Date().toISOString(),
      };

      setReviews(prevReviews => [newReviewObj, ...prevReviews]);
      setNewReview({ rating: 0, review: '' });
      setShowAddReview(false);
      setTotalReviews(prev => prev + 1);

    } catch (error) {
      console.error('Error creating review:', error);
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          setErrorMessage('Your session has expired. Please log in again.');
        } else if (error.response.status === 400) {
          const errorMessage = error.response.data.user?.[0] || 'Invalid review data. Please check your input and try again.';
          setErrorMessage(errorMessage);
        } else {
          setErrorMessage('Failed to create review. Please try again.');
        }
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsCreatingReview(false);
    }
  };

  useEffect(() => {
    localStorage.setItem('newReview', JSON.stringify(newReview));
  }, [newReview]);

  const calculateAverageRating = (reviews: Review[]): number => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  const averageRating = calculateAverageRating(reviews);

  const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange, isClickable = true }) => {
    const [hoverRating, setHoverRating] = useState(0);
  
    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>, starIndex: number) => {
      if (!isClickable) return;
      const star = event.currentTarget;
      const rect = star.getBoundingClientRect();
      const starWidth = rect.width;
      const mouseX = event.clientX - rect.left;
      const percentage = mouseX / starWidth;
      
      if (percentage <= 0.5) {
        setHoverRating(starIndex + 0.5);
      } else {
        setHoverRating(starIndex + 1);
      }
    };
  
    const handleMouseLeave = () => {
      if (isClickable) {
        setHoverRating(0);
      }
    };
  
    const handleClick = (starIndex: number, event: React.MouseEvent<HTMLDivElement>) => {
      if (!isClickable) return;
      const star = event.currentTarget;
      const rect = star.getBoundingClientRect();
      const starWidth = rect.width;
      const mouseX = event.clientX - rect.left;
      const percentage = mouseX / starWidth;
      
      if (percentage <= 0.5) {
        onRatingChange(starIndex + 0.5);
      } else {
        onRatingChange(starIndex + 1);
      }
    };

    return (
      <div className="flex items-center h-6">
        {[1, 2, 3, 4, 5].map((star) => (
          <div
            key={star}
            className={`text-2xl cursor-${isClickable ? 'pointer' : 'default'} w-6 h-6 relative`}
            onClick={(e) => handleClick(star - 1, e)}
            onMouseMove={(e) => handleMouseMove(e, star - 1)}
            onMouseLeave={handleMouseLeave}
          >
            <span className="absolute top-0 left-0 text-gray-300 leading-none">★</span>
            <span
              className="absolute top-0 left-0 text-yellow-400 overflow-hidden leading-none"
              style={{
                width: `${Math.min(100, Math.max(0, ((hoverRating || rating) - (star - 1)) * 100))}%`,
              }}
            >
              ★
            </span>
          </div>
        ))}
      </div>
    );
  };

  const groupSpecializationsByPractice = (specializations: LawyerProfile['specializations']) => {
    return specializations.reduce((acc, specialization) => {
      if (!acc[specialization.practice]) {
        acc[specialization.practice] = [];
      }
      acc[specialization.practice].push(specialization.specialization_name);
      return acc;
    }, {} as Record<string, string[]>);
  };

  if (!profile) return null;

  const groupedSpecializations = groupSpecializationsByPractice(profile.specializations);

  return (
    <div className="container mx-auto my-4 md:my-12 px-4 md:px-0 max-w-[95%] md:max-w-[90%]">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <h1 className="text-2xl md:text-3xl font-bold p-4 md:p-6 bg-gray-50">Lawyer Profile</h1>

        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-1/3 p-4 md:p-6 bg-white">
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden mb-4">
                <img 
                  src={profile.profile_photo || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"} 
                  alt={profile.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-center">{profile.name}</h2>
              <p className="text-gray-600 text-xs text-center mt-2">{profile.address}</p>
              <div className="flex items-center mt-2">
                <StarRating rating={averageRating} onRatingChange={() => {}} isClickable={false} />
                <span className="ml-2 text-xs text-gray-600">
                  ({totalReviews} Reviews)
                </span>
              </div>
            </div>

            <div className="mb-6 rounded-md py-4 px-4 md:py-5 md:px-5 bg-gray-50">
              <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
              <p className="text-gray-700 my-1 text-sm text-justify"><strong>Email:</strong> {profile.email}</p>
              <p className="text-gray-700 my-1 text-sm text-justify"><strong>Mobile:</strong> {profile.mobile}</p>
              <p className="text-gray-700 my-1 text-sm text-justify"><strong>Address:</strong> {profile.address}</p>
            </div>

            {profile.courts && profile.courts.length > 0 && (
              <div className="mb-6 rounded-md py-4 px-4 md:py-5 md:px-5 bg-gray-50">
                <h3 className="text-lg font-semibold mb-2">Courts</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.courts.map((court, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs md:text-sm">
                      {typeof court === 'string' ? court : court.name || 'Unknown Court'}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-md py-4 px-4 md:py-5 md:px-5 bg-gray-50">
              <h3 className="text-lg font-semibold mb-2">Experience</h3>
              <p className="text-gray-700 text-sm text-justify">{profile.experience_years} years {profile.experience_months} months</p>
              </div>
          </div>

          <div className="w-full lg:w-2/3 p-4 md:p-6">
            <div className="mb-6 rounded-md py-4 px-4 md:py-5 md:px-5 bg-gray-50">
              <h3 className="text-lg font-semibold mb-2">About</h3>
              <p className="text-gray-700 leading-relaxed text-justify text-sm md:text-base">{profile.about || 'No information available.'}</p>
            </div>

            <div className="mb-6 rounded-md py-4 px-4 md:py-5 md:px-5 bg-gray-50">
              <h3 className="text-lg font-semibold mb-4">Areas of Practice</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(groupedSpecializations).map(([practice, specializations]) => (
                  <div key={practice} className="bg-white shadow-md p-3 md:p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-gray-800 text-sm md:text-base">{practice}</h4>
                    <div className="flex flex-wrap gap-2">
                      {specializations.map((specialization, index) => (
                        <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs md:text-sm">
                          {specialization}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-md py-4 px-4 md:py-5 md:px-5 bg-gray-50">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <h3 className="text-lg font-semibold mb-2 sm:mb-0">Reviews</h3>
                <div className="flex items-center mt-2 sm:mt-0">
                  <select 
                    className="border rounded-md px-2 py-1 text-sm bg-white mr-2"
                    value={sortOption}
                    onChange={handleSortChange}
                  >
                    <option value="latest">Latest</option>
                    <option value="top_rated">Top Rated</option>
                    <option value="most_helpful">Most Helpful</option>
                  </select>
                  <button
                    className="bg-blue-500 text-white px-3 py-1 text-sm font-medium rounded hover:bg-blue-600 transition"
                    onClick={handleAddReviewClick}
                  >
                    Add Review
                  </button>
                </div>
              </div>
              <div className={`transition-opacity duration-300 ${animateReviews ? 'opacity-0' : 'opacity-100'}`}>
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review.id} className="mb-5 p-3 md:p-4 bg-white rounded-lg shadow-md">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs md:text-sm mr-3">
                          {review.created_by.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-semibold text-sm md:text-md">{review.created_by.name}</span>
                          <div className="flex items-center text-sm">
                            <StarRating
                              rating={review.rating}
                              onRatingChange={() => {}}
                              isClickable={false}
                            />
                            <span className="text-gray-600 ml-2 text-xs">{review.created_at}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 mt-2 text-justify text-xs md:text-sm">{review.review}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-600 italic text-sm">
                    No reviews available at this time.
                  </div>
                )}
              </div>
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!previousPage || isLoadingReviews}
                  className="px-3 py-1 mr-1 text-sm bg-blue-500 text-white rounded-l disabled:bg-gray-300 transition"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!nextPage || isLoadingReviews}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded-r disabled:bg-gray-300 transition"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Popup */}
      {showLoginPopup && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 items-center min-w-full"
          onClick={handleLoginBackdropClick}
        >
          <div>
            <Login />
          </div>
        </div>
      )}

      {/* Review Popup */}
      {showAddReview && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div 
            ref={reviewPopupRef} 
            className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 opacity-100"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Add Review</h3>
                  <p className="text-gray-600 mt-1">Share your experience with others</p>
                </div>
                <button
                  onClick={() => {
                    setShowAddReview(false);
                    setErrorMessage(null);
                  }}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <StarRating
                    rating={newReview.rating}
                    onRatingChange={(rating) => setNewReview({ ...newReview, rating })}
                  />
                </div>

                <div>
                  <label 
                    htmlFor="review" 
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Your Review
                  </label>
                  <textarea
                    id="review"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm"
                    value={newReview.review}
                    onChange={(e) => setNewReview({ ...newReview, review: e.target.value })}
                    rows={4}
                    placeholder="Tell us about your experience..."
                  ></textarea>
                </div>

                {errorMessage && (
                  <div className="bg-red-50 text-red-500 text-sm rounded-lg p-3">
                    {errorMessage}
                  </div>
                )}

                <div className="flex justify-end gap-3">
                  <button
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                    onClick={() => {
                      setShowAddReview(false);
                      setErrorMessage(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50"
                    onClick={createReview}
                    disabled={isCreatingReview}
                  >
                    {isCreatingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}