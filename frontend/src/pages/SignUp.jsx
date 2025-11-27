import React, { useState, useContext } from "react";
import { FaGoogle } from "react-icons/fa";
import {
  User,
  Mail,
  Lock,
  PartyPopper,
  Contact,
  Eye,
  EyeOff,
} from "lucide-react";
import { Link,useNavigate} from "react-router-dom";
import axios from "axios";
import {AuthDataContext} from "../context/AuthContext";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice.js";
const SignUp = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { serverUrl } = useContext(AuthDataContext);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${serverUrl}/api/auth/signup`,
        {
          name,
          userName: username,
          email,
          password,
        },
        { withCredentials: true }
      );
      dispatch(setUserData(response.data));
      setLoading(false);
      toast.success("Signup successful!");
      navigate("/");

    } catch (error) {
      setLoading(false);
      toast.error("Signup failed. Please try again.");
      console.error("error during signup:", error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-100 text-purple-600 mb-3">
            <PartyPopper className="h-6 w-6" />
          </div>

          <h1 className="text-3xl font-logo text-gray-800 logo">VibeShare</h1>
          <p className="text-xs text-gray-500 mt-1">
            Create an account to get started.
          </p>
        </div>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="relative">
            <Contact className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm"
            />
          </div>

          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm"
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={passwordVisible ? "password" : "text"}
              placeholder="Password"
              className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm"
            />
            <button
              onClick={() => setPasswordVisible(!passwordVisible)}
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {passwordVisible ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg transition-colors text-sm mt-2"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-400">Or</span>
          </div>
        </div>

        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-2 rounded-lg transition-colors text-sm"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <span>Google</span>
        </button>

        <div className="mt-5 text-center text-xs text-gray-500 space-y-2">
          <p>
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Log in
            </Link>
          </p>
          
        </div>
      </div>
    </div>
  );
};

export default SignUp;
