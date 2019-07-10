import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { QRCode } from 'react-qr-svg';

function App() {
  const [url, setUrl] = useState('');

  const onUrlInputChange = e => {
    setUrl(e.target.value);
  };

  const renderSvg = () => {
    if (url === '') {
      return <img src={logo} className="App-logo" alt="logo" />;
    }

    return (
      <QRCode
        className="App-logo"
        bgColor="#D0D0D0"
        fgColor="#000000"
        level="L"
        value={url}
      />
    );
  };
  return (
    <div className="App">
      <header className="App-header">
        {renderSvg()}
        <div className="ui input">
          <input
            type="text"
            placeholder="Enter a url"
            value={url}
            onChange={onUrlInputChange}
          />
        </div>
      </header>
    </div>
  );
}

export default App;
