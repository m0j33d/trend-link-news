import api from './api';
import { showAlert } from "../utils/utils";
import { store } from "../redux/store";


export const updateUser = async (data) => {
    try {
        const token = store.getState().user_token;
        const user_id = store.getState().user.id;

        const response = await api.put(`/user/${user_id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data.status === true)
            showAlert({
                msg: response.data.message,
                type: "success",
            });

        return response.data;
    } catch (error) {
        showAlert({
            msg: error.response.data.message,
            type: "danger",
        });
        throw new Error('Failed to update user');
    }
};

export const updateUserPrefeerrences = async (data) => {
    try {
        const token = store.getState().user_token;

        const response = await api.post('/user_preference', data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data.status === true)
            showAlert({
                msg: response.data.message,
                type: "success",
            });

        return response.data;
    } catch (error) {
        showAlert({
            msg: error.response.data.message,
            type: "danger",
        });
        throw new Error('Failed to update user');
    }
};
