import type { StoreApi } from 'zustand/vanilla';
import {ColorValue} from "react-native";
import {type Duration, TimeStamp} from "../time/time";
import { create, UseBoundStore } from "zustand";
import {addToTaskTemplates, addToTaskList, deleteFromTaskTemplates, deleteFromTaskList, getTaskTemplates, getTaskList, getWeeklyTasks, addToWeeklyTasks, deleteFromWeeklyTasks, getWeeklyTaskTemplates, addToWeeklyTaskTemplates, deleteFromWeeklyTaskTemplates} from "../db/db";
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

//weekly tasks templates need to have time specifics
export interface WeeklyTaskTemplate extends TaskTemplate {
  timestamp: TimeStamp;
  duration: Duration;

}

export interface Task extends TaskTemplate {
  date: Date;
  template_id: number;

}

export interface WeeklyTask extends WeeklyTaskTemplate {
  //weekday 0-6 Sunday - monday
  day: number;
  template_id: number;
}

interface taskData<T> {
  task: T | null;
  setTask: (task: T | null) => void;
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
export const useTaskTarget = create<taskData<TaskTemplate>>((set) => (
  {
    task: null,
    setTask: (task) => set(() => ({task}))
  }
))

export const useWeeklyTaskTarget = create<taskData<WeeklyTaskTemplate>>((set) => (
  {
    task: null,
    setTask: (task) => set(() => ({task}))
  }
))

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

export const useWeeklyTaskTemplates = create<taskStoreData<WeeklyTaskTemplate>>((set) => (
  {
    tasks: [],
    loadTasks: async (db): Promise<number> => {
      const data = await getWeeklyTaskTemplates(db);
      set(() => ({tasks: data}))
      return data.length;
    },
    createTask: async (db, {...task}): Promise<number> => {
      const id = await addToWeeklyTaskTemplates(db, task)
      set((state) => ({tasks: state.tasks.concat([{...task, id}])}));
      return id;
    },

    deleteTask: async (db, id): Promise<number> => {
      await deleteFromWeeklyTaskTemplates(db, id);
      set((state) => ({tasks: state.tasks.filter((t) => t.id !== id)}))
      return id;
    },  
  }
));

export const useTasks = create<taskStoreData<Task>>((set) => (
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

export type TaskState<T> = UseBoundStore<StoreApi<taskStoreData<T>>>
