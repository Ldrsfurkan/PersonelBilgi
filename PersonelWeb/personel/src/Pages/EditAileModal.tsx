import { useState } from 'react';
import { API_URL } from '../config';
import type { PersonelEntity } from '../models/types';

interface Props {
  personelId: string;
  mevcutVeri: PersonelEntity['aileBilgileri'];
  isAilesininYanindaYasiyor: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditAileModal({ personelId, mevcutVeri, isAilesininYanindaYasiyor, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State'imiz
  const [formData, setFormData] = useState({
    babaAd: mevcutVeri?.babaAd || '' ,
    anneAd: mevcutVeri?.anneAd ||'' ,
    babaMeslek: mevcutVeri?.babaMeslek ||'' ,
    kardesSayisi: mevcutVeri?.kardesSayisi || 0 ,
    esAd : mevcutVeri?.esAd ||'',
    esMeslek: mevcutVeri?.esMeslek ||'' ,
    oncekiSoyad: mevcutVeri?.oncekiSoyad ||'' ,
    cocukSayisi: mevcutVeri?.cocukSayisi || 0,
    medeniDurum : mevcutVeri?.medeniDurum || 1,
  isAilesininYanindaYasiyor: isAilesininYanindaYasiyor || false
  });

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      // Backend'deki PATCH endpointine gönderiyoruz
      const response = await fetch(`${API_URL}/personel/${personelId}/aile`, {
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
        <h2 style={{ marginTop: 0, color: '#1f2937' }}>Aile Bilgilerini Düzenle</h2>
        
        {error && <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

        {/* MEDENİ DURUM & ÖNCEKİ SOYAD */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Medeni Durum</label>
            <select 
              value={formData.medeniDurum} 
              onChange={e => setFormData({...formData, medeniDurum: parseInt(e.target.value) || 1})}
              style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px', fontFamily: 'inherit', backgroundColor: 'white' }}
            >
              <option value={1}>Bekar</option>
              <option value={2}>Evli</option>
              <option value={3}>Dul</option>
              <option value={4}>Boşanmış</option>
            </select>
          </div>
          <div className="form-group">
            <label>Önceki Soyad</label>
            <input 
              type="text" 
              placeholder="Yoksa boş bırakın"
              value={formData.oncekiSoyad} 
              onChange={e => setFormData({...formData, oncekiSoyad: e.target.value})} 
            />
          </div>
        </div>

        {/* EŞ BİLGİLERİ */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Eş Adı</label>
            <input 
              type="text" 
              value={formData.esAd} 
              onChange={e => setFormData({...formData, esAd: e.target.value})} 
            />
          </div>
          <div className="form-group">
            <label>Eş Mesleği</label>
            <input 
              type="text" 
              value={formData.esMeslek} 
              onChange={e => setFormData({...formData, esMeslek: e.target.value})} 
            />
          </div>
        </div>

        {/* ÇOCUK & KARDEŞ SAYISI */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Çocuk Sayısı</label>
            <input 
              type="number" 
              min="0"
              value={formData.cocukSayisi} 
              onChange={e => setFormData({...formData, cocukSayisi: parseInt(e.target.value) || 0})} 
            />
          </div>
          <div className="form-group">
            <label>Kardeş Sayısı</label>
            <input 
              type="number" 
              min="0"
              value={formData.kardesSayisi} 
              onChange={e => setFormData({...formData, kardesSayisi: parseInt(e.target.value) || 0})} 
            />
          </div>
        </div>

        {/* ANNE & BABA BİLGİLERİ */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Anne Adı</label>
            <input 
              type="text" 
              value={formData.anneAd} 
              onChange={e => setFormData({...formData, anneAd: e.target.value})} 
            />
          </div>
          <div className="form-group">
            <label>Baba Adı</label>
            <input 
              type="text" 
              value={formData.babaAd} 
              onChange={e => setFormData({...formData, babaAd: e.target.value})} 
            />
          </div>
        </div>

        <div className="form-group">
          <label>Baba Mesleği</label>
          <input 
            type="text" 
            value={formData.babaMeslek} 
            onChange={e => setFormData({...formData, babaMeslek: e.target.value})} 
          />
        </div>

        <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
          <input 
            type="checkbox" 
            id="isAilesiyleYasiyor"
            checked={formData.isAilesininYanindaYasiyor}
            onChange={e => setFormData({...formData, isAilesininYanindaYasiyor: e.target.checked})} 
            style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer', margin: 0 }}
          />
          <label htmlFor="isAilesiyleYasiyor" style={{ margin: 0, cursor: 'pointer' }}>
            Ailesi ile mi yaşıyor?
          </label>
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