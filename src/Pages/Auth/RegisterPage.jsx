import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, UserIcon } from "@heroicons/react/24/outline";
import food from "../../assets/productimg/food.png";
import CurvedBG from "../../assets/productimg/curved.png";

const RegisterPage = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            setError("All fields are required");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const res = await fetch("http://localhost:3000/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Registration failed");
                setLoading(false);
                return;
            }

            navigate("/login");

        } catch (err) {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-[rgb(245,130,32,10%)] mt-22">

            <img
                src={CurvedBG}
                alt="background curved lines"
                className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full opacity-60 pointer-events-none select-none"
            />

            <img
                src={food}
                alt="Food"
                className="absolute top-0 right-0 w-[200px] sm:w-[300px] md:w-[430px] pointer-events-none select-none"
            />

            <div className="flex items-start justify-center md:justify-start h-full px-4 md:px-10 py-20 relative z-10">
                <div className="w-full md:w-auto max-w-md bg-white/70 backdrop-blur-xl rounded-2xl p-6 md:p-10 shadow-lg md:ml-10">
                    <div className="w-full">

                        <label className="text-lg font-semibold mb-2">Full Name</label>
                        <div className="relative w-full mb-4">
                            <UserIcon className="w-5 h-5 text-gray-500 absolute left-3 top-3.5" />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                                placeholder="Enter your full name"
                            />
                        </div>

                        <label className="text-lg font-semibold mb-2">Email</label>
                        <div className="relative w-full mb-4">
                            <EnvelopeIcon className="w-5 h-5 text-gray-500 absolute left-3 top-3.5" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                                placeholder="Enter your email"
                            />
                        </div>

                        <label className="text-lg font-semibold mb-2">Password</label>
                        <div className="relative w-full mb-4">
                            <LockClosedIcon className="w-5 h-5 text-gray-500 absolute left-3 top-3.5" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-12 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                                placeholder="Enter password"
                            />
                            {showPassword ? (
                                <EyeSlashIcon
                                    onClick={() => setShowPassword(false)}
                                    className="w-5 h-5 text-gray-500 absolute right-3 top-3.5 cursor-pointer"
                                />
                            ) : (
                                <EyeIcon
                                    onClick={() => setShowPassword(true)}
                                    className="w-5 h-5 text-gray-500 absolute right-3 top-3.5 cursor-pointer"
                                />
                            )}
                        </div>

                        <label className="text-lg font-semibold mb-2">Confirm Password</label>
                        <div className="relative w-full mb-4">
                            <LockClosedIcon className="w-5 h-5 text-gray-500 absolute left-3 top-3.5" />
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full pl-10 pr-12 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                                placeholder="Confirm password"
                            />
                            {showConfirmPassword ? (
                                <EyeSlashIcon
                                    onClick={() => setShowConfirmPassword(false)}
                                    className="w-5 h-5 text-gray-500 absolute right-3 top-3.5 cursor-pointer"
                                />
                            ) : (
                                <EyeIcon
                                    onClick={() => setShowConfirmPassword(true)}
                                    className="w-5 h-5 text-gray-500 absolute right-3 top-3.5 cursor-pointer"
                                />
                            )}
                        </div>

                        {error && (
                            <p className="text-red-600 text-sm mb-3 font-semibold">{error}</p>
                        )}

                        <div className="text-sm font-semibold mb-4">
                            Already have an account?{" "}
                            <span className="cursor-pointer text-[rgb(245,130,32)]">
                                <Link to="/login">Log In</Link>
                            </span>
                        </div>

                        <button
                            disabled={loading}
                            onClick={handleRegister}
                            className="mt-2 w-full rounded-lg px-6 py-3 text-base text-white transition-all bg-[rgb(245,130,32)] font-semibold hover:bg-[rgb(249,115,22)] cursor-pointer"
                        >
                            {loading ? "Registering..." : "Register"}
                        </button>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage;
