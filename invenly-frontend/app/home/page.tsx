'use client';

import { useState } from 'react';
import { QrReader } from '@blackbox-vision/react-qr-reader';

export default function ScanPage() {
  const [code, setCode] = useState<string | null>(null);
  const [item, setItem] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleResult = async (result: any) => {
    const scannedCode = result?.getText?.();
    if (scannedCode && scannedCode !== code) {
      setCode(scannedCode);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/item/code/${scannedCode}`);
        if (!res.ok) throw new Error('Không tìm thấy sản phẩm');

        const data = await res.json();
        setItem(data);
        setError(null);
      } catch (err: any) {
        setItem(null);
        setError(err.message || 'Lỗi khi gọi API');
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Quét mã QR sản phẩm</h2>

      <QrReader
        constraints={{ facingMode: 'environment' }}
        onResult={(result, err) => {
          if (result) handleResult(result);
        }}
        containerStyle={{ width: '100%' }}
      />

      {code && <p className="text-sm text-muted-foreground">Mã quét: <code>{code}</code></p>}

      {error && (
        <p className="text-red-500">⚠ {error}</p>
      )}

      {item && (
        <div className="bg-white rounded shadow p-4">
          <h3 className="text-xl font-bold">{item.name}</h3>
          <p><strong>Mã:</strong> {item.code}</p>
          <p><strong>Loại:</strong> {item.category}</p>
          <p><strong>Miêu tả:</strong> {item.description}</p>
          <p><strong>Nguồn:</strong> {item.source}</p>
          <p><strong>Người quản lý:</strong> {item.manager}</p>
          {item.imageUrl && (
            <img
              src={item.imageUrl}
              alt={item.name}
              className="mt-4 rounded h-48 object-contain"
            />
          )}
        </div>
      )}
    </div>
  );
}
