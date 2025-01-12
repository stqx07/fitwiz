// ##############################################################
// REQUIRE MODULES
// ##############################################################
const express = require("express");
const owlPostController = require("../controllers/owlPostController.js");
const userController = require("../controllers/userController.js");

// ##############################################################
// CREATE ROUTER
// ##############################################################
const router = express.Router();

// ##############################################################
// DEFINE ROUTES
// ##############################################################

// Section B Task 21 (Submit new feedback)
router.post("/:userId", 
  userController.checkUserById, // Ensure user exists
  owlPostController.submitFeedback // Submit feedback
);

// Section B Task 22 (Retrieve all feedback)
router.get("/", owlPostController.getAllFeedback);

// Section B Task 23 (Retrieve feedback for a specific user)
router.get("/", 
  userController.checkUserById, // Ensure user exists
  owlPostController.getUserFeedback // Retrieve feedback for the user 
);

// Section B Task 24 (Update existing feedback)
router.put(
  "/:userId",
  userController.checkUserById, // Ensure user exists 
  owlPostController.checkFeedbackExistence, // Ensure feedback exists
  owlPostController.checkUserOwnership, // Ensure user owns the feedback
  owlPostController.updateFeedback // Update feedback
); 

// Section B Task 25 (Delete feedback)
router.delete("/:feedbackId", owlPostController.deleteFeedback);

// ##############################################################
// EXPORT ROUTER
// ##############################################################
module.exports = router;