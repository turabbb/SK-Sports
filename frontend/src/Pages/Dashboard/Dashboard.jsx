import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../Redux/Features/Auth/AuthSlice";
import AddProductForm from "./AddProductForm";
import UpdateProduct from "./UpdateProduct";

const Dashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState("addProduct");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.UserAuth); // assuming your auth slice is named this

    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const renderContent = () => {
        switch (activeTab) {
            case "addProduct":
                return <AddProductForm />;
            case "updateProduct":
                return < UpdateProduct />;
            case "viewOrders":
                return <div>View All Orders Here</div>;
            case "updateTracking":
                return <div>Update Order Tracking Details</div>;
            case "orderHistory":
                return <div>Order History of all completed orders</div>;
            default:
                return null;
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">

            {/* Sidebar */}
            <aside
                className={`bg-white border-r shadow-md h-screen transition-all duration-300 flex flex-col justify-between ${isSidebarOpen ? "w-64" : "w-20"
                    }`}
            >
                <div>
                    <div className="flex items-center justify-between p-4 border-b">
                        {isSidebarOpen ? (
                            <>
                                <h2 className="text-xl font-bold text-primary">Admin Panel</h2>
                                <button onClick={toggleSidebar} className="text-gray-500 hover:text-gray-700 transition">
                                    <i className="ri-menu-fold-line text-2xl"></i>
                                </button>
                            </>
                        ) : (
                            <div className="w-full flex justify-center">
                                <button onClick={toggleSidebar} className="text-gray-500 hover:text-gray-700 transition">
                                    <i className="ri-menu-unfold-line text-2xl"></i>
                                </button>
                            </div>
                        )}
                    </div>

                    <nav className="flex flex-col mt-6 gap-1">
                        {[
                            { label: "Add Product", icon: "ri-add-line", value: "addProduct" },
                            { label: "Update Product", icon: "ri-edit-line", value: "updateProduct" },
                            { label: "View Orders", icon: "ri-file-list-2-line", value: "viewOrders" },
                            { label: "Update Tracking", icon: "ri-truck-line", value: "updateTracking" },
                            { label: "Order History", icon: "ri-history-line", value: "orderHistory" },
                        ].map((item) => (
                            <button
                                key={item.value}
                                onClick={() => setActiveTab(item.value)}
                                className={`flex items-center gap-3 w-full px-5 py-3 rounded-lg text-left transition-all
                                    ${activeTab === item.value
                                        ? "bg-primary text-white shadow-md"
                                        : "hover:bg-gray-100 text-gray-700"
                                    }`}
                            >
                                <i className={`${item.icon} text-lg`}></i>
                                {isSidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Logout */}
                <div className="p-4">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all"
                    >
                        <i className="ri-logout-box-line text-lg"></i>
                        {isSidebarOpen && <span className="text-sm font-medium">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Top Navbar */}
                <header className="bg-white shadow-md flex items-center justify-between px-6 py-4">
                    <h1 className="text-2xl font-bold text-gray-800">
                        {user?.username ? `Welcome, ${user.username}` : "Welcome Admin"}
                    </h1>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all hidden md:block"
                    >
                        Logout
                    </button>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-8">
                    <div className="bg-white rounded-2xl shadow-lg p-8 min-h-[500px] transition-all duration-500">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
