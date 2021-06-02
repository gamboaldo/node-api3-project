const Users = require("../users/users-model");
const Posts = require("../posts/posts-model");

function logger(req, res, next) {
  // DO YOUR MAGIC
  console.log(`[${req.method}] ${req.path}`);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dateObj = new Date();
  const month = monthNames[dateObj.getMonth()];
  const day = String(dateObj.getDate()).padStart(2, "0");
  const year = dateObj.getFullYear();
  const output = month + "\n" + day + "," + year;
  console.log(output);
  next();
}

function validateUserId(req, res, next) {
  // DO YOUR MAGIC
  console.log("checkThatHubIdIsReal middleware");
  Users.getById(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(404).json({
          error: `hub with id ${req.params.id} not here`,
        });
        // next({
        //   status: 404,
        //   message: `hub with id ${req.params.id} not here`,
        // })
      } else {
        // since we have the hub we append it to req
        req.user = user;
        next();
      }
    })
    .catch((err) => {
      next(err);
    });
}

function validateUser(req, res, next) {
  // DO YOUR MAGIC
  const { name } = req.body;
  // DO YOUR MAGIC
  if (!name) {
    // validation fails
    next({
      message: "missing required text field",
      status: 400,
    });
    // res.status(422).json({ message: 'name is required' })
  } else {
    req.user = { name: req.body.name.trim() };
    next();
  }
}

function validatePost(req, res, next) {
  const { text } = req.body;
  // DO YOUR MAGIC
  if (
    !text ||
    typeof text !== "string" ||
    // !name.trim() ||
    text.trim().length <= 2
  ) {
    // validation fails
    next({
      message: "missing required text field",
      status: 400,
    });
    // res.status(422).json({ message: 'name is required' })
  } else {
    req.post = { text: req.body.text.trim() };
    next();
  }
}

// do not forget to expose these functions to other modules
module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost,
};
