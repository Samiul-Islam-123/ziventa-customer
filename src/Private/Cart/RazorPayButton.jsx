import React from 'react';
import Razorpay from 'react-razorpay';

const RazorpayPaymentButton = () => {
  const handlePaymentSuccess = (payment) => {
    // Handle successful payment
    console.log('Payment Successful:', payment);
  };

  const handlePaymentError = (error) => {
    // Handle payment failure
    console.error('Payment Error:', error);
  };

  const options = {
    key: 'YOUR_KEY_ID', // Replace with your Razorpay Key ID
    amount: 50000, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    currency: 'INR',
    name: 'Acme Corp',
    description: 'Test Transaction',
    image: 'https://example.com/your_logo',
    order_id: 'order_IluGWxBm9U8zJ8', // This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    callback_url: 'https://eneqd3r9zrjok.x.pipedream.net/',
    prefill: {
      name: 'Gaurav Kumar',
      email: 'gaurav.kumar@example.com',
      contact: '9000090000',
    },
    notes: {
      address: 'Razorpay Corporate Office',
    },
    theme: {
      color: '#3399cc',
    },
  };

  return (
    <Razorpay
      options={options}
      onPaymentSuccess={handlePaymentSuccess}
      onPaymentError={handlePaymentError}
    >
      <button>Pay with Razorpay</button>
    </Razorpay>
  );
};

export default RazorpayPaymentButton;
