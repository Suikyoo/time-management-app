import {StyleSheet} from "react-native";

export const styles = StyleSheet.create({
  shadow: {
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,

    // Android shadow
    elevation: 5,

  }
})
