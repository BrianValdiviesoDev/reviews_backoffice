import axios from './axiosConfig';
import { PutRequest, Request } from '../entities/request.entity';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const findAllRequests = async (): Promise<Request[]> => {
  const response = await axios.get(`${API_URL}/requests`);
  return response.data;
};

export const removeRequest = async (id: string): Promise<void> => {
  const response = await axios.delete(`${API_URL}/requests/${id}`);
  return response.data;
}

export const cancelRequest = async (id: string): Promise<Request> => {
  const response = await axios.patch(`${API_URL}/requests/${id}/cancel`);
  return response.data;
}
