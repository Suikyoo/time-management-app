import {ColorValue} from "react-native";
import {type Duration, TimeStamp} from "../time/time";
import { create } from "zustand";

export interface Task {
  id: number;
  color: ColorValue;
  title: string;
  description: string;

  date?: Date;
  timestamp?: TimeStamp,
  duration?: Duration,

}

interface taskData {
  task: Task | null;
  setTask: (task: Task|null) => void;
}

//both the taskList as well as the taskIndex have separate indexing systems
interface taskStoreData {
  tasks: Task[];
  createTask: (task: Task) => void;
  deleteTask: (id: number) => void;
}

export const useTaskTarget = create<taskData>((set) => (
  {
    task: null,
    setTask: (task) => set(() => ({task}))
  }
))

export const useTaskList = create<taskStoreData>((set) => (
  {
    tasks: [],
    createTask: (task) => set((state) => ({tasks: state.tasks.concat([task])})),
      deleteTask: (id) => set((state) => ({tasks: state.tasks.filter((t) => t.id === id)})),
  }
));

export const  useTaskIndex = create<taskStoreData>((set) => (
  {
    tasks: [
      //seed
      {
        id: 0,
        color: "#ff0000", 
        title: "task 1",
        description: "this is task 1"

      }, 
      {
        id: 1,
        color: "#00ff00", 
        title: "task 2",
        description: "this is task 2"

      },
      {
        id: 2,
        color: "#0000ff", 
        title: "task 3",
        description: "this is task 3"

      }


    ],
    createTask: (task) => set((state) => ({tasks: state.tasks.concat([task])})),
      deleteTask: (id) => set((state) => ({tasks: state.tasks.filter((t) => t.id === id)})),
  }
));
