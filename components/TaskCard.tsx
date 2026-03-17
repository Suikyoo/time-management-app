import {Task, TaskTemplate} from "@/lib/task/task";
import {timeStampAfter, timeStampToString} from "@/lib/time/time";
import {ThemedButton, ThemedText, ThemedView} from "./ThemedComponents";

interface Props {
  task: TaskTemplate;
  className?: string; 
  opaque?: boolean;
  onDelete?: () => Promise<void>
}
export default function TaskCard({task, className, onDelete, opaque}: Props) {
  const defaultStyle = "flex flex-row justify-between items-center box-border px-7"
  return (
    <ThemedView reset className={`${defaultStyle} ${className || ""}`} style={opaque ? {backgroundColor: task.color} : {borderWidth: 2, borderColor: task.color}}>
      <ThemedView textInherit={opaque ? "!text-black dark:!text-black" : ""}>
        <ThemedText>{task.title}</ThemedText>
        <ThemedText>{task.description}</ThemedText>
        <ThemedText>
          {
            task.timestamp ? (
              `${timeStampToString(task.timestamp)}` + " - " + (task.duration ? 
                 `${timeStampToString(timeStampAfter(task.timestamp!, task.duration))}` : "" )
            ) : ''
          }
        </ThemedText>

      </ThemedView>
      
      {
        onDelete && (
      <ThemedButton className="h-12 rounded-xl" onPressOut={onDelete}>
        <ThemedText >Delete</ThemedText>
      </ThemedButton>
        )
      }
      

    </ThemedView>
  );
}
