import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../Redux/Features/Auth/AuthSlice";
import AddProductForm from "./AddProductForm";
import UpdateProduct from "./UpdateProduct";
import UpdateTracking from "./UpdateTracking";
import OrderHistory from "./OrderHistory";

const Dashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState("addProduct");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.UserAuth);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        // Close sidebar on mobile after selection
        if (window.innerWidth < 1024) {
            setIsSidebarOpen(false);
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case "addProduct":
                return <AddProductForm />;
            case "updateProduct":
                return <UpdateProduct />;
            case "updateTracking":
                return <UpdateTracking />;
            case "orderHistory":
                return <OrderHistory />;
            default:
                return null;
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside
                className={`bg-white border-r shadow-md h-screen transition-all duration-300 flex flex-col justify-between fixed lg:static inset-y-0 left-0 z-30 ${
                    isSidebarOpen ? "w-64" : "w-0 lg:w-20"
                } ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
            >
                <div className="overflow-hidden">
                    <div className="flex items-center justify-between p-3 sm:p-4 border-b min-h-[4rem]">
                        {isSidebarOpen ? (
                            <>
                                <h2 className="text-lg sm:text-xl font-bold text-primary truncate">Admin Panel</h2>
                                <button onClick={toggleSidebar} className="text-gray-500 hover:text-gray-700 transition p-1">
                                    <i className="ri-menu-fold-line text-xl sm:text-2xl"></i>
                                </button>
                            </>
                        ) : (
                            <div className="w-full flex justify-center">
                                <button onClick={toggleSidebar} className="text-gray-500 hover:text-gray-700 transition p-1">
                                    <i className="ri-menu-unfold-line text-xl sm:text-2xl"></i>
                                </button>
                            </div>
                        )}
                    </div>

                    <nav className="flex flex-col mt-4 sm:mt-6 gap-1 px-2 sm:px-4">
                        {[
                            { label: "Add Product", icon: "ri-add-line", value: "addProduct" },
                            { label: "Update Product", icon: "ri-edit-line", value: "updateProduct" },
                            { label: "Update Tracking", icon: "ri-truck-line", value: "updateTracking" },
                            { label: "Order History", icon: "ri-history-line", value: "orderHistory" },
                        ].map((item) => (
                            <button
                                key={item.value}
                                onClick={() => handleTabChange(item.value)}
                                className={`flex items-center gap-3 w-full px-3 sm:px-5 py-2.5 sm:py-3 rounded-lg text-left transition-all text-sm sm:text-base ${
                                    activeTab === item.value
                                        ? "bg-primary text-white shadow-md"
                                        : "hover:bg-gray-100 text-gray-700"
                                }`}
                                title={!isSidebarOpen ? item.label : ''}
                            >
                                <i className={`${item.icon} text-base sm:text-lg flex-shrink-0`}></i>
                                {isSidebarOpen && <span className="font-medium truncate">{item.label}</span>}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Logout */}
                <div className="p-3 sm:p-4">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-all text-sm sm:text-base"
                        title={!isSidebarOpen ? 'Logout' : ''}
                    >
                        <i className="ri-logout-box-line text-base sm:text-lg flex-shrink-0"></i>
                        {isSidebarOpen && <span className="font-medium">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
                {/* Top Navbar */}
                <header className="bg-white shadow-md flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden text-gray-500 hover:text-gray-700 transition p-1 mr-3"
                    >
                        <i className="ri-menu-line text-xl"></i>
                    </button>

                    <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 truncate">
                        {user?.username ? `Welcome, ${user.username}` : "Welcome Admin"}
                    </h1>
                    
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all hidden md:block"
                    >
                        Logout
                    </button>

                    {/* Mobile User Avatar */}
                    <div className="md:hidden">
                        <div 
                            className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-semibold"
                            title={user?.username ? `Logged in as ${user.username}` : 'Admin'}
                        >
                            {user?.username ? user.username[0].toUpperCase() : 'A'}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 min-h-[500px] transition-all duration-500">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;