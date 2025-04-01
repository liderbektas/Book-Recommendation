import { View, Text, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import { useAuth } from '../store/hooks/hooks';
import { setLogout } from '../store/auth/actions';
import styles from '../assets/styles/profile.styles';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';

export default function LogoutButton() {
  const confirmLogout = () => {
    Alert.alert('Logout', 'Are you sure want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', onPress: () => setLogout(), style: 'destructive' },
    ]);
  };

  return (
    <TouchableOpacity onPress={confirmLogout} style={styles.logoutButton}>
      <Ionicons name='log-out-outline' size={20} color={COLORS.white} />
    </TouchableOpacity>
  );
}
