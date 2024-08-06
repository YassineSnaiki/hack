// models/Candidature.js
const pool = require("../config/database");

class Candidature {
  static async getAllCandidatures() {
    try {
      const [rows] = await pool.query("SELECT * FROM Candidatures");
      return rows;
    } catch (err) {
      throw new Error("An error occurred while fetching candidatures.");
    }
  }

  static async getCandidatureById(id) {
    try {
      const [rows] = await pool.query("SELECT * FROM Candidatures WHERE id = ?", [id]);
      if (rows.length > 0) {
        return rows[0];
      } else {
        throw new Error("Candidature not found.");
      }
    } catch (err) {
      throw new Error("An error occurred while fetching the candidature.");
    }
  }

  static async addCandidature(user_id, evenement_id, num_visitors, commentaire, statut = 'en attente') {
    try {
      await pool.query(
        "INSERT INTO Candidatures (user_id, evenement_id, nombre_visiteur, commentaire, statut) VALUES (?, ?, ?, ?, ?)",
        [user_id, evenement_id, num_visitors, commentaire, statut]
      );
    } catch (err) {
      throw new Error("An error occurred while adding the candidature.");
    }
  }

  static async updateCandidature(id, num_visitors, commentaire, statut) {
    try {
      await pool.query(
        "UPDATE Candidatures SET nombre_visiteur = ?, commentaire = ?, statut = ? WHERE id = ?",
        [num_visitors, commentaire, statut, id]
      );
    } catch (err) {
      throw new Error("An error occurred while updating the candidature.");
    }
  }

  static async deleteCandidature(id) {
    try {
      await pool.query("DELETE FROM Candidatures WHERE id = ?", [id]);
    } catch (err) {
      throw new Error("An error occurred while deleting the candidature.");
    }
  }

  static async getByUserId(user_id) {
    try {
      const [rows] = await pool.query("SELECT * FROM Candidatures WHERE user_id = ?", [user_id]);
      return rows;
    } catch (err) {
      throw new Error("An error occurred while fetching candidatures by user ID.");
    }
  }

  static async getByEventId(evenement_id) {
    try {
      const [rows] = await pool.query("SELECT * FROM Candidatures WHERE evenement_id = ?", [evenement_id]);
      return rows;
    } catch (err) {
      throw new Error("An error occurred while fetching candidatures by event ID.");
    }
  }

  static async getByUserIdAndEventId(user_id, evenement_id) {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM Candidatures WHERE user_id = ? AND evenement_id = ?",
        [user_id, evenement_id]
      );
      return rows;
    } catch (err) {
      throw new Error("An error occurred while fetching candidatures by user ID and event ID.");
    }
  }
}

module.exports = Candidature;
