import React, { useState } from 'react';
import { Form, Input, Accordion, Icon } from 'semantic-ui-react';

const OptionsDrawer = ({ onOptionsChange }) => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [plotConfig, setPlotConfig] = useState({
    xmin: -0.1,
    xmax: 5000,
    ymin: -0.1,
    ymax: 1.1
  });

  const onPlotConfigNumberChange = (option, value) => {
    value = Number(value);
    if (!isNaN(value)) {
      const ncfg = { ...plotConfig, [option]: value };
      setPlotConfig(ncfg);
      onOptionsChange(ncfg);
    }
  };

  return (
    <Accordion>
      <Accordion.Title
        active={activeIndex === 0}
        index={0}
        onClick={() => setActiveIndex(activeIndex === 0 ? -1 : 0)}
      >
        <Icon
          color="pink"
          size="big"
          name={activeIndex === 0 ? 'double down angle' : 'double right angle'}
        />
      </Accordion.Title>
      <Accordion.Content active={activeIndex === 0}>
        <Form>
          <Form.Group widths="equal">
            <Form.Field
              id="form-input-control-x-min"
              control={Input}
              type="number"
              label="X Axis Minimum"
              value={plotConfig.xmin}
              onChange={(e, { value }) => {
                onPlotConfigNumberChange('xmin', value);
              }}
            />
            <Form.Field
              id="form-input-control-x-max"
              control={Input}
              type="number"
              label="X Axis Maximum"
              value={plotConfig.xmax}
              onChange={(e, { value }) => {
                onPlotConfigNumberChange('xmax', value);
              }}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              id="form-input-control-y-min"
              control={Input}
              type="number"
              label="Y Axis Minimum"
              value={plotConfig.ymin}
              onChange={(e, { value }) => {
                onPlotConfigNumberChange('ymin', value);
              }}
            />
            <Form.Field
              id="form-input-control-y-max"
              control={Input}
              type="number"
              label="Y Axis Maximum"
              value={plotConfig.ymax}
              onChange={(e, { value }) => {
                onPlotConfigNumberChange('ymax', value);
              }}
            />
          </Form.Group>
        </Form>
      </Accordion.Content>
    </Accordion>
  );
};

export default OptionsDrawer;
