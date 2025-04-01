import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import styles from '../../assets/styles/create.styles';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { router } from 'expo-router';
import { useAuth } from '../../store/hooks/hooks';

export default function Create() {
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [rating, setRating] = useState(3);
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [loading, setLoading] = useState(false);

  const { token } = useAuth();

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Galeri erişimine izin vermeniz gerekiyor');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled && result.assets.length > 0) {
        setImage(result.assets[0].uri);
        setImageBase64(result.assets[0].base64);
      }
    } catch (error) {
      console.log('Image error', error);
    }
  };

  const renderStarPicker = () => (
    <View style={styles.ratingContainer}>
      {[...Array(5)].map((_, i) => (
        <TouchableOpacity
          key={i}
          onPress={() => setRating(i + 1)}
          style={styles.starButton}
        >
          <Ionicons
            name={i + 1 <= rating ? 'star' : 'star-outline'}
            size={32}
            color={i + 1 <= rating ? '#f4b400' : COLORS.textSecondary}
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  const submitHandler = async () => {
    if (!title || !caption || !rating || !imageBase64) {
      Alert.alert('Error', 'Please fill all the blanks');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        'http://localhost:3001/api/books',
        {
          title,
          caption,
          rating,
          image: `data:image/jpeg;base64,${imageBase64}`,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data) {
        throw new Error('Something went wrong', response?.data?.error.message);
      }

      Alert.alert('Success', 'Your book recommendation has been posted!');
      setTitle('');
      setCaption('');
      setImage(null);
      setImageBase64(null);
      setRating(3);
      router.push('/');
    } catch (error) {
      console.log('Create book error:', error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        style={styles.scrollViewStyle}
      >
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Add Book Recommendation</Text>
            <Text style={styles.subtitle}>
              Share your favorite reads with others
            </Text>
          </View>
          <View style={styles.form}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Book Title</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name='book-outline'
                  size={20}
                  color={COLORS.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder='Enter book title'
                  placeholderTextColor={COLORS.placeholderText}
                  value={title}
                  onChangeText={setTitle}
                />
              </View>
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Your Rating</Text>
              {renderStarPicker()}
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Book Image</Text>
              <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {image ? (
                  <Image source={{ uri: image }} style={styles.previewImage} />
                ) : (
                  <View style={styles.placeholderContainer}>
                    <Ionicons
                      name='image-outline'
                      size={40}
                      color={COLORS.textSecondary}
                    />
                    <Text style={styles.placeholderText}>
                      Tap to select image
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Caption</Text>
              <TextInput
                multiline
                onChangeText={setCaption}
                value={caption}
                placeholderTextColor={COLORS.placeholderText}
                style={styles.textArea}
                placeholder='Write your review or thoughts on this book...'
              />
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={submitHandler}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <>
                  <Ionicons
                    name='cloud-upload-outline'
                    size={20}
                    color={COLORS.white}
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.buttonText}>Share</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
