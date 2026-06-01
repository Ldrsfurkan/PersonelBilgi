import { useState } from 'react';
import { API_URL } from '../config';
import type { PersonelEntity } from '../models/types';

interface Props {
    personelId: string;
    mevcutVeri: PersonelEntity['iletisimBilgileri'];
    onClose: () => void;
    onSuccess: () => void; // Başarılı olunca ana sayfayı yenilemek için
}

export default function EditIletisimModal({ personelId, mevcutVeri, onClose, onSuccess }: Props) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form statemiz (Mevcut verilerle dolduruyoruz)
    const [formData, setFormData] = useState({
        email: mevcutVeri?.email || '',
        telefon: mevcutVeri?.telefon || '',
        adres: {
            il: mevcutVeri?.adres?.il || '',
            ilce: mevcutVeri?.adres?.ilce || '',
            sokak: mevcutVeri?.adres?.sokak || '',
            tamAdres: mevcutVeri?.adres?.tamAdres || ''
        },
        ulasilamadiginda: {
            adSoyad: mevcutVeri?.ulasilamadiginda?.adSoyad || '',
            telefon: mevcutVeri?.ulasilamadiginda?.telefon || ''
        }
    });

    const handleSave = async () => {
        setLoading(true);
        setError(null);
        try {
            // Backend'deki Carter endpointimize PATCH atıyoruz
            const response = await fetch(`${API_URL}/personel/${personelId}/iletisim`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Güncelleme başarısız oldu.');

            onSuccess(); // Ana sayfadaki veriyi yeniletir
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            {/* onClick={(e) => e.stopPropagation()} ile arka plana tıklayınca kapanmasını ama içine tıklayınca kapanmamasını sağlıyoruz */}
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2 style={{ marginTop: 0, color: '#1f2937' }}>İletişim Bilgilerini Düzenle</h2>

                {error && <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

                <div className="form-group">
                    <label>Telefon</label>
                    <input value={formData.telefon} onChange={e => setFormData({ ...formData, telefon: e.target.value })} />
                </div>

                <div className="form-group">
                    <label>E-Posta</label>
                    <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                </div>

                <h3 style={{ fontSize: '1rem', marginTop: '1rem', marginBottom: '0.5rem' }}>Adres Bilgileri</h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label>İl</label>
                        <input value={formData.adres.il} onChange={e => setFormData({ ...formData, adres: { ...formData.adres, il: e.target.value } })} />
                    </div>
                    <div className="form-group">
                        <label>İlçe</label>
                        <input value={formData.adres.ilce} onChange={e => setFormData({ ...formData, adres: { ...formData.adres, ilce: e.target.value } })} />
                    </div>
                    <div className="form-group">
                        <label>Sokak</label>
                        <input value={formData.adres.sokak} onChange={e => setFormData({ ...formData, adres: { ...formData.adres, ilce: e.target.value } })} />
                    </div>
                </div>


                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                    <label>Ulasilamadiginda Aranacak Kişi</label>
                    <input value={formData.ulasilamadiginda.adSoyad} onChange={e => setFormData({ ...formData, ulasilamadiginda: { ...formData.ulasilamadiginda, adSoyad: e.target.value } })} />
                </div>
                <div className="form-group">
                    <label> Numara</label>
                    <input value={formData.ulasilamadiginda.telefon} onChange={e => setFormData({ ...formData, ulasilamadiginda: { ...formData.ulasilamadiginda, telefon: e.target.value } })} />
                </div>
            </div>

            <div className="form-group">
                <label>Açık Adres</label>
                <input value={formData.adres.tamAdres} onChange={e => setFormData({ ...formData, adres: { ...formData.adres, tamAdres: e.target.value } })} />
            </div>


            <div className="modal-actions">
                <button onClick={onClose} disabled={loading} style={{ padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '6px', background: 'white', cursor: 'pointer' }}>İptal</button>
                <button onClick={handleSave} disabled={loading} style={{ padding: '0.5rem 1rem', border: 'none', borderRadius: '6px', background: '#3b82f6', color: 'white', cursor: 'pointer' }}>
                    {loading ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
            </div>
        </div>
        </div >
    );
}