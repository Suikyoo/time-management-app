import {ColorValue} from "react-native";
import {type Duration, TimeStamp} from "../time/time";
import { create } from "zustand";
import {addToTaskTemplates, addToTaskList, deleteFromTaskTemplates, deleteFromTaskList, getTaskTemplates, getTaskList, getWeeklyTasks, addToWeeklyTasks, deleteFromWeeklyTasks} from "../db/db";
import {SQLiteDatabase} from "expo-sqlite";

export interface TaskTemplate {
  id: number;
  color: ColorValue;
  title: string;
  description: string;

  timestamp?: TimeStamp;
  //duration in millisecond
  duration?: Duration;

  visible: Boolean;

}

export interface Task extends TaskTemplate {
  date: Date;
  template_id: number;

}

export interface WeeklyTask extends TaskTemplate {
  //weekday 0-6 Sunday - monday
  day: number;
  template_id: number;
}

interface taskData {
  task: TaskTemplate| null;
  setTask: (task: TaskTemplate|null) => void;
}

//both the taskList as well as the taskTemplates have separate indexing systems
//update: they both share the same IDs now, 
//taskTemplates have non-repeating IDs. They're the paintbrushes while
//taskList have repeating IDs. They're the painted pigments in the calendar that the paintbrushes have made.
interface taskStoreData<T> {
  tasks: T[];
  //returns the number of tasks
  loadTasks: (db: SQLiteDatabase) => Promise<number>;

  //returns the id number
  createTask: (db: SQLiteDatabase, task: T) => Promise<number>;
  deleteTask: (db:SQLiteDatabase, id: number) => Promise<number>;
}

//used as the state for the Task Palette
export const useTaskTarget = create<taskData>((set) => (
  {
    task: null,
    setTask: (task) => set(() => ({task}))
  }
))

export const useTaskList = create<taskStoreData<Task>>((set) => (
  {
    tasks: [],
    loadTasks: async (db): Promise<number> => {
      const data = await getTaskList(db);
      set(() => ({tasks: data}))
      return data.length;
    },
    createTask: async (db, {...task}): Promise<number> => {
      const id = await addToTaskList(db, task);
      set((state) => ({tasks: state.tasks.concat([{...task, id}])}));

      return id;
    },

    deleteTask: async (db, id): Promise<number> => {
      await deleteFromTaskList(db, id);
      set((state) => ({tasks: state.tasks.filter((t) => t.id !== id)}))
      return id;
      
    },
  }
));

export const useTaskTemplates = create<taskStoreData<TaskTemplate>>((set) => (
  {
    tasks: [],
    loadTasks: async (db): Promise<number> => {
      const data = await getTaskTemplates(db);
      set(() => ({tasks: data}))
      return data.length;
    },
    createTask: async (db, {...task}): Promise<number> => {
      const id = await addToTaskTemplates(db, task)
      set((state) => ({tasks: state.tasks.concat([{...task, id}])}));
      return id;
    },

    deleteTask: async (db, id): Promise<number> => {
      await deleteFromTaskTemplates(db, id);
      set((state) => ({tasks: state.tasks.filter((t) => t.id !== id)}))
      return id;
    },  
  }
));

export const useWeeklyTasks = create<taskStoreData<WeeklyTask>>((set) => (
  {
    tasks: [],
    loadTasks: async (db): Promise<number> => {
      const data = await getWeeklyTasks(db);
      set(() => ({tasks: data}))
      return data.length;
    },
    createTask: async (db, {...task}): Promise<number> => {
      const id = await addToWeeklyTasks(db, task);
      set((state) => ({tasks: state.tasks.concat([{...task, id}])}));

      return id;
    },

    deleteTask: async (db, id): Promise<number> => {
      await deleteFromWeeklyTasks(db, id);
      set((state) => ({tasks: state.tasks.filter((t) => t.id !== id)}))
      return id;
      
    },
  }
));

//compound operation functions
