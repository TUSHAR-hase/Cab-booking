import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { FaEye, FaChevronLeft, FaChevronRight, FaCheck, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";

function HotelBookingManagement() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(null);
    const [currentBooking, setCurrentBooking] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        fetchBookings();
    }, [statusFilter]);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            let url = `${import.meta.env.VITE_API_URL}/api/booking/get-hotel-bookings`;
            if (statusFilter !== "all") {
                url += `?status=${statusFilter}`;
            }

            const response = await fetch(url, {
                method: "GET",
                credentials: "include",
            });
            if (!response.ok) throw new Error("Failed to fetch bookings");
            const data = await response.json();
            setBookings(data.data || []);
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

    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
        setCurrentPage(1);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const formatDateTime = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleUpdateStatus = async (newStatus) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/booking/update-status`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    bookingId: currentBooking._id,
                    status: newStatus
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to update status");
            }

            await response.json();
            fetchBookings();
            setShowModal(null);
            Swal.fire("Success!", `Booking status updated to ${newStatus}`, "success");
        } catch (err) {
            Swal.fire("Error!", err.message, "error");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "confirmed":
                return "bg-green-500";
            case "cancelled":
                return "bg-red-500";
            case "completed":
                return "bg-blue-500";
            case "pending":
                return "bg-yellow-500";
            case "failed":
                return "bg-red-700";
            case "refunded":
                return "bg-purple-500";
            default:
                return "bg-gray-500";
        }
    };

    const getPaymentStatusColor = (status) => {
        switch (status) {
            case "completed":
                return "bg-green-500";
            case "pending":
                return "bg-yellow-500";
            case "failed":
                return "bg-red-500";
            case "refunded":
                return "bg-purple-500";
            default:
                return "bg-gray-500";
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentBookings = bookings.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(bookings.length / itemsPerPage);

    return (
        <div className="h-full w-full py-8 px-4 md:px-6 font-poppins bg-black text-white">
            <Helmet>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" />
            </Helmet>
            <h1 className="text-3xl md:text-4xl font-semibold text-red-500 mb-4 md:mb-6 text-center">Hotel Booking Management</h1>
            <p className="text-base md:text-lg text-red-400 mb-6 text-center">Manage and review all hotel bookings</p>

            <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
                <div className="flex items-center">
                    <label className="text-base text-red-400 font-semibold mr-3">Filter by status:</label>
                    <select
                        value={statusFilter}
                        onChange={handleStatusFilterChange}
                        className="p-2 border border-gray-600 rounded text-white text-base bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        <option value="all">All Bookings</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="completed">Completed</option>
                        {/* <option value="pending">Payment Pending</option> */}
                    </select>
                </div>

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
                    {bookings.length === 0 ? (
                        <div className="w-full py-8 md:py-12 text-center bg-black rounded-lg shadow-lg border border-gray-700">
                            <div className="mx-auto max-w-2xl p-4 md:p-6">
                                <div className="text-5xl md:text-6xl mb-4 text-red-500">📅</div>
                                <h2 className="text-xl md:text-2xl font-bold text-red-400 mb-2">
                                    No Bookings Found
                                </h2>
                                <p className="text-base md:text-lg text-gray-300">
                                    {statusFilter === "all"
                                        ? "There are no bookings to display."
                                        : `There are no ${statusFilter} bookings to display.`}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Table Headings */}
                            <div className="hidden md:flex bg-red-600 text-white rounded-lg p-4">
                                <div className="w-2/12 text-left font-semibold text-lg">Booking ID</div>
                                <div className="w-2/12 text-left font-semibold text-lg">Hotel</div>
                                <div className="w-2/12 text-left font-semibold text-lg">Dates</div>
                                <div className="w-1/12 text-left font-semibold text-lg">Guests</div>
                                <div className="w-2/12 text-left font-semibold text-lg">Amount</div>
                                <div className="w-2/12 text-left font-semibold text-lg">Status</div>
                                <div className="w-1/12 text-left font-semibold text-lg">Actions</div>
                            </div>

                            {/* Booking Rows */}
                            <div className="hidden md:block">
                                {currentBookings.map((booking) => (
                                    <div
                                        key={booking._id}
                                        className="flex flex-row items-center justify-between bg-gray-800 rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow duration-300 mb-4"
                                    >
                                        <div className="w-2/12 text-left">
                                            <p className="text-lg text-white">#{booking._id.slice(-6)}</p>
                                            <p className="text-sm text-gray-400">{formatDateTime(booking.createdAt)}</p>
                                        </div>
                                        <div className="w-2/12 text-left">
                                            <p className="text-white">{booking.hotel?.name || "N/A"}</p>
                                            <p className="text-sm text-gray-400">{booking.room?.room_type || "N/A"}</p>
                                        </div>
                                        <div className="w-2/12 text-left">
                                            <p className="text-white">{formatDate(booking.bookingStartDate)}</p>
                                            <p className="text-sm text-gray-400">to {formatDate(booking.bookingEndDate)}</p>
                                        </div>
                                        <div className="w-1/12 text-left">
                                            <p className="text-white">{booking.personDetails?.length || 0}</p>
                                        </div>
                                        <div className="w-2/12 text-left">
                                            <p className="text-white">₹{booking.totalAmount?.toFixed(2) || "0.00"}</p>
                                            {/* <span className={`text-xs px-2 py-1 rounded-full ${getPaymentStatusColor(booking.paymentStatus)}`}>
                                                {booking.paymentStatus}
                                            </span> */}
                                        </div>
                                        <div className="w-2/12 text-left">
                                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(booking.bookingStatus)}`}>
                                                {booking.bookingStatus}
                                            </span>
                                        </div>
                                        <div className="w-1/12 text-left">
                                            <button
                                                onClick={() => {
                                                    setCurrentBooking(booking);
                                                    setShowModal("view");
                                                }}
                                                className="bg-gray-700 text-white p-2 rounded-lg hover:bg-gray-600 shadow-lg transition-colors"
                                                title="View"
                                            >
                                                <FaEye />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Booking Cards (Mobile) */}
                            <div className="md:hidden space-y-4">
                                {currentBookings.map((booking) => (
                                    <div
                                        key={booking._id}
                                        className="bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
                                    >
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-sm text-red-400 font-medium">Booking ID</p>
                                                    <p className="text-lg text-white">#{booking._id.slice(-6)}</p>
                                                </div>
                                                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(booking.bookingStatus)}`}>
                                                    {booking.bookingStatus}
                                                </span>
                                            </div>

                                            <div>
                                                <p className="text-sm text-red-400 font-medium">Hotel</p>
                                                <p className="text-white">{booking.hotel?.name || "N/A"}</p>
                                                <p className="text-sm text-gray-400">{booking.room?.room_type || "N/A"}</p>
                                            </div>

                                            <div>
                                                <p className="text-sm text-red-400 font-medium">Dates</p>
                                                <p className="text-white">{formatDate(booking.bookingStartDate)} to {formatDate(booking.bookingEndDate)}</p>
                                            </div>

                                            <div className="flex justify-between">
                                                <div>
                                                    <p className="text-sm text-red-400 font-medium">Guests</p>
                                                    <p className="text-white">{booking.personDetails?.length || 0}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-red-400 font-medium">Amount</p>
                                                    <p className="text-white">₹{booking.totalAmount?.toFixed(2) || "0.00"}</p>
                                                    <span className={`text-xs px-2 py-1 rounded-full ${getPaymentStatusColor(booking.paymentStatus)}`}>
                                                        {booking.paymentStatus}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex justify-end">
                                                <button
                                                    onClick={() => {
                                                        setCurrentBooking(booking);
                                                        setShowModal("view");
                                                    }}
                                                    className="bg-gray-700 text-white p-2 rounded-lg hover:bg-gray-600 shadow-lg transition-colors"
                                                    title="View"
                                                >
                                                    <FaEye />
                                                </button>
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

            {/* View Booking Modal */}
            {showModal === "view" && currentBooking && (
                <div className="fixed inset-0 flex justify-center items-center bg-opacity-50 backdrop-blur-sm z-50">
                    <div className="bg-black p-6 rounded-xl shadow-lg max-w-lg w-full border-2 border-red-600 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-semibold mb-4 text-white">Booking Details</h2>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-red-400 font-medium">Booking ID</p>
                                    <p className="text-white">#{currentBooking._id.slice(-6)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-red-400 font-medium">Booking Date</p>
                                    <p className="text-white">{formatDateTime(currentBooking.createdAt)}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-red-400 font-medium">Hotel</p>
                                <p className="text-white">{currentBooking.hotel?.name || "N/A"}</p>
                                <p className="text-gray-300">{currentBooking.room?.room_type || "N/A"} Room</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-red-400 font-medium">Check-in</p>
                                    <p className="text-white">{formatDate(currentBooking.bookingStartDate)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-red-400 font-medium">Check-out</p>
                                    <p className="text-white">{formatDate(currentBooking.bookingEndDate)}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-red-400 font-medium">Guests</p>
                                <div className="mt-2 space-y-2">
                                    {currentBooking.personDetails?.map((person, index) => (
                                        <div key={index} className="bg-gray-800 p-3 rounded-lg">
                                            <p className="text-white">Name: {person.name}</p>
                                            <p className="text-gray-300">Age: {person.age}</p>
                                            <p className="text-gray-300">Aadhar: {person.aadhar}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-red-400 font-medium">Total Amount</p>
                                    <p className="text-white">₹{currentBooking.totalAmount?.toFixed(2) || "0.00"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-red-400 font-medium">Payment Status</p>
                                    <span className={`text-xs px-2 py-1 rounded-full ${getPaymentStatusColor(currentBooking.paymentStatus)}`}>
                                        {currentBooking.paymentStatus}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-red-400 font-medium">Booking Status</p>
                                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(currentBooking.bookingStatus)}`}>
                                    {currentBooking.bookingStatus}
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 space-y-3">
                            {currentBooking.bookingStatus === "confirmed" && (
                                <>
                                    <button
                                        onClick={() => handleUpdateStatus("completed")}
                                        className="w-full bg-green-600 text-white px-4 py-2 rounded font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <FaCheck /> Mark as Completed
                                    </button>
                                    <button
                                        onClick={() => handleUpdateStatus("cancelled")}
                                        className="w-full bg-red-600 text-white px-4 py-2 rounded font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <FaTimes /> Cancel Booking
                                    </button>
                                </>
                            )}

                            <button
                                onClick={() => setShowModal(null)}
                                className="w-full bg-gray-700 px-4 py-2 rounded text-white font-semibold hover:bg-gray-600 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default HotelBookingManagement;