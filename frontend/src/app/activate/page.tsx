'use client';

import { useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import axios from 'axios';

function ActivateForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await axios.post('/api/auth/activate', { token, password });
    setDone(true);
  };

  if (done) return <div className="p-6">✅ Your account is now active!</div>;

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-6 space-y-4">
      <h1 className="text-xl font-bold">Set your password</h1>
      <input
        type="password"
        placeholder="Enter a password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Activate Account
      </button>
    </form>
  );
}

export default function ActivatePage() {
  return (
    <Suspense>
      <ActivateForm />
    </Suspense>
  );
}
