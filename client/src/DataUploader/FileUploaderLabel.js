import React from 'react';
import { Label } from 'semantic-ui-react';

const FileUploaderLabel = ({ labelText, resetCallback }) => {
  const onResetClick = e => {
    e.stopPropagation();
    e.preventDefault();
    if (resetCallback) {
      resetCallback();
    }
  };
  const renderContent = () => {
    if (resetCallback) {
      return (
        <span>
          {labelText}
          <i
            onClick={onResetClick}
            style={{ margin: '5px' }}
            className="tiny icon undo"
          ></i>
        </span>
      );
    } else {
      return <span>{labelText}</span>;
    }
  };
  return (
    <Label basic size="huge" color="red" pointing="below">
      <label htmlFor="file">{renderContent()}</label>
    </Label>
  );
};

export default FileUploaderLabel;
