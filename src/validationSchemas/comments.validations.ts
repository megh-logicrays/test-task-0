import Joi from "joi";

// Comment Validation Schema
const getCommentsByArticleSchema = {
  params: Joi.object({
    articleId: Joi.number().integer().required(),
  }),
};

const createCommentForArticleSchema = {
  body: Joi.object({
    nickname: Joi.string().required(),
    content: Joi.string().required(),
    articleId: Joi.number().integer().required(),
  }),
};

const createReplyToCommentSchema = {
  body: Joi.object({
    nickname: Joi.string().required(),
    content: Joi.string().required(),
    parentId: Joi.number().integer().required(),
  }),
};

export {
  getCommentsByArticleSchema,
  createCommentForArticleSchema,
  createReplyToCommentSchema,
};
