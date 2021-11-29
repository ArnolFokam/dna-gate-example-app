import { useContext, useEffect, useState } from "react";
import { Field, Form, Formik, ErrorMessage } from 'formik';
import { useAppDispatch, useAppSelector } from "../config/store";
import { Link, Redirect, useHistory, useLocation } from "react-router-dom";
import NotyfContext from "../config/NotyfContext";
import { handleRegister, reset } from "../reducers/register.reducer";
import WebcamModal from "../components/WebcamModal";

const SignUp = (props: any) => {
    const dispatch = useAppDispatch();
    const notyf = useContext(NotyfContext);

    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
    const successMessage = useAppSelector(state => state.register.successMessage);
    const errorMessage = useAppSelector(state => state.register.errorMessage);
    const registrationSuccess = useAppSelector(state => state.register.registrationSuccess);
    const loading = useAppSelector(state => state.register.loading);

    const { push } = useHistory();

    useEffect(
        () => () => {
            dispatch(reset());
        },
        [dispatch]);

    useEffect(() => {
        if (successMessage) {
            notyf.success(successMessage);
        }
        // eslint-disable-next-line
    }, [successMessage]);

    useEffect(() => {
        if (registrationSuccess) {
            push("/login");
        } else if (errorMessage) {
            notyf.error(errorMessage);
        }
    }, [registrationSuccess, errorMessage, push, notyf]);

    const setValidatePicture = async (image: any) => {
        setShowModal(false);
        await dispatch(handleRegister({
            name,
            email,
            password,
            image
        }));
    };

    const handleValidSubmit = ({
        name,
        email,
        password
    }: any) => {
        setName(name);
        setEmail(email);
        setPassword(password);
        setShowModal(true);
    }

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
        {showModal && <WebcamModal setHandleCloseModal={() => setShowModal(false)} setvalidatePicture={setValidatePicture} />}
        {/*Auth Card Container*/}
        <div className="grid place-items-center mx-2 my-20 py-20">
            {/*Auth Card*/}
            <div className="w-11/12 p-12 sm:w-8/12 md:w-6/12 lg:w-5/12 2xl:w-4/12 
                px-6 py-10 sm:px-10 sm:py-6 
                bg-white rounded-lg shadow-md lg:shadow-lg">

                {/*Card Title*/}
                <h2 className="text-center font-semibold text-3xl lg:text-4xl text-gray-800">
                    SignUp
                </h2>

                <Formik
                    initialValues={{
                        name: '',
                        email: '',
                        password: ''
                    }}
                    validate={values => {
                        const errors = {} as any;
                        if (!values.email) {
                            errors.email = 'Required';
                        } else if (
                            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                        ) {
                            errors.email = 'Invalid email address';
                        }

                        if (!values.name) {
                            errors.name = 'Required';
                        } else if (
                            !/^[a-zA-Z'-]+$/i.test(values.name)
                        ) {
                            errors.name = 'Should be a valid first name';
                        }

                        if (!values.password) {
                            errors.password = 'Required';
                        }

                        return errors;
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                        handleValidSubmit(values);
                        setSubmitting(false);
                    }}
                >
                    {({ isSubmitting }) =>

                        <Form id="signUp-form" className="mt-10">
                            {/*Name Input*/}
                            <label htmlFor="name" className="block text-xs font-semibold text-gray-600 uppercase">First Name</label>
                            <Field type="name" name="name" placeholder="John" className="block w-full py-2 px-1 text-gray-800 appearance-none border-b-2 border-gray-100 focus:text-gray-500 focus:outline-none focus:border-gray-200" />
                            <ErrorMessage name="name" component="div" className="text-red-700 text-sm pt-2 pb-5" />

                            {/*Email Input*/}
                            <label htmlFor="email" className="block text-xs mt-5 font-semibold text-gray-600 uppercase">E-mail</label>
                            <Field type="email" name="email" placeholder="exmaple@example.test" className="block w-full py-2 px-1 text-gray-800 appearance-none border-b-2 border-gray-100 focus:text-gray-500 focus:outline-none focus:border-gray-200" />
                            <ErrorMessage name="email" component="div" className="text-red-700 text-sm pt-2 pb-5" />

                            {/*Password Input*/}
                            <label htmlFor="password" className="block text-xs  mt-5 font-semibold text-gray-600 uppercase">Password</label>
                            <Field type="password" name="password" placeholder="***********" className="block w-full py-2 px-1 text-gray-800 appearance-none border-b-2 border-gray-100 focus:text-gray-500 focus:outline-none focus:border-gray-200" />
                            <ErrorMessage name="password" component="div" className="text-red-700 text-sm pt-2 pb-5" />

                            {/*Auth Buttton*/}
                            <button disabled={isSubmitting || loading} type="submit" className="w-full py-3 mt-10 bg-gray-800 rounded-sm
                        font-medium text-white uppercase 
                        focus:outline-none hover:bg-gray-700 hover:shadow-none flex items-center justify-center" id="signUp-btn">
                                {loading && <div className="animate-spin rounded-full mr-3 h-4 w-4 border-b-2 border-white-900"></div>}
                                signUp
                            </button>

                            {/*Another Auth Routes*/}
                            {/*Another Auth Routes*/}
                            <div className="flex justify-center mt-8 sm:mb-4 text-sm text-center">
                                <Link to="/login" className="flex-2 underline">
                                    Already have an account?
                                </Link>
                            </div>
                        </Form>}
                </Formik>
            </div>
        </div>
    </div>;
}

export default SignUp;
