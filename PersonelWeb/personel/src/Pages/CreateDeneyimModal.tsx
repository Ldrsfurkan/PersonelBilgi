import { useState } from 'react';
import { API_URL } from '../config';

interface Props {
  personelId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateDeneyimModal({ personelId, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    sirketAdi: '',
    pozisyon: '',
    baslangicTarihi: '',
    bitisTarihi: '',
    aciklama: ''
  });

  const handleSave = async () => {
    if (!formData.sirketAdi || !formData.pozisyon) {
      setError("Şirket Adı ve Pozisyon alanları zorunludur.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/personel/${personelId}/deneyimler`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Yeni deneyim eklenirken bir hata oluştu.');
      
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
        <h2 style={{ marginTop: 0, color: '#1f2937' }}>Yeni İş Deneyimi Ekle</h2>
        
        {error && <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Şirket Adı *</label>
            <input 
              type="text" 
              placeholder="Örn: TechCorp"
              value={formData.sirketAdi} 
              onChange={e => setFormData({...formData, sirketAdi: e.target.value})} 
            />
          </div>
          <div className="form-group">
            <label>Pozisyon *</label>
            <input 
              type="text" 
              placeholder="Örn: Backend Developer"
              value={formData.pozisyon} 
              onChange={e => setFormData({...formData, pozisyon: e.target.value})} 
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Başlangıç Tarihi</label>
            <input 
              type="date" 
              value={formData.baslangicTarihi} 
              onChange={e => setFormData({...formData, baslangicTarihi: e.target.value})} 
            />
          </div>
          <div className="form-group">
            <label>Bitiş Tarihi</label>
            <input 
              type="date" 
              value={formData.bitisTarihi} 
              onChange={e => setFormData({...formData, bitisTarihi: e.target.value})} 
            />
          </div>
        </div>

        <div className="form-group">
          <label>Açıklama / Yapılan İşler</label>
          <textarea 
            rows={4}
            placeholder="Bu pozisyonda neler yaptınız?"
            value={formData.aciklama} 
            onChange={e => setFormData({...formData, aciklama: e.target.value})} 
            style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px', fontFamily: 'inherit', resize: 'vertical' }}
          />
        </div>

        <div className="modal-actions" style={{ marginTop: '2rem' }}>
          <button onClick={onClose} disabled={loading} style={{ padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '6px', background: 'white', cursor: 'pointer' }}>İptal</button>
          <button onClick={handleSave} disabled={loading} style={{ padding: '0.5rem 1rem', border: 'none', borderRadius: '6px', background: '#10b981', color: 'white', cursor: 'pointer' }}>
            {loading ? 'Ekleniyor...' : 'Ekle'}
          </button>
        </div>
      </div>
    </div>
  );
}