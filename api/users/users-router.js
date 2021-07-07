const router = require("express").Router();

// You will need `users-model.js` and `posts-model.js` both
const Users = require("./users-model");
const Posts = require("../posts/posts-model");
const {
  validateUserId,
  validateUser,
  validatePost,
} = require("../middleware/middleware.js");
// The middleware functions also need to be required

// const router = express.Router();

router.get("/", (req, res, next) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  Users.get()
    .then((hubs) => {
      res.status(200).json(hubs);
    })

    .catch(next);
});

router.get("/:id", validateUserId, (req, res) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  res.json(req.user);
});

router.post("/", validateUser, async (req, res, next) => {
  try {
    const newUser = await Users.insert(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
});

// RETURN THE FRESHLY UPDATED USER OBJECT
// this needs a middleware to verify user id
// and another middleware to check that the request body is valid
router.put("/:id", validateUserId, validateUser, async (req, res, next) => {
  const { id } = req.params;

  try {
    const updatedUser = await Users.update(id, req.body);
    updatedUser
      ? res.status(200).json({ id: parseInt(id), name: req.body.name })
      : res.status(500).json({ message: "update failed, please try again" });
  } catch (err) {
    next(err);
  }
});

// RETURN THE FRESHLY DELETED USER OBJECT
// this needs a middleware to verify user id
router.delete("/:id", validateUserId, async (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  try {
    const userToDelete = await Users.getById(id);
    const deletedUser = await Users.remove(id);
    deletedUser
      ? res.json(userToDelete)
      : res.status(500).json({ message: "deletion failed, please try again" });
  } catch (err) {
    next(err);
  }
});

router.get("/:id/posts", validateUserId, async (req, res, next) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  try {
    const posts = await Users.getUserPosts(req.params.id);
    res.json(posts);
  } catch (err) {
    next(err);
  }
});

// RETURN THE NEWLY CREATED USER POST
// this needs a middleware to verify user id
// and another middleware to check that the request body is valid
router.post(
  "/:id/posts",
  validateUserId,
  validatePost,
  async (req, res, next) => {
    const postToInsert = {
      text: req.body.text,
      user_id: req.params.id || null,
    };
    try {
      const newPost = await Posts.insert(postToInsert);
      res.status(201).json(newPost);
    } catch (err) {
      next(err);
    }
  }
);

router.use((err, req, res) => {
  // eslint-disable-line
  res.status(500).json({
    message: err.message,
    stack: err.stack,
    custom: "Something went wrong in the users router",
  });
});

// do not forget to export the router
module.exports = router;
