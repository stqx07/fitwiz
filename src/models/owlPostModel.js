// ##############################################################
// REQUIRE MODULES
// ##############################################################
const pool = require("../services/db.js");

// ##################################################################
// DEFINE INSERT OPERATION TO CREATE NEW FEEDBACK (Section B Task 21)
// ##################################################################
module.exports.insertFeedback = (data, callback) => {
    const SQLSTATEMENT = `
        INSERT INTO Feedback (user_id, name, email, comment, rating)
        VALUES (?, ?, ?, ?, ?);
    `;

    const VALUES = [data.user_id, data.name, data.email, data.comment, data.rating];
    pool.query(SQLSTATEMENT, VALUES, callback);
};

// ####################################################################
// DEFINE SELECT OPERATION TO RETRIEVE ALL FEEDBACK (Section B Task 22)
// ####################################################################
module.exports.selectAllFeedback = (callback) => {
    const SQLSTATEMENT = `
        SELECT * 
        FROM Feedback
        ORDER BY submitted_at DESC;
    `;

    pool.query(SQLSTATEMENT, callback);
};

// ####################################################################################
// DEFINE SELECT OPERATION TO RETRIEVE FEEDBACK FOR A SPECIFIC USER (Section B Task 23)
// ####################################################################################
module.exports.selectFeedbackByUser = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT *
        FROM Feedback
        WHERE user_id = ?;
    `;

    const VALUES = [data.user_id];
    pool.query(SQLSTATEMENT, VALUES, callback);
};

// #############################################################################
// DEFINE SELECT OPERATION TO CHECK FEEDBACK EXISTENCE BY ID (Section B Task 24)
// #############################################################################
module.exports.checkFeedbackExistence = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT * 
        FROM Feedback
        WHERE feedback_id = ?;
    `;

    const VALUES = [data.feedback_id];
    pool.query(SQLSTATEMENT, VALUES, callback);
};

// #######################################################################
// DEFINE SELECT OPERATION TO CHECK FEEDBACK OWNERSHIP (Section B Task 24)
// #######################################################################
module.exports.checkUserOwnership = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT * 
        FROM Feedback
        WHERE feedback_id = ? AND user_id = ?;
    `;

    const VALUES = [data.feedback_id, data.user_id];
    pool.query(SQLSTATEMENT, VALUES, callback);
};

// #######################################################################
// DEFINE UPDATE OPERATION TO MODIFY EXISTING FEEDBACK (Section B Task 24)
// #######################################################################
module.exports.updateFeedbackById = (data, callback) => {
    const SQLSTATEMENT = `
        UPDATE Feedback
        SET name = ?, email = ?, comment = ?, rating = ?
        WHERE feedback_id = ?;
    `;

    const VALUES = [data.name, data.email, data.comment, data.rating, data.feedback_id];
    pool.query(SQLSTATEMENT, VALUES, callback);
};

// ####################################################################
// DEFINE DELETE OPERATION TO DELETE FEEDBACK BY ID (Section B Task 25)
// ####################################################################
module.exports.deleteFeedbackById = (data, callback) => {
    const SQLSTATEMENT = `
        DELETE FROM Feedback
        WHERE feedback_id = ?;
    `;

    const VALUES = [data.feedback_id];
    pool.query(SQLSTATEMENT, VALUES, callback);
};