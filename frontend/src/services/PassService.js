import api from './api';

export const generatePassToken = async () => {
  const response = await api.post('/pass/tokens');
  return response.data;
};
