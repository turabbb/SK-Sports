import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../Pages/Homepage/Home";
import CategoryPage from "../Pages/Category/CategoryPage";
import Search from "../Pages/Search/Search";
import SportsPage from "../Pages/Shop/SportsPage";
import SingleProduct from "../Pages/Shop/Products/SingleProduct";
import Login from "../Components/Login";
import Register from "../Components/Register";
import Dashboard from "../Pages/Dashboard/Dashboard";
import PrivateRoute from "./PrivateRoute";
import Checkout from "../Pages/Shop/Checkout";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "/", element: <Home /> },
            { path: "/category/:categoryName", element: <CategoryPage /> },
            { path: "/search", element: <Search /> },
            { path: "/sports", element: <SportsPage /> },
            { path: "/sports/:id", element: <SingleProduct /> },
            {path: "/checkout", element: <Checkout />},
        ]
    },
    
    {
        path: "/login",
        element: <Login />,
        children: [
            
        ]
    },

    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/dashboard",
        element: (
            <PrivateRoute>
                <Dashboard />
            </PrivateRoute>
        )
    }
]);

export default router;