'use client';
import { SearchIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SearchBar() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto relative"
    >
      <input
        type="text"
        placeholder="Search by service name, department or authority..."
        className="w-full p-4 pl-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
    </motion.div>
  );
}