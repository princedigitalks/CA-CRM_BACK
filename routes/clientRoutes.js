const express = require('express');
const router = express.Router();
const {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  addFamilyMember,
  deleteFamilyMember,
  addDocument,
  deleteDocument,
  uploadDocument,
  updateDocument,
  searchClients
} = require('../controllers/clientController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../utils/multerConfig');

router.get('/clients', protect, getAllClients);
router.get('/clients/search', protect, searchClients);
router.get('/clients/:id', protect, getClientById);
router.get('/clientsfind', getAllClients);
router.post('/clients', protect, createClient);
router.put('/clients/:id', protect, updateClient);
router.delete('/clients/:id', protect, deleteClient);

router.post('/clients/:id/family', protect, addFamilyMember);
router.delete('/clients/:id/family/:memberId', protect, deleteFamilyMember);

router.post('/clients/:id/documents', protect, addDocument);
router.post('/clients/:id/documents/upload', protect, upload.single('file'), uploadDocument);
router.put('/clients/:id/documents/:docId', protect, upload.single('file'), updateDocument);
router.put('/clients/:id/documents/:docId/:memberId', protect, upload.single('file'), updateDocument);
router.delete('/clients/:id/documents/:docId', protect, deleteDocument);
router.delete('/clients/:id/documents/:docId/:memberId', protect, deleteDocument);

module.exports = router;