// import logo from './logo.svg';
import './App.css';
import {Routes,Route} from 'react-router-dom'
import Homepage from './pages/Home';
import RoomPage from './pages/Room';
import { SockteProvider } from './providers/socket';
import { PeerProvider } from './providers/peer';
 
function App() {
  return (
    <div className="App">
     <div className="App">
     <SockteProvider>
      <PeerProvider>
<Routes>
  
  <Route path="/" element={<Homepage/>} />
  <Route path="/room/:roomId" element={<RoomPage/>}/>
  

</Routes>
</PeerProvider>
</SockteProvider>
</div>
    </div>
  );
}

export default App;
