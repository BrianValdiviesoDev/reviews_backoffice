import axios from './axiosConfig';
import { PutRequest, Request, RequestStatus } from '../entities/request.entity';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const SCRAPPER_URL = process.env.NEXT_PUBLIC_SCRAPPER_URL;

export const findAllRequests = async (): Promise<Request[]> => {
  const response = await axios.get(`${API_URL}/requests`);
  return response.data;
};

export const removeRequest = async (id: string): Promise<void> => {
  const response = await axios.delete(`${API_URL}/requests/${id}`);
  return response.data;
};

export const cancelRequest = async (id: string): Promise<Request> => {
  const response = await axios.patch(`${API_URL}/requests/${id}/cancel`);
  return response.data;
};

export const duplicateRequest = async (request: Request): Promise<Request> => {
  const post = {
    url: request.url,
    productId: request.productId,
    type: request.type,
    status: RequestStatus.PENDING,
  };
  const response = await axios.post(`${API_URL}/requests`, post);
  return response.data;
};

export const stopScrapper = async (): Promise<void> => {
  const response = await axios.post(`${SCRAPPER_URL}/requests/stop`);
  return response.data;
};

export const startScrapper = async (): Promise<void> => {
  const response = await axios.post(`${SCRAPPER_URL}/requests/start`);
  return response.data;
};
