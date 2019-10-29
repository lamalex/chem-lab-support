import React, { useState } from 'react';
import _ from 'underscore';
import { Segment } from 'semantic-ui-react';

import DataUploader from './DataUploader/DataUploader';
import './ReactToggle.css';

function App() {
  const serverUrlBase = 'http://localhost:8000/static';

  const [error, setError] = useState(null);
  const [plots, setPlots] = useState([]);

  const onUploadFinished = ({ data }) => {
    const { images } = data;
    setError(null);
    setPlots(images);
  };

  const onUploadError = err => {
    setError(err);
  };

  const renderPlots = () => {
    if (error) {
      return (
        <Segment padded="very">
          <h1>
            I'm really sorry but something has gone <u>horribly</u> wrong
          </h1>
          <span>Whoopsie!</span>
        </Segment>
      );
    }
    return _.map(plots, (plot, i) => {
      return (
        <Segment key={i} padded="very">
          <h2>{plot}</h2>
          <img
            className="ui image"
            src={`${serverUrlBase}${plot}`}
            alt={plot}
          ></img>
        </Segment>
      );
    });
  };

  return (
    <div>
      <DataUploader
        onUploadFinished={onUploadFinished}
        onError={onUploadError}
      />
      <div className="ui container">{renderPlots()}</div>
    </div>
  );
}

export default App;
