import React, { useState } from "react";
import { Brain, Zap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo section */}
          <div className="flex items-center">
            <Link
              to="/"
              className="group flex items-center gap-2 py-2 transition-colors duration-200"
            >
              <div className="relative flex items-center">
                <Brain className="w-8 h-8 text-blue-600 group-hover:text-blue-700 transition-colors" />
                <Zap className="w-4 h-4 text-yellow-500 absolute -right-1 -top-1 group-hover:text-yellow-600 transition-colors" />
              </div>
              <div className="flex items-center">
                <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text">
                  Brain
                </span>
                <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text">
                  Buster
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            {userInfo ? (
              <>
                {userInfo.role === "admin" ? (
                  <div className="flex items-center space-x-4">
                    <Link
                      to="/admin/categories"
                      className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Categories
                    </Link>
                    <Link
                      to="/admin/subjects"
                      className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Subjects
                    </Link>
                    <Link
                      to="/admin/questions"
                      className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Questions
                    </Link>
                    <Link
                      to="/admin"
                      className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Detail
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <Link
                      to="/"
                      className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Tests
                    </Link>
                    <Link
                      to="/test-history"
                      className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      History
                    </Link>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Hamburger menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-white-600 hover:text-blue-600 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {userInfo ? (
            <>
              {userInfo.role === "admin" ? (
                <>
                  <Link
                    to="/admin/categories"
                    className="block text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Categories
                  </Link>
                  <Link
                    to="/admin/subjects"
                    className="block text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Subjects
                  </Link>
                  <Link
                    to="/admin/questions"
                    className="block text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Questions
                  </Link>
                  <Link
                    to="/admin"
                    className="block text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Detail
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/"
                    className="block text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Tests
                  </Link>
                  <Link
                    to="/test-history"
                    className="block text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    History
                  </Link>
                </>
              )}
              <div className="pt-2">
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-base font-medium transition duration-150 ease-in-out"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-base font-medium transition duration-150 ease-in-out"
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
