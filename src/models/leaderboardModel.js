// ##############################################################
// REQUIRE MODULES
// ##############################################################
const pool = require("../services/db");

// ################################################################
// DEFINE SELECT OPERATION TO READ USER'S HOUSE (Section B Task 19)
// ################################################################
module.exports.selectUserHouse = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT * FROM HogwartsHouse
        WHERE house_id = ?;
    `;

    const VALUES = [data.houseId];
    pool.query(SQLSTATEMENT, VALUES, callback);
};

// ##################################################################################################
// DEFINE SELECT OPERATION TO READ USER LEADERBOARD WITH OPTIONAL FILTER BY HOUSE (Section B Task 19)
// ##################################################################################################
module.exports.selectUserLeaderboard = (data, callback) => {
    let SQLSTATEMENT = `
        SELECT u.user_id, u.username, u.skillpoints, h.house_name
        FROM User u
        LEFT JOIN UserHouse uh ON u.user_id = uh.user_id
        LEFT JOIN HogwartsHouse h ON uh.house_id = h.house_id
    `;
    
    const VALUES = [];
    
    if (data.house_id) {
        SQLSTATEMENT += "WHERE uh.house_id = ? ";
        VALUES.push(data.house_id);
    }
    
    SQLSTATEMENT += "ORDER BY u.skillpoints DESC";

    pool.query(SQLSTATEMENT, VALUES, callback);
};

// #####################################################################################################
// DEFINE SELECT OPERATION TO READ HOUSE LEADERBOARD BASED ON CUMULATIVE SKILLPOINTS (Section B Task 20)
// #####################################################################################################
module.exports.selectHouseLeaderboard = (callback) => {
    const SQLSTATEMENT = `
        SELECT 
            HogwartsHouse.house_id,
            HogwartsHouse.house_name,
            SUM(User.skillpoints) AS total_skillpoints
        FROM HogwartsHouse
        LEFT JOIN UserHouse ON HogwartsHouse.house_id = UserHouse.house_id
        LEFT JOIN User ON UserHouse.user_id = User.user_id
        GROUP BY HogwartsHouse.house_id
        ORDER BY total_skillpoints DESC;
    `;

    pool.query(SQLSTATEMENT, callback);
};