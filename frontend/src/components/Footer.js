import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 py-6 text-sm text-gray-500 flex flex-col md:flex-row items-center justify-between gap-2">
        <p>© {new Date().getFullYear()} MedRisk. All rights reserved.</p>
        <p className="text-xs">Built with React, Tailwind CSS, Node.js, and MongoDB</p>
      </div>
    </footer>
  );
};

export default Footer;