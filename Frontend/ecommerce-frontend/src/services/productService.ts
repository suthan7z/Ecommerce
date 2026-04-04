import axios from 'axios';

const API_URL = '/api/products';

export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
}

export const getProducts = async (filters: ProductFilters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.search)   params.append('search',   filters.search);
    if (filters.category) params.append('category', filters.category);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.sort)     params.append('sort',     filters.sort);

    const url = params.toString() ? `${API_URL}?${params.toString()}` : API_URL;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching products: ' + (error instanceof Error ? error.message : String(error)));
  }
};

export const getProductById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching product: ' + (error instanceof Error ? error.message : String(error)));
  }
};
