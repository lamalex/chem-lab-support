import React from 'react';
import ReactDOM from 'react-dom';
import { mount } from 'enzyme';

import App from '../App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

let wrapped;
describe('the qr code generator', () => {
  beforeEach(() => {
    wrapped = mount(<App />);
  });

  it('renders the react logo svg', () => {
    expect(wrapped.find('img').length).toEqual(1);
  });

  it('renders an svg on input', () => {
    const newValue = 'convert this to a fugging qrcode';
    wrapped.find('input').simulate('change', {
      target: {
        value: newValue
      }
    });

    wrapped.update();
    expect(wrapped.find('svg').length).toEqual(1);
  });

  afterEach(() => {
    wrapped.unmount();
  });
});
