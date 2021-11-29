import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import axios, { AxiosError, AxiosResponse } from "axios";
import { AppThunk } from "..//config/store";
import { serializeAxiosError } from "./utils";
import { Storage } from "../helpers/storage";
import { AUTH_TOKEN_KEY } from "..//config/constants";

export const initialState = {
    loading: false,
    isAuthenticated: false,
    loginSuccess: false,
    loginError: false, // Errors returned from server side
    account: {} as any,
    errorMessage: null as unknown as string, // Errors returned from server side
    redirectMessage: null as unknown as string,
    sessionHasBeenFetched: false,
    logoutUrl: null as unknown as string,
};

export type AuthenticationState = Readonly<typeof initialState>;

// Actions

export const getSession = (): AppThunk => (dispatch, getState) => {
    dispatch(getAccount());
};

export const getAccount = createAsyncThunk('authentication/get_account', async () => axios.get<any>('/api/users/me'), {
    serializeError: serializeAxiosError,
});

interface IAuthParams {
    username: string;
    password?: string;
    image?: string;
}

export const authenticateWithPassword = createAsyncThunk(
    'authentication/login_pass',
    async (auth: IAuthParams) => {
        return await axios.post<any>('/api/auth/signin/pass', {
            username: auth.username,
            password: auth.password
        }, {
            headers: {
                "Content-Type": "application/json"
            },
        })
    },
    {
        serializeError: serializeAxiosError,
    }
);

export const authenticateWithFace = createAsyncThunk(
    'authentication/login_face',
    async (auth: IAuthParams) => {
        return await axios.post<any>('/api/auth/signin/face', {
            username: auth.username,
            image: auth.image
        }, {
            headers: {
                "Content-Type": "application/json"
            },
        })
    },
    {
        serializeError: serializeAxiosError,
    }
);

export const login: (username: string, password?: string, image?: string) => AppThunk =
    (username, password, image) =>
        async dispatch => {
            let result = null;
            if (image) {
                result = await dispatch(authenticateWithFace({ username, image }));
            } else {
                result = await dispatch(authenticateWithPassword({ username, password }));
            }

            const response = result.payload as AxiosResponse;
            const data = response?.data;
            if (data && data["token_type"] === 'bearer') {
                const jwt = data["access_token"];
                Storage.session.set(AUTH_TOKEN_KEY, jwt);
                dispatch(getSession());
            }
        };

export const clearAuthToken = () => {
    Storage.session.remove(AUTH_TOKEN_KEY);
};

export const logout: () => AppThunk = () => dispatch => {
    clearAuthToken();
    dispatch(logoutSession());
};

export const clearAuthentication = (messageKey: any) => (dispatch: (arg0: { payload: any; type: string; }) => void) => {
    clearAuthToken();
    dispatch(authError(messageKey));
    dispatch(clearAuth());
};

export const AuthenticationSlice = createSlice({
    name: "authentication",
    initialState: initialState as AuthenticationState,
    reducers: {
        logoutSession(state) {
            return {
                ...initialState,
                sessionHasBeenFetched: state.sessionHasBeenFetched,
                showModalLogin: true,
            };
        },
        authError(state, action) {
            return {
                ...state,
                showModalLogin: true,
                redirectMessage: action.payload,
            };
        },
        clearAuth(state) {
            return {
                ...state,
                loading: false,
                showModalLogin: true,
                isAuthenticated: false,
            };
        },
    },
    extraReducers(builder) {
        builder
            .addCase(getAccount.rejected, (state, action) => ({
                ...state,
                loading: false,
                isAuthenticated: false,
                sessionHasBeenFetched: true,
                errorMessage: action.error.message!,
            }))
            .addCase(getAccount.fulfilled, (state, action) => {
                const isAuthenticated = action.payload!! && action.payload.data!!
                // for now, we will not implement account activation && action.payload.data.activated;
                return {
                    ...state,
                    isAuthenticated,
                    loading: false,
                    sessionHasBeenFetched: true,
                    account: action.payload.data,
                };
            })
            .addCase(getAccount.pending, state => {
                state.loading = true;
            })
            .addMatcher(isAnyOf(authenticateWithFace.rejected,
                authenticateWithPassword.rejected), (state, action) => ({
                    ...initialState,
                    errorMessage: (action.error as AxiosError).response!.data.message || action.error.message!,
                    showModalLogin: true,
                    loginError: true,
                }))
            .addMatcher(isAnyOf(authenticateWithFace.fulfilled,
                authenticateWithPassword.fulfilled), (state, action) => ({
                    ...state,
                    loading: false,
                    loginError: false,
                    loginSuccess: true,
                }))

            .addMatcher(isAnyOf(authenticateWithPassword.pending,
                authenticateWithFace.pending), state => {
                    state.loading = true;
                    state.loginError = false;
                    state.loginSuccess = false;
                });
    }
});

export const { logoutSession, authError, clearAuth } = AuthenticationSlice.actions;

// Reducer
export default AuthenticationSlice.reducer;