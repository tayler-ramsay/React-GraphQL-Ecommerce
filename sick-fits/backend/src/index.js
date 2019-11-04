const cookieParser = require("cookie-parser");
require("dotenv").config({ path: "variables.env" });
const createServer = require("./createServer");
const db = require("./db");

const server = createServer();

//TODO Use express middleware to handle cookies(JWT)
b 
//TODO Use express middleware to populate current user

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
