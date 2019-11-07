const cookieParser = require("cookie-parser");
require("dotenv").config({ path: "variables.env" });
const createServer = require("./createServer");
const db = require("./db");
const jwt = require("jsonwebtoken");

const server = createServer();

server.express.use(cookieParser());

//decode the JWT so we can get the user ID on each request
server.express.use((req, res, next) => {
  const { token } = req.cookies;
  console.log(`This is the middleware token ${token}`);
  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    // put the userID onto the req for future requests to access
    req.userId = userId;
  }
  next();
});

// Create a middleware that populates the user on each request
server.express.use(async (req, res, next) => {
  //if they are not logged in skip this
  if (!req.userId) return next();
  const user = await db.query.user(
    { where: { id: req.userId } },
    `{id, permissions, email, name}`
  );
  req.user = user;
  next();
});

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL
    }
  },
  spun => {
    console.log(`Server is running on port http://localhost:${spun.port}`);
  }
);
