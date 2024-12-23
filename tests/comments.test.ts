const request = require('supertest');
const { prisma } = require('../src/prismaClient');
const app = require('../src/app');

describe('Comment API', () => {
  let article;

  beforeAll(async () => {
    await prisma.$connect();
    // Seed an article for testing comments
    article = await prisma.article.create({
      data: { nickname: 'Author', title: 'Test Article', content: 'Content' },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  afterEach(async () => {
    await prisma.comment.deleteMany();
  });

  test('GET /comments/article/:articleId - should return comments for an article', async () => {
    // Seed comments
    await prisma.comment.createMany({
      data: [
        { nickname: 'User1', content: 'Nice article!', articleId: article.id },
        { nickname: 'User2', content: 'Great read!', articleId: article.id },
      ],
    });

    const res = await request(app).get(`/comments/article/${article.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].content).toBe('Nice article!');
  });

  test('POST /comments/article - should add a comment to an article', async () => {
    const commentData = {
      nickname: 'Commenter',
      content: 'Interesting perspective!',
      articleId: article.id,
    };

    const res = await request(app).post('/comments/article').send(commentData);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.content).toBe(commentData.content);
  });

  test('POST /comments/reply - should add a reply to a comment', async () => {
    const parentComment = await prisma.comment.create({
      data: { nickname: 'User1', content: 'Parent comment', articleId: article.id },
    });

    const replyData = {
      nickname: 'Replier',
      content: 'This is a reply',
      parentId: parentComment.id,
    };

    const res = await request(app).post('/comments/reply').send(replyData);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.parentId).toBe(parentComment.id);
  });
});
