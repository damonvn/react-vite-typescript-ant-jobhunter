import axiosClient from "axios";
import { Mutex } from "async-mutex";
import { IBackendRes } from "@/types/backend";
import { store } from "@/redux/store";
import { setRefreshTokenAction } from "@/redux/slices/accountSlide";
import { notification } from "antd";

interface AccessTokenResponse {
    access_token: string;
}

const mutex = new Mutex();
const NO_RETRY_HEADER = 'x-no-retry';
const NO_RETRY_HEADER_400 = 'x-no-retry-400';

const handleRefreshToken = async (): Promise<string | null> => {
    return await mutex.runExclusive(async () => {
        const res = await instance.get<IBackendRes<AccessTokenResponse>>('/api/v1/auth/refresh');
        if (res.data && res.data.data) return res.data.data.access_token;
        else return null;
    });
};

/**
 * Creates an initial 'axios' instance with custom settings.
 */
const instance = axiosClient.create({
    baseURL: import.meta.env.VITE_BACKEND_URL as string,
    withCredentials: true
});


instance.interceptors.request.use(function (config) {
    if (typeof window !== "undefined" && window && window.localStorage && window.localStorage.getItem('access_token')) {
        config.headers.Authorization = 'Bearer ' + window.localStorage.getItem('access_token');
    }
    if (!config.headers.Accept && config.headers["Content-Type"]) {
        config.headers.Accept = "application/json";
        config.headers["Content-Type"] = "application/json; charset=utf-8";
    }
    return config;
});

/**
 * Handle all responses. It is possible to add handlers
 * for requests, but it is omitted here for brevity.
 */
instance.interceptors.response.use(
    (res) => res,
    async (error) => {
        if (error.config && error.response
            && +error.response.status === 401
            && error.config.url !== '/api/v1/auth/login'
            && !error.config.headers[NO_RETRY_HEADER]
        ) {
            localStorage.removeItem('access_token');
            error.config.headers[NO_RETRY_HEADER] = true;
            const access_token = await handleRefreshToken();
            if (access_token) {
                error.config.headers['Authorization'] = `Bearer ${access_token}`;
                localStorage.setItem('access_token', access_token)
                return instance.request(error.config);
            }
        }

        if (
            error.config && error.response
            && +error.response.status === 400
            && error.config.url === '/api/v1/auth/refresh'
            && location.pathname.startsWith("/admin")
        ) {
            error.config.handlers[NO_RETRY_HEADER_400] = true;
            const message = error?.response?.data?.error ?? "Có lỗi xảy ra, vui lòng login.";
            //dispatch redux action
            store.dispatch(setRefreshTokenAction({ status: true, message }));
        }

        if (+error.response.status === 403) {
            notification.error({
                message: error?.response?.data?.message ?? "",
                description: error?.response?.data?.error ?? ""
            })
        }
        return error?.response?.data ?? Promise.reject(error);
    }
);

export default instance;