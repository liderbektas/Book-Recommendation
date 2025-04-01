import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useAuth } from '../../store/hooks/hooks';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';
import styles from '../../assets/styles/profile.styles';
import ProfileHeader from '../../components/ProfileHeader';
import LogoutButton from '../../components/LogoutButton';
import BookRecomandation from '../../components/BookRecomandation';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';

export default function Profile() {
  const { user, token } = useAuth();
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const fetchBooksByUser = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`http://localhost:3001/api/books/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks(data.books);
    } catch (error) {
      console.log(error?.response?.data?.message || 'Error fetching books');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooksByUser();
  }, []);

  return (
    <View style={styles.container}>
      <ProfileHeader />
      <LogoutButton />

      <View style={styles.booksHeader}>
        <Text style={styles.bookTitle}>Your Recommendations</Text>
        <Text style={styles.booksCount}>{books?.length} books</Text>
      </View>

      <FlatList
        data={books}
        renderItem={({ item }) => (
          <BookRecomandation item={item} books={books} setBooks={setBooks} />
        )}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.booksList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name='book-outline' size={50} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>No recommendations yet</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push('/create')}
            >
              <Text style={styles.addButtonText}>Add Your First Book</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}