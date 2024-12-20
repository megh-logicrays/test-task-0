//library imports
import express from "express";

//local imports
import articleRouter from "./articles.router";
import commentRouter from "./comments.router";

const router = express.Router();

router.use("/articles", articleRouter);
router.use("/comments", commentRouter);

export default router;
