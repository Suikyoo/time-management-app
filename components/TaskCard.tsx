import {Task, useTaskIndex} from "@/lib/task/task";
import {timeStampAfter, timeStampToString} from "@/lib/time/time";
import {View, Text, Button} from "react-native";

interface Props {
  task: Task
}
export default function TaskCard({task}: Props) {
  const deleteTask = useTaskIndex( state => state.deleteTask );
  const press = () => {
    if (task.id) {
      deleteTask(task.id);
    }
  }
  return (
    <View style={{backgroundColor: task.color}}>
      <Text>{task.title}</Text>
      <Text>{task.description}</Text>
      {
        task.timestamp && task.duration ? <Text>{timeStampToString(task.timestamp)}-{timeStampToString(timeStampAfter(task.timestamp, task.duration))}</Text>: <Text></Text>
      }
      
      <Button title="delete" onPress={press} />
      

    </View>
  );
}
