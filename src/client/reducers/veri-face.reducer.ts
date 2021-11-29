import axios, { AxiosError } from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { serializeAxiosError } from './utils';


const initialState = {
    loading: false,
    requestFailure: false,
    requestSuccess: false,
    errorMessage: null as unknown as string,
    successMessage: null as unknown as string,
};

export type RegisterState = Readonly<typeof initialState>;

// Actions

export const checkMatch = createAsyncThunk(
    'veri_face/check_match',
    async (image: string) => await axios.post<any>('/api/auth/check/face/', {
        image,
    }),
    { serializeError: serializeAxiosError }
);

export const RegisterSlice = createSlice({
    name: 'register',
    initialState: initialState,
    reducers: {
        reset() {
            return initialState;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(checkMatch.pending, (state, action) => {
                state.loading = true;
                state.requestFailure = false;
                state.requestSuccess = false;
            })
            .addCase(checkMatch.rejected, (state, action) => {
                return {
                    ...initialState,
                    requestFailure: true,
                    errorMessage: (action.error as AxiosError).response!.data.message || action.error.message!,
                }
            })
            .addCase(checkMatch.fulfilled, (state, action) => ({
                ...initialState,
                requestSuccess: true,
                successMessage: 'Successful match!',
            }));
    },
});

export const { reset } = RegisterSlice.actions;

// Reducer
export default RegisterSlice.reducer;
