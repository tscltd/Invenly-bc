'use client';

import { useState } from 'react';
import { useRouter} from 'next/navigation';
import { login } from '@/lib/api';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await login(username, password);
    if (res?.user.token) {
      localStorage.setItem('invenly_token', res.token);
      router.push('/dashboard');
    } else {
      setError(res?.message || 'Đăng nhập thất bại');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-24 p-6 border rounded-xl shadow">
      <h1 className="text-2xl mb-4 font-bold">Đăng nhập Vaultix</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border p-2 rounded"
          placeholder="Tên đăng nhập"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          className="w-full border p-2 rounded"
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-red-600">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Đăng nhập
        </button>
      </form>
    </div>
  );
}
