const request =require('supertest');
const app =require('../app');
const User =require('../models/User');

describe('Expense API ',() =>{
    let authToken;
    beforeAll(async () =>{
        //registrer and login
        
          await request(app).post('/api/auth/register').send({
      username: 'karhtik',
      email: 'arhitk@gmail.com',
      password: 'arhtik143',
      firstName: 'arhthik',
      lastName: 'M',
    });
 

    
    const response = await request(app).post('/api/auth/login').send({
      email: 'arhitk@gmail.com',
      password: 'arhtik143',
    });
   authToken = response.body.token;

    });

 
describe('POST /api/expenses', () => {
    it('should create an expense', async () => {
      const response = await request(app)
        .post('/api/expenses')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: 50,
          category: 'Food',
          date: new Date().toISOString(),
          note: 'Lunch',
          paymentMethod: 'Card',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });
  });





  
     describe('GET /api/expenses', () => {
    it('should retrieve expenses', async () => {
      const response = await request(app)
        .get('/api/expenses')
        .set('Authorization', `Bearer $    {authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.expenses)).toBe(true);
    });
  });


});
