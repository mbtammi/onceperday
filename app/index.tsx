import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';
import styles from './styles'; // Import the styles from the external file

type Habit = {
  id: number;
  text: string;
  isChecked: boolean;
};

const index = () => {
  const [habit, setHabit] = useState<string>(''); // habit input state
  const [habits, setHabits] = useState<Habit[]>([]); // habit list state
  const [clickedHabit, setClickedHabit] = useState<number | null>(null); // state to track clicked habit

  // Add a habit
  const addHabit = () => {
    if (habit.trim()) {
      const newHabit: Habit = {
        id: Date.now(), // Unique ID for each habit
        text: habit,
        isChecked: false,  // Default is unchecked
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
    console.log("jeeess")
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
    setHabits(habits.filter(habit => habit.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Once a Day fuc thiss</Text>
      <Text style={{ fontFamily: "SpaceMono-Regular", paddingBlockEnd: 25, }}>More features coming! For suggestions contact mirotammi44@gmail.com</Text>
      

      {/* Button section at the top */}


      {/* Text input for new habit and check icon */}
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
        {/* <TouchableOpacity onPress={addHabit}>
          <Icon name="add" size={30} color="#4CAF50" style={styles.checkIcon} />
        </TouchableOpacity> */}
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

export default index;