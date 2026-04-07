'use client';
import { useState } from 'react';

export default function Tabs() {
  const [activeTab, setActiveTab] = useState('business');

  return (
    <div className="flex border-b">
      {['Business', 'Services'].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab.toLowerCase())}
          className={`px-6 py-3 font-medium ${
            activeTab === tab.toLowerCase()
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-blue-600'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}