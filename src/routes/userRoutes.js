// ##############################################################
// REQUIRE MODULES
// ##############################################################
const express = require("express");
const controller = require("../controllers/userController");

// ##############################################################
// CREATE ROUTER
// ##############################################################
const router = express.Router();

// ##############################################################
// DEFINE ROUTES
// ##############################################################

// Section B Task 31 (Retrieve activity history for a user)
router.get("/userActivityHistory/:userId",
  controller.checkUserById, // Ensure the user exists
  controller.getUserActivityHistory // Fetch user activity history
);

// Section B Task 32 (Retrieve user details by providing user_id)
router.get("/:userId", controller.checkUserById);

// Section A Task 3 (Update user details by providing user_id in the URL and updated username in the request body)
router.put(
  "/:user_id",
  controller.checkUserById, // Ensure the user exists
  controller.checkUsername, // Verify if username has already been used before by another user
  controller.updateUserById // Update user details
);

// Section A Task 1 (Create a new user by specifying the new user's username in the request body)
router.post("/", 
  controller.checkUsername, // Verify if username has already been used before by another user
  controller.createNewUser // Create new user
);

// Section A Task 2 (Retrieve a list of all users with their respective user_id, username, and skillpoints)
router.get("/", controller.readAllUsers);

// ##############################################################
// EXPORT ROUTER
// ##############################################################
module.exports = router;