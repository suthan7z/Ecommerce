const crypto = require('crypto');
const Payment = require('../models/Payment');
const Order = require('../models/Order');

const MERCHANT_ID = process.env.PAYHERE_MERCHANT_ID;
const MERCHANT_SECRET = process.env.PAYHERE_MERCHANT_SECRET;
const IS_SANDBOX = process.env.NODE_ENV !== 'production';

// Helper: generate PayHere hash
// Formula: MD5(merchant_id + order_id + amount + currency + MD5(merchant_secret).toUpperCase()).toUpperCase()
const generateHash = (orderId, amount, currency = 'LKR') => {
  const secretHash = crypto
    .createHash('md5')
    .update(MERCHANT_SECRET)
    .digest('hex')
    .toUpperCase();

  const hashStr = MERCHANT_ID + orderId + amount + currency + secretHash;
  return crypto.createHash('md5').update(hashStr).digest('hex').toUpperCase();
};

// POST /api/payments/initiate
// Frontend calls this to get the hash + payment params before opening PayHere popup
exports.initiatePayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const amount = order.totalAmount.toFixed(2);
    const currency = 'LKR';
    const hash = generateHash(orderId, amount, currency);

    // Save a pending payment record
    await Payment.findOneAndUpdate(
      { orderId },
      { orderId, userId: req.userId, amount: order.totalAmount, status: 'pending', paymentMethod: 'card' },
      { upsert: true, new: true }
    );

    res.json({
      merchant_id: MERCHANT_ID,
      order_id: orderId,
      amount,
      currency,
      hash,
      sandbox: IS_SANDBOX,
    });
  } catch (error) {
    console.error('Initiate payment error:', error);
    res.status(500).json({ 
      message: 'Failed to initiate payment', 
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
};

// POST /api/payments/notify
// PayHere calls this URL server-to-server when payment completes
// Must be a public URL (not localhost) — use ngrok for testing
exports.paymentNotify = async (req, res) => {
  try {
    const {
      merchant_id,
      order_id,
      payhere_amount,
      payhere_currency,
      status_code,
      md5sig,
    } = req.body;

    // Verify the signature to make sure it's really from PayHere
    const secretHash = crypto
      .createHash('md5')
      .update(MERCHANT_SECRET)
      .digest('hex')
      .toUpperCase();

    const localSig = crypto
      .createHash('md5')
      .update(merchant_id + order_id + payhere_amount + payhere_currency + status_code + secretHash)
      .digest('hex')
      .toUpperCase();

    if (localSig !== md5sig) {
      console.error('PayHere: Invalid signature', { localSig, md5sig });
      return res.sendStatus(400);
    }

    // status_code 2 = success, 0 = pending, -1 = cancelled, -2 = failed, -3 = chargedback
    if (status_code === '2') {
      // Mark payment as completed
      await Payment.findOneAndUpdate(
        { orderId: order_id },
        { status: 'completed', transactionId: `PH_${order_id}_${Date.now()}` },
        { upsert: true }
      );

      // Mark order as paid and confirmed
      await Order.findByIdAndUpdate(order_id, {
        paymentStatus: 'paid',
        status: 'confirmed',
      });

      console.log(`PayHere: Payment confirmed for order ${order_id}`);
    } else if (status_code === '-1' || status_code === '-2') {
      await Payment.findOneAndUpdate({ orderId: order_id }, { status: 'failed' });
      await Order.findByIdAndUpdate(order_id, { paymentStatus: 'failed' });
    }

    // PayHere expects a 200 OK — always send it
    res.sendStatus(200);
  } catch (error) {
    console.error('PayHere notify error:', error);
    res.sendStatus(500);
  }
};

// GET /api/payments/status/:orderId
exports.getPaymentStatus = async (req, res) => {
  try {
    const payment = await Payment.findOne({ orderId: req.params.orderId });
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    if (payment.userId.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    res.json(payment);
  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch payment status', 
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
};

// POST /api/payments/refund (admin only)
exports.refundPayment = async (req, res) => {
  try {
    if (req.userRole !== 'admin') return res.status(403).json({ message: 'Admins only' });

    const { orderId } = req.body;
    const payment = await Payment.findOne({ orderId });
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    if (payment.status !== 'completed') {
      return res.status(400).json({ message: 'Can only refund completed payments' });
    }

    // Note: PayHere refunds must be done manually through the PayHere merchant dashboard
    // There is no programmatic refund API available
    payment.status = 'refunded';
    await payment.save();

    const order = await Order.findById(orderId);
    if (order) { order.status = 'refunded'; await order.save(); }

    res.json({ success: true, message: 'Refund marked. Process the actual refund in PayHere dashboard.', payment });
  } catch (error) {
    console.error('Refund payment error:', error);
    res.status(500).json({ 
      message: 'Refund failed', 
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
};

// GET /api/payments/history (admin)
exports.getPaymentHistory = async (req, res) => {
  try {
    if (req.userRole !== 'admin') return res.status(403).json({ message: 'Admins only' });
    const payments = await Payment.find()
      .populate('userId', 'email name')
      .populate('orderId')
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch history', 
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
};

// GET /api/payments/my-history (user)
exports.getUserPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.userId })
      .populate('orderId')
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    console.error('Get user payment history error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch history', 
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
};
