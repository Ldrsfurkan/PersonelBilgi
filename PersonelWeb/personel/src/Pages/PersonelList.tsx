import { useEffect, useState } from 'react';
import { API_URL } from '../config';
import type { GetAllPersonelResponse, PersonelKisaDto } from '../models/types';
import CreatePersonelModal from './CreatePersonelModal';

interface Props {
  onPersonelSecildi: (id: string) => void;
}

export default function PersonelList({ onPersonelSecildi }: Props) {
  const [personeller, setPersoneller] = useState<PersonelKisaDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPersoneller = async () => {
      try {
        const response = await fetch(`${API_URL}/personel`);
        if (!response.ok) throw new Error('Veriler çekilemedi.');

        const data: GetAllPersonelResponse = await response.json();
        if (data.success) {
          setPersoneller(data.personeller);
        } else {
          setError(data.message);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPersoneller();
  }, []);

  if (loading) return <div className="loading">Yükleniyor...</div>;
  if (error) return <div className="error">Hata: {error}</div>;

  return (
    <div>
      {/* BAŞLIK VE BUTON */}
      <header className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: '0 0 0.5rem 0', textAlign: 'left' }}>Personel Listesi</h1>
          <p style={{ margin: 0, textAlign: 'left' }}>Sistemde kayıtlı tüm personeller.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{ background: '#10b981', color: 'white', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '1rem', boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)' }}
        >
          + Yeni Personel Ekle
        </button>
      </header>

      {personeller.length === 0 ? (
        <div className="empty">Kayıtlı personel bulunamadı.</div>
      ) : (
        <ul className="personel-list">
          {personeller.map((p) => (
            <li key={p.id} className="personel-card">
              <div className="avatar">
                {p.adSoyad.substring(0, 2).toUpperCase()}
              </div>
              <div className="personel-info">
                <h2>{p.adSoyad}</h2>
              </div>
              <button 
                className="view-btn" 
                onClick={() => onPersonelSecildi(p.id)} // Tıklanınca ID'yi App.tsx'e yolla
              >
                Detay
              </button>
            </li>
          ))}
        </ul>
      )}
      {isModalOpen && (
        <CreatePersonelModal 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => {
            setIsModalOpen(false);
            window.location.reload(); // Listeyi güncellemek için sayfayı yenile
          }} 
        />
      )}
    </div>
  );
}