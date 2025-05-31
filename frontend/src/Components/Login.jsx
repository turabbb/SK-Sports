import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useLoginUserMutation } from '../Redux/Features/Auth/Auth';
import { setUser } from '../Redux/Features/Auth/AuthSlice';

const Login = () => {
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    //ReduxToolkit
    const dispatch = useDispatch();
    const [loginUser, { isLoading: loginLoading }] = useLoginUserMutation();

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const data = { email, password };

        try {
            const response = await loginUser(data).unwrap();
            console.log(response);
            const {token, user} = response;
            dispatch(setUser({user}));
            alert("Login Successfull");
            navigate('/');
        } catch (error) {
            setMessage("Please provide a valid email and password");
        }
    };

    return (
        <section className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#F4E5EC] to-[#EAD2DC] px-4 py-8">
            <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-6 sm:p-8 transition-transform transform hover:scale-105 duration-300">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-2">Admin Login</h2>
                <p className="text-gray-500 text-center mb-6 text-sm sm:text-base">Sign in to continue</p>

                <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
                    <div>
                        <label className="block text-gray-700 font-medium text-sm sm:text-base mb-2">Email Address</label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            name="email"
                            id="email"
                            placeholder="example@domain.com"
                            required
                            className="w-full bg-gray-100 border border-gray-300 focus:outline-none px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg focus:ring-2 focus:ring-[#D9A5B3] transition-all duration-300 text-sm sm:text-base"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium text-sm sm:text-base mb-2">Password</label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            name="password"
                            id="password"
                            placeholder="********"
                            required
                            className="w-full bg-gray-100 border border-gray-300 focus:outline-none px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg focus:ring-2 focus:ring-[#D9A5B3] transition-all duration-300 text-sm sm:text-base"
                        />
                    </div>

                    {message && <p className="text-red-500 text-center text-sm">{message}</p>}

                    <button
                        type="submit"
                        disabled={loginLoading}
                        className="w-full mt-4 sm:mt-5 bg-[#D9A5B3] text-white hover:bg-[#C98C9F] font-medium py-2.5 sm:py-3 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                    >
                        {loginLoading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Signing in...
                            </div>
                        ) : (
                            'Login'
                        )}
                    </button>
                </form>

                <p className="mt-6 text-xs sm:text-sm text-center text-gray-500">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-[#D989A3] hover:underline font-medium">
                        Sign up
                    </Link>
                </p>
            </div>
        </section>
    );
};

export default Login;