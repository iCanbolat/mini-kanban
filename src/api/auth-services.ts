import axios from 'axios';
import { createUserSchema, loginSchema } from '../types/validation';
import { z } from 'zod';
import { ApiResponseType } from '../types/api';
import { IUser } from '../types/user';

export const BASE_URL = 'http://localhost:5000/';
export const axiosInstance = axios.create({ baseURL: BASE_URL });

export const login = ({
  email,
  password,
}: z.infer<typeof loginSchema>): Promise<ApiResponseType<IUser>> => {
  return axiosInstance
    .get('users', {
      params: {
        email,
        password,
      },
    })
    .then((response) => {
      if (response.data.length < 1) {
        return { success: false, message: 'Invalid credentials.' };
      }
      return { success: true, data: response.data[0] };
    });
};

export const register = async ({
  email,
  name,
  role,
  password,
}: z.infer<typeof createUserSchema>) :Promise<ApiResponseType> => {
  try {
    const checkUserExists = (
      await axiosInstance.get('users', { params: { email } })
    ).data;
    console.log(checkUserExists);

    if (checkUserExists.length > 0)
      return { success: false, message: 'User already exists!' };

    await axiosInstance.post('users', { email, password, role, name });

    return { success: true, message: 'User has created!' };
  } catch (error) {
    return { success: false, message: 'User has error created!', error };
  }
};

const authService = {
  login,
  register,
};

export default authService;
