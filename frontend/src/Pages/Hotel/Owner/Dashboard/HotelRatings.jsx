import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { FaChevronLeft, FaChevronRight, FaStar } from "react-icons/fa";
import Swal from "sweetalert2";

function HotelRatingManagement() {
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    useEffect(() => {
        fetchRatings();
    }, []);

    const fetchRatings = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/hotel-ratings`, {
                method: "GET",
                credentials: "include",
            });
            if (!response.ok) throw new Error("Failed to fetch ratings");
            const data = await response.json();
            setRatings(data.data || []);
        } catch (err) {
            setError(err.message);
            Swal.fire("Error!", err.message, "error");
        } finally {
            setLoading(false);
        }
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const renderStars = (rating) => {
        return (
            <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                    <FaStar
                        key={i}
                        className={`${i < rating ? 'text-yellow-400' : 'text-gray-400'} text-lg`}
                    />
                ))}
            </div>
        );
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentRatings = ratings.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(ratings.length / itemsPerPage);

    return (
        <div className="h-full w-full py-8 px-4 md:px-6 font-poppins bg-black text-white">
            <Helmet>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" />
            </Helmet>
            <h1 className="text-3xl md:text-4xl font-semibold text-red-500 mb-4 md:mb-6 text-center">Hotel Ratings & Feedback</h1>
            <p className="text-base md:text-lg text-red-400 mb-6 text-center">View all hotel ratings and customer feedback</p>

            <div className="flex flex-col md:flex-row justify-end mb-6 gap-4">
                <div className="flex items-center">
                    <label className="text-base text-red-400 font-semibold mr-3">Rows per page:</label>
                    <select
                        value={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                        className="p-2 border border-gray-600 rounded text-white text-base bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center">
                    <div className="animate-spin border-t-4 border-red-500 rounded-full w-12 h-12"></div>
                </div>
            ) : (
                <div className="space-y-4">
                    {ratings.length === 0 ? (
                        <div className="w-full py-8 md:py-12 text-center bg-black rounded-lg shadow-lg border border-gray-700">
                            <div className="mx-auto max-w-2xl p-4 md:p-6">
                                <div className="text-5xl md:text-6xl mb-4 text-red-500">⭐</div>
                                <h2 className="text-xl md:text-2xl font-bold text-red-400 mb-2">
                                    No Ratings Found
                                </h2>
                                <p className="text-base md:text-lg text-gray-300">
                                    There are no ratings to display.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Table Headings */}
                            <div className="hidden md:flex bg-red-600 text-white rounded-lg p-4">
                                <div className="w-3/12 text-left font-semibold text-lg">Hotel</div>
                                <div className="w-2/12 text-left font-semibold text-lg">User</div>
                                <div className="w-1/12 text-left font-semibold text-lg">Rating</div>
                                <div className="w-5/12 text-left font-semibold text-lg">Feedback</div>
                                <div className="w-1/12 text-left font-semibold text-lg">Date</div>
                            </div>

                            {/* Rating Rows */}
                            <div className="hidden md:block">
                                {currentRatings.map((rating) => (
                                    <div
                                        key={rating._id}
                                        className="flex flex-row items-center justify-between bg-gray-800 rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow duration-300 mb-4"
                                    >
                                        <div className="w-3/12 text-left">
                                            <p className="text-white">{rating.hotel?.name || "N/A"}</p>
                                        </div>
                                        <div className="w-2/12 text-left">
                                            <p className="text-white">{rating.user?.email || "Anonymous"}</p>
                                        </div>
                                        <div className="w-1/12 text-left">
                                            {renderStars(rating.rating)}
                                        </div>
                                        <div className="w-5/12 text-left">
                                            <p className="text-white">{rating.review || "No feedback provided"}</p>
                                        </div>
                                        <div className="w-1/12 text-left">
                                            <p className="text-sm text-gray-400">{formatDate(rating.createdAt)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Rating Cards (Mobile) */}
                            <div className="md:hidden space-y-4">
                                {currentRatings.map((rating) => (
                                    <div
                                        key={rating._id}
                                        className="bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
                                    >
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-sm text-red-400 font-medium">Hotel</p>
                                                    <p className="text-white">{rating.hotel?.name || "N/A"}</p>
                                                </div>
                                                <p className="text-sm text-gray-400">{formatDate(rating.createdAt)}</p>
                                            </div>

                                            <div>
                                                <p className="text-sm text-red-400 font-medium">User</p>
                                                <p className="text-white">{rating.user?.email || "Anonymous"}</p>
                                            </div>

                                            <div>
                                                <p className="text-sm text-red-400 font-medium">Rating</p>
                                                {renderStars(rating.rating)}
                                            </div>

                                            <div>
                                                <p className="text-sm text-red-400 font-medium">Feedback</p>
                                                <p className="text-white">{rating.review || "No feedback provided"}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            <div className="flex justify-center mt-6 mb-12">
                                <nav className="flex items-center gap-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="p-3 text-white bg-gray-800 rounded-lg shadow-sm hover:bg-gray-700 disabled:opacity-50 transition-colors duration-200"
                                    >
                                        <FaChevronLeft className="w-6 h-6" />
                                    </button>

                                    <div className="flex items-center gap-2">
                                        {totalPages <= 7 ? (
                                            Array.from({ length: totalPages }, (_, index) => (
                                                <button
                                                    key={index + 1}
                                                    onClick={() => handlePageChange(index + 1)}
                                                    className={`p-3 min-w-[3rem] text-center rounded-lg shadow-sm ${currentPage === index + 1
                                                        ? "bg-red-600 text-white hover:bg-red-700"
                                                        : "bg-gray-800 text-white hover:bg-gray-700"
                                                        } transition-colors duration-200`}
                                                >
                                                    {index + 1}
                                                </button>
                                            ))
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => handlePageChange(1)}
                                                    className={`p-3 min-w-[3rem] text-center rounded-lg shadow-sm ${currentPage === 1
                                                        ? "bg-red-600 text-white hover:bg-red-700"
                                                        : "bg-gray-800 text-white hover:bg-gray-700"
                                                        } transition-colors duration-200`}
                                                >
                                                    1
                                                </button>

                                                {currentPage > 3 && (
                                                    <span className="px-2 text-gray-500">...</span>
                                                )}

                                                {Array.from({ length: totalPages }, (_, index) => {
                                                    const page = index + 1;
                                                    if (
                                                        page > 1 &&
                                                        page < totalPages &&
                                                        Math.abs(page - currentPage) <= 1
                                                    ) {
                                                        return (
                                                            <button
                                                                key={page}
                                                                onClick={() => handlePageChange(page)}
                                                                className={`p-3 min-w-[3rem] text-center rounded-lg shadow-sm ${currentPage === page
                                                                    ? "bg-red-600 text-white hover:bg-red-700"
                                                                    : "bg-gray-800 text-white hover:bg-gray-700"
                                                                    } transition-colors duration-200`}
                                                            >
                                                                {page}
                                                            </button>
                                                        );
                                                    }
                                                    return null;
                                                })}

                                                {currentPage < totalPages - 2 && (
                                                    <span className="px-2 text-gray-500">...</span>
                                                )}

                                                <button
                                                    onClick={() => handlePageChange(totalPages)}
                                                    className={`p-3 min-w-[3rem] text-center rounded-lg shadow-sm ${currentPage === totalPages
                                                        ? "bg-red-600 text-white hover:bg-red-700"
                                                        : "bg-gray-800 text-white hover:bg-gray-700"
                                                        } transition-colors duration-200`}
                                                >
                                                    {totalPages}
                                                </button>
                                            </>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="p-3 text-white bg-gray-800 rounded-lg shadow-sm hover:bg-gray-700 disabled:opacity-50 transition-colors duration-200"
                                    >
                                        <FaChevronRight className="w-6 h-6" />
                                    </button>
                                </nav>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default HotelRatingManagement;