import React, { useState, useEffect } from "react";
import { auth } from "../config/firebase";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import Nav from "../component/nav";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [resetError, setResetError] = useState("");
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      setError(getErrorMessage(err.code));
    }
  };

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case "auth/user-not-found":
        return "Login failed. This email is not registered.";
      case "auth/wrong-password":
        return "Login failed. Incorrect password.";
      case "auth/too-many-requests":
        return "Too many unsuccessful login attempts. Try again later.";
      default:
        return "Login failed. Check your email and password.";
    }
  };

  const handleForgotPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setIsPasswordReset(true);
      setResetError("");
      setFeedbackMessage("Password reset email sent. Check your inbox.");
    } catch (error) {
      setIsPasswordReset(false);
      setResetError("Failed to send reset email. Please check your email address.");
      setFeedbackMessage("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    login();
  };

  return (
    <div>
      <Nav />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-96">
          <h2 className="text-2xl font-semibold mb-4">Login</h2>
          {error && (
            <div className="mb-4 text-red-500">
              <p>{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-600"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 p-2 w-full border rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-600"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 p-2 w-full border rounded-md"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
            >
              Login
            </button>
          </form>
          <div className="mt-4">
            <button
              onClick={() => {
                setResetEmail("");
                setFeedbackMessage("");
              }}
              className="text-blue-500 hover:underline focus:outline-none"
            >
              Forgot Password?
            </button>
          </div>
          {resetEmail && (
            <div>
              <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-600 mt-4">
                Email for Password Reset
              </label>
              <input
                type="email"
                id="resetEmail"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="mt-1 p-2 w-full border rounded-md"
                required
              />
              <button
                onClick={handleForgotPassword}
                className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
              >
                Reset Password
              </button>
              {resetError && (
                <div className="mt-2 text-red-500">
                  <p>{resetError}</p>
                </div>
              )}
              {feedbackMessage && (
                <div className="mt-2 text-green-500">
                  <p>{feedbackMessage}</p>
                </div>
              )}
              {isPasswordReset && (
                <div className="mt-2 text-green-500">
                  <p>Password reset email sent. Check your inbox.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
