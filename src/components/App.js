import React, { useState, useRef } from 'react';
import logo from './logo.svg';
import './App.css';
import QRCode from 'qrcode.react';

function App() {
  const canvas = useRef(null);

  const [url, setUrl] = useState('');
  const [datablob, setDatablob] = useState('');

  const onUrlInputChange = e => {
    setUrl(e.target.value);
  };

  const onDownloadClick = e => {
    const cvs = canvas.current.children[0];
    console.log(cvs.toDataURL());
    setDatablob(cvs.toDataURL());
  };

  const renderDisabled = () => {
    let classes = 'ui button';
    if (url === '') {
      return classes + ' secondary disabled';
    }

    return classes + ' primary';
  };

  const renderSvg = () => {
    if (url === '') {
      return <img src={logo} className="App-logo" alt="logo" />;
    }

    return (
      <div ref={canvas}>
        <QRCode
          className="App-logo"
          bgColor="#FFFFFF"
          fgColor="#000000"
          level="L"
          size="256"
          value={url}
        />
      </div>
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        {renderSvg()}
        <div className="ui action input">
          <input
            type="text"
            placeholder="Enter a url"
            value={url}
            onChange={onUrlInputChange}
          />
          <a
            href={datablob}
            download="qrcode.png"
            onClick={onDownloadClick}
            className={renderDisabled()}
          >
            <h2>Download</h2>
          </a>
        </div>
      </header>
    </div>
  );
}

export default App;
