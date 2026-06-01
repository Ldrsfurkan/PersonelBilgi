import { useState } from 'react';
import { API_URL } from '../config';
import type { PersonelEntity } from '../models/types';

interface Props {
  personelId: string;
  mevcutVeri: PersonelEntity['egitimBilgileri'];
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditEgitimModal({ personelId, mevcutVeri, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tarihi input'a (YYYY-MM-DD) uygun hale getiren ufak yardımcı
  const formatDateForInput = (dateString?: string) => {
    if (!dateString || dateString === "0001-01-01T00:00:00") return '';
    return dateString.split('T')[0];
  };

  // Form State'imiz
  const [formData, setFormData] = useState({
    isUniversiteMezunu: mevcutVeri?.isUniversiteMezunu || false,
    isLiseMezunu: mevcutVeri?.isLiseMezunu || false,
    okulAdi: mevcutVeri?.okulAdi || '',
    bolum: mevcutVeri?.bolum || '',
    mezuniyetNotu: mevcutVeri?.mezuniyetNotu || 0,
    baslangicTarihi: formatDateForInput(mevcutVeri?.baslangicTarihi),
    mezuniyetTarihi: formatDateForInput(mevcutVeri?.mezuniyetTarihi)
  });

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      // Backend'deki PATCH endpointine gönderiyoruz
      const response = await fetch(`${API_URL}/personel/${personelId}/egitim`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Eğitim bilgileri güncellenemedi.');
      
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
        <h2 style={{ marginTop: 0, color: '#1f2937' }}>Eğitim Bilgilerini Düzenle</h2>
        
        {error && <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

        {/* CHECKBOX'LAR (YAN YANA) */}
        <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
          <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem', marginBottom: 0 }}>
            <input 
              type="checkbox" 
              id="uniMezunu"
              checked={formData.isUniversiteMezunu} 
              onChange={e => setFormData({...formData, isUniversiteMezunu: e.target.checked})} 
              style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer' }}
            />
            <label htmlFor="uniMezunu" style={{ margin: 0, cursor: 'pointer' }}>Üniversite Mezunu</label>
          </div>

          <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem', marginBottom: 0 }}>
            <input 
              type="checkbox" 
              id="liseMezunu"
              checked={formData.isLiseMezunu} 
              onChange={e => setFormData({...formData, isLiseMezunu: e.target.checked})} 
              style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer' }}
            />
            <label htmlFor="liseMezunu" style={{ margin: 0, cursor: 'pointer' }}>Lise Mezunu</label>
          </div>
        </div>

        {/* OKUL VE BÖLÜM */}
        <div className="form-group">
          <label>Okul Adı</label>
          <input 
            type="text" 
            placeholder="Örn: Ege Üniversitesi"
            value={formData.okulAdi} 
            onChange={e => setFormData({...formData, okulAdi: e.target.value})} 
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Bölüm</label>
            <input 
              type="text" 
              placeholder="Örn: Bilgisayar Mühendisliği"
              value={formData.bolum} 
              onChange={e => setFormData({...formData, bolum: e.target.value})} 
            />
          </div>
          <div className="form-group">
            <label>Mezuniyet Notu</label>
            <input 
              type="number" 
              step="0.01" 
              min="0"
              placeholder="Örn: 3.25"
              value={formData.mezuniyetNotu} 
              onChange={e => setFormData({...formData, mezuniyetNotu: parseFloat(e.target.value) || 0})} 
            />
          </div>
        </div>

        {/* TARİHLER */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
          <div className="form-group">
            <label>Başlangıç Tarihi</label>
            <input 
              type="date" 
              value={formData.baslangicTarihi} 
              onChange={e => setFormData({...formData, baslangicTarihi: e.target.value})} 
            />
          </div>
          <div className="form-group">
            <label>Mezuniyet Tarihi</label>
            <input 
              type="date" 
              value={formData.mezuniyetTarihi} 
              onChange={e => setFormData({...formData, mezuniyetTarihi: e.target.value})} 
            />
          </div>
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