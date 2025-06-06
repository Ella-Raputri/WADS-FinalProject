import React from "react";
import { FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";

const Footer = () => {
  return (
    <footer className="font-poppins w-full red-navbar text-white py-4">
      <div className="w-full mx-auto flex flex-col sm:flex-row items-center justify-between px-6">

        <div className="text-center sm:text-left font-semibold text-md">
          <p>© Copyright 2025 Group Raft & NMC</p>
        </div>

        {/* Social Media Logo */}
        <div className="flex space-x-5 mt-3 font-semibold sm:mt-0">
          <a
            href="https://www.instagram.com/nmcbnmc/"
            target="_blank"
            aria-label="Instagram"
            rel="noopener noreferrer"
            className="hover:text-gray-300"
          >
            <FaInstagram className="w-6 h-6" />
          </a>
          <a
            href="mailto:ellarworkingfolder@gmail.com"
            target="_blank"
            aria-label="Email"
            rel="noopener noreferrer"
            className="hover:text-gray-300"
          >
            <HiOutlineMail className="w-6 h-6" />
          </a>
          <a
            href="https://www.youtube.com/@NMCBNMC"
            target="_blank"
            aria-label="Youtube"
            rel="noopener noreferrer"
            className="hover:text-gray-300"
          >
            <FaYoutube className="w-6 h-6" />
          </a>
          <a
            href="https://www.tiktok.com/@nmcbnmc"
            target="_blank"
            aria-label="Tiktok"
            rel="noopener noreferrer"
            className="hover:text-gray-300"
          >
            <FaTiktok className="w-5 h-5 mt-0.5" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
