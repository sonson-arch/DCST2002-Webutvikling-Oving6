import axios from 'axios';
import pool from '../src/mysql-pool';
import app from '../src/app';
import taskService, { Task } from '../src/task-service';
import e from 'express';

const testTasks: Task[] = [
  { id: 1, title: 'Les leksjon', description: 'Notater fra leksjon den 25.09.24', done: false },
  { id: 2, title: 'Møt opp på forelesning', description: '', done: false },
  { id: 3, title: 'Gjør øving', description: '', done: false },
];

// Since API is not compatible with v1, API version is increased to v2
axios.defaults.baseURL = 'http://localhost:3001/api/v2';

let webServer: any;
beforeAll((done) => {
  // Use separate port for testing
  webServer = app.listen(3001, () => done());
}, 10000); // Increase timeout to 10 seconds

beforeEach((done) => {
  // Delete all tasks, and reset id auto-increment start value
  pool.query('TRUNCATE TABLE Tasks', (error) => {
    if (error) return done(error);

    // Create testTasks sequentially in order to set correct id, and call done() when finished
    taskService
      .create(testTasks[0].title, testTasks[0].description) 
      .then(() => taskService.create(testTasks[1].title, testTasks[1].description)) // Create testTask[1] after testTask[0] has been created
      .then(() => taskService.create(testTasks[2].title, testTasks[2].description)) // Create testTask[2] after testTask[1] has been created
      .then(() => done()); // Call done() after testTask[2] has been created
  });
}, 10000);

// Stop web server and close connection to MySQL server
afterAll((done) => {
  if (!webServer) return done(new Error());
  webServer.close(() => pool.end(() => done()));
});






//-----------------------------task-router.test.ts--------------------------------


describe('Fetch tasks (GET)', () => {
  test('Fetch all tasks (200 OK)', (done) => {
    axios.get('/tasks').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(testTasks);
      done();
    });
  });

  test('Fetch task (200 OK)', (done) => {
    axios.get('/tasks/1').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(testTasks[0]);
      done();
    });
  });

  test('Fetch task (404 Not Found)', (done) => {
    axios
      .get('/tasks/4')
      .then((_response) => done(new Error()))
      .catch((error) => {
        expect(error.message).toEqual('Request failed with status code 404');
        done();
      });
  });
});

describe('Create new task (POST)', () => {
  test('Create new task (200 OK)', (done) => {
    axios.post('/tasks', { title: 'Ny oppgave' , description: 'Test'}).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual({ id: 4 });
      done();
    });
  });
});


describe('Update task (PUT)', () => {
  test('Update task (200 OK)', (done) => {
    axios.put('/tasks/2', { done: true }).then((response) => {
      expect(response.status).toEqual(200);
      done();
    })
    });
});
 
describe('Delete task (DELETE)', () => {
  test('Delete task (200 OK)', (done) => {
    axios.delete('/tasks/2').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual({ id: 2 });
      done();
    })
  }); 
}); 

describe('Delete task (DELETE)', () => {
  test('Delete task (404 Not Found)', (done) => {
    axios.delete('/tasks/4').then((response) => {
      expect(response.status).toEqual(404);
      done();
    })
  });
});

describe('Update task (PUT)', () => {
  test('Update task (404 Not Found)', (done) => {
    axios.put('/tasks/4', { done: true }).then((response) => {
      expect(response.status).toEqual(404);
      done();
    })
  });
});


//-----------------------------task-service.test.ts--------------------------------


describe('TaskService tests', () => {
  test('Get task', (done) => {
    taskService.get(1).then((task) => {
      expect(task).toEqual(testTasks[0]);
      done();
    });
  });

  test('Get all tasks', (done) => {
    taskService.getAll().then((tasks) => {
      expect(tasks).toEqual(testTasks);
      done();
    });
  });

  test('Create task', (done) => {
    taskService.create('Ny oppgave', 'Test').then((id) => {
      expect(id).toEqual(4);
      done();
    });
  });

  test('Update task', (done) => {
    taskService.update(2, true).then(() => {
      taskService.get(2).then((task) => {
        expect(task.done).toEqual(true);
        done();
      });
    });
  });

  test('Delete task', (done) => {
    taskService.delete(2).then(() => {
      taskService.get(2).then((task) => {
        expect(task).toBeUndefined();
        done();
      });
    });
  });
});

