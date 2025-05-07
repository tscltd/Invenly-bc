'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ManageItemsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchItems = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/item`);
    const data = await res.json();
    setItems(data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xoá vật phẩm này?')) return;

    setLoading(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/item/${id}`, {
      method: 'DELETE',
    });

    const data = await res.json();
    if (res.ok) {
      alert('🗑️ Đã xoá thành công');
      fetchItems();
    } else {
      alert(data.message || 'Xoá thất bại');
    }
    setLoading(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">📦 Quản lý vật phẩm</h2>
        <Link href="/import">
          <button className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 text-sm">
            ➕ Nhập từ Excel
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item._id}
            className="border rounded-xl p-4 shadow hover:shadow-md transition space-y-2 bg-white"
          >
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-40 object-cover rounded"
              />
            )}
            <h3 className="text-lg font-semibold">{item.name}</h3>
            <p className="text-sm text-muted-foreground truncate">{item.description}</p>
            <div className="text-sm space-y-1">
              <p><strong>📂 Loại:</strong> {item.category}</p>
              <p><strong>🔖 Mã:</strong> <code>{item.code}</code></p>
              <p><strong>👤 Người phụ trách:</strong> {item.manager}</p>
            </div>
            <div className="flex gap-2 mt-2">
              <Link href={`/scan?code=${item.code}`}>
                <button className="text-blue-600 underline text-sm">✏️ Sửa</button>
              </Link>
              <button
                onClick={() => handleDelete(item._id)}
                disabled={loading}
                className="text-red-500 underline text-sm"
              >
                ❌ Xoá
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="col-span-full text-center text-gray-500">Không có vật phẩm nào.</div>
        )}
      </div>
    </div>
  );
}
