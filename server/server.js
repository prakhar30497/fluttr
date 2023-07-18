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
  likes: true,
  comments: true,
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
        title: req.body.title || "",
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
  // io.emit("receive-post", post);
  res.send(post);
});

app.get("/posts", auth, async (req, res) => {
  const { userId } = req;
  const posts = await prisma.post.findMany({
    select: POST_SELECT_FIELDS,
  });
  posts.forEach((post) => {
    post.liked = !!post.likes.find((like) => like.userId === userId);
    post.likes = post.likes.length;
    post.comments = post.comments.length;
  });
  res.json(posts);
});

app.get("/profile/:handle", auth, async (req, res) => {
  const { userId } = req;
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

      posts.forEach((post) => {
        post.liked = !!post.likes.find((like) => like.userId === userId);
        post.likes = post.likes.length;
        post.comments = post.comments.length;
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
        createdAt: true,
        likes: true,
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

app.post("/posts/:postId/toggleLike", async (req, res) => {
  const data = {
    postId: req.params.postId,
    userId: req.body.userId,
  };

  const like = await prisma.postLike.findUnique({
    where: { userId_postId: data },
  });

  if (like == null) {
    console.log("Like", data);
    await prisma.postLike.create({ data });
    res.send({ addLike: true });
  } else {
    console.log("Unlike", data);
    await prisma.postLike.delete({ where: { userId_postId: data } });
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

app.post("/search", async (req, res) => {
  const { q } = req.query;
  const { userId } = req.body;

  console.log(typeof userId);

  const users = await prisma.user.findMany({
    where: {
      handle: {
        startsWith: q,
      },
    },
    select: {
      id: true,
      name: true,
      handle: true,
    },
  });

  const results = users.filter((user) => user.id !== String(userId));
  res.json({ users: results });
});

app.post("/startChat", auth, async (req, res) => {
  const { participants } = req.body;
  console.log(participants);
  try {
    if (participants.length !== 2) {
      return res.status(404);
    }
    const newChat = await prisma.chat.create({ data: {} });
    console.log("newChat", newChat);

    const newParticipant1 = await prisma.chatParticipant.create({
      data: {
        userId: participants[0],
        chatId: newChat.id,
      },
    });

    const newParticipant2 = await prisma.chatParticipant.create({
      data: {
        userId: participants[1],
        chatId: newChat.id,
      },
    });

    res.json({
      chatId: newChat.id,
      participants: [newParticipant1, newParticipant2],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred." });
  }
});

app.get("/chats", auth, async (req, res) => {
  const { userId } = req;
  console.log("userId", userId);

  try {
    const chatParticipants = await prisma.chatParticipant.findMany({
      where: {
        userId,
      },
      include: {
        chat: {
          include: {
            participants: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    handle: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Extract user information of each participant in the user's chats
    const participantsInfo = chatParticipants.map((participant) => ({
      chatId: participant.chatId,
      ...participant.chat.participants.filter((p) => userId !== p.user.id)[0]
        .user,
    }));

    // Return the participants' user information
    res.json(participantsInfo);
  } catch (error) {
    console.error("Error retrieving user chats:", error);
    res.status(500).json({ error: "Failed to retrieve user chats" });
  }
});

app.get("/chats/:chatId/messages", auth, async (req, res) => {
  const { chatId } = req.params;

  try {
    // Retrieve messages of the specified chat
    const messages = await prisma.message.findMany({
      where: {
        chatId,
      },
      select: {
        content: true,
        senderId: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    res.json(messages);
  } catch (error) {
    console.error("Error retrieving chat messages:", error);
    res.status(500).json({ error: "Failed to retrieve chat messages" });
  }
});

app.post("/chat", async (req, res) => {
  try {
    const { participants, message } = req.body;

    // Create a new chat
    const chat = await prisma.chat.create({
      data: {
        participants: {
          connect: participants.map((participantId) => ({ id: participantId })),
        },
      },
    });

    // Emit chat data to the participants
    participants.forEach((participantId) => {
      io.to(participantId).emit("newChat", chat);
    });

    res.json(chat);
  } catch (error) {
    console.error("Error creating chat:", error);
    res.status(500).json({ error: "Failed to create chat" });
  }
});

server.listen(port, function (err) {
  if (err) {
    console.log("Error while starting server");
  } else {
    console.log("Server has been started at " + port);
  }
});

const users = {};

io.on("connection", (socket) => {
  console.log("a user connected");
  // socket.on("create-post", (userId, message) => {
  //   console.log(userId, message);
  // });

  socket.on("addUser", (userId) => {
    users[userId] = socket.id;
    console.log(`User ${userId} registered with socket ID ${socket.id}`);
  });

  socket.on(
    "chatMessage",
    async ({ chatId, senderId, recipientId, content }) => {
      const senderSocket = users[senderId];
      const recipientSocket = users[recipientId];

      console.log(senderSocket, recipientSocket, users);

      if (senderSocket && recipientSocket) {
        console.log(senderSocket, recipientSocket);
        // Emit the message to both sender and recipient
        // io.to(senderSocket).emit("getMessage", { senderId, content });
        io.to(recipientSocket).emit("getMessage", { senderId, content });
      } else {
        console.log(`One or both users are not online. Message not delivered.`);
      }

      const newMessage = await prisma.message.create({
        data: {
          chatId,
          senderId,
          recipientId,
          content,
        },
      });
    }
  );
  socket.on("disconnect", () => {
    // Remove the user from the connected users list
    const disconnectedUserId = Object.keys(users).find(
      (userId) => users[userId] === socket.id
    );
    if (disconnectedUserId) {
      delete users[disconnectedUserId];
      console.log(`User ${disconnectedUserId} disconnected.`);
    }
  });
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
