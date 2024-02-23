import React, { useState } from "react";
import { auth } from "../config/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState(null);

  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setEmailSent(true);
      setError(null);
    } catch (error) {
      setError("Failed to send reset email. Please check your email address.");
      setEmailSent(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4">Forgot Password</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleResetPassword(); }}>
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
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
          >
            Reset Password
          </button>
        </form>
        {error && (
          <div className="mt-2 text-red-500">
            <p>{error}</p>
          </div>
        )}
        {emailSent && (
          <div className="mt-2 text-green-500">
            <p>Password reset email sent. Check your inbox.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
