import api from './api';
import {
    LOGIN_USER,
    SET_LOGGED_IN,
    SET_USER,
    RESET
} from "../redux/types";
import { showAlert } from "../utils/utils";
import { store } from "../redux/store";



export const login = async ({ email, password }) => {
    try {
        const response = await api.post('/login', { email, password });
        const { token } = response.data;
        if (response.data.status)
            store.dispatch({
                type: LOGIN_USER,
                payload: token,
            });
        return response.data
    } catch (error) {
        showAlert({
            msg: error.response.data.message,
            type: "danger",
        });

        throw new Error('Login failed');
    }
};

export const register = async ({ name, email, password }) => {

    try {
        const response = await api.post('/register', { name, email, password });
        const { token } = response.data;

        if (response.data.status === true)
            store.dispatch({
                type: LOGIN_USER,
                payload: token,
            });
        return response.data

    } catch (error) {
        showAlert({
            msg: error.response.data.message,
            type: "danger",
        });

        throw new Error('Registration failed');
    }
};

export const logout = async () => {
    try {
        const token = store.getState().user_token;
        const response = await api.post('/logout', null ,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        store.dispatch({
            type: RESET,
        });

        return response.data

    } catch (error) {
        showAlert({
            msg: error.response.data.message,
            type: "danger",
        });

    }
};

export const getAuthenticatedUser = async () => {
    try {
        const token = store.getState().user_token;
        const response = await api.get('/user', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data.status === true)
            store.dispatch({
                type: SET_USER,
                payload: response.data?.data,
            });

        return response.data;
    } catch (error) {
        store.dispatch({
            type: SET_LOGGED_IN,
            payload: false,
        });
    }
};

export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
};

export const forgotPassword = async ({ email }) => {
    try {
        const response = await api.post('/forgot-password', { email });

        if (response.data.status === true)
            showAlert({
                msg: response.data.message,
                type: "success",
            });

    } catch (error) {
        showAlert({
            msg: error.response.data.message,
            type: "danger",
        });

        throw new Error('Forgot password failed');
    }
};

export const resetPassword = async (data) => {
    try {
        const response = await api.post('/reset-password', data);

        if (response.data.status === true)
            showAlert({
                msg: response.data.message,
                type: "success",
            });

    } catch (error) {
        showAlert({
            msg: error.response.data.message,
            type: "danger",
        });

        throw new Error('Forgot password failed');
    }
};

export const resendVerificationMail = async (data) => {
    try {
        const token = store.getState().user_token;
        const response = await api.post('/email/verification-notification', data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;

    } catch (error) {
        console.log(error)
        showAlert({
            msg: error.response.data.message,
            type: "danger",
        });
    }
};
