// const mongoose = require('mongoose');

// const rentalRequestSchema = new mongoose.Schema({
//   equipment: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Equipment',
//     required: true
//   },
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   startDate: {
//     type: Date,
//     required: true
//   },
//   endDate: {
//     type: Date,
//     required: true
//   },
//   notes: {
//     type: String,
//     trim: true
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'approved', 'rejected', 'cancelled'],
//     default: 'pending'
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// // تحديث تاريخ التعديل قبل الحفظ
// rentalRequestSchema.pre('save', function(next) {
//   this.updatedAt = Date.now();
//   next();
// });

// // التحقق من أن تاريخ البداية قبل تاريخ النهاية
// rentalRequestSchema.pre('save', function(next) {
//   if (this.startDate >= this.endDate) {
//     next(new Error('تاريخ البداية يجب أن يكون قبل تاريخ النهاية'));
//   }
//   next();
// });

// module.exports = mongoose.model('RentalRequest', rentalRequestSchema); 


const mongoose = require('mongoose');

const rentalRequestSchema = new mongoose.Schema({
  equipment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  notes: {
    type: String,
    trim: true
  },
  price: { // إضافة حقل السعر
    type: Number,
    required: true // تأكد من أنه يجب تمرير السعر
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// تحديث تاريخ التعديل قبل الحفظ
rentalRequestSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// التحقق من أن تاريخ البداية قبل تاريخ النهاية
rentalRequestSchema.pre('save', function(next) {
  if (this.startDate >= this.endDate) {
    next(new Error('تاريخ البداية يجب أن يكون قبل تاريخ النهاية'));
  }
  next();
});

module.exports = mongoose.model('RentalRequest', rentalRequestSchema);
