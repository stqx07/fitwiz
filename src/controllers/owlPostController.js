// ##############################################################
// REQUIRE MODULES
// ##############################################################
const model = require("../models/owlPostModel.js");

// #################################################################
// DEFINE CONTROLLER FUNCTION TO SUBMIT FEEDBACK (Section B Task 21)
// #################################################################
module.exports.submitFeedback = (req, res) => {
    const data = {
        user_id: res.locals.user_id,
        name: req.body.name,
        email: req.body.email,
        comment: req.body.comment,
        rating: req.body.rating,
    };

    if (!data.name || !data.email || !data.comment || !data.rating) {
        return res.status(400).json({
            message: "Name, email, comment, and rating are required.",
        });
    }

    if (data.rating < 1 || data.rating > 5) {
        return res.status(400).json({
            message: "Rating must be between 1 and 5.",
        });
    }

    const callback = (error, results) => {
        if (error) {
            console.error("Error submitFeedback:", error);
            return res.status(500).json(error);
        }

        res.status(201).json({
            message: "Feedback submitted successfully!",
            feedback_id: results.insertId,
        });
    };

    model.insertFeedback(data, callback);
};

// #######################################################################
// DEFINE CONTROLLER FUNCTION TO RETRIEVE ALL FEEDBACK (Section B Task 22)
// #######################################################################
module.exports.getAllFeedback = (req, res) => {
    const callback = (error, results) => {
        if (error) {
            console.error("Error getAllFeedback:", error);
            return res.status(500).json(error);
        } else if (results.length === 0) {
            res.status(404).json({
                message: "No feedback found in the database."
            });
        } else {
            res.status(200).json(results);
        }
    };

    model.selectAllFeedback(callback);
};

// #######################################################################################
// DEFINE CONTROLLER FUNCTION TO RETRIEVE FEEDBACK FOR A SPECIFIC USER (Section B Task 23)
// #######################################################################################
module.exports.getUserFeedback = (req, res, next) => {
    const userId = res.locals.user_id;

    const data = {
        user_id: userId
    };

    const callback = (error, results) => {
        if (error) {
            console.error("Error getUserFeedback:", error);
            return res.status(500).json(error);
        } else if (results.length === 0) {
            res.status(404).json({
                message: "No feedback found for this user."
            });
        } else {
            res.status(200).json(results);
        }
    };

    model.selectFeedbackByUser(data, callback);
};

// ##########################################################################
// DEFINE CONTROLLER FUNCTION TO CHECK FEEDBACK EXISTENCE (Section B Task 24)
// ##########################################################################
module.exports.checkFeedbackExistence = (req, res, next) => {
    const feedbackId = req.body.feedbackId;

    if (!feedbackId) {
        return res.status(400).json({
            message: "feedbackId is undefined."
        })
    }

    const data = {
        feedback_id: feedbackId
    };

    const callback = (error, results) => {
        if (error) {
            console.error("Error checkFeedbackExistence:", error);
            return res.status(500).json(error);
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Feedback not found!"
            });
        }
        else {
            res.locals.name = results[0].name;
            res.locals.email = results[0].email;
            res.locals.comment = results[0].comment;
            res.locals.rating = results[0].rating;
            next();
        }
    };

    model.checkFeedbackExistence(data, callback);
}

// ######################################################################################
// DEFINE CONTROLLER FUNCTION TO CHECK USER ID AGAINST FEEDBACK OWNER (Section B Task 24)
// ######################################################################################
module.exports.checkUserOwnership = (req, res, next) => {
    const userId = res.locals.user_id;
    const feedbackId = req.body.feedbackId;

    if (!userId ) {
        return res.status(400).json({
            message: "userId is undefined"
        });
    }

    const data = {
        user_id: userId,
        feedback_id: feedbackId
    };

    const callback = (error, results) => {
        if (error) {
            console.error("Error checkUserOwnership:", error);
            return res.status(500).json(error);
        }
        else {
            if (results.length === 0) {
                return res.status(403).json({
                    message: "User does not own this feedback!"
                });
            }
            else {
                next();
            }
        }
    };

    model.checkUserOwnership(data, callback);
};

// ##########################################################################
// DEFINE CONTROLLER FUNCTION TO UPDATE EXISTING FEEDBACK (Section B Task 24)
// ##########################################################################
module.exports.updateFeedback = (req, res) => {
    const feedbackId = req.body.feedbackId;
    const updatedData = {
        name: req.body.name,
        email: req.body.email,
        comment: req.body.comment,
        rating: req.body.rating,
    };

    if (!updatedData.name || !updatedData.email || !updatedData.comment || !updatedData.rating) {
        return res.status(400).json({
            message: "Name, email, comment, and rating are required.",
        });
    }

    if (updatedData.rating < 1 || updatedData.rating > 5) {
        return res.status(400).json({
            message: "Rating must be between 1 and 5.",
        });
    }

    const currentFeedback = res.locals.feedback; // Example: { name, email, comment, rating }

    if (
        updatedData.comment === res.locals.comment &&
        updatedData.rating === res.locals.rating &&
        updatedData.name === res.locals.name &&
        updatedData.email === res.locals.email
    ) {
        return res.status(409).json({
            message: "No changes were made to the feedback.",
        });
    }

    const data = {
        feedback_id: feedbackId,
        name: updatedData.name,
        email: updatedData.email,
        comment: updatedData.comment,
        rating: updatedData.rating,
    };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error updateFeedback:", error);
            return res.status(500).json(error);
        } else {
            return res.status(200).json({
                message: "Feedback updated successfully!",
            });
        }
    };

    model.updateFeedbackById(data, callback);
};

// #################################################################
// DEFINE CONTROLLER FUNCTION TO DELETE FEEDBACK (Section B Task 25)
// #################################################################
module.exports.deleteFeedback = (req, res) => {
    const feedbackId = req.params.feedbackId;

    if (!feedbackId || isNaN(feedbackId)) {
        return res.status(400).json({
            message: "Invalid or missing feedbackId.",
        });
    }

    const data = {
        feedback_id: feedbackId
    };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error deleteFeedback:", error);
            return res.status(500).json(error);
        } else if (results.affectedRows === 0) {
            return res.status(404).json({
                message: "Feedback not found!",
            });
        } else {
            return res.status(204).send();
        }
    };

    model.deleteFeedbackById(data, callback);
};