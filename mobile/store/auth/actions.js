import store from '../store';
import { _setCheckAuth, _setUser, _setLogout } from './slice';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const setRegister = async (data) => {
  try {
    store.dispatch(_setUser({ user: data.user, token: data.token }));
    await AsyncStorage.setItem('user', JSON.stringify(data.user));
    await AsyncStorage.setItem('token', JSON.stringify(data.token));
  } catch (error) {
    console.error('AsyncStorage error:', error);
  }
};

export const setLogin = async (data) => {
  try {
    store.dispatch(_setUser({ user: data.user, token: data.token }));
    await AsyncStorage.setItem('user', JSON.stringify(data.user));
    await AsyncStorage.setItem('token', JSON.stringify(data.token));
  } catch (error) {
    console.error('AsyncStorage error:', error);
  }
};

export const setLogout = async () => {
  try {
    store.dispatch(_setLogout());
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('token');
  } catch (error) {
    console.error('Logout error', error);
  }
};
