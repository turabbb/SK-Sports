import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useLoginUserMutation } from '../Redux/Features/Auth/Auth';

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
        console.log(data);

        try {
            const response = await loginUser(data).unwrap();
            //console.log(response);
            alert("Login Successfull");
            navigate('/');
        } catch (error) {
            setMessage("Please provide a valid email and password");
        }
    };

    return (
        <section className="h-screen flex items-center justify-center bg-gradient-to-r from-[#F4E5EC] to-[#EAD2DC]">
            <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 transition-transform transform hover:scale-105 duration-300">
                <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">Admin Login</h2>
                <p className="text-gray-500 text-center mb-6">Sign in to continue</p>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-gray-700 font-medium">Email Address</label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            name="email"
                            id="email"
                            placeholder="example@domain.com"
                            required
                            className="w-full bg-gray-100 border border-gray-300 focus:outline-none px-4 py-3 rounded-lg focus:ring-2 focus:ring-[#D9A5B3] transition-all duration-300"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium">Password</label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            name="password"
                            id="password"
                            placeholder="********"
                            required
                            className="w-full bg-gray-100 border border-gray-300 focus:outline-none px-4 py-3 rounded-lg focus:ring-2 focus:ring-[#D9A5B3] transition-all duration-300"
                        />
                    </div>

                    {message && <p className="text-red-500 text-center">{message}</p>}

                    <button
                        type="submit"
                        className="w-full mt-5 bg-[#D9A5B3] text-white hover:bg-[#C98C9F] font-medium py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                    >
                        Login
                    </button>
                </form>

                <p className="mt-6 text-sm text-center text-gray-500">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-[#D989A3] hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </section>
    );
};

export default Login;
