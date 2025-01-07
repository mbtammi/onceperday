import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: "SpaceMono-Bold",
  },
  buttonSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',  // Align the input and the checkmark icon horizontally
    alignItems: 'center',
    marginBottom: 16,
    width: '100%', // Ensure it takes full width
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 8,
    borderRadius: 4,
    flex: 1, // Make the TextInput take the remaining space
  },
  checkIcon: {
    marginLeft: 20, // Space between TextInput and checkmark icon
  },
  habitContainer: {
    backgroundColor: '#fff',
    marginBottom: 10,
    padding: 10,
    borderRadius: 4,
    flexDirection: 'row', // This makes the items align horizontally
    alignItems: 'center',  // Center the text vertically
    justifyContent: 'flex-start', // Align items to the left
  },
  habitText: {
    fontSize: 16,
    flexShrink: 1, // Ensures the text shrinks if it overflows
    marginRight: 10, // Adds space between the text and checkbox
    maxWidth: '80%', // Limits the width of the text
    fontFamily: "SpaceMono-Regular",
  },
  addButton: {
    backgroundColor: '#FFD60A',
    padding: 9,
    borderRadius: 4,
    alignItems: 'center',  // Aligns children horizontally
    justifyContent: 'center',  // Centers the content vertically
    marginLeft: 20,
  },  
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: "SpaceMono-Regular",
    textAlign: 'center',  // Centers the text inside the button
  },
  clickedHabit: {
    backgroundColor: '#d3d3d3', // Grey overlay when clicked
  },
  overlinedText: {
    textDecorationLine: 'line-through', // Apply overline effect when clicked
  },
});

export default styles;