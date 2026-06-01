import { useState } from 'react';
import { API_URL } from '../config';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreatePersonelModal({ onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    ad: '',
    soyad: '',
    tcNo: '',
    dogumYeri: '',
    dogumTarihi: '',
    uyruk: 'Türk' 
  });

  const handleSave = async () => {
    if (!formData.ad || !formData.soyad || !formData.tcNo || !formData.dogumTarihi) {
      setError("Lütfen zorunlu alanları (Ad, Soyad, TC No, Doğum Tarihi) doldurun.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/personel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Personel oluşturulurken bir hata meydana geldi.');
      
      onSuccess(); 
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <h2 style={{ marginTop: 0, color: '#1f2937' }}>Yeni Personel Ekle</h2>
        
        {error && <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Ad *</label>
            <input 
              type="text" 
              placeholder="Örn: Ahmet"
              value={formData.ad} 
              onChange={e => setFormData({...formData, ad: e.target.value})} 
            />
          </div>
          <div className="form-group">
            <label>Soyad *</label>
            <input 
              type="text" 
              placeholder="Örn: Yılmaz"
              value={formData.soyad} 
              onChange={e => setFormData({...formData, soyad: e.target.value})} 
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>TC Kimlik No *</label>
            <input 
              type="text" 
              maxLength={11}
              placeholder="11 Haneli TC No"
              value={formData.tcNo} 
              onChange={e => setFormData({...formData, tcNo: e.target.value})} 
            />
          </div>
          <div className="form-group">
            <label>Uyruk</label>
            <input 
              type="text" 
              value={formData.uyruk} 
              onChange={e => setFormData({...formData, uyruk: e.target.value})} 
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Doğum Yeri</label>
            <input 
              type="text" 
              placeholder="Örn: İzmir"
              value={formData.dogumYeri} 
              onChange={e => setFormData({...formData, dogumYeri: e.target.value})} 
            />
          </div>
          <div className="form-group">
            <label>Doğum Tarihi *</label>
            <input 
              type="date" 
              value={formData.dogumTarihi} 
              onChange={e => setFormData({...formData, dogumTarihi: e.target.value})} 
            />
          </div>
        </div>

        <div className="modal-actions" style={{ marginTop: '2rem' }}>
          <button onClick={onClose} disabled={loading} style={{ padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '6px', background: 'white', cursor: 'pointer' }}>İptal</button>
          <button onClick={handleSave} disabled={loading} style={{ padding: '0.5rem 1rem', border: 'none', borderRadius: '6px', background: '#10b981', color: 'white', cursor: 'pointer', fontWeight: '500' }}>
            {loading ? 'Ekleniyor...' : 'Personeli Kaydet'}
          </button>
        </div>
      </div>
    </div>
  );
}