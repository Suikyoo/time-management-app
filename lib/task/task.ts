import {useState} from "react";
import {ColorValue} from "react-native";
import {type Duration, TimeStamp} from "../time/time";

export interface Task {
  color: ColorValue;
  name: string;
  date?: Date;
  timestamp?: TimeStamp,
  duration?: Duration,
  
}

const [taskList, setTaskList] = useState<Task[]>([]);
const [taskIndex, setTaskIndex] = useState<Task[]>([]);
const [taskTarget, setTaskTarget] = useState<Task | null>(null);

export function useTask()
