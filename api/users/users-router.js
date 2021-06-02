const router = require("express").Router();

// You will need `users-model.js` and `posts-model.js` both
const Users = require("./users-model");
const Posts = require("../posts/posts-model");
const {
  logger,
  validateUserId,
  validateUser,
  validatePost,
} = require("../middleware/middleware.js");
// The middleware functions also need to be required

// const router = express.Router();

router.get("/", logger, (req, res, next) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  Users.get()
    .then((hubs) => {
      // throw new Error('TOTAL DISASTER')
      res.status(200).json(hubs);
    })
    // .catch(err => next(err));
    .catch(next);
});

router.get("/:id", validateUserId, (req, res) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  res.json(req.user);
});

router.post("/", (req, res) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
});

router.put("/:id", (req, res) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
});

router.delete("/:id", (req, res) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
});

router.get("/:id/posts", (req, res) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
});

router.post("/:id/posts", (req, res) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
});

router.use((err, req, res, next) => {
  console.log("err handling midd kicking in!", err.message);
  res.status(err.status || 500).json({
    custom: "something exploded inside the app",
    message: err.message,
    stack: err.stack,
  });
});

// do not forget to export the router
module.exports = router;
