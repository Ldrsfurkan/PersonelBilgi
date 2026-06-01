import { useState } from 'react';
import PersonelList from './Pages/PersonelList';
import PersonelDetay from './Pages/PersonelDetail';
import './App.css'; 

function App() {
  const [aktifPersonelId, setAktifPersonelId] = useState<string | null>(null);

  return (
    <div className="app-container">
      {aktifPersonelId === null ? (
        <PersonelList onPersonelSecildi={(id) => setAktifPersonelId(id)} />
      ) : (
        <PersonelDetay 
          personelId={aktifPersonelId} 
          onGeriDon={() => setAktifPersonelId(null)} 
        />
      )}
    </div>
  );
}

export default App;