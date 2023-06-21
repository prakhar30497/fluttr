import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import path from "path";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import cookieParser from "cookie-parser";
import { prisma } from "./utils/db.js";
import { generateUsername } from "./utils/index.js";
import { auth } from "./authMiddleware.js";
import {
  addRefreshTokenToWhitelist,
  findRefreshTokenById,
  deleteRefreshToken,
} from "./auth/authServices.js";
import { hashToken } from "./utils/hashToken.js";

dotenv.config();
const app = express();
const port = process.env.PORT;
const server = http.createServer(app);

const JWT_ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;
const JWT_REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;

app.use(express.json());
app.use(
  cors({
    origin: [process.env.CLIENT_URL],
    credentials: true,
  })
);
app.use(cookieParser());

const io = new Server(server, {
  cors: {
    origin: [process.env.CLIENT_URL],
  },
});

// app.use(express.static(path.resolve(__dirname, "client")));

const POST_SELECT_FIELDS = {
  id: true,
  title: true,
  body: true,
  createdAt: true,
  user: {
    select: {
      id: true,
      name: true,
      handle: true,
    },
  },
};
const COMMENT_SELECT_FIELDS = {
  id: true,
  message: true,
  parentId: true,
  createdAt: true,
  user: {
    select: {
      id: true,
      name: true,
      handle: true,
    },
  },
};

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("You must provide an email and a password.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const username = await generateUsername(name);

  try {
    const user = await prisma.user.create({
      data: {
        handle: username,
        name,
        email,
        password: hashedPassword,
      },
    });

    res.json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error registering user" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const jti = uuidv4();
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id, jti);

    await addRefreshTokenToWhitelist({
      jti,
      refreshToken,
      userId: user.id,
    });

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error logging in" });
  }
});

app.get("/refresh-token", async (req, res) => {
  // const refreshToken = req.body.refreshToken;

  // if (!refreshToken) {
  //   return res.status(401).json({ error: "No refresh token provided" });
  // }

  // jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err, decoded) => {
  //   if (err) {
  //     return res.status(403).json({ error: "Invalid refresh token" });
  //   }

  //   const accessToken = generateAccessToken(decoded.userId);

  //   res.json({ accessToken });
  // });
  const cookies = req.cookies;
  console.log("cookies?.jwt", cookies?.jwt);
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;
  jwt.verify(refreshToken, JWT_REFRESH_SECRET, async (err, decoded) => {
    if (err) return res.sendStatus(403);
    console.log("payload", decoded);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        handle: true,
      },
    });
    if (!user) {
      return res.sendStatus(401);
    }
    const savedRefreshToken = await findRefreshTokenById(decoded.jti);

    if (!savedRefreshToken || savedRefreshToken.revoked === true) {
      return res.sendStatus(401);
    }

    const hashedToken = hashToken(refreshToken);
    if (hashedToken !== savedRefreshToken.hashedToken) {
      return res.sendStatus(401);
    }

    const accessToken = generateAccessToken(user.id);

    res.json({ accessToken });
  });
});

app.get("/user/:email", auth, async (req, res) => {
  const user = await prisma.user.findFirst({
    where: { email: req.params.email },
    select: {
      id: true,
      name: true,
      handle: true,
    },
  });
  // res.status(200);
  res.send(user);
});

app.get("/userAvailable/:username", async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { name: req.params.username },
    select: {
      id: true,
      name: true,
      handle: true,
    },
  });
  console.log(user);
  if (user) {
    res.send({ isAvailable: false });
  } else {
    res.send({ isAvailable: true });
  }
});

app.post("/user", async (req, res) => {
  const user = await prisma.user.create({
    data: { name: req.body.username, email: req.body.email },
  });
  res.send(user);
});

app.post("/post", async (req, res) => {
  const post = await prisma.post
    .create({
      data: {
        userId: req.body.userId,
        body: req.body.message,
        title: "Title",
      },
      include: {
        user: true,
      },
    })
    .then(async (post) => {
      console.log(post);
      const postData = await prisma.post.findUnique({
        where: { id: post.id },
        select: POST_SELECT_FIELDS,
      });
      return postData;
    });

  console.log(JSON.stringify(post));
  io.emit("receive-post", post);
  res.send(post);
});

