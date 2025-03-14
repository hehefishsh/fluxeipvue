import axios from 'axios';

const API_URL = 'http://localhost:8080/api/bulletins';

export const getBulletins = () => axios.get(API_URL);
export const getBulletinById = (id) => axios.get(`${API_URL}/${id}`);
export const createBulletin = (data) => axios.post(API_URL, data);
export const updateBulletin = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteBulletin = (id) => axios.delete(`${API_URL}/${id}`);
