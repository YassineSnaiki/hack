// controllers/CandidatureController.js
const Candidature = require('../models/Candidature');
const Event = require('../models/Event');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail'); // Make sure sendEmail is properly imported

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

    static async getCandidatures(req, res) {
      try {
          const candidatures = await Candidature.getAllCandidatures();
          const events = await Event.getAllEvents();
          const users = await User.getAllUsers();
          
          // Build a map for quick lookup of user details by user_id
          const userMap = new Map(users.map(user => [user.id, user]));
          
          res.render('candidatures', { candidatures, events, userMap });
      } catch (err) {
          req.flash('error_msg', 'An error occurred while fetching candidatures.');
          res.redirect('/admin');
      }
  }

    static async acceptCandidature(req, res) {
        try {
            const { id } = req.params;
            const candidature = await Candidature.getCandidatureById(id);

            if (!candidature) {
                req.flash('error_msg', 'Candidature not found.');
                return res.redirect('/candidatures');
            }

            await Candidature.updateCandidature(id, candidature.nombre_visiteur, candidature.commentaire, 'accepte');

            const user = await User.findById(candidature.user_id);
            if (user && user.email) {
                await sendEmail(user.email, 'Candidature Accepted', 'Your candidature has been accepted.');
            } else {
                console.error('User email is not available.');
            }

            req.flash('success_msg', 'Candidature accepted successfully.');
            res.redirect('/candidatures');
        } catch (err) {
            console.error('Error accepting candidature:', err);
            req.flash('error_msg', 'An error occurred while accepting the candidature.');
            res.redirect('/candidatures');
        }
    }

    static async refuseCandidature(req, res) {
        try {
            const { id } = req.params;
            const candidature = await Candidature.getCandidatureById(id);

            if (!candidature) {
                req.flash('error_msg', 'Candidature not found.');
                return res.redirect('/candidatures');
            }

            await Candidature.updateCandidature(id, candidature.nombre_visiteur, candidature.commentaire, 'refuse');

            const user = await User.findById(candidature.user_id);
            if (user && user.email) {
                await sendEmail(user.email, 'Candidature Refused', 'Your candidature has been refused.');
            } else {
                console.error('User email is not available.');
            }

            req.flash('success_msg', 'Candidature refused successfully.');
            res.redirect('/candidatures');
        } catch (err) {
            console.error('Error refusing candidature:', err);
            req.flash('error_msg', 'An error occurred while refusing the candidature.');
            res.redirect('/candidatures');
        }
    }
}

module.exports = CandidatureController;
