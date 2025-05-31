import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterUserMutation } from '../Redux/Features/Auth/Auth';

const Register = () => {
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [registerUser, {isLoading}] = useRegisterUserMutation();
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        const data = { username, email, password };
        console.log(data);

        try {
            await registerUser(data).unwrap();
            alert("Registration Successful");
            navigate('/login');
            
        } catch (error) {
            setMessage("Registration Failed");
        }
    };

    return (
        <section className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#F4E5EC] to-[#EAD2DC] px-4 py-8">
            <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-6 sm:p-8 transition-transform transform hover:scale-105 duration-300">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-2">Create an Account</h2>
                <p className="text-gray-500 text-center mb-6 text-sm sm:text-base">Join us today</p>

                <form onSubmit={handleRegister} className="space-y-4 sm:space-y-5">
                    <div>
                        <label className="block text-gray-700 font-medium text-sm sm:text-base mb-2">Username</label>
                        <input
                            onChange={(e) => setUsername(e.target.value)}
                            type="text"
                            name="username"
                            id="username"
                            placeholder="Choose a username"
                            required
                            className="w-full bg-gray-100 border border-gray-300 focus:outline-none px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg focus:ring-2 focus:ring-[#D9A5B3] transition-all duration-300 text-sm sm:text-base"
                        />
                    </div>
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
                        disabled={isLoading}
                        className="w-full mt-4 sm:mt-5 bg-[#D9A5B3] text-white hover:bg-[#C98C9F] font-medium py-2.5 sm:py-3 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Creating Account...
                            </div>
                        ) : (
                            'Sign Up'
                        )}
                    </button>
                </form>

                <p className="mt-6 text-xs sm:text-sm text-center text-gray-500">
                    Already have an account?{' '}
                    <Link to="/login" className="text-[#D989A3] hover:underline font-medium">
                        Login
                    </Link>
                </p>
            </div>
        </section>
    );
};

export default Register;