const RentalRequest = require('../models/RentalRequest');
const Equipment = require('../models/Equipment');

// التحقق من توفر المعدة في فترة معينة
const checkAvailability = async (equipmentId, startDate, endDate) => {
  const existingRentals = await RentalRequest.find({
    equipment: equipmentId,
    status: { $in: ['pending', 'approved'] },
    $or: [
      { startDate: { $lte: endDate }, endDate: { $gte: startDate } },
      { startDate: { $gte: startDate, $lte: endDate } }
    ]
  });

  return existingRentals.length === 0;
};

// إنشاء طلب تأجير جديد
const createRentalRequest = async (req, res) => {
  try {
    const { equipmentId, startDate, endDate, notes } = req.body;
    const userId = req.user._id;

    // التحقق من وجود المعدة
    const equipment = await Equipment.findById(equipmentId);
    if (!equipment) {
      return res.status(404).json({ message: 'المعدة غير موجودة' });
    }

    // التحقق من توفر المعدة في الفترة المطلوبة
    const isAvailable = await checkAvailability(equipmentId, startDate, endDate);
    if (!isAvailable) {
      return res.status(400).json({ message: 'المعدة غير متوفرة في الفترة المطلوبة' });
    }

    // إنشاء طلب التأجير
    const rentalRequest = new RentalRequest({
      equipment: equipmentId,
      user: userId,
      startDate,
      endDate,
      notes,
      status: 'pending'
    });

    await rentalRequest.save();

    res.status(201).json({
      message: 'تم إنشاء طلب التأجير بنجاح',
      rentalRequest
    });
  } catch (error) {
    console.error('Error creating rental request:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء إنشاء طلب التأجير' });
  }
};

// تحديث حالة طلب التأجير
const updateRentalRequestStatus = async (req, res) => {
  try {
    const { rentalRequestId } = req.params;
    const { status } = req.body;
    const userId = req.user._id;

    // التحقق من صحة الحالة
    const allowedStatuses = ['pending', 'approved', 'rejected', 'cancelled'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'حالة الطلب غير صالحة' });
    }

    // البحث عن طلب التأجير مع تجميع بيانات المعدة والمستخدم
    const rentalRequest = await RentalRequest.findById(rentalRequestId)
      .populate({
        path: 'equipment',
        select: 'owner name'
      })
      .populate('user', 'name');

    if (!rentalRequest) {
      return res.status(404).json({ message: 'طلب التأجير غير موجود' });
    }

    if (!rentalRequest.equipment) {
      return res.status(404).json({ message: 'المعدة غير موجودة' });
    }

    // التحقق من أن المستخدم هو مالك المعدة
    if (rentalRequest.equipment.owner.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'غير مصرح لك بتحديث حالة هذا الطلب' });
    }

    // تحديث حالة الطلب
    rentalRequest.status = status;
    await rentalRequest.save();

    res.json({
      message: 'تم تحديث حالة طلب التأجير بنجاح',
      rentalRequest
    });
  } catch (error) {
    console.error('Error updating rental request status:', error);
    res.status(500).json({ 
      message: 'حدث خطأ أثناء تحديث حالة طلب التأجير',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// جلب طلبات التأجير للمستخدم
const getUserRentalRequests = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const rentalRequests = await RentalRequest.find({ user: userId })
      .populate('equipment', 'title mainImage manufacturer model dailyRate')
      .sort({ createdAt: -1 });

    res.json({ rentalRequests });
  } catch (error) {
    console.error('Error fetching user rental requests:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء جلب طلبات التأجير' });
  }
};

// جلب طلبات التأجير للمعدات
const getEquipmentRentalRequests = async (req, res) => {
  try {
    const { equipmentId } = req.params;
    const userId = req.user._id;

    // التحقق من أن المستخدم هو مالك المعدة
    const equipment = await Equipment.findById(equipmentId);
    if (!equipment) {
      return res.status(404).json({ message: 'المعدة غير موجودة' });
    }

    if (equipment.owner.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'غير مصرح لك بالوصول إلى طلبات هذه المعدة' });
    }

    const rentalRequests = await RentalRequest.find({ equipment: equipmentId })
      .populate('user', 'name email phoneNumber')
      .sort({ createdAt: -1 });

    res.json({ rentalRequests });
  } catch (error) {
    console.error('Error fetching equipment rental requests:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء جلب طلبات التأجير' });
  }
};

module.exports = {
  createRentalRequest,
  updateRentalRequestStatus,
  getUserRentalRequests,
  getEquipmentRentalRequests
}; 