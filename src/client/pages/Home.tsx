import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, ElementsConsumer } from '@stripe/react-stripe-js';

import CheckoutForm from '../components/CheckoutForm';
import { useAppSelector } from '../config/store';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY!);

const Home = () => {
    const [paymentOptions, setPaymentOptions] = useState<any>({});
    const userName = useAppSelector(state => state.authentication.account.name);

    useEffect(() => {
        async function getSecret() {
            // Create PaymentIntent on the server
            const { error: backendError, clientSecret } = await fetch('/api/creat-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    paymentMethodType: 'card',
                    currency: 'usd',
                    amount: 22000,
                }),
            })
                .then((response) => response.json());

            if (backendError) {
                return;
            }

            setPaymentOptions({
                ...paymentOptions,
                clientSecret: clientSecret
            })
        }

        getSecret();
        // eslint-disable-next-line
    }, []);

    return <div className="home">
        <div className="flex flex-col h-full bg-gray-100">
            {/*Auth Card Container*/}
            <div className="grid place-items-center mx-2 my-20 py-20">
                {/*Auth Card*/}
                <div className="w-11/12 p-12 sm:w-8/12 md:w-6/12 lg:w-5/12 2xl:w-4/12 
                px-6 py-10 sm:px-10 sm:py-6 
                bg-white rounded-lg shadow-md lg:shadow-lg">

                    {/*Card Title*/}
                    <h3 className="text-center font-semibold text-2xl lg:text-2xl text-gray-800">
                    <span className="font-bold text-yellow-600">{userName}</span>'s Shop
                    </h3>

                    <p className="pt-8 text-base md:text-md ...">This is a fake article from our fake shop. To buy it, click on
                        <b>{" "}buy now</b> and
                        you will be prompted to provide your facial features so we can verify that the payment comes from
                        you.
                    </p>
                    <div className="pb-8 pt-8 flex row justify-center">
                        <div className="flex max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
                            <div className="w-1/3 bg-cover"
                                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1494726161322-5360d4d0eeae?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80')" }}>
                            </div>
                            <div className="w-2/3 p-4">
                                <h1 className="text-gray-900 font-bold text-2xl">Backpack</h1>
                                <p className="mt-2 text-gray-600 text-sm">Lorem ipsum dolor sit amet consectetur adipisicing
                                    elit In odit exercitationem fuga id nam quia</p>
                                <div className="flex item-center mt-2">
                                    <svg className="w-5 h-5 fill-current text-yellow-400" viewBox="0 0 24 24">
                                        <path
                                            d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                                    </svg>
                                    <svg className="w-5 h-5 fill-current text-yellow-400" viewBox="0 0 24 24">
                                        <path
                                            d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                                    </svg>
                                    <svg className="w-5 h-5 fill-current text-yellow-400" viewBox="0 0 24 24">
                                        <path
                                            d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                                    </svg>
                                    <svg className="w-5 h-5 fill-current text-yellow-200" viewBox="0 0 24 24">
                                        <path
                                            d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                                    </svg>
                                    <svg className="w-5 h-5 fill-current text-yellow-200" viewBox="0 0 24 24">
                                        <path
                                            d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                                    </svg>
                                </div>
                                <div className="flex item-center justify-between mt-3">
                                    <h1 className="text-gray-700 font-bold text-xl ">$220</h1>
                                </div>
                            </div>
                        </div>
                    </div>

                    {paymentOptions.clientSecret && <Elements stripe={stripePromise} options={paymentOptions}>
                        <ElementsConsumer>
                            {({ elements, stripe }) => (
                                <CheckoutForm elements={elements} stripe={stripe} clientSecret={paymentOptions.clientSecret}/>
                            )}
                        </ElementsConsumer>
                    </Elements>}

                </div>
            </div>
        </div>
    </div>;
}

export default Home;
