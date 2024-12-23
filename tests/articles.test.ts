import request from 'supertest';
import appInstance from '../src/lib/ExpressAppProvider';

const app = appInstance.getServer();

describe('GET /healthcheck', () => {
  it('should return 200 OK', async () => {
    const response = await request(app).get('/healthcheck');
    console.log(response);
    expect(response.status).toBe(200);
  });
});