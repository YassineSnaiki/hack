const pool = require('../config/database');

// Define a class to handle operations on the Speakers table
class Speaker {
  // Method to get all speakers
  static async getAll() {
    try {
      const [rows] = await pool.query('SELECT * FROM Speakers');
      return rows;
    } catch (error) {
      throw new Error('Error retrieving speakers: ' + error.message);
    }
  }

  // Method to get a speaker by ID
  static async getById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM Speakers WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw new Error('Error retrieving speaker by ID: ' + error.message);
    }
  }
  static async getByEventId(eventId) {
    try {
      const [rows] = await pool.query('SELECT * FROM Speakers WHERE evenement_id = ?', [eventId]);
      return rows;
    } catch (error) {
      throw new Error('Error retrieving speakers by event ID: ' + error.message);
    }
  }

  // Method to create a new speaker
  static async create({ nom, prenom, description, evenement_id }) {
    try {
      const [result] = await pool.query(
        'INSERT INTO Speakers (nom, prenom, description, evenement_id) VALUES (?, ?, ?, ?)',
        [nom, prenom, description, evenement_id]
      );
      return result.insertId;
    } catch (error) {
      throw new Error('Error creating speaker: ' + error.message);
    }
  }

  // Method to update a speaker by ID
  static async update(id, { nom, prenom, description, evenement_id }) {
    try {
      await pool.query(
        'UPDATE Speakers SET nom = ?, prenom = ?, description = ?, evenement_id = ? WHERE id = ?',
        [nom, prenom, description, evenement_id, id]
      );
    } catch (error) {
      throw new Error('Error updating speaker: ' + error.message);
    }
  }

  // Method to delete a speaker by ID
  static async delete(id) {
    try {
      await pool.query('DELETE FROM Speakers WHERE id = ?', [id]);
    } catch (error) {
      throw new Error('Error deleting speaker: ' + error.message);
    }
  }
}

module.exports = Speaker;
