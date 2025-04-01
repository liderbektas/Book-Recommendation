import axios from 'axios';
import { setLogin, setRegister } from './actions';
import { Alert } from 'react-native';

export const signupAPI = async (username, email, password) => {
  try {
    const { data } = await axios.post(
      'http://localhost:3001/api/auth/register',
      { username, email, password }
    );
    setRegister(data);
    return data;
  } catch (error) {
    if (error.response) {
      Alert.alert('Hata', error.response.data.message);
      throw error;
    }
  }
};

export const loginAPI = async (email, password) => {
  try {
    const { data } = await axios.post(
      'http://localhost:3001/api/auth/login',
      { email, password }
    );
    setLogin(data);
    return data;
  } catch (error) {
    if (error.response) {
      Alert.alert('Hata', error.response.data.message);
      throw error;
    }
  }
};
