// controllers/CandidatureController.js
const Candidature = require('../models/Candidature');

class CandidatureController {
    static async addCandidature(req, res) {
        try {
          const { evenement_id } = req.params;
          const { num_visitors, commentaire } = req.body;
          const user_id = req.user.id; // Extract user ID from authenticated user
    
          // Adding candidature with default statut 'en attente'
          await Candidature.addCandidature(user_id, evenement_id, num_visitors, commentaire, 'en attente');
    
          req.flash('success_msg', 'Candidature added successfully');
          res.redirect(`/event/${evenement_id}`);
        } catch (err) {
          req.flash('error_msg', 'An error occurred while adding the candidature.');
          res.redirect(`/event/${req.params.evenement_id}`);
        }
      }
    }
module.exports = CandidatureController;
