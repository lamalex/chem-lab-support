import React, { useState } from 'react';
import Toggle from 'react-toggle';
import { Form, Input, Accordion, Icon } from 'semantic-ui-react';

const OptionsDrawer = ({ onOptionsChange }) => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [useInferred, setUseInferred] = useState(true);
  const [plotConfig, setPlotConfig] = useState({
    xmin: -0.1,
    xmax: 5000,
    ymin: -0.1,
    ymax: 1.1
  });

  const onPlotConfigNumberChange = (option, value) => {
    const valueAsNumber = Number(value);
    if (!isNaN(valueAsNumber)) {
      const ncfg = { ...plotConfig, [option]: valueAsNumber };
      setPlotConfig(ncfg);
      onOptionsChange(ncfg);
    } else if (option === null) {
      onOptionsChange(value);
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
          <Form.Field inline>
            <Toggle
              id="infer-vals"
              defaultChecked={useInferred}
              onChange={() => {
                const newUseInferred = !useInferred;

                setUseInferred(newUseInferred);
                onPlotConfigNumberChange(
                  null,
                  newUseInferred ? {} : plotConfig
                );
              }}
            />
            <label htmlFor="infer-vals">Use values inferred from data</label>
          </Form.Field>
          <Form.Group widths="equal">
            <Form.Field
              id="form-input-control-x-min"
              control={Input}
              disabled={useInferred}
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
              disabled={useInferred}
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
              disabled={useInferred}
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
              disabled={useInferred}
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
