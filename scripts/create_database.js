// scripts/create_database.js
const pool = require("../config/database");
const bcrypt = require("bcrypt");

async function createDatabase() {
  try {
    const connection = await pool.getConnection();

    // Create database and users table
    await connection.query(`CREATE DATABASE IF NOT EXISTS users_db`);
    await connection.query(`USE users_db`);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        username VARCHAR(20) NOT NULL,
        email VARCHAR(50) NOT NULL,
        password CHAR(60) NOT NULL,
        nom VARCHAR(50) NOT NULL,
        prenom VARCHAR(50) NOT NULL,
        role VARCHAR(255) DEFAULT 'user',
        verificationToken VARCHAR(255) NULL,
        isVerified BOOLEAN DEFAULT FALSE,
        PRIMARY KEY (id),
        UNIQUE INDEX id_UNIQUE (id ASC),
        UNIQUE INDEX username_UNIQUE (username ASC),
        UNIQUE INDEX email_UNIQUE (email ASC)
      )
    `);

    // Create Evenements table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Evenements (
        id INT AUTO_INCREMENT PRIMARY KEY,
        titre VARCHAR(255),
        apercu TEXT,
        description TEXT,
        image_url TEXT NOT NULL,
        date_debut DATE,
        date_fin DATE,
        time TIME,
        lieu VARCHAR(255),
        plan JSON,
        observations TEXT,
        participation TEXT,
        info_add TEXT
      )
    `);




    // Create Speakers table
        await connection.query(`
          CREATE TABLE IF NOT EXISTS Speakers (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nom VARCHAR(100),
            prenom VARCHAR(100),
            description TEXT,
            evenement_id INT,
            image_url TEXT,
            FOREIGN KEY (evenement_id) REFERENCES Evenements(id)
          )
        `);
    

    

    const [events] = await connection.query(
      "SELECT COUNT(*) AS count FROM evenements"
    );
    const eventCount = events[0].count;

    if (eventCount === 0)
      await connection.query(`
INSERT INTO Evenements (titre, apercu, description, image_url, date_debut, date_fin, time, lieu, plan, observations, participation, info_add) VALUES
('Olive Harvest Festival', 'A festival celebrating the olive harvest.', 'The Olive Harvest Festival is an annual event that brings together the community to celebrate the rich tradition of olive harvesting. The festival features a variety of activities, including live music, traditional dance performances, and local food stalls showcasing dishes made with olives. The event is an opportunity for visitors to learn about the olive harvesting process, from picking to pressing, and to taste a wide range of olive products. Local farmers and producers will share their knowledge and stories, making it an educational and enjoyable experience for all ages.', '/img/event1.jpg', '2024-08-04', '2024-08-06', '10:00:00', 'Olive Grove', '["9:00 AM - Opening Ceremony", "10:30 AM - Olive Picking", "1:00 PM - Lunch", "2:30 PM - Olive Oil Tasting"]', 'Bring comfortable shoes for walking in the grove.', 'Open to all ages; ideal for families and olive enthusiasts.', 'Parking is available on-site; no pets allowed.'),

('Olive Oil Workshop', 'Hands-on workshop on olive oil production.', 'This interactive workshop offers a comprehensive look at the art and science of olive oil production. Participants will gain hands-on experience in olive oil tasting, learning to identify the different qualities and flavors of various olive oils. The workshop will cover the entire production process, from the selection of olives to the extraction and bottling of the oil. Experts will discuss the importance of factors such as olive variety, ripeness, and processing techniques. Attendees will also have the chance to create their own blends and take home a bottle of their personalized olive oil.', '/img/event2.jpg', '2024-8-01', '2024-08-03', '14:00:00', 'Community Center', '["2:00 PM - Introduction", "2:30 PM - Olive Oil Tasting", "3:30 PM - Pressing Demonstration"]', 'Materials provided; dress for a hands-on experience.', 'Limited to 30 participants; suitable for adults.', 'Please notify us of any food allergies in advance.'),

('Olive Tree Planting Day', 'Community event for planting olive trees.', 'Olive Tree Planting Day is a community-driven initiative aimed at promoting environmental sustainability and enhancing local green spaces. Volunteers of all ages are invited to participate in planting olive trees throughout Greenfield Park. The event includes an educational segment where experts will teach proper planting techniques and the ecological benefits of olive trees. In addition to planting, participants will engage in activities such as mulching and watering. The event will conclude with a communal lunch where participants can share their experiences and learn more about ongoing environmental projects in the community.', '/img/event3.jpg', '2024-09-05', '2024-09-07', '09:00:00', 'Greenfield Park', '["9:00 AM - Registration", "9:30 AM - Planting Instructions", "10:00 AM - Tree Planting", "12:00 PM - Lunch"]', 'Wear outdoor clothing suitable for digging.', 'Open to all community members; children must be accompanied by an adult.', 'All necessary tools will be provided; bring your own water bottle.'),

('Olive Tasting Event', 'Taste and learn about various olive products.', 'The Olive Tasting Event is a delightful culinary experience that allows participants to explore the diverse world of olives. Guests will sample a variety of olive products, including different olive varieties, oils, and tapenades. Experts will provide insights into the history and cultivation of olives, as well as tips on pairing olive products with different foods. The event will feature guided tastings, where attendees will learn to discern subtle flavor notes and quality indicators. This event is perfect for food enthusiasts and those looking to deepen their appreciation of olives.', '/img/event4.jpg', '2024-12-01', '2024-12-06', '16:00:00', 'Downtown Plaza', '["4:00 PM - Welcome", "4:15 PM - Olive Tasting", "5:00 PM - Q&A Session"]', 'Taste a range of olive varieties.', 'Open to food enthusiasts and olive lovers.', 'Products available for purchase at the end of the event.'),

('Olive Festival Gala', 'Gala event with olive-themed entertainment.', 'The Olive Festival Gala is the highlight of the olive harvest season, offering a night of elegance and celebration. This black-tie event features a gourmet dinner crafted by renowned chefs, showcasing dishes that highlight the versatility and flavor of olives. Guests will enjoy live music and entertainment, including performances by local artists. The gala also includes a silent auction with exclusive olive-themed items, with proceeds supporting local farmers and sustainable agriculture projects. This evening promises to be a memorable experience, filled with good food, great company, and a deep appreciation for the olive harvest.', '/img/event5.jpg', '2024-12-20', '2024-12-26', '19:00:00', 'Grand Hall', '["7:00 PM - Reception", "7:30 PM - Dinner", "8:30 PM - Live Music", "10:00 PM - Auction"]', 'Formal attire required.', 'Suitable for adults; a ticketed event.', 'All proceeds go towards supporting local agriculture.'),

('Olive Oil Cooking Class', 'Learn to cook with olive oil.', 'This cooking class offers a hands-on experience in cooking with olive oil. Participants will learn various recipes that highlight the versatility of olive oil, from appetizers to desserts. The class will cover techniques such as sautéing, roasting, and baking with olive oil. Experienced chefs will guide participants through each recipe, offering tips and tricks for achieving the best flavors. The session will conclude with a tasting of the dishes prepared, along with a discussion on the health benefits of incorporating olive oil into daily cooking.', '/img/event6.jpg', '2024-11-05', '2024-11-07', '11:00:00', 'Culinary School', '["11:00 AM - Introduction", "11:30 AM - Cooking Demonstration", "1:00 PM - Tasting"]', 'All ingredients provided.', 'Suitable for adults and teens; reservation required.', 'Bring an apron and notebook for notes.'),

('Olive History Lecture', 'Lecture on the history of olives.', 'Join us for an enlightening lecture on the rich history of olives. This event will explore the cultural and historical significance of olives in various civilizations, from ancient Greece to modern-day Mediterranean cultures. The lecture will cover the evolution of olive cultivation, trade routes, and the role of olives in religious and culinary traditions. Attendees will gain a deeper understanding of how olives have shaped societies and economies over millennia. The lecture will be followed by a Q&A session, allowing participants to ask questions and engage in discussion.', '/img/event7.jpg', '2024-10-15', '2024-10-15', '18:00:00', 'History Museum', '["6:00 PM - Lecture", "7:00 PM - Q&A Session"]', 'Materials and refreshments provided.', 'Open to all ages; ideal for history enthusiasts.', 'Free admission; donations welcome.'),

('Olive Harvest Tour', 'Guided tour of an olive grove.', 'Experience the beauty and tranquility of an olive grove during the harvest season. This guided tour will take participants through the entire olive harvesting process, from picking to pressing. The tour includes a visit to a traditional olive mill, where guests can observe the extraction of olive oil. Participants will learn about different olive varieties, harvesting techniques, and the importance of sustainable practices in olive farming. The tour will conclude with a tasting session, where guests can sample freshly pressed olive oil and other olive-based products.', '/img/event8.jpg', '2024-09-20', '2024-09-22', '08:00:00', 'Olive Grove', '["8:00 AM - Meet at Entrance", "8:30 AM - Grove Tour", "10:00 AM - Mill Visit", "11:00 AM - Tasting"]', 'Wear comfortable walking shoes.', 'Suitable for all ages; great for families and nature lovers.', 'Please arrive 15 minutes early; bring your own water bottle.');

      INSERT INTO Speakers (nom, prenom, description, evenement_id, image_url) VALUES
      ('Garcia', 'Carlos', 'Olive farmer and local expert on traditional harvesting techniques.', 1, 'https://i.pravatar.cc/48?u=118836'),
      ('Haddad', 'Leila', 'Culinary expert specializing in olive-based dishes.', 1, 'https://i.pravatar.cc/48?u=118837'),
      ('Brown', 'Emily', 'Cultural historian with a focus on Mediterranean festivals.', 1, 'https://i.pravatar.cc/48?u=118838'),
      ('Alvarado', 'Maria', 'Local producer of olive products.', 1, 'https://i.pravatar.cc/48?u=118839'),
  
      ('Rossi', 'Gianni', 'Expert in olive oil production and tasting.', 2, 'https://i.pravatar.cc/48?u=118840'),
      ('Martin', 'Sophie', 'Food scientist specializing in olive oil quality analysis.', 2, 'https://i.pravatar.cc/48?u=118841'),
      ('Ahmad', 'Yasmine', 'Agricultural engineer with a focus on olive cultivation.', 2, 'https://i.pravatar.cc/48?u=118842'),
      ('Silva', 'Rafael', 'Olive oil sommelier.', 2, 'https://i.pravatar.cc/48?u=118843'),
  
      ('Patel', 'Anil', 'Environmentalist and expert in sustainable agriculture.', 3, 'https://i.pravatar.cc/48?u=118844'),
      ('Lopez', 'Miguel', 'Arborist specializing in olive trees.', 3, 'https://i.pravatar.cc/48?u=118845'),
      ('Chen', 'Mei', 'Community organizer and advocate for urban greening.', 3, 'https://i.pravatar.cc/48?u=118846'),
      ('Novak', 'Katarina', 'Educator on the ecological benefits of olive trees.', 3, 'https://i.pravatar.cc/48?u=118847'),
  
      ('Johnson', 'Michael', 'Chef and expert in olive-based recipes.', 4, 'https://i.pravatar.cc/48?u=118848'),
      ('Berardi', 'Laura', 'Olive oil producer with a focus on organic products.', 4, 'https://i.pravatar.cc/48?u=118849'),
      ('Abdullah', 'Sara', 'Historian with expertise in the culinary history of olives.', 4, 'https://i.pravatar.cc/48?u=118850'),
      ('Kumar', 'Raj', 'Food critic and author specializing in Mediterranean cuisine.', 4, 'https://i.pravatar.cc/48?u=118851');
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS programmes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      jour DATE NOT NULL,
      evenement_id INT,
      plan JSON,
      FOREIGN KEY (evenement_id) REFERENCES Evenements(id)
    )
  `);
  
  const [programmes] = await connection.query("SELECT COUNT(*) AS count FROM programmes");
  const programmesCount = programmes[0].count;
  
  if (programmesCount === 0) {
    // Insert data into programmes table with all 15 speakers
    await connection.query(`
      INSERT INTO programmes (jour, evenement_id, plan) VALUES
      ('2024-08-05', 1, '[
        {"activity": "Opening Ceremony", "time": "9:00 AM", "speaker_id": 1},
        {"activity": "Olive Picking", "time": "10:30 AM", "speaker_id": 2},
        {"activity": "Lunch", "time": "1:00 PM", "speaker_id": 3},
        {"activity": "Olive Oil Tasting", "time": "2:30 PM", "speaker_id": 4}
      ]'),
      ('2024-08-06', 1, '[
        {"activity": "Introduction", "time": "2:00 PM", "speaker_id": 5},
        {"activity": "Olive Oil Tasting", "time": "2:30 PM", "speaker_id": 6},
        {"activity": "Pressing Demonstration", "time": "3:30 PM", "speaker_id": 7}
      ]'),
      ('2024-09-05', 3, '[
        {"activity": "Registration", "time": "9:00 AM", "speaker_id": 8},
        {"activity": "Planting Instructions", "time": "9:30 AM", "speaker_id": 9},
        {"activity": "Tree Planting", "time": "10:00 AM", "speaker_id": 10},
        {"activity": "Lunch", "time": "12:00 PM", "speaker_id": 11}
      ]'),
      ('2024-09-06', 3, '[
        {"activity": "Mulching Instructions", "time": "2:00 PM", "speaker_id": 12},
        {"activity": "Watering", "time": "3:00 PM", "speaker_id": 13},
        {"activity": "Wrap-Up", "time": "4:00 PM", "speaker_id": 14}
      ]'),
      ('2024-10-01', 4, '[
        {"activity": "Cooking Demonstration", "time": "10:00 AM", "speaker_id": 15},
        {"activity": "Recipe Sharing", "time": "11:00 AM", "speaker_id": 1},
        {"activity": "Tasting Session", "time": "12:00 PM", "speaker_id": 2}
      ]'),
      ('2024-10-02', 4, '[
        {"activity": "Panel Discussion", "time": "2:00 PM", "speaker_id": 3},
        {"activity": "Q&A Session", "time": "3:00 PM", "speaker_id": 4}
      ]'),
      ('2024-11-01', 5, '[
        {"activity": "Reception", "time": "7:00 PM", "speaker_id": 5},
        {"activity": "Dinner", "time": "7:30 PM", "speaker_id": 6},
        {"activity": "Live Music", "time": "8:30 PM", "speaker_id": 7},
        {"activity": "Auction", "time": "10:00 PM", "speaker_id": 8}
      ]'),
      ('2024-11-02', 5, '[
        {"activity": "Silent Auction Begins", "time": "10:00 AM", "speaker_id": 9},
        {"activity": "Auction Closes", "time": "2:00 PM", "speaker_id": 10}
      ]')
    `);
  }

    // Create Sponsors table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Sponsors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nom VARCHAR(100),
        description TEXT,
        evenement_id INT,
        FOREIGN KEY (evenement_id) REFERENCES Evenements(id)
      )
    `);

    // Create Candidatures table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Candidatures (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNSIGNED,
        evenement_id INT,
        statut ENUM('en attente', 'accepte', 'refuse'),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (evenement_id) REFERENCES Evenements(id)
      )
    `);

    // Check if users table is empty
    const [users] = await connection.query(
      "SELECT COUNT(*) AS count FROM users"
    );
    const usersCount = users[0].count;

    if (usersCount === 0) {
      // Insert admin user
      const adminPassword = "admin_password"; // Replace with a secure password or environment variable
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const adminEmail = "admin@example.com";
      const adminNom = "Admin";
      const adminPrenom = "User";

      await connection.query(
        `
        INSERT INTO users (username, email, password, nom, prenom, role, isVerified) 
        VALUES (?, ?, ?, ?, ?, 'admin', true)
      `,
        ["admin", adminEmail, hashedPassword, adminNom, adminPrenom]
      );

      console.log("Admin user created with password: admin_password");
    } else {
      console.log("Admin user already exists or other users present");
    }

    connection.release();
  } catch (err) {
    console.error("Error creating database, tables, or admin user:", err);
  }
}

module.exports = createDatabase;