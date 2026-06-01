import { useState } from 'react';
import { API_URL } from '../config';
import type { PersonelEntity } from '../models/types';

interface Props {
  personelId: string;
  mevcutVeri: PersonelEntity['kimlikBilgileri'];
  kangrubu: number;
  onClose: () => void;
  onSuccess: () => void;
}

 // Tarihi input'a (YYYY-MM-DD) uygun hale getiren ufak yardımcı
  const formatDateForInput = (dateString?: string) => {
    if (!dateString || dateString === "0001-01-01T00:00:00") return '';
    return dateString.split('T')[0];
  };

export default function EditKimlikModal({ personelId, mevcutVeri, kangrubu, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State'imiz
  const [formData, setFormData] = useState({
    tcNo: mevcutVeri?.tcNo || '',
    uyruk: mevcutVeri?.uyruk || '',
    dogumYeri: mevcutVeri?.dogumYeri || '',
    dogumTarihi: formatDateForInput(mevcutVeri?.dogumTarihi),
    kangrubu: kangrubu || 0
  });

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      // Backend'deki PATCH endpointine gönderiyoruz
      const response = await fetch(`${API_URL}/personel/${personelId}/kimlik`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Aile bilgileri güncellenemedi.');
      
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginTop: 0, color: '#1f2937' }}>Kimlik Bilgilerini Düzenle</h2>
        
        {error && <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
        {/* TC NO & UYRUK */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>TC Kimlik No</label>
            <input 
              type="text" 
              maxLength={11}
              value={formData.tcNo} 
              onChange={e => setFormData({...formData, tcNo: e.target.value})} 
            />
          </div>
          <div className="form-group">
            <label>Uyruk</label>
            <input 
              type="text" 
              placeholder="Örn: TC"
              value={formData.uyruk} 
              onChange={e => setFormData({...formData, uyruk: e.target.value})} 
            />
          </div>
        </div>

        {/* DOĞUM YERİ & DOĞUM TARİHİ */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Doğum Yeri</label>
            <input 
              type="text" 
              value={formData.dogumYeri} 
              onChange={e => setFormData({...formData, dogumYeri: e.target.value})} 
            />
          </div>
          <div className="form-group">
            <label>Doğum Tarihi</label>
            <input 
              type="date" 
              value={formData.dogumTarihi} 
              onChange={e => setFormData({...formData, dogumTarihi: e.target.value})} 
            />
          </div>
        </div>

        {/* KAN GRUBU (Enum olduğu için Select kullanıyoruz) */}
        <div className="form-group">
          <label>Kan Grubu</label>
          <select 
            value={formData.kangrubu} 
            onChange={e => setFormData({...formData, kangrubu: parseInt(e.target.value) || 0})}
            style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px', backgroundColor: 'white', fontFamily: 'inherit' }}
          >
            <option value={0}>Belirtilmedi</option>
            <option value={1}>A Rh+</option>
            <option value={2}>A Rh-</option>
            <option value={3}>B Rh+</option>
            <option value={4}>B Rh-</option>
            <option value={5}>AB Rh+</option>
            <option value={6}>AB Rh-</option>
            <option value={7}>0 Rh+</option>
            <option value={8}>0 Rh-</option>
          </select>
        </div>

        {/* BUTONLAR */}
        <div className="modal-actions">
          <button onClick={onClose} disabled={loading} style={{ padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '6px', background: 'white', cursor: 'pointer' }}>İptal</button>
          <button onClick={handleSave} disabled={loading} style={{ padding: '0.5rem 1rem', border: 'none', borderRadius: '6px', background: '#3b82f6', color: 'white', cursor: 'pointer' }}>
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </div>
    </div>
  );
}