import { FaFileAlt } from "react-icons/fa";

export default Footer;
function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 py-8 mt-10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-lg">
              <FaFileAlt className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold">NexusDocs</span>
          </div>

          <div className="text-gray-400 text-sm">
            © {new Date().getFullYear()} NexusDocs. All rights reserved.
          </div>

          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <button className="text-gray-400 hover:text-emerald-400 transition-colors">
              Privacy Policy
            </button>
            <button className="text-gray-400 hover:text-emerald-400 transition-colors">
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
