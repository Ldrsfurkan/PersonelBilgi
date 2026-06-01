import { useState } from 'react';
import { API_URL } from '../config';
import type { PersonelEntity } from '../models/types';

interface Props {
  personelId: string;
  mevcutVeri: PersonelEntity['basvuruBilgileri'];
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditBasvuruModal({ personelId, mevcutVeri, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tarihi input'a (YYYY-MM-DD) uygun hale getiren ufak yardımcı
  const formatDateForInput = (dateString?: string) => {
    if (!dateString || dateString === "0001-01-01T00:00:00") return '';
    return dateString.split('T')[0];
  };

  // Form State'imiz
  const [formData, setFormData] = useState({
    departman1: mevcutVeri?.departman1 || 0,
    departman2: mevcutVeri?.departman2 || 0,
    departman3: mevcutVeri?.departman3 || 0,
    calismaSaatleri:mevcutVeri?.calismaSaatleri || 0,
    uygunGorulenDepartman:mevcutVeri?.uygunGorulenDepartman || 0,
    baslamaTarihi: formatDateForInput(mevcutVeri?.baslamaTarihi),
    ayrilmaTarihi: formatDateForInput(mevcutVeri?.ayrilmaTarihi),
    basvuruTarihi: formatDateForInput(mevcutVeri?.basvuruTarihi),
    denemeSureci: mevcutVeri?.denemeSureci || '',
    egitimSureci:mevcutVeri?.egitimSureci || ''
  });

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      // Backend'deki PATCH endpointine gönderiyoruz
      const response = await fetch(`${API_URL}/personel/${personelId}/basvuru`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Basvuru bilgileri güncellenemedi.');
      
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <h2 style={{ marginTop: 0, color: '#1f2937' }}>Firma Başvuru Durumunu Düzenle</h2>
        
        {error && <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

        {/* DEPARTMAN TERCİHLERİ */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>1. Tercih</label>
            <select 
              value={formData.departman1} 
              onChange={e => setFormData({...formData, departman1: parseInt(e.target.value) || 0})}
              style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px', backgroundColor: 'white' }}
            >
              <option value={0}>Belirtilmedi</option>
              <option value={1}>Yazılım</option>
              <option value={2}>İnsan Kaynakları</option>
              <option value={3}>Finans</option>
              <option value={4}>Pazarlama</option>
              <option value={5}>Satış</option>
              <option value={6}>Operasyon</option>
            </select>
          </div>
          <div className="form-group">
            <label>2. Tercih</label>
            <select 
              value={formData.departman2} 
              onChange={e => setFormData({...formData, departman2: parseInt(e.target.value) || 0})}
              style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px', backgroundColor: 'white' }}
            >
              <option value={0}>Belirtilmedi</option>
              <option value={1}>Yazılım</option>
              <option value={2}>İnsan Kaynakları</option>
              <option value={3}>Finans</option>
              <option value={4}>Pazarlama</option>
              <option value={5}>Satış</option>
              <option value={6}>Operasyon</option>
            </select>
          </div>
          <div className="form-group">
            <label>3. Tercih</label>
            <select 
              value={formData.departman3} 
              onChange={e => setFormData({...formData, departman3: parseInt(e.target.value) || 0})}
              style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px', backgroundColor: 'white' }}
            >
              <option value={0}>Belirtilmedi</option>
              <option value={1}>Yazılım</option>
              <option value={2}>İnsan Kaynakları</option>
              <option value={3}>Finans</option>
              <option value={4}>Pazarlama</option>
              <option value={5}>Satış</option>
              <option value={6}>Operasyon</option>
            </select>
          </div>
        </div>

        {/* UYGUN GÖRÜLEN DEPARTMAN & ÇALIŞMA MODELİ */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Uygun Görülen Departman</label>
            <select 
              value={formData.uygunGorulenDepartman} 
              onChange={e => setFormData({...formData, uygunGorulenDepartman: parseInt(e.target.value) || 0})}
              style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px', backgroundColor: 'white' }}
            >
              <option value={0}>Belirtilmedi</option>
              <option value={1}>Yazılım</option>
              <option value={2}>İnsan Kaynakları</option>
              <option value={3}>Finans</option>
              <option value={4}>Pazarlama</option>
              <option value={5}>Satış</option>
              <option value={6}>Operasyon</option>
            </select>
          </div>
          <div className="form-group">
            <label>Çalışma Modeli</label>
            <select 
              value={formData.calismaSaatleri} 
              onChange={e => setFormData({...formData, calismaSaatleri: parseInt(e.target.value) || 0})}
              style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px', backgroundColor: 'white' }}
            >
              <option value={0}>Belirtilmedi</option>
              <option value={1}>Tam Zamanlı</option>
              <option value={2}>Yarı Zamanlı</option>
              <option value={3}>Esnek Çalışma</option>
              <option value={4}>Uzaktan Çalışma</option>
              <option value={5}>Hibrit</option>
            </select>
          </div>
        </div>

        {/* TARİHLER */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
          <div className="form-group">
            <label>Başvuru Tarihi</label>
            <input 
              type="date" 
              value={formData.basvuruTarihi} 
              onChange={e => setFormData({...formData, basvuruTarihi: e.target.value})} 
            />
          </div>
          <div className="form-group">
            <label>Başlama Tarihi</label>
            <input 
              type="date" 
              value={formData.baslamaTarihi} 
              onChange={e => setFormData({...formData, baslamaTarihi: e.target.value})} 
            />
          </div>
          <div className="form-group">
            <label>Ayrılma Tarihi</label>
            <input 
              type="date" 
              value={formData.ayrilmaTarihi} 
              onChange={e => setFormData({...formData, ayrilmaTarihi: e.target.value})} 
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Deneme Süreci</label>
            <input 
              type="text" 
              placeholder="Örn: 02:00:00 veya 15.00:00:00"
              value={formData.denemeSureci} 
              onChange={e => setFormData({...formData, denemeSureci: e.target.value})} 
            />
          </div>
          <div className="form-group">
            <label>Eğitim Süreci</label>
            <input 
              type="text" 
              placeholder="Örn: 02:00:00 veya 15.00:00:00"
              value={formData.egitimSureci} 
              onChange={e => setFormData({...formData, egitimSureci: e.target.value})} 
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