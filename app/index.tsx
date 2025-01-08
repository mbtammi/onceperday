import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font'; // Import expo-font for loading fonts
import styles from './styles'; // Import your styles from external file
import * as Notifications from 'expo-notifications';
import { StatusBar } from 'expo-status-bar';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

type Habit = {
  id: number;
  text: string;
  isChecked: boolean;
};

const Index = () => {
  const [habit, setHabit] = useState<string>(''); // habit input state
  const [habits, setHabits] = useState<Habit[]>([]); // habit list state
  const [fontsLoaded, setFontsLoaded] = useState(false); // State for font loading
  const [clickedHabits, setClickedHabits] = useState<number[]>([]); // Track multiple clicked habits


  // Load custom fonts
  useEffect(() => {
    const loadFonts = async () => {
      console.log("Attempting to load fonts...");

      try {
        await Font.loadAsync({
          'SpaceMono-Regular': require('./assets/fonts/SpaceMono-Regular.ttf'),
          'SpaceMono-Bold': require('./assets/fonts/SpaceMono-Bold.ttf'),
          'SpaceMono-Italic': require('./assets/fonts/SpaceMono-Italic.ttf'),
          'SpaceMono-BoldItalic': require('./assets/fonts/SpaceMono-BoldItalic.ttf'),
        });
        console.log("Fonts loaded successfully!");
        setFontsLoaded(true);
      } catch (error) {
        console.error("Error loading fonts:", error);
      }
    };

    loadFonts();
  }, []);

  useEffect(() => {
    // Function to reset clicked habits at midnight
    const resetHabitsAtMidnight = () => {
      const interval = setInterval(() => {
        const currentTime = new Date();
        if (currentTime.getHours() === 0 && currentTime.getMinutes() === 0) {
          console.log("Resetting habits at midnight...");
          setClickedHabits([]);
        }
      }, 60000); // Check every minute
  
      // Clean up the interval on component unmount
      return () => clearInterval(interval);
    };
  
    resetHabitsAtMidnight(); // Start the midnight check
  }, []);

  // Load habits from AsyncStorage when the app starts
  useEffect(() => {
    const loadHabits = async () => {
      console.log("Loading habits from AsyncStorage...");
      try {
        const storedHabits = await AsyncStorage.getItem('habits');
        if (storedHabits) {
          setHabits(JSON.parse(storedHabits)); // Parse and set the habits
          console.log("Habits loaded:", storedHabits);
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
      console.log("Saving habits to AsyncStorage...");
      try {
        await AsyncStorage.setItem('habits', JSON.stringify(habits)); // Save habits as a JSON string
        console.log("Habits saved:", habits);
      } catch (error) {
        console.error('Error saving habits to AsyncStorage', error);
      }
    };
    saveHabits();
  }, [habits]);

  // Request permissions for notifications and schedule daily notifications
  useEffect(() => {
    const setupNotifications = async () => {
      console.log("Requesting notification permissions...");
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissions not granted', 'Notification permissions are required to remind you daily.');
        return;
      }

      // Cancel any existing notifications to avoid duplicates
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log("Scheduling daily notifications...");

      // Schedule a daily notification at 8 PM
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '✅ Remember to check your daily habits!',
          body: 'Go open the app!',
          sound: false,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: 20, // 8 PM
          minute: 0,
        },
      });
    };

    setupNotifications();
  }, []);

  // Add a habit
  const addHabit = () => {
    console.log("Adding habit:", habit);
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
    console.log(`Toggling habit with ID: ${id}`);
    setClickedHabits((prevClickedHabits) => {
      // If the habit is already clicked, remove it from the array
      if (prevClickedHabits.includes(id)) {
        return prevClickedHabits.filter((habitId) => habitId !== id);
      } else {
        // Otherwise, add it to the array
        return [...prevClickedHabits, id];
      }
    });
  };

  // Handle long press on habit to ask for confirmation before deletion
  const handleLongPress = (id: number) => {
    console.log(`Long press detected on habit with ID: ${id}`);
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
    console.log(`Deleting habit with ID: ${id}`);
    setHabits(habits.filter((habit) => habit.id !== id));
  };

  // Render loading indicator until fonts are loaded
  if (!fontsLoaded) {
    console.log("Fonts not loaded yet, showing loading indicator...");
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  console.log("Rendering app with loaded fonts...");

  return (
    <View style={styles.container}>
      <StatusBar style="dark" hidden />
      <Text style={[styles.title, { fontFamily: 'SpaceMono-Bold' }]}>Once a Day</Text>
      <Text style={{ fontFamily: 'SpaceMono-Regular', paddingBottom: 25 }}>
        This is the simplest habit tracker. Tap to complete Habit and Hold to detele. More features coming in the future! For suggestions contact mirotammi44@gmail.com
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
              clickedHabits.includes(item.id) && styles.clickedHabit, // Apply styles for clicked habit
            ]}
          >
            {/* Habit text */}
            <Text
              style={[
                styles.habitText,
                {
                  fontFamily: clickedHabits.includes(item.id)
                    ? 'SpaceMono-Italic'
                    : 'SpaceMono-Regular',
                },
                clickedHabits.includes(item.id) && styles.overlinedText,
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
