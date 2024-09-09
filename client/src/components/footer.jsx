import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#222831] text-white py-10 mt-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-start md:items-center px-4 space-y-8 md:space-y-0">
        {/* Left - Company Info */}
        <div className="flex-1 text-left">
          <h4 className="text-3xl font-bold mb-3">Flow Team</h4>
          <p className="text-gray-400">@ All rights reserved 2024</p>
        </div>

        {/* Center - Quick Links */}
        <div className="flex-1 text-center">
          <h4 className="text-2xl font-bold mb-4">Quick Links</h4>
          <ul className="space-y-3 text-gray-300">
            <li>
              <Link
                to="/"
                className="hover:text-orange-500 transition-colors duration-300"
              >
                Get Started
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="hover:text-orange-500 transition-colors duration-300"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="hover:text-orange-500 transition-colors duration-300"
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                to="/services"
                className="hover:text-orange-500 transition-colors duration-300"
              >
                Services
              </Link>
            </li>
          </ul>
        </div>

        {/* Right - Follow Us */}
        <div className="flex-1 text-right">
          <h4 className="text-2xl font-bold mb-4">Follow Us</h4>
          <div className="flex justify-end space-x-6">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-orange-500 transition-colors duration-300"
            >
              <i className="fab fa-facebook-f text-3xl"></i>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-orange-500 transition-colors duration-300"
            >
              <i className="fab fa-twitter text-3xl"></i>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-orange-500 transition-colors duration-300"
            >
              <i className="fab fa-instagram text-3xl"></i>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-orange-500 transition-colors duration-300"
            >
              <i className="fab fa-linkedin-in text-3xl"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="bg-[#1e272e] py-4 mt-6">
        <p className="text-center text-gray-400 text-sm">
          Designed & Developed by Flow Team
        </p>
      </div>
    </footer>
  );
};

export default Footer;
