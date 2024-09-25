
import * as React from 'react';
import { TaskDetails } from '../src/task-components';
import { shallow } from 'enzyme';

//npm test -- -i task-components-snapshot.test.tsx


describe('TaskDetails renders correctly with use of snapshot', () => {
  test('Renders correctly', () => {
    const wrapper = shallow(<TaskDetails match={{ params: { id: 1 } }} />);

    setTimeout(() => {
      wrapper.update(); // Ensure the component is updated

      expect(wrapper).toMatchSnapshot();
    }, 0);
  })
})