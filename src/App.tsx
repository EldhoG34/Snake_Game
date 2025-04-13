import React from 'react';
import Game from './components/Game';
import Leaderboard from './components/Leaderboard';
import AdUnit from './components/AdUnit';
import './App.css';

function App() {
  return (
    <div className="app">
      <div className="app-container">
        {/* Top banner ad */}
        <AdUnit 
          adSlot="XXXXXXXX" // Replace with your ad slot ID
          style={{ 
            width: '100%', 
            minHeight: '90px',
            marginBottom: '20px' 
          }}
        />
        
        <div className="game-section">
          <Game />
          {/* Sidebar ad */}
          <AdUnit 
            adSlot="XXXXXXXX" // Replace with your ad slot ID
            style={{ 
              width: '300px',
              minHeight: '600px',
              margin: '0 20px'
            }}
          />
        </div>
        
        <Leaderboard />
        
        {/* Bottom banner ad */}
        <AdUnit 
          adSlot="XXXXXXXX" // Replace with your ad slot ID
          style={{ 
            width: '100%', 
            minHeight: '90px',
            marginTop: '20px' 
          }}
        />
      </div>
    </div>
  );
}

export default App;
