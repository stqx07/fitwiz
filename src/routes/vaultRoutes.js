// ##############################################################
// REQUIRE MODULES
// ##############################################################
const express = require("express");
const controller = require("../controllers/vaultController.js");

// ##############################################################
// CREATE ROUTER
// ##############################################################
const router = express.Router();

// ##############################################################
// DEFINE ROUTES
// ##############################################################

// Section B Task 7 (Retrieve all items in the user's vault)
router.get("/", controller.getAllItemsInVaultById);

// Section B Task 8 (Retrieve all wands in the user's vault)
router.get("/wands", controller.getAllWandsInVault);

// Section B Task 9 (Retrieve all potions in the user's vault)
router.get("/potions", controller.getAllPotionsInVault);

// Section B Task 10 (Retrieve all spells in the user's vault)
router.get("/spells", controller.getAllSpellsInVault);

// ##############################################################
// EXPORT ROUTER
// ##############################################################
module.exports = router;