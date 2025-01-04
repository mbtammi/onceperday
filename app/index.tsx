import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import styles from './styles'; // Import the styles from the external file
import * as Notifications from 'expo-notifications';

type Habit = {
  id: number;
  text: string;
  isChecked: boolean;
};

// Request permission for notifications
const requestNotificationPermissions = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    console.log('Notification permissions not granted');
  }
};

// Set the notification handler to show an alert when the notification arrives
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const Index = () => {
  const [habit, setHabit] = useState<string>(''); // habit input state
  const [habits, setHabits] = useState<Habit[]>([]); // habit list state
  const [clickedHabit, setClickedHabit] = useState<number | null>(null); // state to track clicked habit

  // Request notification permissions when the app is loaded
  useEffect(() => {
    requestNotificationPermissions();
  }, []);

  // Load habits from AsyncStorage on app load
  useEffect(() => {
    const loadHabits = async () => {
      try {
        const storedHabits = await AsyncStorage.getItem('habits');
        if (storedHabits) {
          setHabits(JSON.parse(storedHabits)); // Parse and set habits
        }
      } catch (error) {
        console.log("Error loading habits from AsyncStorage", error);
      }
    };
    loadHabits();
  }, []);

  // Save habits to AsyncStorage whenever the habits list changes
  useEffect(() => {
    const saveHabits = async () => {
      try {
        await AsyncStorage.setItem('habits', JSON.stringify(habits)); // Convert habits to string and save
      } catch (error) {
        console.log("Error saving habits to AsyncStorage", error);
      }
    };
    if (habits.length > 0) {
      saveHabits();
    }
  }, [habits]);

  // Add a habit and trigger a notification
  const addHabit = async () => {
    if (habit.trim()) {
      const newHabit: Habit = {
        id: Date.now(), // Unique ID for each habit
        text: habit,
        isChecked: false,  // Default is unchecked
      };
      setHabits([...habits, newHabit]);
      setHabit('');

      // Show an in-app notification when a new habit is added
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'New Habit Added!',
          body: `You just added the habit: ${newHabit.text}`,
        },
        trigger: null, // Show immediately
      });
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
    Alert.alert(
      "Delete Habit",
      "Are you sure you want to delete this habit?",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => deleteHabit(id),
          style: "destructive",
        },
      ]
    );
  };

  // Delete a habit
  const deleteHabit = (id: number) => {
    const updatedHabits = habits.filter(habit => habit.id !== id);
    setHabits(updatedHabits); // Update the habits list
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Once a Day</Text>
      <Text style={{ fontFamily: "SpaceMono-Regular", paddingBlockEnd: 25, }}>More features coming! For suggestions contact mirotammi44@gmail.com</Text>
      
      {/* Text input for new habit and add button */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={habit}
          onChangeText={setHabit}
          placeholder="Enter a new habit"
        />
        <TouchableOpacity onPress={addHabit} style={styles.addButton}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* FlatList to display habits */}
      <FlatList
        data={habits}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleHabitClick(item.id)}  // Handle click on habit
            onLongPress={() => handleLongPress(item.id)}  // Handle long press to delete
            style={[styles.habitContainer, clickedHabit === item.id && styles.clickedHabit]} // Apply styles for clicked habit
          >
            {/* Habit text */}
            <Text style={[styles.habitText, clickedHabit === item.id && styles.overlinedText]}>
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
