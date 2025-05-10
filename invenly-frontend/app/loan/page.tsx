'use client';

import { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export default function LoanScanPage() {
  const scannerRef = useRef<any>(null);
  const scannedRef = useRef(false);

  const [scannedItems, setScannedItems] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [borrowerName, setBorrowerName] = useState('');
  const [borrowerImageFile, setBorrowerImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const scannedCodesRef = useRef<Set<string>>(new Set());

  const handleResult = async (scannedCode: string) => {
    if (scannedRef.current || scannedCodesRef.current.has(scannedCode)) return;
    scannedRef.current = true;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/item/code/${scannedCode}`);
      if (!res.ok) throw new Error('Không tìm thấy vật phẩm');
      const data = await res.json();

      if (data.isLoaned) {
        setError(`❌ Vật phẩm "${data.name}" đã được mượn.`);
      } else {
        scannedCodesRef.current.add(scannedCode);
        setScannedItems((prev) => [
          ...prev,
          {
            ...data,
            returnDueDate: '',
            damaged: false,
            damageNote: '',
          },
        ]);
        setError(null);
      }
    } catch (err: any) {
      setError(err.message || 'Lỗi khi quét mã');
    }

    setTimeout(() => {
      scannedRef.current = false;
    }, 3000);
  };

  useEffect(() => {
    import('html5-qrcode').then(({ Html5Qrcode }) => {
      const container = document.getElementById('reader');
      if (container) container.innerHTML = '';

      const scanner = new Html5Qrcode('reader');
      scannerRef.current = scanner;

      scanner
        .start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: 250 },
          (decodedText: string) => handleResult(decodedText),
          () => { }
        )
        .catch((err) => console.error('🚫 Không thể mở camera:', err));
    });

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().then(() => scannerRef.current.clear());
      }
    };
  }, []);

  const handleUploadImage = async (): Promise<string> => {
    if (!borrowerImageFile) return '';

    const formData = new FormData();
    formData.append('file', borrowerImageFile);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/loan/upload-image`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('invenly_token') || ''}`,
      },
      body: formData,
    });

    if (res.status === 401) {
      alert('⚠️ Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
      window.location.href = '/login';
      return '';
    }

    if (!res.ok) {
      setStatusMessage('❌ Upload ảnh thất bại');
      return '';
    }

    const result = await res.json();
    return result.imageUrl;
  };

  const handleSubmit = async () => {
    if (!borrowerName || scannedItems.some((i) => !i.returnDueDate)) {
      setStatusMessage('⚠️ Vui lòng nhập đủ thông tin');
      return;
    }

    setLoading(true);
    setStatusMessage('⏳ Đang gửi yêu cầu...');

    try {
      const imageUrl = await handleUploadImage();

      const payload = {
        borrowerName,
        borrowerImageUrl: imageUrl,
        items: scannedItems.map((i) => ({
          code: i.code,
          returnDueDate: i.returnDueDate,
          damaged: i.damaged,
          damageNote: i.damageNote,
        })),
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/loan/batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('invenly_token') || ''}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.status === 401) {
        setStatusMessage('⚠️ Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        localStorage.setItem('pendingLoanRequest', JSON.stringify(payload));
        window.location.href = '/login';
        return;
      }

      if (res.ok) {
        setStatusMessage(`✅ Mượn thành công: ${result.success} vật phẩm\n❌ Thất bại: ${result.failed.join(', ')}`);
        setScannedItems([]);
        setBorrowerName('');
        setBorrowerImageFile(null);
      } else {
        setStatusMessage(`❌ Gửi thất bại: ${result.error || 'Lỗi không xác định'}`);
      }
    } catch (err) {
      setStatusMessage('❌ Lỗi hệ thống khi gửi yêu cầu');
    } finally {
      setLoading(false);
      setTimeout(() => setStatusMessage(null), 6000);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">📦 Quét để mượn vật phẩm</h2>
      <div id="reader" className="w-full max-w-xs mx-auto border rounded overflow-hidden" />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Label htmlFor="borrowerName">Tên người mượn</Label>
      <Input
        id="borrowerName"
        placeholder="Nhập tên người mượn"
        value={borrowerName}
        onChange={(e) => setBorrowerName(e.target.value)}
      />

      <div className="space-y-2">
        <Label htmlFor="borrowerImage">Ảnh người mượn</Label>
        <Input
          id="borrowerImage"
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              setBorrowerImageFile(e.target.files[0]);
            }
          }}
        />
        {borrowerImageFile && <p className="text-sm text-muted-foreground">📎 {borrowerImageFile.name}</p>}
      </div>

      {scannedItems.length > 0 && (
        <div className="overflow-x-auto border rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="p-2 text-left">Ảnh</th>
                <th className="p-2 text-left">Tên</th>
                <th className="p-2 text-left">Mã</th>
                <th className="p-2 text-left">Ngày trả</th>
                <th className="p-2 text-left">Hư?</th>
                <th className="p-2 text-left">Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {scannedItems.map((item, index) => (
                <tr key={item.code} className="border-t">
                  <td className="p-2">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-12 h-12 rounded object-cover"
                    />
                  </td>
                  <td className="p-2">{item.name}</td>
                  <td className="p-2 text-xs text-muted-foreground">{item.code}</td>
                  <td className="p-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            'justify-start text-left font-normal w-[150px]',
                            !item.returnDueDate && 'text-muted-foreground'
                          )}
                        >
                          {item.returnDueDate
                            ? format(new Date(item.returnDueDate), 'dd/MM/yyyy')
                            : 'Chọn ngày'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={
                            item.returnDueDate
                              ? new Date(item.returnDueDate)
                              : undefined
                          }
                          onSelect={(date) => {
                            const newItems = [...scannedItems];
                            newItems[index].returnDueDate =
                              date?.toISOString().split('T')[0] || '';
                            setScannedItems(newItems);
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </td>
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={item.damaged}
                      onChange={(e) => {
                        const newItems = [...scannedItems];
                        newItems[index].damaged = e.target.checked;
                        setScannedItems(newItems);
                      }}
                    />
                  </td>
                  <td className="p-2">
                    {item.damaged && (
                      <Textarea
                        className="w-[200px] text-xs"
                        rows={2}
                        placeholder="Mô tả hư hỏng"
                        value={item.damageNote}
                        onChange={(e) => {
                          const newItems = [...scannedItems];
                          newItems[index].damageNote = e.target.value;
                          setScannedItems(newItems);
                        }}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}


      {scannedItems.length > 0 && (
        <Button className="w-full" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Đang gửi...' : `📤 Gửi yêu cầu mượn (${scannedItems.length})`}
        </Button>
      )}

      {statusMessage && (
        <div className="bg-gray-100 border rounded p-3 text-sm text-gray-800 whitespace-pre-line">
          {statusMessage}
        </div>
      )}
    </div>
  );
}
