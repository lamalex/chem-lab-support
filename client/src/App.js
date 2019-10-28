import React, { useState } from 'react';
import _ from 'underscore';
import { Segment } from 'semantic-ui-react';

import DataUploader from './DataUploader/DataUploader';
import './ReactToggle.css';

function App() {
  const serverUrlBase = 'http://localhost:8000/static';

  const [plots, setPlots] = useState([]);

  const onUploadFinished = ({ data }) => {
    const { images } = data;
    setPlots(images);
  };

  const renderPlots = () => {
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
      <DataUploader onUploadFinished={onUploadFinished} />
      <div className="ui container">{renderPlots()}</div>
    </div>
  );
}

export default App;
