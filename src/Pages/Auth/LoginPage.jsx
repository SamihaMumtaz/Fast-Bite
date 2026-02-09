import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import food from "../../assets/productimg/food.png";
import CurvedBG from "../../assets/productimg/curved.png";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email and password required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid credentials");
        return;
      }

      localStorage.setItem("token", data.token);

      navigate("/dashboard");

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
        className="absolute top-0 right-0 w-[250px] sm:w-[300px] md:w-[430px] pointer-events-none select-none"
      />

      <div className="relative z-10 flex justify-center md:justify-start px-4 md:px-10 pt-24 md:pt-32">
        <div className="w-full md:w-auto max-w-md bg-white/70 backdrop-blur-xl rounded-2xl p-6 md:p-10 shadow-lg md:ml-10">
          <div className="w-full">
            
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

            {error && (
              <p className="text-red-600 text-sm mb-3 font-semibold">{error}</p>
            )}

            <div className="text-sm font-semibold mb-4">
              Don’t have an account?{" "}
              <span className="cursor-pointer text-[rgb(245,130,32)]">
                <Link to="/register">Register</Link>
              </span>
            </div>

            <button
              disabled={loading}
              onClick={handleLogin}
              className="mt-2 w-full rounded-lg px-6 py-3 text-base text-white transition-all bg-[rgb(245,130,32)] font-semibold hover:bg-[rgb(249,115,22)] cursor-pointer"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
