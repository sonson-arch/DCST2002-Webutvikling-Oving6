import * as React from 'react';
import { Alert } from '../src/widgets';
import { shallow } from 'enzyme';
import { wrap } from '@cfaester/enzyme-adapter-react-18/dist/enzyme-adapter-utils';

//npm test -- -i alert-widget.test.tsx

describe('Alert tests', () => {
  test('No alerts initially', () => {
    const wrapper = shallow(<Alert />);

    expect(wrapper.matchesElement(<div></div>)).toEqual(true);
  });

  test('Show 3 alert messages', (done) => {
    const wrapper = shallow(<Alert />);

    Alert.danger('test');
    Alert.danger('test2');
    Alert.danger('test3');

   
    wrapper.update();

    // Wait for events to complete
    setTimeout(() => {
      wrapper.update(); 


      expect(
        wrapper.matchesElement(
          <div>
            <div className="alert alert-dismissible alert-danger" role="alert">
              test
              <button type="button" className="btn-close btn-sm" />
            </div>
            <div className="alert alert-dismissible alert-danger" role="alert">
              test2
              <button type="button" className="btn-close btn-sm" />
            </div>
            <div className="alert alert-dismissible alert-danger" role="alert">
              test3
              <button type="button" className="btn-close btn-sm" />
            </div>
          </div>
        )
      ).toEqual(true);

      done();
    }, 0);
  });

  test('Close alert message for second one', (done) => {
    const wrapper = shallow(<Alert />);

    Alert.danger('test2');

    
    wrapper.update();

    // Wait for events to complete
    setTimeout(() => {
      wrapper.update();

      expect(
        wrapper.matchesElement(
          <div>
            <div className="alert alert-dismissible alert-danger" role="alert">
              test2
              <button type="button" className="btn-close btn-sm" />
            </div>
          </div>
        )
      ).toEqual(true);

      wrapper.find('button.btn-close').simulate('click');

      setTimeout(() => {
        wrapper.update(); // Ensure the component is updated
        expect(wrapper.matchesElement(<div></div>)).toEqual(true);
        done();
      }, 0);
    });
  });
});


