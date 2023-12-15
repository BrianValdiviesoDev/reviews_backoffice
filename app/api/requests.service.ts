import axios from './axiosConfig';
import { Request } from '../entities/request.entity';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const findAllRequests = async (): Promise<Request[]> => {
  const response = await axios.get(`${API_URL}/requests`);
  return response.data;
};
