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
