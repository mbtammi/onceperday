import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font'; // Import expo-font for loading fonts
import styles from './styles'; // Import your styles from external file

type Habit = {
  id: number;
  text: string;
  isChecked: boolean;
};

const Index = () => {
  const [habit, setHabit] = useState<string>(''); // habit input state
  const [habits, setHabits] = useState<Habit[]>([]); // habit list state
  const [clickedHabit, setClickedHabit] = useState<number | null>(null); // state to track clicked habit
  const [fontsLoaded, setFontsLoaded] = useState(false); // State for font loading

  // Load custom fonts
  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'SpaceMono-Regular': require('./assets/fonts/SpaceMono-Regular.ttf'),
        'SpaceMono-Bold': require('./assets/fonts/SpaceMono-Bold.ttf'),
        'SpaceMono-Italic': require('./assets/fonts/SpaceMono-Italic.ttf'),
        'SpaceMono-BoldItalic': require('./assets/fonts/SpaceMono-BoldItalic.ttf'),
      });
      setFontsLoaded(true);
    };

    loadFonts();
  }, []);

  // Load habits from AsyncStorage when the app starts
  useEffect(() => {
    const loadHabits = async () => {
      try {
        const storedHabits = await AsyncStorage.getItem('habits');
        if (storedHabits) {
          setHabits(JSON.parse(storedHabits)); // Parse and set the habits
        }
      } catch (error) {
        console.error('Error loading habits from AsyncStorage', error);
      }
    };
    loadHabits();
  }, []);

  // Save habits to AsyncStorage whenever the `habits` state changes
  useEffect(() => {
    const saveHabits = async () => {
      try {
        await AsyncStorage.setItem('habits', JSON.stringify(habits)); // Save habits as a JSON string
      } catch (error) {
        console.error('Error saving habits to AsyncStorage', error);
      }
    };
    saveHabits();
  }, [habits]);

  // Add a habit
  const addHabit = () => {
    if (habit.trim()) {
      const newHabit: Habit = {
        id: Date.now(), // Unique ID for each habit
        text: habit,
        isChecked: false, // Default is unchecked
      };
      setHabits([...habits, newHabit]);
      setHabit('');
    }
  };

  // Handle habit click (for overlay and overline effect)
  const handleHabitClick = (id: number) => {
    if (clickedHabit === id) {
      setClickedHabit(null); // If clicked again, remove the effect
    } else {
      setClickedHabit(id); // Apply the effect to clicked habit
    }
  };

  // Handle long press on habit to ask for confirmation before deletion
  const handleLongPress = (id: number) => {
    Alert.alert('Delete Habit', 'Are you sure you want to delete this habit?', [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: () => deleteHabit(id),
        style: 'destructive',
      },
    ]);
  };

  // Delete a habit
  const deleteHabit = (id: number) => {
    setHabits(habits.filter((habit) => habit.id !== id));
  };

  // Render loading indicator until fonts are loaded
  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { fontFamily: 'SpaceMono-Bold' }]}>Once a Day</Text>
      <Text style={{ fontFamily: 'SpaceMono-Regular', paddingBottom: 25 }}>
        More features coming! For suggestions contact mirotammi44@gmail.com
      </Text>

      {/* Text input for new habit and add button */}
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { fontFamily: 'SpaceMono-Regular' }]}
          value={habit}
          onChangeText={setHabit}
          placeholder="Enter a new habit"
        />
        <TouchableOpacity onPress={addHabit} style={styles.addButton}>
          <Text style={[styles.buttonText, { fontFamily: 'SpaceMono-Bold' }]}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* FlatList to display habits */}
      <FlatList
        data={habits}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleHabitClick(item.id)} // Handle click on habit
            onLongPress={() => handleLongPress(item.id)} // Handle long press to delete
            style={[
              styles.habitContainer,
              clickedHabit === item.id && styles.clickedHabit, // Apply styles for clicked habit
            ]}
          >
            {/* Habit text */}
            <Text
              style={[
                styles.habitText,
                { fontFamily: clickedHabit === item.id ? 'SpaceMono-Italic' : 'SpaceMono-Regular' },
                clickedHabit === item.id && styles.overlinedText,
              ]}
            >
              {item.text}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default Index;
