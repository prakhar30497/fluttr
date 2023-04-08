import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

dotenv.config();
const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT;

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

const COMMENT_SELECT_FIELDS = {
  id: true,
  message: true,
  parentId: true,
  createdAt: true,
  user: {
    select: {
      id: true,
      name: true,
    },
  },
};

app.get("/", (req, res) => {
  res.status(200);
  res.send({ message: "Welcome to root URL of Server" });
});

app.get("/user/:email", async (req, res) => {
  const user = await prisma.user.findFirst({
    where: { email: req.params.email },
    select: {
      id: true,
      name: true,
    },
  });
  // res.status(200);
  res.send(user);
});

app.post("/user", async (req, res) => {
  const user = await prisma.user.create({
    data: { name: req.body.username, email: req.body.email },
  });
  res.send(user);
});

app.post("/post", async (req, res) => {
  const post = await prisma.post.create({
    data: {
      userId: req.body.userId,
      body: req.body.message,
      title: "Title",
    },
  });
  res.send(post);
});

app.get("/posts", async (req, res) => {
  const posts = await prisma.post.findMany({
    select: {
      id: true,
      title: true,
      body: true,
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  res.json(posts);
});

app.get("/post/:id/:userId", async (req, res) => {
  const post = await prisma.post
    .findUnique({
      where: { id: req.params.id },
      select: {
        body: true,
        title: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        comments: {
          orderBy: {
            createdAt: "desc",
          },
          select: {
            ...COMMENT_SELECT_FIELDS,
            _count: { select: { likes: true } },
          },
        },
      },
    })
    .then(async (post) => {
      const likes = await prisma.like.findMany({
        where: {
          userId: req.params.userId,
          commentId: { in: post.comments.map((comment) => comment.id) },
        },
      });

      return {
        ...post,
        comments: post.comments.map((comment) => {
          const { _count, ...commentFields } = comment;
          return {
            ...commentFields,
            likedByMe: likes.find((like) => like.commentId === comment.id),
            likeCount: _count.likes,
          };
        }),
      };
    });
  res.json(post);
});

app.post("/posts/:id/comments", async (req, res) => {
  if (req.body.message === "" || req.body.message == null) {
    return res.send(app.httpErrors.badRequest("Message is required"));
  }

  const comment = await prisma.comment
    .create({
      data: {
        message: req.body.message,
        userId: req.body.userId,
        parentId: req.body.parentId,
        postId: req.params.id,
      },
      select: COMMENT_SELECT_FIELDS,
    })
    .then((comment) => {
      return {
        ...comment,
        likeCount: 0,
        likedByMe: false,
      };
    });

  res.send(comment);
});

app.put("/posts/:postId/comments/:commentId", async (req, res) => {
  if (req.body.message === "" || req.body.message == null) {
    return res.send(app.httpErrors.badRequest("Message is required"));
  }

  const { userId } = await prisma.comment.findUnique({
    where: { id: req.params.commentId },
    select: { userId: true },
  });
  if (userId !== req.body.userId) {
    return res.send(
      app.httpErrors.unauthorized(
        "You do not have permission to edit this message"
      )
    );
  }

  const comment = await prisma.comment.update({
    where: { id: req.params.commentId },
    data: { message: req.body.message },
    select: { message: true },
  });
  res.send(comment);
});

app.delete("/posts/:postId/comments/:commentId", async (req, res) => {
  await prisma.comment.delete({
    where: { id: req.params.commentId },
    select: { id: true },
  });
  res.send("Comment Deleted");
});

app.post("/posts/:postId/comments/:commentId/toggleLike", async (req, res) => {
  const data = {
    commentId: req.params.commentId,
    userId: req.body.userId,
  };

  const like = await prisma.like.findUnique({
    where: { userId_commentId: data },
  });

  if (like == null) {
    console.log("Like", data);
    await prisma.like.create({ data });
    res.send({ addLike: true });
  } else {
    console.log("Unlike", data);
    await prisma.like.delete({ where: { userId_commentId: data } });
    res.send({ addLike: false });
  }
});

app.listen(port, function (err) {
  if (err) {
    console.log("Error while starting server");
  } else {
    console.log("Server has been started at " + port);
  }
});

// async function main() {
//   const users = await prisma.user.findMany();
//   // console.log(users);
// }

// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })

//   .catch(async (e) => {
//     console.error(e);

//     await prisma.$disconnect();

//     process.exit(1);
//   });
