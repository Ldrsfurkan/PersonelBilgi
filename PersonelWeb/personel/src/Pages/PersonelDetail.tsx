import { useEffect, useState } from 'react';
import { API_URL } from '../config';
import type { GetPersonelByIdResponse, PersonelEntity } from '../models/types';
import EditIletisimModal from './EditIletisimModal';
import EditEgitimModal from './EditEgitimModal';
import EditAileModal from './EditAileModal';
import EditBasvuruModal from './EditBasvuruModal';
import EditKimlikModal from './EditKimlikModal';
import EditGenelDurumModal from './EditGenelDurumModal';
import EditEkBilgilerModal from './EditEkBilgilerModal';
import CreateDeneyimModal from './CreateDeneyimModal';

interface Props {
    personelId: string;
    onGeriDon: () => void;
}

export default function PersonelDetay({ personelId, onGeriDon }: Props) {
    const [personel, setPersonel] = useState<PersonelEntity | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [aktifModal, setAktifModal] = useState<string | null>(null);

    useEffect(() => {
        const fetchDetay = async () => {
            try {
                const response = await fetch(`${API_URL}/personel/${personelId}`);
                if (!response.ok) throw new Error('Detaylar çekilemedi.');
                const data: GetPersonelByIdResponse = await response.json();
                if (data.success && data.personel) setPersonel(data.personel);
                else setError(data.message);
            } catch (err: any) { setError(err.message); }
            finally { setLoading(false); }
        };
        fetchDetay();
    }, [personelId]);

    if (loading) return <div className="loading">Detaylar yükleniyor...</div>;
    if (error || !personel) return <div className="error">Hata: {error || 'Bulunamadı'}</div>;

    const formatTarih = (tarih?: string) => {
        if (!tarih || tarih === "0001-01-01T00:00:00") return "-";
        return new Date(tarih).toLocaleDateString('tr-TR');
    };

    // --- ENUM EŞLEŞTİRMELERİ (MAPPING) ---
    const KanGrubuMap: Record<number, string> = {
        0: 'Belirtilmedi',
        1: 'A Rh+', 2: 'A Rh-', 3: 'B Rh+', 4: 'B Rh-',
        5: 'AB Rh+', 6: 'AB Rh-', 7: '0 Rh+', 8: '0 Rh-'
    };

    const AskerlikDurumuMap: Record<number, string> = {
        1: 'Yapıldı', 2: 'Muaf', 3: 'Tecilli', 4: 'Yapılmadı'
    };

    const DepartmanMap: Record<number, string> = {
        0: 'Belirtilmedi',
        1: 'Yazılım', 2: 'İnsan Kaynakları', 3: 'Finans',
        4: 'Pazarlama', 5: 'Satış', 6: 'Operasyon'
    };

    const CalismaSaatleriMap: Record<number, string> = {
        1: 'Tam Zamanlı', 2: 'Yarı Zamanlı', 3: 'Esnek Çalışma', 4: 'Uzaktan Çalışma', 5: 'Hibrit'
    };

    const MedeniDurumMap: Record<number, string> = {
        0: 'Belirtilmedi', 1: 'Bekar', 2: 'Evli', 3: 'Dul', 4: 'Boşanmış'
    };

    const BilgiSatiri = ({ etiket, deger }: { etiket: string; deger: React.ReactNode }) => (
        <div style={{ display: 'flex', marginBottom: '0.5rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.25rem' }}>
            <span style={{ fontWeight: '600', color: '#374151', width: '45%' }}>{etiket}:</span>
            <span style={{ color: '#4b5563', width: '55%', wordBreak: 'break-word' }}>{deger !== undefined && deger !== null && deger !== '' ? deger : '-'}</span>
        </div>
    );

    const BilgiKutusu = ({ baslik, onEdit, children }: { baslik: string, onEdit: () => void, children: React.ReactNode }) => (
        <div className="custom-scrollbar" style={{
            position: 'relative',
            backgroundColor: '#f9fafb',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            aspectRatio: '1 / 1',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <button
                onClick={onEdit}
                style={{ position: 'absolute', top: '1.2rem', right: '1rem', background: 'transparent', border: 'none', color: '#3b82f6', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}
            >
                Düzenle
            </button>
            <h3 style={{ marginTop: 0, color: '#2563eb', marginBottom: '1.5rem', paddingRight: '4rem', flexShrink: 0 }}>{baslik}</h3>
            <div style={{ flex: 1 }}>{children}</div>
        </div>
    );

    // --- HTML / JSX KISMI ---
    return (
        <div>
            <button className="view-btn" onClick={onGeriDon} style={{ marginBottom: '1rem', backgroundColor: '#6b7280' }}>
                ← Listeye Dön
            </button>

            <div className="personel-card" style={{ flexDirection: 'column', alignItems: 'stretch', padding: '2rem' }}>

                {/* ANA BAŞLIK (Tam Ortalanmış) */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%' }}>
                    <h1 style={{ margin: '0 0 0.5rem 0', color: '#1f2937' }}>
                        {personel.kimlikBilgileri?.ad} {personel.kimlikBilgileri?.soyad}
                    </h1>
                    <span style={{ backgroundColor: '#e0e7ff', color: '#3730a3', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.875rem', fontWeight: '500' }}>
                        {personel.meslek}
                    </span>
                </div>

                <hr style={{ width: '100%', borderColor: '#e5e7eb', margin: '2rem 0' }} />

                {/* 2 SÜTUNLU BİLGİ KARTLARI IZGARASI (1fr 1fr ile sağdan sola hizalama) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', width: '100%' }}>

                    {/* KİMLİK BİLGİLERİ */}
                    <BilgiKutusu baslik="Kimlik Bilgileri" onEdit={() => setAktifModal('kimlik')}>
                        <BilgiSatiri etiket="TC Kimlik No" deger={personel.kimlikBilgileri?.tcNo} />
                        <BilgiSatiri etiket="Uyruk" deger={personel.kimlikBilgileri?.uyruk} />
                        <BilgiSatiri etiket="Doğum Yeri" deger={personel.kimlikBilgileri?.dogumYeri} />
                        <BilgiSatiri etiket="Doğum Tarihi" deger={formatTarih(personel.kimlikBilgileri?.dogumTarihi)} />
                        <BilgiSatiri etiket="Kan Grubu" deger={personel.kanGrubu ? KanGrubuMap[personel.kanGrubu] : '-'} />
                    </BilgiKutusu>

                    {/* İLETİŞİM BİLGİLERİ */}
                    <BilgiKutusu baslik="İletişim Bilgileri" onEdit={() => setAktifModal('iletisim')}>
                        <BilgiSatiri etiket="Telefon" deger={personel.iletisimBilgileri?.telefon} />
                        <BilgiSatiri etiket="E-Posta" deger={personel.iletisimBilgileri?.email} />
                        <BilgiSatiri etiket="İl / İlçe" deger={`${personel.iletisimBilgileri?.adres?.il || '-'} / ${personel.iletisimBilgileri?.adres?.ilce || '-'}`} />
                        <BilgiSatiri etiket="Sokak" deger={personel.iletisimBilgileri?.adres?.sokak} />
                        <BilgiSatiri etiket="Açık Adres" deger={personel.iletisimBilgileri?.adres?.tamAdres} />
                        <div style={{ marginTop: '1rem', paddingTop: '0.5rem', borderTop: '1px dashed #d1d5db' }}>
                            <span style={{ fontSize: '0.85rem', color: '#6b7280', display: 'block', marginBottom: '0.5rem' }}>Ulaşılamadığında Aranacak Kişi:</span>
                            <BilgiSatiri etiket="Ad Soyad" deger={personel.iletisimBilgileri?.ulasilamadiginda?.adSoyad} />
                            <BilgiSatiri etiket="Telefon" deger={personel.iletisimBilgileri?.ulasilamadiginda?.telefon} />
                        </div>
                    </BilgiKutusu>

                    {/* GENEL DURUM & BEKLENTİLER */}
                    <BilgiKutusu baslik="Genel Durum & Beklentiler" onEdit={() => setAktifModal('geneldurum')}>
                        <BilgiSatiri etiket="Beklenen Ücret" deger={personel.beklenenUcret ? `${personel.beklenenUcret} ₺` : '-'} />
                        <BilgiSatiri etiket="Ehliyet" deger={personel.isEhliyetiVar ? 'Var' : 'Yok'} />
                        <BilgiSatiri etiket="Sabıka Kaydı" deger={personel.isSabikaKaydiVar ? 'Var' : 'Yok'} />
                        <BilgiSatiri etiket="Sigara Kullanımı" deger={personel.isSigaraKullaniyor ? 'Kullanıyor' : 'Kullanmıyor'} />
                        <BilgiSatiri etiket="Hibrit Çalışma" deger={personel.isHibritCalisabilir ? 'Uygun' : 'Uygun Değil'} />
                        <BilgiSatiri etiket="İş Seyahati" deger={personel.isIsSeyehatineCikabilir ? 'Çıkabilir' : 'Çıkamaz'} />
                        <BilgiSatiri etiket="Yönetici Kadrosu" deger={personel.isYoneticiDuzeyindeCalisabilir ? 'Çalışabilir' : 'Çalışamaz'} />
                        <BilgiSatiri etiket="Firma Çalışan Yakını" deger={personel.isFirmadaCalisanYakiniVar ? 'Var' : 'Yok'} />
                    </BilgiKutusu>

                    {/* EĞİTİM BİLGİLERİ */}
                    <BilgiKutusu baslik="Eğitim Bilgileri" onEdit={() => setAktifModal('egitim')}>
                        <BilgiSatiri etiket="Üniversite Mezunu" deger={personel.egitimBilgileri?.isUniversiteMezunu ? 'Evet' : 'Hayır'} />
                        <BilgiSatiri etiket="Lise Mezunu" deger={personel.egitimBilgileri?.isLiseMezunu ? 'Evet' : 'Hayır'} />
                        <BilgiSatiri etiket="Okul Adı" deger={personel.egitimBilgileri?.okulAdi} />
                        <BilgiSatiri etiket="Bölüm" deger={personel.egitimBilgileri?.bolum} />
                        <BilgiSatiri etiket="Mezuniyet Notu" deger={personel.egitimBilgileri?.mezuniyetNotu} />
                        <BilgiSatiri etiket="Başlangıç Tarihi" deger={formatTarih(personel.egitimBilgileri?.baslangicTarihi)} />
                        <BilgiSatiri etiket="Mezuniyet Tarihi" deger={formatTarih(personel.egitimBilgileri?.mezuniyetTarihi)} />
                    </BilgiKutusu>

                    {/* AİLE BİLGİLERİ */}
                    <BilgiKutusu baslik="Aile Bilgileri" onEdit={() => setAktifModal('aile')}>
                        <BilgiSatiri etiket="Medeni Durum" deger={personel.aileBilgileri?.medeniDurum !== undefined ? MedeniDurumMap[personel.aileBilgileri.medeniDurum] : '-'} />
                        <BilgiSatiri etiket="Ailesiyle Mi Yaşıyor?" deger={personel.isAilesininYanindaYasiyor ? 'Evet' : 'Hayır'} />
                        <BilgiSatiri etiket="Eş Adı / Meslek" deger={personel.aileBilgileri?.esAd ? `${personel.aileBilgileri.esAd} (${personel.aileBilgileri.esMeslek || 'Belirtilmedi'})` : '-'} />
                        <BilgiSatiri etiket="Anne Adı" deger={personel.aileBilgileri?.anneAd} />
                        <BilgiSatiri etiket="Baba Adı / Meslek" deger={personel.aileBilgileri?.babaAd ? `${personel.aileBilgileri.babaAd} (${personel.aileBilgileri.babaMeslek || 'Belirtilmedi'})` : '-'} />
                        <BilgiSatiri etiket="Çocuk Sayısı" deger={personel.aileBilgileri?.cocukSayisi} />
                        <BilgiSatiri etiket="Kardeş Sayısı" deger={personel.aileBilgileri?.kardesSayisi} />
                        <BilgiSatiri etiket="Önceki Soyad" deger={personel.aileBilgileri?.oncekiSoyad} />
                    </BilgiKutusu>

                    {/* ASKERLİK VE EK GELİR */}
                    <BilgiKutusu baslik="Askerlik & Ek Bilgiler" onEdit={() => setAktifModal('ekbilgiler')}>
                        <BilgiSatiri etiket="Askerlik Durumu" deger={personel.askerlikDurumu ? AskerlikDurumuMap[personel.askerlikDurumu] : '-'} />
                        <BilgiSatiri etiket="Tecil Tarihi" deger={formatTarih(personel.tecilDurumu)} />
                        <BilgiSatiri etiket="Tecil Nedeni" deger={personel.tecilNedeni} />
                        <div style={{ margin: '1rem 0', borderTop: '1px dashed #d1d5db' }}></div>
                        <BilgiSatiri etiket="Ek Gelir" deger={personel.isEkGeliriVar ? `${personel.ekGelir} ₺` : 'Yok'} />
                        <BilgiSatiri etiket="Ek Gelir Kaynağı" deger={personel.ekGelirNedeni} />
                        <BilgiSatiri etiket="Ekstra Açıklama" deger={personel.ekstraAciklama} />
                        <BilgiSatiri etiket="Ekstra Beklentiler" deger={personel.ekstraBeklentiler} />
                    </BilgiKutusu>

                    {/* BAŞVURU BİLGİLERİ */}
                    <BilgiKutusu baslik="Firma Başvuru Durumu" onEdit={() => setAktifModal('basvuru')}>
                        <BilgiSatiri etiket="Tercih Edilen Dep. 1" deger={personel.basvuruBilgileri?.departman1 ? DepartmanMap[personel.basvuruBilgileri.departman1] : '-'} />
                        <BilgiSatiri etiket="Tercih Edilen Dep. 2" deger={personel.basvuruBilgileri?.departman2 ? DepartmanMap[personel.basvuruBilgileri.departman2] : '-'} />
                        <BilgiSatiri etiket="Tercih Edilen Dep. 3" deger={personel.basvuruBilgileri?.departman3 ? DepartmanMap[personel.basvuruBilgileri.departman3] : '-'} />
                        <BilgiSatiri etiket="Uygun Görülen Dep." deger={personel.basvuruBilgileri?.uygunGorulenDepartman ? DepartmanMap[personel.basvuruBilgileri.uygunGorulenDepartman] : '-'} />
                        <BilgiSatiri etiket="Çalışma Modeli" deger={personel.basvuruBilgileri?.calismaSaatleri ? CalismaSaatleriMap[personel.basvuruBilgileri.calismaSaatleri] : '-'} />
                        <BilgiSatiri etiket="Başvuru Tarihi" deger={formatTarih(personel.basvuruBilgileri?.basvuruTarihi)} />
                        <BilgiSatiri etiket="Başlama Tarihi" deger={formatTarih(personel.basvuruBilgileri?.baslamaTarihi)} />
                        <BilgiSatiri etiket="Deneme Süreci" deger={personel.basvuruBilgileri?.denemeSureci} />
                        <BilgiSatiri etiket="Eğitim Süreci" deger={personel.basvuruBilgileri?.egitimSureci} />
                        <BilgiSatiri etiket="Ayrılma Tarihi" deger={formatTarih(personel.basvuruBilgileri?.ayrilmaTarihi)} />
                    </BilgiKutusu>

                </div>

                {/* DENEYİMLER BÖLÜMÜ (Ayrı bir satırda tam genişlikte) */}
                <div style={{ width: '100%', marginTop: '3rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #2563eb', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
                        <h3 style={{ margin: 0, color: '#2563eb' }}>İş Deneyimleri</h3>
                        <button
                            onClick={() => setAktifModal('yeniDeneyim')}
                            style={{ background: '#10b981', color: 'white', border: 'none', padding: '0.4rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
                        >
                            + Yeni Deneyim Ekle
                        </button>
                    </div>

                    {!personel.deneyimler || personel.deneyimler.length === 0 ? (
                        <p style={{ color: '#6b7280', fontStyle: 'italic' }}>Kayıtlı iş deneyimi bulunmamaktadır.</p>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            {personel.deneyimler.map((deneyim) => (
                                <div key={deneyim.id} style={{ position: 'relative', border: '1px solid #e5e7eb', padding: '1.2rem', borderRadius: '8px', backgroundColor: 'white' }}>
                                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#1f2937', paddingRight: '2rem' }}>
                                        {deneyim.pozisyon} <br /><span style={{ color: '#6b7280', fontWeight: 'normal', fontSize: '0.9rem' }}>@ {deneyim.sirketAdi}</span>
                                    </h4>
                                    <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.5rem', backgroundColor: '#f3f4f6', display: 'inline-block', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                                        🗓️ {formatTarih(deneyim.baslangicTarihi)} - {formatTarih(deneyim.bitisTarihi)}
                                    </div>
                                    <p style={{ margin: 0, color: '#4b5563', fontSize: '0.95rem' }}>{deneyim.aciklama}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>

            {aktifModal === 'iletisim' && (
                <EditIletisimModal
                    personelId={personel.id}
                    mevcutVeri={personel.iletisimBilgileri}
                    onClose={() => setAktifModal(null)}
                    onSuccess={() => {
                        setAktifModal(null);
                        window.location.reload();
                    }}
                />
            )}
            {aktifModal === 'egitim' && (
                <EditEgitimModal
                    personelId={personel.id}
                    mevcutVeri={personel.egitimBilgileri}
                    onClose={() => setAktifModal(null)}
                    onSuccess={() => {
                        setAktifModal(null);
                        window.location.reload();
                    }}
                />
            )}
            {aktifModal === 'aile' && (
                <EditAileModal
                    personelId={personel.id}
                    mevcutVeri={personel.aileBilgileri}
                    isAilesininYanindaYasiyor={personel.isAilesininYanindaYasiyor}
                    onClose={() => setAktifModal(null)}
                    onSuccess={() => {
                        setAktifModal(null);
                        window.location.reload();
                    }}
                />
            )}

            {aktifModal === 'basvuru' && (
                <EditBasvuruModal
                    personelId={personel.id}
                    mevcutVeri={personel.basvuruBilgileri}
                    onClose={() => setAktifModal(null)}
                    onSuccess={() => {
                        setAktifModal(null);
                        window.location.reload();
                    }}
                />
            )}

            {aktifModal === 'kimlik' && (
                <EditKimlikModal
                    personelId={personel.id}
                    mevcutVeri={personel.kimlikBilgileri}
                    kangrubu={personel.kanGrubu}
                    onClose={() => setAktifModal(null)}
                    onSuccess={() => {
                        setAktifModal(null);
                        window.location.reload();
                    }}
                />
            )}

            {aktifModal === 'geneldurum' && (
                <EditGenelDurumModal
                    personelId={personel.id}
                    mevcutVeri={personel}
                    onClose={() => setAktifModal(null)}
                    onSuccess={() => {
                        setAktifModal(null);
                        window.location.reload();
                    }}
                />
            )}

            {aktifModal === 'ekbilgiler' && (
                <EditEkBilgilerModal
                    personelId={personel.id}
                    mevcutVeri={personel}
                    onClose={() => setAktifModal(null)}
                    onSuccess={() => {
                        setAktifModal(null);
                        window.location.reload();
                    }}
                />
            )}

            {aktifModal === 'yeniDeneyim' && (
                <CreateDeneyimModal
                    personelId={personel.id}
                    onClose={() => setAktifModal(null)}
                    onSuccess={() => {
                        setAktifModal(null);
                        window.location.reload();
                    }}
                />
            )}
        </div>
    );
}