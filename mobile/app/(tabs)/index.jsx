import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Image } from 'expo-image';
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import styles from '../../assets/styles/home.styles';
import { useAuth } from '../../store/hooks/hooks';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import dayjs from 'dayjs';

export default function Home() {
  const { token } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchBooks = async (refresh = false) => {
    if (!hasMore && !refresh) return;
    try {
      if (refresh) setRefreshing(true);
      else setLoading(true);

      const { data } = await axios.get(
        `http://localhost:3001/api/books?page=${refresh ? 1 : page}&limit=2`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBooks(refresh ? data.books : [...books, ...data.books]);
      setPage(refresh ? 2 : page + 1);
      setHasMore(data.books.length > 0);
    } catch (error) {
      console.log(error?.response?.data?.message || 'Hata oluştu');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleRefresh = useCallback(() => {
    setHasMore(true);
    fetchBooks(true);
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.bookCard}>
      <View style={styles.bookHeader}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: item?.user?.profileImage }}
            style={styles.avatar}
          />
          <Text style={styles.username}>{item?.user?.username}</Text>
        </View>
      </View>

      <View style={styles.bookImageContainer}>
        <Image source={{ uri: item.image }} style={styles.bookImage} />
      </View>

      <View style={styles.bookDetails}>
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
        <Text style={styles.caption}>{item.caption}</Text>
        <Text style={styles.date}>
          {dayjs(item.createdAt).format('DD MMMM YYYY HH:mm')}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onEndReached={() => fetchBooks()}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>LZ.</Text>
            <Text style={styles.headerSubtitle}>
              Discover great reads from the community
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={COLORS.primary} />
        }
        ListFooterComponent={() =>
          loading && (
            <ActivityIndicator size='large' color={COLORS.textSecondary} />
          )
        }
      />
    </View>
  );
}
