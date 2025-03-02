import { FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";

const Footer = () => {
  return (
    <footer className="mt-10 md:mt-5 font-poppins w-full red-navbar text-white py-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between px-6">

        <div className="text-center sm:text-left">
          <p>© Copyright 2025 Group Raft & NMC</p>
        </div>

        <div className="flex space-x-4 mt-3 sm:mt-0">
          <a
            href="https://www.instagram.com/nmcbnmc/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300"
          >
            <FaInstagram className="w-6 h-6" />
          </a>
          <a
            href="mailto:ellarworkingfolder@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300"
          >
            <HiOutlineMail className="w-6 h-6" />
          </a>
          <a
            href="https://www.youtube.com/@NMCBNMC"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300"
          >
            <FaYoutube className="w-6 h-6" />
          </a>
          <a
            href="https://www.tiktok.com/@nmcbnmc"
            target="_blank"
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
