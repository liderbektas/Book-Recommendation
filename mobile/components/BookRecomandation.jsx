import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import styles from '../assets/styles/profile.styles';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import COLORS from '../constants/colors';
import axios from 'axios';
import { useAuth } from '../store/hooks/hooks';

export default function BookRecomandation({ item, books, setBooks }) {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  const deleteBook = async (bookId) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:3001/api/books/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks(books.filter((book) => book._id !== bookId));
      Alert.alert('Success', 'Book deleted succesfully');
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (bookId) => {
    Alert.alert('Delete', 'Are you sure you want to delete?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteBook(bookId),
      },
    ]);
  };

  return (
    <View style={styles.bookItem}>
      <Image source={item.image} style={styles.bookImage} contentFit='cover' />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <View style={styles.ratingContainer}>
          {[...Array(5)].map((_, i) => (
            <Ionicons
              key={i}
              name={i + 1 <= item.rating ? 'star' : 'star-outline'}
              size={14}
              color={i + 1 <= item.rating ? '#f4b400' : COLORS.textSecondary}
            />
          ))}
        </View>
        <Text style={styles.bookCaption} numberOfLines={2}>
          {item.caption}
        </Text>
        <Text style={styles.bookDate}>
          {dayjs(item?.createdAt).format('DD MMMM YYYY HH:mm')}
        </Text>
      </View>

      <TouchableOpacity onPress={() => confirmDelete(item._id)}>
        {loading ? (
          <ActivityIndicator size='small' color={COLORS.primary} />
        ) : (
          <Ionicons name='trash-outline' size={20} color={COLORS.primary} />
        )}
      </TouchableOpacity>
    </View>
  );
}
