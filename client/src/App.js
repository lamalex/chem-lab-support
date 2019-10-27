import React, { useState } from 'react';
import _ from 'underscore';

import DataUploader from './DataUploader/DataUploader';

function App() {
  const serverUrlBase = 'http://localhost:8001/static';

  const [plots, setPlots] = useState([]);

  const onUploadFinished = ({ data }) => {
    const { images } = data;
    setPlots(images);
  };

  const renderPlots = () => {
    return _.map(plots, (plot, i) => {
      return (
        <div key={i} className="ui center aligned raised segment">
          <h2>{plot}</h2>
          <img
            className="ui image"
            src={`${serverUrlBase}${plot}`}
            alt={plot}
          ></img>
        </div>
      );
    });
  };

  return (
    <div>
      <DataUploader onUploadFinished={onUploadFinished} />
      <div>{renderPlots()}</div>
    </div>
  );
}

export default App;
