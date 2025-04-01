import { View, Text } from 'react-native';
import { useAuth } from '../store/hooks/hooks';
import styles from '../assets/styles/profile.styles';
import dayjs from 'dayjs';
import { Image } from 'expo-image';

export default function ProfileHeader() {
  const { user } = useAuth();

  return (
    <View style={styles.profileHeader}>
      <Image source={user?.profileImage} style={styles.profileImage} />
      <View style={styles.profileInfo}>
        <Text style={styles.username}>{user?.username}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.memberSince}>
          Joined {dayjs(user?.createdAt).format('DD MMMM YYYY HH:mm')}
        </Text>
      </View>
    </View>
  );
}
