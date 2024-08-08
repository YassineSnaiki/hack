const pool = require("../config/database");

class Event {
  static async getAllEvents() {
    try {
      const [rows] = await pool.query("SELECT * FROM Evenements");
      return rows;
    } catch (err) {
      throw new Error("An error occurred while fetching events.");
    }
  }

  static async getEventById(id) {
    try {
      const [rows] = await pool.query("SELECT * FROM Evenements WHERE id = ?", [
        id,
      ]);
      if (rows.length > 0) {
        return rows[0];
      } else {
        throw new Error("Event not found.");
      }
    } catch (err) {
      throw new Error("An error occurred while fetching the event.");
    }
  }


  

  static async addEvent(
    titre,
    apercu,
    description,
    image_url,
    date_debut,
    date_fin,
    time,
    lieu,
    observations,
    participation,
    info_add
  ) {
    try {
      await pool.query(
        "INSERT INTO Evenements (titre, apercu, description, image_url, date_debut, date_fin, time, lieu, observations, participation, info_add) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          titre,
          apercu,
          description,
          image_url,
          date_debut,
          date_fin,
          time,
          lieu,
          observations,
          participation,
          info_add,
        ]
      );
    } catch (err) {
      console.error("Database error:", err); // Log the actual database error
      throw new Error("An error occurred while adding the event.");
    }
  }
  
// In Event.js (or your model file)

static async deleteEvent(id) {
  try {
    await pool.query('DELETE FROM Evenements WHERE id = ?', [id]);
  } catch (err) {
    console.error("Database error:", err);
    throw new Error("An error occurred while deleting the event.");
  }
}




// Event.js (Model)

static async updateEvent(
  id,
  titre,
  apercu,
  description,
  image_url,
  date_debut,
  date_fin,
  time,
  lieu,
  observations,
  participation,
  info_add
) {
  try {
    await pool.query(
      `UPDATE Evenements SET
        titre = ?, apercu = ?, description = ?, image_url = ?,
        date_debut = ?, date_fin = ?, time = ?, lieu = ?,
        observations = ?, participation = ?, info_add = ?
      WHERE id = ?`,
      [
        titre,
        apercu,
        description,
        image_url,
        date_debut,
        date_fin,
        time,
        lieu,
        observations,
        participation,
        info_add,
        id,
      ]
    );
  } catch (err) {
    console.error("Database error:", err);
    throw new Error("An error occurred while updating the event.");
  }
}



}

module.exports = Event;
