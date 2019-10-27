import React, { useCallback, useState } from 'react';
import _ from 'underscore';

import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import { useDropzone } from 'react-dropzone';
import { Button } from 'semantic-ui-react';

import RoundedBox from '../RoundedBox/RoundedBox';
import OptionsDrawer from './OptionsDrawer/OptionsDrawer';
import FileUploaderLabel from './FileUploaderLabel';

import './DataUploader.css';

const DataUploader = ({ onUploadFinished = null }) => {
  const [loading, setLoading] = useState(false);
  const [datafilePath, setDatafilePath] = useState('');
  const [plotConfig, setPlotConfig] = useState({});

  const uploadFile = file => {
    const url = 'http://localhost:8000/upload';
    const formdata = new FormData();
    formdata.append('plotConfig', JSON.stringify(plotConfig));
    formdata.append('file', file);

    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };

    return axios.post(url, formdata, config);
  };

  const onPlotConfigChanged = pcfg => {
    setPlotConfig(pcfg);
  };

  const onFormSubmit = e => {
    e.preventDefault();

    if (acceptedFiles.length > 0) {
      setLoading(true);
      uploadFile(acceptedFiles[0]).then(res => {
        if (onUploadFinished) onUploadFinished(res);
        setLoading(false);
      });
    } else {
      console.log('THIS SHOULD NOT BE!');
    }
  };

  const onDrop = useCallback(acceptedFiles => {
    const firstCsv = _.find(acceptedFiles, f => {
      return f.type === 'text/csv';
    });

    if (firstCsv) {
      setDatafilePath(firstCsv.path);
    }
  }, []);

  const {
    isDragActive,
    getRootProps,
    getInputProps,
    isDragReject,
    acceptedFiles
  } = useDropzone({
    onDrop,
    accept: 'text/csv',
    minSize: 0,
    maxSize: 1048576
  });

  const renderDropLabel = () => {
    let labelText = 'Drop a .csv here to upload';
    if (isDragActive && !isDragReject && acceptedFiles.length === 0)
      labelText = 'Drop that dern .csv right here';
    else if (isDragReject) labelText = 'Oh dang. CSVs only, please';
    return <FileUploaderLabel labelText={labelText} />;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div>
          <ClipLoader
            sizeUnit={'px'}
            size={150}
            color={'#00ce66'}
            loading={loading}
          />
        </div>
      );
    }
    return (
      <>
        <div {...getRootProps()}>
          <div className="ui field">
            {renderDropLabel()}
            <input {...getInputProps()} className="input inputfile" />
          </div>
        </div>

        <div>
          <Button
            color="pink"
            size="big"
            onClick={onFormSubmit}
            disabled={datafilePath === ''}
          >
            Plot my data
          </Button>
          <OptionsDrawer onOptionsChange={onPlotConfigChanged} />
        </div>
      </>
    );
  };

  return <RoundedBox className="container">{renderContent()}</RoundedBox>;
};

export default DataUploader;
