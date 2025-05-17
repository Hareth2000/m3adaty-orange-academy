const express = require('express');
const router = express.Router();
const { 
  createRentalRequest, 
  updateRentalRequestStatus,
  getUserRentalRequests,
  getEquipmentRentalRequests
} = require('../controllers/rentalRequestController');
const { isAuthenticated } = require('../middleware/auth');

// إنشاء طلب تأجير جديد
router.post('/', isAuthenticated, createRentalRequest);

// تحديث حالة طلب التأجير
router.put('/:rentalRequestId/status', isAuthenticated, updateRentalRequestStatus);

// جلب طلبات التأجير للمستخدم
router.get('/user', isAuthenticated, getUserRentalRequests);

// جلب طلبات التأجير للمعدات
router.get('/equipment/:equipmentId', isAuthenticated, getEquipmentRentalRequests);

module.exports = router; 