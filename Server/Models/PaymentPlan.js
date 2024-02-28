// PaymentPlan model
const mongoose = require('mongoose');

const paymentPlanSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['percentage', 'amount'],
        required: true
    },
    planName: {
        type: String,
        required: true
    },
    numInstallments: {
        type: Number,
        required: true
    },
    installments: [{
        installment: {
          type: Number,
          required: true,
        },
        daysFromBooking: {
          type: Number,
          required: true,
        },
        amountRS: {
          type: Number,
          required: true,
        },
      }],
});

const PaymentPlan = mongoose.model('PaymentPlan', paymentPlanSchema);

module.exports = PaymentPlan;
