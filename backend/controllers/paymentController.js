const catchAsyncError = require('../middlewares/catchAsyncError');
const stripe = require('stripe')(
  'sk_test_51O7tt6SIUVqr9ITSdpbZGdVPnQBYdW0Dy6cGQNPS1YUdNB5Ub6nKicp4ABTFLe0G1WH99Vy1B5L6ET8eRevx3L3z000Gd4a43x'
);

exports.processPayment = catchAsyncError(async (req, res, next) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: 'inr',
    description: 'TEST PAYMENT',
    metadata: { integration_check: 'accept_payment' },
    shipping: req.body.shipping,
  });

  res.status(200).json({
    success: true,
    client_secret: paymentIntent.client_secret,
  });
});

exports.sendStripeApi = catchAsyncError(async (req, res, next) => {
  res.status(200).json({
    stripeApiKey:
      'pk_test_51O7tt6SIUVqr9ITSR5pALoJqjB55DZoPXEJHSYIH72Wkv9vXBXmpGGtw8GmboR1R0J6gzeYfNrcVUSgeQ8VxutZO003S3wrEzI',
  });
});
