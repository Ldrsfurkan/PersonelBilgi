import { useState } from 'react';
import { API_URL } from '../config';
import type { PersonelEntity } from '../models/types';

interface Props {
  personelId: string;
  mevcutVeri: PersonelEntity;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditEkBilgilerModal({ personelId, mevcutVeri, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tarihi input'a (YYYY-MM-DD) uygun hale getiren ufak yardımcı
  const formatDateForInput = (dateString?: string) => {
    if (!dateString || dateString === "0001-01-01T00:00:00") return '';
    return dateString.split('T')[0];
  };

  // Form State'imiz
  const [formData, setFormData] = useState({
  askerlikDurumu: mevcutVeri?.askerlikDurumu || 0,
  TecilTarihi: formatDateForInput(mevcutVeri?.tecilDurumu),
  tecilNedeni: mevcutVeri?.tecilNedeni || '',
  ekGelir: mevcutVeri?.ekGelir || 0,
  ekGelirNedeni: mevcutVeri?.ekGelirNedeni || '',
  ekstraAciklama: mevcutVeri?.ekstraAciklama || '',
  ekstraBeklentiler: mevcutVeri?.ekstraBeklentiler || ''
  });

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      // Backend'deki PATCH endpointine gönderiyoruz
      const response = await fetch(`${API_URL}/personel/${personelId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Askerlik & Ek bilgiler güncellenemedi.');
      
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '550px' }}>
        <h2 style={{ marginTop: 0, color: '#1f2937' }}>Askerlik ve Ek Bilgileri Düzenle</h2>
        
        {error && <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

        {/* --- ASKERLİK BÖLÜMÜ --- */}
        <h3 style={{ fontSize: '1.05rem', color: '#374151', marginBottom: '1rem' }}>Askerlik Durumu</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Durum</label>
            <select 
              value={formData.askerlikDurumu} 
              onChange={e => setFormData({...formData, askerlikDurumu: parseInt(e.target.value) || 0})}
              style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px', backgroundColor: 'white' }}
            >
              <option value={0}>Belirtilmedi</option>
              <option value={1}>Yapıldı</option>
              <option value={2}>Tecilli</option>
              <option value={3}>Muaf</option>
              <option value={4}>Yapılmadı</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Tecil Tarihi</label>
            <input 
              type="date" 
              value={formData.TecilTarihi} 
              onChange={e => setFormData({...formData, TecilTarihi: e.target.value})} 
              disabled={formData.askerlikDurumu !== 2} // Sadece "Tecilli" seçiliyse aktif olsun
            />
          </div>
        </div>

        <div className="form-group">
          <label>Tecil/Muafiyet Nedeni</label>
          <input 
            type="text" 
            placeholder="Örn: Eğitim, Sağlık vs."
            value={formData.tecilNedeni} 
            onChange={e => setFormData({...formData, tecilNedeni: e.target.value})} 
          />
        </div>

        <hr style={{ borderColor: '#e5e7eb', margin: '1.5rem 0' }} />

        {/* --- EK GELİR BÖLÜMÜ --- */}
        <h3 style={{ fontSize: '1.05rem', color: '#374151', marginBottom: '1rem' }}>Ek Gelir Beyanı</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Ek Gelir Miktarı (₺)</label>
            <input 
              type="number" 
              min="0"
              step="1000"
              value={formData.ekGelir} 
              onChange={e => setFormData({...formData, ekGelir: parseFloat(e.target.value) || 0})} 
            />
          </div>
          <div className="form-group">
            <label>Ek Gelir Kaynağı</label>
            <input 
              type="text" 
              placeholder="Örn: Kira, Freelance İş vs."
              value={formData.ekGelirNedeni} 
              onChange={e => setFormData({...formData, ekGelirNedeni: e.target.value})} 
            />
          </div>
        </div>

        <hr style={{ borderColor: '#e5e7eb', margin: '1.5rem 0' }} />

        {/* --- EKSTRA AÇIKLAMA VE BEKLENTİLER --- */}
        <h3 style={{ fontSize: '1.05rem', color: '#374151', marginBottom: '1rem' }}>Ekstra Notlar</h3>
        <div className="form-group">
          <label>Ekstra Açıklama (Personel Hakkında Notlar)</label>
          <textarea 
            rows={3}
            value={formData.ekstraAciklama} 
            onChange={e => setFormData({...formData, ekstraAciklama: e.target.value})} 
            style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px', fontFamily: 'inherit', resize: 'vertical' }}
          />
        </div>

        <div className="form-group">
          <label>Ekstra Beklentiler</label>
          <textarea 
            rows={3}
            value={formData.ekstraBeklentiler} 
            onChange={e => setFormData({...formData, ekstraBeklentiler: e.target.value})} 
            style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px', fontFamily: 'inherit', resize: 'vertical' }}
          />
        </div>

        {/* --- BUTONLAR --- */}
        <div className="modal-actions" style={{ marginTop: '2rem' }}>
          <button onClick={onClose} disabled={loading} style={{ padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '6px', background: 'white', cursor: 'pointer' }}>İptal</button>
          <button onClick={handleSave} disabled={loading} style={{ padding: '0.5rem 1rem', border: 'none', borderRadius: '6px', background: '#3b82f6', color: 'white', cursor: 'pointer' }}>
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </div>
    </div>
  );
}