import axios from '@/configs/axios-customize';
import { IBackendRes, IAccount } from '@/types/backend';

export const callLogin = (username: string, password: string) => {
    return axios.post<IBackendRes<IAccount>>('/api/v1/auth/login', { username, password });
}