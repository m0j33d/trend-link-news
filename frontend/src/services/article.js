import api from './api';
import { store } from "../redux/store";


export const getArticles = async ({ keyword, sources, categories, from, to }) => {
    try {
        const token = store.getState().user_token;
        const params = new URLSearchParams({
          ...(keyword && { keyword }),
          ...(sources && sources.length && { sources }),
          ...(categories && categories.length && { categories }),
          ...(from && { from }),
          ...(to && { to })
        });

        const response = await api.get(`/fetch?${params.toString()}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.log(error)
    }
};

export const getArticlesFilter = async ({ keyword, sources, from, to }) => {
    try {
        const token = store.getState().user_token;
        const params = new URLSearchParams({
            ...(keyword && { keyword }),
            ...(sources && sources.length && { sources }),
            ...(from && { from }),
            ...(to && { to })
          });

        const response = await api.get(`/fetch?${params.toString()}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.log(error)
    }
};

export const getCachedArticles = async (page) => {
    try {
        const token = store.getState().user_token;

        const response = await api.get(`/fetch_cached_articles?page=${page ?? 1}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.log(error)
    }
};
