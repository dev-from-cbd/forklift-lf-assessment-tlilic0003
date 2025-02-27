import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Loader2, LogIn, Eye, EyeOff } from "lucide-react";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState(""); // Store email input
  const [password, setPassword] = useState(""); // Store password input
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await signIn(email, password); // Authenticate user
      navigate("/");
    } catch (err) {
      setError("Failed to sign in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        {error && <div className="text-sm text-red-600">{error}</div>}

        <div>
          <input
            type="email"
            required
            className="w-full px-3 py-1.5 text-sm border rounded focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            required
            className="w-full px-3 py-1.5 text-sm border rounded focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 pr-10"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>

        <div className="flex items-center justify-between text-xs">
          <Link
            to="/reset-password"
            className="text-blue-600 hover:text-blue-500"
          >
            Forgot password?
          </Link>
          <Link to="/register" className="text-blue-600 hover:text-blue-500">
            Create account
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <LogIn className="w-4 h-4 mr-2" />
              Log in
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
