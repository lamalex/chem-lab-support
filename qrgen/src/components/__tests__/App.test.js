import React from 'react';
import ReactDOM from 'react-dom';

import { mount } from 'enzyme';
import canvasMock from 'jest-canvas-mock';

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

  describe('on empty input', () => {
    it('renders the react logo svg', () => {
      expect(wrapped.find('img').prop('src')).toMatch(/logo.*svg/);
    });

    it('has a disabled download button', () => {
      expect(wrapped.find('a').hasClass('disabled'));
    });
  });

  describe('on text input', () => {
    beforeEach(() => {
      const newValue = 'convert this to a fugging qrcode';
      wrapped.find('input').simulate('change', {
        target: {
          value: newValue
        }
      });

      wrapped.update();
    });

    it('renders a canvas', () => {
      expect(wrapped.find('canvas').length).toEqual(1);
    });

    it('enables download link', () => {
      expect(!wrapped.find('a').hasClass('disabled'));
    });

    describe('on download click', () => {
      it('sets anchor href', () => {
        wrapped.find('a').simulate('click');
        wrapped.update();
        expect(wrapped.find('a').prop('href')).toBe('data:image/png;base64,00');
      });
    });
  });

  afterEach(() => {
    wrapped.unmount();
  });
});