app.get("/posts", async (req, res) => {
  const posts = await prisma.post.findMany({
    select: POST_SELECT_FIELDS,
  });
  res.json(posts);
});

app.get("/profile/:handle", async (req, res) => {
  const profile = await prisma.user
    .findFirst({
      where: { handle: req.params.handle },
      select: {
        id: true,
        name: true,
        handle: true,
        about: true,
        createdAt: true,
        avatar: true,
        location: true,
      },
    })
    .then(async (user) => {
      const posts = await prisma.post.findMany({
        where: { userId: user.id },
        select: POST_SELECT_FIELDS,
      });

      return {
        posts,
        user,
      };
    });
  res.json(profile);
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
            handle: true,
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

app.get("/followers/check", async (req, res) => {
  const { followerId, followingId } = req.query;

  try {
    const follows = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });
    const user = await prisma.user.findUnique({
      where: { id: followingId },
      select: {
        id: true,
        followedBy: true,
        following: true,
      },
    });
    const followers = user?.followedBy?.length;
    const following = user?.following?.length;

    const isFollowing = !!follows; // Convert to boolean

    res.status(200).json({ isFollowing, data: { followers, following } });
  } catch (error) {
    console.error("Error checking follower:", error);
    res
      .status(500)
      .json({ error: "An error occurred while checking follower" });
  }
});

app.post("/followers/add", async (req, res) => {
  const { followerId, followingId } = req.body;

  try {
    const newFollows = await prisma.follows
      .create({
        data: {
          follower: { connect: { id: followerId } },
          following: { connect: { id: followingId } },
        },
      })
      .then(async (data) => {
        const user = await prisma.user.findUnique({
          where: { id: followingId },
          select: {
            id: true,
            followedBy: true,
            following: true,
          },
        });
        const followers = user?.followedBy?.length;
        const following = user?.following?.length;
        return {
          ...data,
          followers,
          following,
        };
      });

    res
      .status(201)
      .json({ message: "Follower added successfully", data: newFollows });
  } catch (error) {
    console.error("Error adding follower:", error);
    res.status(500).json({ error: "An error occurred while adding follower" });
  }
});

app.post("/followers/remove", async (req, res) => {
  const { followerId, followingId } = req.body;

  try {
    const deletedFollows = await prisma.follows
      .deleteMany({
        where: {
          followerId,
          followingId,
        },
      })
      .then(async (data) => {
        const user = await prisma.user.findUnique({
          where: { id: followingId },
          select: {
            id: true,
            followedBy: true,
            following: true,
          },
        });
        const followers = user?.followedBy?.length;
        const following = user?.following?.length;
        return {
          ...data,
          followers,
          following,
        };
      });

    res
      .status(200)
      .json({ message: "Follower removed successfully", data: deletedFollows });
  } catch (error) {
    console.error("Error removing follower:", error);
    res
      .status(500)
      .json({ error: "An error occurred while removing follower" });
  }
});

server.listen(port, function (err) {
  if (err) {
    console.log("Error while starting server");
  } else {
    console.log("Server has been started at " + port);
  }
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("custom", (num, str, obj) => {
    console.log(num, str, obj);
  });
  socket.on("create-post", (userId, message) => {
    console.log(userId, message);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// io.on("connection", (socket) => {
//   console.log("a user connected");
//   console.log(socket.id);
//   // socket.on("custom", (num, str, obj) => {
//   //   console.log(num, str, obj);
//   // });
// });

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

export function generateAccessToken(userId) {
  return jwt.sign({ userId }, JWT_ACCESS_SECRET, { expiresIn: "4h" });
}

export function generateRefreshToken(userId, jti) {
  return jwt.sign({ userId, jti }, JWT_REFRESH_SECRET, { expiresIn: "30d" });
}

export function generateTokens(user, jti) {
  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id, jti);

  return {
    accessToken,
    refreshToken,
  };
}
