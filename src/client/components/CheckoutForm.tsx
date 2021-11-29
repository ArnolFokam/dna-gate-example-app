import { CardElement } from '@stripe/react-stripe-js';
import { useContext, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../config/store';
import { logout } from '../reducers/authentication.reducer';
import NotyfContext from "../config/NotyfContext";
import WebcamModal from './WebcamModal';
import { checkMatch } from '../reducers/veri-face.reducer';

const CheckoutForm = ({ stripe, elements, clientSecret }: any) => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const notyf = useContext(NotyfContext);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethodID, setPaymentMethodID] = useState(null);

  const requestFailure = useAppSelector(state => state.veriFace.requestFailure);
  const errorMessage = useAppSelector(state => state.veriFace.errorMessage);
  const requestSuccess = useAppSelector(state => state.veriFace.requestSuccess);

  const handleChange = (event: any) => {
    setName(event.target.value);
  }

  const handleLogout = () => {
    dispatch(logout());
  }

  const pay = async () => {
    const { error: stripeError } = await stripe
      .confirmCardPayment(clientSecret, {
        payment_method: paymentMethodID,
      });

    if (stripeError) {
      setMessage(stripeError.message);
    } else {
      setMessage('');
      notyf.success("Successful payment!");
    }

    setSubmitting(false);
  }

  const handleSubmit = async (event: any) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const cardElement = elements.getElement(CardElement);

    setSubmitting(true);
    const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        name,
      },
    });

    if (stripeError) {
      setSubmitting(false);
      setMessage(stripeError.message);
    } else {
      setMessage('');
      setPaymentMethodID(paymentMethod.id);
      setShowModal(true);
    }
  };

  const setValidatePicture = async (image: string) => {
    setShowModal(false);
    await dispatch(checkMatch(image));
  };

  useEffect(() => {
    // if a request was initiated
    if (submitting) {
      // if the request went through, check match
      if (requestSuccess) {
        pay();
      }
    }
  // eslint-disable-next-line
  }, [requestSuccess]);

  useEffect(() => {
    // if a request was initiated
    if (requestFailure && errorMessage) {
      notyf.error(errorMessage);
      setSubmitting(false);
    }

  // eslint-disable-next-line
  }, [requestFailure, notyf]);

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      {showModal && <WebcamModal setHandleCloseModal={() => setShowModal(false)} setvalidatePicture={setValidatePicture} />}
      <input required
        className="shadow appearance-none border rounded w-full mt-6 mb-3 py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="name" type="text" placeholder="Enter you legal name" value={name} onChange={handleChange} />
      <div className="py-6">
        <CardElement />
      </div>
      {/**add notif */}
      {message && <div id="messages" className="text-sm text-red-700" role="alert">{message}</div>}
      <div className="flex justify-between item-center py-5">
        <button onClick={handleLogout}
          className="bg-gray-700 hover:bg-gray-500 text-white font-bold py-2 px-4 border-b-4 border-gray-800 hover:border-gray-600 rounded">
          Logout
        </button>

        <button type="submit" form="payment-form" disabled={!stripe || submitting}
          className="flex items-center bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded">
          {submitting && <div className="animate-spin rounded-full mr-3 h-4 w-4 border-b-2 border-white-900"></div>}
          buy now
        </button>
      </div>
    </form>
  )
};

export default CheckoutForm;
