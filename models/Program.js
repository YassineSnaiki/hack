const pool = require('../config/database');

class Program {
  // Method to get all programs for a specific event by event ID
  static async getByEventId(eventId) {
    try {
      const [rows] = await pool.query('SELECT * FROM programmes WHERE evenement_id = ?', [eventId]);
      return rows;
    } catch (error) {
      throw new Error('Error retrieving programs by event ID: ' + error.message);
    }
  }

  // Method to create a new program
  static async create(program) {
    try {
      const { jour, evenement_id, plan } = program;
      const [result] = await pool.query(`
        INSERT INTO programmes (jour, evenement_id, plan) 
        VALUES (?, ?, ?)`,
        [jour, evenement_id, JSON.stringify(plan)]
      );
      return result.insertId; // Return the ID of the newly created program
    } catch (error) {
      throw new Error('Error creating program: ' + error.message);
    }
  }

  // Method to get all programs
  static async getAll() {
    try {
      const [rows] = await pool.query('SELECT * FROM programmes');
      return rows;
    } catch (error) {
      throw new Error('Error retrieving all programs: ' + error.message);
    }
  }

  // Method to get a program by ID
  static async getById(programId) {
    try {
      const [rows] = await pool.query('SELECT * FROM programmes WHERE id = ?', [programId]);
      return rows[0];
    } catch (error) {
      throw new Error('Error retrieving program by ID: ' + error.message);
    }
  }

  // Method to update a program
  static async update(programId, program) {
    try {
      const { jour, evenement_id, plan } = program;
      await pool.query(`
        UPDATE programmes 
        SET jour = ?, evenement_id = ?, plan = ? 
        WHERE id = ?`,
        [jour, evenement_id, JSON.stringify(plan), programId]
      );
    } catch (error) {
      throw new Error('Error updating program: ' + error.message);
    }
  }

  // Method to delete a program
  static async delete(programId) {
    try {
      await pool.query('DELETE FROM programmes WHERE id = ?', [programId]);
    } catch (error) {
      throw new Error('Error deleting program: ' + error.message);
    }
  }
}

module.exports = Program;
