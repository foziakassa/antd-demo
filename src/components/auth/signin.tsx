import React from "react";
import { Link } from "react-router-dom";

const SignIn = () => {
  return (
    <div className="bg-blue-50 flex items-center justify-center min-h-screen">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
          LogIn
        </h2>
        <form action="#" method="POST">
        
          <div className="mb-5">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-5">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
         
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-300"
          >
            Sign In 
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600">
           Do not have an account?{" "}
          <Link to='/signup'  className="text-blue-500 hover:underline"> 
           Sign in
          </Link>
          
        </p>
      </div>
    </div>
  );
};

export default SignIn;