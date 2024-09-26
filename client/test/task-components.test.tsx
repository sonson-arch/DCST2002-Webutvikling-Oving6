import * as React from 'react';
import { TaskList, TaskNew, TaskDetails } from '../src/task-components';
import { shallow } from 'enzyme';
import { Form, Button, Column, Row, Card, Alert } from '../src/widgets';
import { NavLink } from 'react-router-dom';
import taskService from '../src/task-service';

//npm test -- -i task-components.test.tsx

jest.mock('../src/task-service', () => {
  class TaskService {
    getAll() {
      return Promise.resolve([
        {
          id: 1,
          title: 'Les leksjon',
          description: 'Notater fra leksjon den 25.09.24',
          done: false,
        },
        { id: 2, title: 'Møt opp på forelesning', description: '', done: false },
        { id: 3, title: 'Gjør øving', description: '', done: false },
      ]);
    }

    get() {
      return Promise.resolve({
        id: 1,
        title: 'Les leksjon',
        description: 'Notater fra leksjon den 25.09.24',
        done: false,
      });
    }

    create() {
      return Promise.resolve(4); // Same as: return new Promise((resolve) => resolve(4));
    }

    update() {
      return Promise.resolve();
    }

    delete() {
      return Promise.resolve();
    }
  }

  return new TaskService();
});

describe('Task component tests', () => {
  test('TaskList draws correctly', (done) => {
    const wrapper = shallow(<TaskList />);

    // Wait for events to complete
    setTimeout(() => {
      expect(
        wrapper.containsAllMatchingElements([
          <NavLink to="/tasks/1">Les leksjon</NavLink>,
          <NavLink to="/tasks/2">Møt opp på forelesning</NavLink>,
          <NavLink to="/tasks/3">Gjør øving</NavLink>,
        ]),
      ).toEqual(true);
      done();
    });
  });

  test('TaskList click on New task', (done) => {
    const wrapper = shallow(<TaskList />);

    wrapper.find(Button.Success).simulate('click');
    expect(location.hash).toEqual('#/tasks/new');
    done();
  });

  test('TaskNew correctly sets location on create', (done) => {
    const wrapper = shallow(<TaskNew />);

    wrapper.find(Form.Input).simulate('change', { currentTarget: { value: 'Kaffepause' } });
    // @ts-ignore
    expect(wrapper.containsMatchingElement(<Form.Input value="Kaffepause" />)).toEqual(true);

    wrapper.find(Button.Success).simulate('click');
    // Wait for events to complete
    setTimeout(() => {
      expect(location.hash).toEqual('#/tasks/4');
      done();
    });
  });
});

describe('TaskDetails tests', () => {
  test('TaskDetails renders correctly', (done) => {
    const wrapper = shallow(<TaskDetails match={{ params: { id: 1 } }} />);

    setTimeout(() => {
      wrapper.update(); // Ensure the component is updated

      console.log(wrapper.debug()); // Debug the rendered output

      // @ts-ignore
      expect(
        wrapper.containsAllMatchingElements([
          <Card title="Task">
            <Row>
              <Column width={2}>Title:</Column>
              <Column>Les leksjon</Column>
            </Row>
            <Row>
              <Column width={2}>Description:</Column>
              <Column>Notater fra leksjon den 25.09.24</Column>
            </Row>
            <Row>
              <Column width={2}>Done:</Column>
              <Column>
                <Form.Checkbox checked={false} />
              </Column>
            </Row>
          </Card>,
          <Button.Success>Edit</Button.Success>,
        ]),
      ).toEqual(true);
      done();
    }, 0);
  });
});

describe('TaskDetails renders correctly with use of snapshot', () => {
  test('Renders correctly', () => {
    const wrapper = shallow(<TaskDetails match={{ params: { id: 1 } }} />);

    setTimeout(() => {
      wrapper.update();

      expect(wrapper).toMatchSnapshot();
    }, 0);
  });
});

describe('TaskEdit tests', () => {
  test('TaskEdit correctly sets location on update', (done) => {
    const wrapper = shallow(<TaskDetails match={{ params: { id: 1 } }} />);

    setTimeout(() => {
      wrapper.update();

      wrapper.find(Button.Success).simulate('click');
      expect(location.hash).toEqual('#/tasks/1/edit');
      done();
    }, 0);
  });

  test('TaskEdit change done', (done) => {
    const wrapper = shallow(<TaskDetails match={{ params: { id: 1 } }} />);

    setTimeout(() => {
      wrapper.update();

      wrapper.find(Form.Checkbox).simulate('change', { currentTarget: { checked: false } });
      expect(wrapper.find(Form.Checkbox).prop('checked')).toEqual(false);
      done();
    }, 0);
  });

  test('TaskDetails Edit button click', (done) => {
    const wrapper = shallow(<TaskDetails match={{ params: { id: 1 } }} />);

    setTimeout(() => {
      wrapper.update(); // Ensure the component is updated

      wrapper.find(Button.Success).simulate('click');
      expect(location.hash).toEqual('#/tasks/1/edit');
      done();
    }, 0);
  });

  test('TaskDetails colunm width', (done) => {
    const wrapper = shallow(<TaskDetails match={{ params: { id: 1 } }} />);

    setTimeout(() => {
      wrapper.update(); // Ensure the component is updated

      expect(wrapper.containsMatchingElement(<Column width={2}>Title:</Column>)).toEqual(true);
      done();
    }, 0);
  });
});
