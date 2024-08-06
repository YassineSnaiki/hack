// models/sponsor.js
const pool = require("../config/database");

class Sponsor {
  static async getAllSponsors() {
    try {
      const [rows] = await pool.query("SELECT * FROM Sponsors");
      return rows;
    } catch (err) {
      throw new Error("An error occurred while fetching sponsors.");
    }
  }

  static async getSponsorById(id) {
    try {
      const [rows] = await pool.query("SELECT * FROM Sponsors WHERE id = ?", [id]);
      if (rows.length > 0) {
        return rows[0];
      } else {
        throw new Error("Sponsor not found.");
      }
    } catch (err) {
      throw new Error("An error occurred while fetching the sponsor.");
    }
  }

  static async addSponsor(nom, description, evenement_id) {
    try {
      await pool.query(
        "INSERT INTO Sponsors (nom, description, evenement_id) VALUES (?, ?, ?)",
        [nom, description, evenement_id]
      );
    } catch (err) {
      throw new Error("An error occurred while adding the sponsor.");
    }
  }

  static async updateSponsor(id, nom, description, evenement_id) {
    try {
      await pool.query(
        "UPDATE Sponsors SET nom = ?, description = ?, evenement_id = ? WHERE id = ?",
        [nom, description, evenement_id, id]
      );
    } catch (err) {
      throw new Error("An error occurred while updating the sponsor.");
    }
  }

  static async deleteSponsor(id) {
    try {
      await pool.query("DELETE FROM Sponsors WHERE id = ?", [id]);
    } catch (err) {
      throw new Error("An error occurred while deleting the sponsor.");
    }
  }

  static async getByEventId(evenement_id) {
    try {
      const [rows] = await pool.query("SELECT * FROM Sponsors WHERE evenement_id = ?", [evenement_id]);
      return rows;
    } catch (err) {
      throw new Error("An error occurred while fetching sponsors by event ID.");
    }
  }
}

module.exports = Sponsor;
