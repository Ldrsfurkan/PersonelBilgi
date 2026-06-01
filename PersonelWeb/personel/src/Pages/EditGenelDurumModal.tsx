import { useState } from 'react';
import { API_URL } from '../config';
import type { PersonelEntity } from '../models/types';

interface Props {
  personelId: string;
  mevcutVeri: PersonelEntity
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditGenelDurumModal({ personelId, mevcutVeri, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  // Form State'imiz
  const [formData, setFormData] = useState({
    beklenenUcret: mevcutVeri?.beklenenUcret || 0,
    isEhliyetiVar: mevcutVeri?.isEhliyetiVar || false,
    isSabikaKaydiVar: mevcutVeri?.isSabikaKaydiVar || false,
    isSigaraKullaniyor: mevcutVeri?.isSigaraKullaniyor || false,
    isHibritCalisabilir: mevcutVeri?.isHibritCalisabilir || false,
    isIsSeyehatineCikabilir: mevcutVeri?.isIsSeyehatineCikabilir || false,
    isYoneticiDuzeyindeCalisabilir: mevcutVeri?.isYoneticiDuzeyindeCalisabilir || false,
    isFirmadaCalisanYakiniVar: mevcutVeri?.isFirmadaCalisanYakiniVar || false
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

      if (!response.ok) throw new Error('Genel Durum bilgileri güncellenemedi.');
      
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
        <h2 style={{ marginTop: 0, color: '#1f2937' }}>Genel Durum & Beklentileri Düzenle</h2>
        
        {error && <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

        {/* BEKLENEN ÜCRET (Tam Genişlik) */}
        <div className="form-group">
          <label>Beklenen Ücret (₺)</label>
          <input 
            type="number" 
            min="0"
            step="1000"
            placeholder="Örn: 35000"
            value={formData.beklenenUcret} 
            onChange={e => setFormData({...formData, beklenenUcret: parseFloat(e.target.value) || 0})} 
            style={{ width: '100%', maxWidth: '200px' }}
          />
        </div>

        <hr style={{ borderColor: '#e5e7eb', margin: '1.5rem 0' }} />

        {/* CHECKBOX IZGARASI (Yan Yana 2 Sütun) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          
          <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            <input 
              type="checkbox" 
              id="ehliyet"
              checked={formData.isEhliyetiVar} 
              onChange={e => setFormData({...formData, isEhliyetiVar: e.target.checked})} 
              style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer', margin: 0 }}
            />
            <label htmlFor="ehliyet" style={{ margin: 0, cursor: 'pointer' }}>Ehliyet Var</label>
          </div>

          <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            <input 
              type="checkbox" 
              id="sabikaKaydi"
              checked={formData.isSabikaKaydiVar} 
              onChange={e => setFormData({...formData, isSabikaKaydiVar: e.target.checked})} 
              style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer', margin: 0 }}
            />
            <label htmlFor="sabikaKaydi" style={{ margin: 0, cursor: 'pointer' }}>Sabıka Kaydı Var</label>
          </div>

          <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            <input 
              type="checkbox" 
              id="sigara"
              checked={formData.isSigaraKullaniyor} 
              onChange={e => setFormData({...formData, isSigaraKullaniyor: e.target.checked})} 
              style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer', margin: 0 }}
            />
            <label htmlFor="sigara" style={{ margin: 0, cursor: 'pointer' }}>Sigara Kullanıyor</label>
          </div>

          <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            <input 
              type="checkbox" 
              id="hibrit"
              checked={formData.isHibritCalisabilir} 
              onChange={e => setFormData({...formData, isHibritCalisabilir: e.target.checked})} 
              style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer', margin: 0 }}
            />
            <label htmlFor="hibrit" style={{ margin: 0, cursor: 'pointer' }}>Hibrit Çalışabilir</label>
          </div>

          <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            <input 
              type="checkbox" 
              id="seyahat"
              checked={formData.isIsSeyehatineCikabilir} 
              onChange={e => setFormData({...formData, isIsSeyehatineCikabilir: e.target.checked})} 
              style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer', margin: 0 }}
            />
            <label htmlFor="seyahat" style={{ margin: 0, cursor: 'pointer' }}>İş Seyahatine Çıkabilir</label>
          </div>

          <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            <input 
              type="checkbox" 
              id="yonetici"
              checked={formData.isYoneticiDuzeyindeCalisabilir} 
              onChange={e => setFormData({...formData, isYoneticiDuzeyindeCalisabilir: e.target.checked})} 
              style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer', margin: 0 }}
            />
            <label htmlFor="yonetici" style={{ margin: 0, cursor: 'pointer' }}>Yönetici Düzeyinde Çalışabilir</label>
          </div>

          <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            <input 
              type="checkbox" 
              id="firmaYakini"
              checked={formData.isFirmadaCalisanYakiniVar} 
              onChange={e => setFormData({...formData, isFirmadaCalisanYakiniVar: e.target.checked})} 
              style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer', margin: 0 }}
            />
            <label htmlFor="firmaYakini" style={{ margin: 0, cursor: 'pointer' }}>Firmada Çalışan Yakını Var</label>
          </div>

        </div>

        {/* BUTONLAR */}
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