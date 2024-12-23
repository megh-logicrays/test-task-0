const request = require('supertest');
const { prisma } = require('../src/prismaClient');
const app = require('../src/app'); // Import your Express app

describe('Article API', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  afterEach(async () => {
    // Clean up the test database
    await prisma.article.deleteMany();
  });

  test('GET /articles - should return paginated articles', async () => {
    // Seed articles
    await prisma.article.createMany({
      data: [
        { nickname: 'Author1', title: 'Title1', content: 'Content1' },
        { nickname: 'Author2', title: 'Title2', content: 'Content2' },
      ],
    });

    const res = await request(app).get('/articles').query({ page: 1, limit: 1 });
    expect(res.status).toBe(200);
    expect(res.body.articles).toHaveLength(1);
    expect(res.body.totalCount).toBe(2);
  });

  test('POST /articles - should create a new article', async () => {
    const articleData = {
      nickname: 'Author',
      title: 'New Article',
      content: 'This is a new article',
    };

    const res = await request(app).post('/articles').send(articleData);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe(articleData.title);
  });

  test('GET /articles/:id - should return an article by ID', async () => {
    const article = await prisma.article.create({
      data: { nickname: 'Author', title: 'Specific Article', content: 'Specific content' },
    });

    const res = await request(app).get(`/articles/${article.id}`);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe(article.title);
  });

  test('DELETE /articles/:id - should delete an article', async () => {
    const article = await prisma.article.create({
      data: { nickname: 'Author', title: 'To Be Deleted', content: 'Content' },
    });

    const res = await request(app).delete(`/articles/${article.id}`);
    expect(res.status).toBe(200);

    const deletedArticle = await prisma.article.findUnique({ where: { id: article.id } });
    expect(deletedArticle).toBeNull();
  });
});
