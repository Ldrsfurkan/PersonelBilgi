export interface PersonelKisaDto {
  id: string;
  adSoyad: string;
}

export interface GetAllPersonelResponse {
  personeller: PersonelKisaDto[];
  success: boolean;
  message: string;
}

export interface PersonelDeneyim {
  id: string;
  sirketAdi: string;
  pozisyon: string;
  baslangicTarihi: string;
  bitisTarihi: string;
  aciklama: string;
}
// Tüm detayları içeren ana varlık
export interface PersonelEntity {
  id: string;
  meslek: string;
  ekGelir : number;
  kanGrubu: number;
  tecilDurumu:string;
  tecilNedeni:string;
  beklenenUcret: number;
  ekGelirNedeni: string;
  ekstraAciklama: string;
  isEhliyetiVar: boolean;
  isEkGeliriVar: boolean;
  askerlikDurumu: number;
  isSabikaKaydiVar: boolean;
  ekstraBeklentiler:string;
  isSigaraKullaniyor: boolean;
  isHibritCalisabilir: boolean;
  isIsSeyehatineCikabilir: boolean;
  isAilesininYanindaYasiyor: boolean;
  isFirmadaCalisanYakiniVar: boolean;
  isYoneticiDuzeyindeCalisabilir: boolean;
  kimlikBilgileri?: {
    ad: string;
    soyad: string;
    tcNo: string;
    dogumTarihi: string;
    uyruk:string;
    dogumYeri:string;
  };
  iletisimBilgileri?: {
    email: string;
    telefon: string;
    adres?: { il: string; ilce: string; sokak: string; tamAdres: string };
    ulasilamadiginda?: {adSoyad: string; telefon: string;}
  };
  basvuruBilgileri?: {
    departman1:number;
    departman2:number;
    departman3:number;
    denemeSureci:string;
    egitimSureci:string;
    ayrilmaTarihi:string;
    baslamaTarihi:string;
    basvuruTarihi:string;
    calismaSaatleri:number;
    uygunGorulenDepartman:number;
  };
  egitimBilgileri?: {
    isUniversiteMezunu:boolean;
    isLiseMezunu:boolean;
    okulAdi:string;
    bolum:string;
    mezuniyetNotu:number;
    baslangicTarihi:string;
    mezuniyetTarihi:string;
  };
  aileBilgileri?:{
    esAd:string;
    anneAd:string;
    babaAd:string;
    esMeslek:string;
    babaMeslek:string;
    cocukSayisi:number;
    medeniDurum:number;
    oncekiSoyad:string;
    kardesSayisi:number;
  };
  deneyimler?: PersonelDeneyim[];
}

export interface GetPersonelByIdResponse {
  personel: PersonelEntity | null;
  success: boolean;
  message: string;
}