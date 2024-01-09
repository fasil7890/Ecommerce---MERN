import React, { Fragment, useEffect } from 'react';
import { useElements, useStripe } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from '@stripe/react-stripe-js';
import axios from 'axios';
import { toast } from 'react-toastify';
import { orderCompleted } from '../../slices/cartSlice';
import { createOrder } from '../../actions/orderActions';
import { clearOrderError } from '../../slices/orderSlice';

const Payment = () => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'));
  const { user } = useSelector((state) => state.authState);
  const { error: orderError } = useSelector((state) => state.orderState);
  const { items: cartItems, shippingInfo } = useSelector(
    (state) => state.cartState
  );
  const paymentData = {
    amount: Math.round(orderInfo ? orderInfo.totalPrice * 100 : ''),
    shipping: {
      name: user.name,
      address: {
        city: shippingInfo.city,
        postal_code: shippingInfo.postal_code,
        country: shippingInfo.country,
        state: shippingInfo.state,
        line1: shippingInfo.address,
      },
      phone: shippingInfo.phoneNo,
    },
  };

  const order = {
    orderItems: cartItems,
    shippingInfo,
  };

  if (orderInfo) {
    order.itemsPrice = orderInfo.itemsPrice;
    order.shippingPrice = orderInfo.shippingPrice;
    order.taxPrice = orderInfo.taxPrice;
    order.totalPrice = orderInfo.totalPrice;
  }

  useEffect(() => {
    if (orderError) {
      toast(orderError, {
        position: toast.POSITION.BOTTOM_CENTER,
        type: 'error',
        onOpen: () => {
          dispatch(clearOrderError());
        },
      });
      return;
    }
  }, [dispatch, orderError]);

  const submitHandler = async (e) => {
    e.preventDefault();
    document.querySelector('#pay_btn').disabled = true;
    try {
      const { data } = await axios.post('/api/v1/payment/process', paymentData);
      const clientSecret = data.client_secret;
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: user.name,
            email: user.email,
          },
        },
      });
      console.log(result, 'result');
      if (result.error) {
        toast((await result).error.message, {
          type: 'error',
          position: toast.POSITION.BOTTOM_CENTER,
        });
      } else {
        if ((await result).object === 'payment_intent') {
          toast('Payment Success', {
            type: 'success',
            position: toast.POSITION.BOTTOM_CENTER,
          });
        } else {
          toast('Payment Success', {
            type: 'success',
            position: toast.POSITION.BOTTOM_CENTER,
          });
          order.paymentInfo = {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
          };
          dispatch(orderCompleted());
          dispatch(createOrder(order));
          navigate('/order/success');
        }
      }
    } catch (error) {
      console.log(error, 'Stripe Error');
    }
  };

  return (
    <Fragment>
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form onSubmit={submitHandler} className="shadow-lg">
            <h1 className="mb-4">Card Info</h1>
            <div className="form-group">
              <label htmlFor="card_num_field">Card Number</label>
              <CardNumberElement
                type="text"
                id="card_num_field"
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="card_exp_field">Card Expiry</label>
              <CardExpiryElement
                type="text"
                id="card_exp_field"
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="card_cvc_field">Card CVC</label>
              <CardCvcElement
                type="text"
                id="card_cvc_field"
                className="form-control"
              />
            </div>

            <button id="pay_btn" type="submit" className="btn btn-block py-3">
              Pay {`${orderInfo ? orderInfo.totalPrice : ''}`}
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default Payment;
