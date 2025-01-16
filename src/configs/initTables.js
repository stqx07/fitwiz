const pool = require("../services/db");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const callback = (error, results, fields) => {
  if (error) {
    console.error("Error creating tables:", error);
  } else {
    console.log("Tables created successfully");
  }
  process.exit();
}

bcrypt.hash('1234', saltRounds, (error, hash) => {
  if (error) {
    console.error("Error hashing password:", error);
  } else {
    console.log("Hashed password:", hash);

    const SQLSTATEMENT = `
    -- Drop child tables first to avoid foreign key constraint issues
    DROP TABLE IF EXISTS UserCompletion;
    DROP TABLE IF EXISTS Duel;
    DROP TABLE IF EXISTS Vault;
    DROP TABLE IF EXISTS Review;
    DROP TABLE IF EXISTS FitnessChallenge;
    DROP TABLE IF EXISTS PotionShop;
    DROP TABLE IF EXISTS SpellShop;
    DROP TABLE IF EXISTS WandShop;
    DROP TABLE IF EXISTS UserHouse;
    DROP TABLE IF EXISTS UserQuest;
    DROP TABLE IF EXISTS Creature;
    DROP TABLE IF EXISTS Quest;
    DROP TABLE IF EXISTS HogwartsHouse;
    DROP TABLE IF EXISTS User;
    
    -- Parent Tables
    CREATE TABLE User (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        username TEXT NOT NULL,
        email TEXT NOT NULL,
        password TEXT NOT NULL,
        skillpoints INT,
        user_health INT NOT NULL DEFAULT 100
    );
    
    CREATE TABLE HogwartsHouse (
        house_id INT AUTO_INCREMENT PRIMARY KEY,
        house_name VARCHAR(255) NOT NULL UNIQUE,
        house_description TEXT NOT NULL
    );
    
    CREATE TABLE Creature (
        creature_id INT AUTO_INCREMENT PRIMARY KEY,
        creature_name VARCHAR(255) NOT NULL,
        creature_health INT NOT NULL,
        reward_points INT NOT NULL,
        description TEXT
    );
    
    CREATE TABLE Quest (
        quest_id INT AUTO_INCREMENT PRIMARY KEY,
        quest_name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        reward_points INT NOT NULL,
        completion_status BOOL DEFAULT FALSE
    );
    
    CREATE TABLE WandShop (
        wand_id INT AUTO_INCREMENT PRIMARY KEY,
        wand_name TEXT NOT NULL,
        wand_cost INT NOT NULL
    );
    
    CREATE TABLE PotionShop (
        potion_id INT AUTO_INCREMENT PRIMARY KEY,
        potion_name TEXT NOT NULL,
        potion_description TEXT NOT NULL,
        potion_cost INT NOT NULL,
        potion_damage INT,
        potion_heal INT
    );
    
    CREATE TABLE SpellShop (
        spell_id INT AUTO_INCREMENT PRIMARY KEY,
        spell_name TEXT NOT NULL,
        spell_description TEXT NOT NULL,
        spell_cost INT NOT NULL,
        spell_damage INT
    );
    
    -- Child Tables
    CREATE TABLE Review (
        review_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        comment TEXT NOT NULL,
        rating INT CHECK (rating BETWEEN 1 AND 5),
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES User(user_id)
    );
    
    CREATE TABLE Vault (
        vault_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        wand_id INT,
        potion_id INT,
        spell_id INT,
        potion_quantity INT DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES User(user_id),
        FOREIGN KEY (wand_id) REFERENCES WandShop(wand_id),
        FOREIGN KEY (potion_id) REFERENCES PotionShop(potion_id),
        FOREIGN KEY (spell_id) REFERENCES SpellShop(spell_id)
    );
    
    CREATE TABLE FitnessChallenge (
        challenge_id INT AUTO_INCREMENT PRIMARY KEY,
        creator_id INT NOT NULL,
        challenge TEXT NOT NULL,
        skillpoints INT NOT NULL
    );
    
    CREATE TABLE UserCompletion (
        complete_id INT AUTO_INCREMENT PRIMARY KEY,
        challenge_id INT NOT NULL,
        user_id INT NOT NULL,
        completed BOOL NOT NULL,
        creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        notes TEXT,
        FOREIGN KEY (user_id) REFERENCES User(user_id),
        FOREIGN KEY (challenge_id) REFERENCES FitnessChallenge(challenge_id)
    );
    
    CREATE TABLE Duel (
        duel_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        creature_id INT NOT NULL,
        result ENUM('Win', 'Lose', 'Draw', 'Started', 'In Progress') NOT NULL,
        user_health INT NOT NULL,
        creature_health INT NOT NULL,
        skillpoints_gained INT NOT NULL DEFAULT 0,
        skillpoints_deducted INT NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES User(user_id),
        FOREIGN KEY (creature_id) REFERENCES Creature(creature_id)
    );
    
    CREATE TABLE UserQuest (
        user_quest_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        quest_id INT NOT NULL,
        status VARCHAR(255) DEFAULT 'In Progress',
        progress VARCHAR(255),
        completion_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES User(user_id),
        FOREIGN KEY (quest_id) REFERENCES Quest(quest_id)
    );
    
    CREATE TABLE UserHouse (
        user_id INT PRIMARY KEY,
        house_id INT NOT NULL,
        sorted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES User(user_id),
        FOREIGN KEY (house_id) REFERENCES HogwartsHouse(house_id)
    );
    
    -- Insert required data
    INSERT INTO User (user_id, username, email, password, skillpoints, user_health)
    VALUES 
        (1, 'HarryPotter', 'harrypotter@example.com', '${hash}', 750, 100),
        (2, 'HermioneGranger', 'hermionegranger@example.com', '${hash}', 430, 100),
        (3, 'DracoMalfoy', 'dracomalfoy@example.com', '${hash}', 150, 100);
    
    INSERT INTO HogwartsHouse (house_id, house_name, house_description)
    VALUES 
        (1, 'Gryffindor', 'Gryffindor was founded by Godric Gryffindor and favoured students who possessed characteristics such as courage, bravery and determination. The house colours were scarlet and gold, and the emblematic animal was a lion, which decorated the walls of the Gryffindor common room.'),
        (2, 'Hufflepuff', 'Hufflepuff was founded by Helga Hufflepuff who valued hard work, patience, loyalty and fairness over any particular aptitude in any of her students. The house colours were black and yellow and its emblem a badger. These colours decorated the walls of the Hufflepuff underground common room.'),
        (3, 'Ravenclaw', 'Ravenclaw was one of four Hogwarts houses and prized students whose focus was on learning, wit and wisdom. This reflected the nature of their founder, Rowena Ravenclaw who was known to be a woman of remarkable diligence and intelligence. The Ravenclaw common room was decorated with the house colours of blue and bronze along with their eagle emblem.'),
        (4, 'Slytherin', 'Slytherin was one of the four Hogwarts houses and was characterised by its silver and green colours and serpent emblem. The Slytherin common room was located in the castle dungeons. Founded by Salazar Slytherin, the students sent to Slytherin were representative of his preference for characters defined by cunning, pride and ambition.');
    
    INSERT INTO FitnessChallenge (challenge_id, creator_id, challenge, skillpoints)
    VALUES 
        (1, 1, 'Complete 2.4km within 15 minutes', 50),
        (2, 1, 'Cycle around the island for at least 50km', 100),
        (3, 2, 'Complete a full marathon (42.2km)', 200),
        (4, 2, 'Hold a plank for 5 minutes', 50),
        (5, 2, 'Perform 100 push-ups in one session', 75);
    
    INSERT INTO WandShop (wand_name, wand_cost)
    VALUES
        ('Aspen wood with a unicorn core 12"" and surprisingly swishy flexibility', 300),
        ('Maple wood with a phoenix core 12½"" and rigid flexibility', 300),
        ('Ash wood with a phoenix core 12¼"" and quite bendy flexibility', 300),
        ('Silver lime wood with a unicorn core 14½"" and surprisingly swishy flexibility', 300),
        ('Cherry wood with a dragon core 12½"" and slightly yielding flexibility', 300),
        ('Ebony wood with a dragon core 12"" and hard flexibility', 300);
    
    INSERT INTO PotionShop (potion_id, potion_name, potion_description, potion_cost, potion_damage, potion_heal)
    VALUES
        (1, 'Cure for Boils', 'A potion which removes boils, such as those produced by the Pimple Jinx.', 64, NULL, 40),
        (2, 'Wiggenweld Potion', 'A healing potion with the power to sterilise and heal minor injuries, and was the antidote to the Sleeping Draught and the Draught of Living Death.', 80, NULL, 50),
        (3, 'Essence of Dittany', 'A magical solution that possesses powerful curative properties, which could be used on open shallow wounds for immediate healing and skin regeneration.', 120, NULL, 75),
        (4, 'Dizziness Draught', 'A potion that provokes a sensation of lightheadedness and loss of balance on the drinker.', 32, 20, NULL),
        (5, 'Confusion Concoction', 'A potion which causes confusion in the drinker.', 48, 30, NULL),
        (6, 'Weakness Potion', 'A potion whose fumes induced weakness, both physically and mentally.', 80, 50, NULL);
    
    INSERT INTO SpellShop (spell_id, spell_name, spell_description,spell_cost, spell_damage)
    VALUES
        (1, 'Melofors Jinx', 'A jinx that encases the head of the victim in a pumpkin.', 38, 15),
        (2, 'Incendio', 'A charm that conjures a jet of flames that can be used to set things alight.', 50, 20),
        (3, 'Ventus', 'A charm which shoots a jet of strong, spiralling wind from the tip of the wand.', 50, 20),
        (4, 'Avifors', 'A transfiguration spell that transformed small objects and creatures into birds.', 88, 35),
        (5, 'Petrificus Totalus', 'A curse that temporarily paralyses the opponent.', 100, 40),
        (6, 'Impedimenta', 'A jinx that hinders the movement of the target, slowing it down or stopping it in its tracks.', 125, 50),
        (7, 'Depulso', 'A charm that sends the target away from the caster. It can send a target towards a specific location.', 150, 60),
        (8, 'Expelliarmus', 'A charm that forces whatever an opponent was holding to fly out of their hand. Commonly used in duels to make an opponent lose their wand.', 150, 60),
        (9, 'Flipendo', 'A jinx that knocks the target backwards. Could also be used to push heavy objects.', 175, 70),
        (10, 'Stupefy', 'A charm that stuns the target, rendering them unconscious. Useful in duelling as it can quickly end a duel without causing lasting damage.', 175, 70);
    
    INSERT INTO Creature (creature_id, creature_name, creature_health, reward_points, description)
    VALUES
        (1, 'Doxy', 100, 40, 'A small, venomous creature resembling a fairy with sharp teeth and a nasty bite.'),
        (2, 'Chimaera', 130, 52, 'A vicious hybrid beast with the head of a lion, body of a goat, and tail of a dragon.'),
        (3, 'Nightmare Thestral', 150, 60, 'A mutated Thestral, strengthened by dark magic.'),
        (4, 'Werewolf', 175, 70, 'A human cursed to transform into a ferocious wolf under a full moon.'),
        (5, 'Basilisk', 200, 80, 'A giant serpent with deadly eyes and venomous fangs.'),
        (6, 'Dragon', 250, 100, 'A powerful, fire-breathing creature with impenetrable scales.');
    
    INSERT INTO Quest (quest_name, description, reward_points, completion_status)
    VALUES
        ('Escape from the Forbidden Forest', 
        'Complete a 2.4km run within 15 minutes to dodge magical creatures and enchanted obstacles. Race against time to escape the dangers of the Forbidden Forest and prove your bravery!', 
        45, 
        FALSE),
         
        ('Golden Snitch Chase', 
        'Cycle 50km through challenging paths and tricky trails in pursuit of the elusive Golden Snitch. Navigate steep hills and sharp turns as you push your limits to capture the Snitch and achieve ultimate glory!', 
        90, 
        FALSE),
         
        ('Escape the Basilisk', 
        'Complete a 42.2km marathon to outrun the terrifying Basilisk through enchanted paths and cursed terrains. Avoid the petrifying gaze of the serpent and prove your courage in this ultimate test of endurance!', 
        180, 
        FALSE);
    `;
    
    pool.query(SQLSTATEMENT, callback);
  }
});