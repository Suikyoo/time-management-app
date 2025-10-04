import { useTaskIndex, useTaskTarget } from "@/lib/task/task";
import {Link} from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";

export default function TaskPalette() {
  //this is the task index, which are the created tasks that you then use for the taskList
  const tasks = useTaskIndex(state => state.tasks);
  let currTask = useTaskTarget(state => state.task);
  const setTask = useTaskTarget(state => state.setTask);

  const styles = StyleSheet.create({
    circle: {
      width: 20,
      height: 20,
      borderRadius: 10,
    }
  });

  return (
    <View>
    <FlatList 
    data={tasks} 
    renderItem={t => (
      <TouchableOpacity key={t.item.id} onPressOut={() => setTask(t.item)}>
      <View style={[styles.circle, {backgroundColor: t.item.color}]}></View>
      </TouchableOpacity>
    )}
    />
    <Link href={"/(modals)/tasks"}>
      <View style={styles.circle}>
        <Text>+</Text>
      </View>
    </Link>

    </View>
  )
}
