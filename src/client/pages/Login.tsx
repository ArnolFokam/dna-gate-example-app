import { useContext, useEffect, useState } from "react";
import { clearAuth, login } from "../reducers/authentication.reducer";
import { Field, Form, Formik, ErrorMessage } from 'formik';
import { useAppDispatch, useAppSelector } from "../config/store";

import { Link, Redirect, useLocation } from "react-router-dom";
import NotyfContext from "../config/NotyfContext";
import WebcamModal from "../components/WebcamModal";

const Login = () => {
    const dispatch = useAppDispatch();
    const notyf = useContext(NotyfContext);

    const [email, setEmail] = useState('');
    const [useFace, setUseFace] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isSigningIn, setIsSigningIn] = useState(false);
    
    const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
    const loginError = useAppSelector(state => state.authentication.loginError);
    const errorMessage = useAppSelector(state => state.authentication.errorMessage);
    const loginSuccess = useAppSelector(state => state.authentication.loginSuccess);

    const handleLoginWithPassword = ({
        email,
        password
    }: any) => {
        setIsSigningIn(true);
        dispatch(login(email, password))
    }

    const handleModalShow = (email: string) => {
        setEmail(email);
        setShowModal(true);
    }

    const handleLoginWithFace = (image: any) => {
        setShowModal(false);
        setIsSigningIn(true);
        dispatch(login(email, undefined, image));
    };

    useEffect(() => {
        if (loginSuccess) {
            setUseFace(false);
            setIsSigningIn(false);
            notyf.success("Successful authentication");
        }
        // eslint-disable-next-line
    }, [loginSuccess, notyf]);

    useEffect(() => {
        if (errorMessage && loginError) {
            setUseFace(true);
            setIsSigningIn(false);
            notyf.error(errorMessage);
            dispatch(clearAuth());
        }
    }, [errorMessage, loginError, notyf, dispatch]);

    const location = useLocation();
    const { from } = (location.state as any) || { from: { pathname: '/', search: location.search } };

    if (isAuthenticated) {
        if (from.pathname.startsWith('/shop')) {
            return <Redirect to={from} />;
        } else {
            return <Redirect to="/shop" />;
        }
    }

    return <div className="flex flex-col h-full bg-gray-100">
        {showModal && <WebcamModal setHandleCloseModal={() => {
            setUseFace(false);
            setShowModal(false);
            setIsSigningIn(false);
        }} setvalidatePicture={handleLoginWithFace} />}
        {/*Auth Card Container*/}
        <div className="grid place-items-center mx-2 my-20 py-20">
            {/*Auth Card*/}
            <div className="w-11/12 p-12 sm:w-8/12 md:w-6/12 lg:w-5/12 2xl:w-4/12 
                px-6 py-10 sm:px-10 sm:py-6 
                bg-white rounded-lg shadow-md lg:shadow-lg">

                {/*Card Title*/}
                <h2 className="text-center font-semibold text-3xl lg:text-4xl text-gray-800">
                    Login
                </h2>

                <Formik
                    initialValues={{
                        email: '',
                        password: ''
                    }}
                    validate={values => {
                        const errors = {} as any;
                        if (!values.email) {
                            if (useFace) {
                                errors.email = 'Email is also required with face login';
                            } else {
                                errors.email = 'Required';
                            }
                        } else if (
                            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                        ) {
                            errors.email = 'Invalid email address';
                        }

                        if (!useFace && !values.password) {
                            errors.password = 'Required';
                        }

                        return errors;
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                        setSubmitting(true);
                        if (useFace) {
                            handleModalShow(values.email);
                        } else {
                            handleLoginWithPassword(values);
                        }
                        setSubmitting(false);
                    }}
                >
                    {({ isSubmitting, submitForm }) =>

                        <Form id="login-form" className="mt-10">
                            {/*Email Input*/}
                            <label htmlFor="email" className="block text-xs font-semibold text-gray-600 uppercase">E-mail</label>
                            <Field type="email" name="email" placeholder="exmaple@example.test" className="block w-full py-2 px-1 text-gray-800 appearance-none border-b-2 border-gray-100 focus:text-gray-500 focus:outline-none focus:border-gray-200" />
                            <ErrorMessage name="email" component="div" className="text-red-700 text-sm pt-2 pb-5" />

                            {/*Password Input*/}
                            <label htmlFor="password" className="block mt-5 text-xs font-semibold text-gray-600 uppercase">Password</label>
                            <Field type="password" name="password" placeholder="***********" className="block w-full py-2 px-1 text-gray-800 appearance-none border-b-2 border-gray-100 focus:text-gray-500 focus:outline-none focus:border-gray-200" />
                            <ErrorMessage name="password" component="div" className="text-red-700 text-sm pt-2 pb-5" />

                            {/*Auth Buttton*/}
                            <button disabled={isSubmitting || isSigningIn} type="submit" className="w-full py-3 mt-10 bg-gray-800 rounded-sm
                        font-medium text-white uppercase
                        focus:outline-none hover:bg-gray-700 hover:shadow-none flex items-center justify-center" id="login-btn">
                                {(!useFace && isSigningIn) && <div className="animate-spin rounded-full mr-3 h-4 w-4 border-b-2 border-white-900"></div>}
                                Login with password
                            </button>
                            <p className="text-center uppercase text-gray-500 font-bold py-5">- OR -</p>
                            {/*Auth Buttton*/}
                            <button onClick={() => {
                                setUseFace(true);
                                submitForm();
                            }} disabled={isSubmitting || isSigningIn} type="submit" className="w-full py-3 bg-red-600 rounded-sm
                        font-medium text-white uppercase
                        focus:outline-none hover:bg-red-500 hover:shadow-none flex items-center justify-center" id="login-btn">
                                {(useFace && isSigningIn) && <div className="animate-spin rounded-full mr-3 h-4 w-4 border-b-2 border-white-900"></div>}
                                Login with face
                            </button>

                            {/*Another Auth Routes*/}
                            <div className="flex justify-center mt-8 sm:mb-4 text-sm text-center">
                                <Link to="/signup" className="flex-2 underline">
                                    Create an account
                                </Link>
                            </div>
                        </Form>}
                </Formik>
            </div>
        </div>
    </div>;
}

export default Login;
