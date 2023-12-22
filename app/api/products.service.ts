import axios from './axiosConfig';
import { PostProduct, Product } from '../entities/product.entity';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getAllProducts = async (): Promise<Product[]> => {
  const response = await axios.get(`${API_URL}/products`);
  return response.data;
};

export const getProduct = async (id: string): Promise<Product> => {
  const response = await axios.get(`${API_URL}/products/${id}`);
  return response.data;
};

export const createProduct = async (product: PostProduct): Promise<Product> => {
  const response = await axios.post(`${API_URL}/products`, product);
  return response.data;
};

export const updateProduct = async (
  id: string,
  product: PostProduct,
): Promise<Product> => {
  const response = await axios.put(`${API_URL}/products/${id}`, product);
  return response.data;
};

export const verifyProduct = async (
  id: string,
  matchId: string,
): Promise<Product> => {
  const response = await axios.patch(`${API_URL}/products/${id}/verify`, {
    matchId,
  });
  return response.data;
};

export const checkProductMatches = async (
  id: string,
  matchesIds: string[],
): Promise<void> => {
  const response = await axios.post(
    `${API_URL}/queues/checkMatches/${id}`,
    matchesIds,
  );
  return response.data;
};
