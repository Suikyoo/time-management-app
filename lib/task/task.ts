import {ColorValue} from "react-native";
import {type Duration, TimeStamp} from "../time/time";
import { create, createStore, StoreApi, UseBoundStore, useStore } from "zustand";
import {addToTaskIndex, addToTaskList, deleteFromTaskIndex, deleteFromTaskList, getTaskIndex, getTaskList} from "../db/db";
import {SQLiteDatabase} from "expo-sqlite";

export interface TaskTemplate {
  id: number;
  color: ColorValue;
  title: string;
  description: string;
  native: boolean;

  timestamp?: TimeStamp,
  duration?: Duration,

}

export interface Task extends TaskTemplate{
  date: Date;
  template_id: number;

}

interface taskData {
  task: TaskTemplate| null;
  setTask: (task: TaskTemplate|null) => void;
}
//both the taskList as well as the taskIndex have separate indexing systems
//update: they both share the same IDs now, 
//taskIndex have non-repeating IDs. They're the paintbrushes while
//taskList have repeating IDs. They're the painted pigments in the calendar that the paintbrushes have made.
interface taskStoreData<T> {
  tasks: T[];
  loadTasks: (db: SQLiteDatabase) => Promise<void>;
  createTask: (db: SQLiteDatabase, task: T) => Promise<void>;
  deleteTask: (db:SQLiteDatabase, id: number) => Promise<void>;
}

export const useTaskTarget = create<taskData>((set) => (
  {
    task: null,
    setTask: (task) => set(() => ({task}))
  }
))

export const useTaskList = create<taskStoreData<Task>>((set) => (
  {
    tasks: [],
    loadTasks: async (db) => {
      const data = await getTaskList(db);
      set(() => ({tasks: data}))
    },
    createTask: async (db, task) => {
      const id = await addToTaskList(db, task);
      set((state) => ({tasks: state.tasks.concat([{...task, id}])}));
    },

    deleteTask: async (db, id) => {
      await deleteFromTaskList(db, id);
      set((state) => ({tasks: state.tasks.filter((t) => t.id !== id)}))
    },
  }
));

export const  useTaskIndex = create<taskStoreData<TaskTemplate>>((set) => (
  {
    tasks: [],
    loadTasks: async (db) => {
      const data = await getTaskIndex(db);
      set(() => ({tasks: data}))
    },
    createTask: async (db, task) => {
      const id = await addToTaskIndex(db, task)
      set((state) => ({tasks: state.tasks.concat([{...task, id}])}));
    },

    deleteTask: async (db, id) => {
      await deleteFromTaskIndex(db, id);
      set((state) => ({tasks: state.tasks.filter((t) => t.id !== id)}))
    },  
  }
));

//await useTaskIndex(s => s.loadTasks)();
//await useTaskList(s => s.loadTasks)();
