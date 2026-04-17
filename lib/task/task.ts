import type { StoreApi } from 'zustand/vanilla';
import {ColorValue} from "react-native";
import {type Duration, TimeStamp} from "../time/time";
import { create, UseBoundStore } from "zustand";
import {addToTaskTemplates, addToTasks, deleteFromTaskTemplates, deleteFromTasks, getTaskTemplates, getTasks, getWeeklyTasks, addToWeeklyTasks, deleteFromWeeklyTasks, getWeeklyTaskTemplates, addToWeeklyTaskTemplates, deleteFromWeeklyTaskTemplates, deleteTasksFromTemplateId, deleteWeeklyTasksFromTemplateId, updateToTaskTemplates, updateToWeeklyTaskTemplates, updateToTasks, updateToWeelyTasks, getTasksFromTemplateId, getWeeklyTasksFromTemplateId} from "../db/db";
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
  duration: Duration;

}

export interface Task extends TaskTemplate {
  date: Date;
  template_id: number;

}

export interface WeeklyTask extends WeeklyTaskTemplate {
  //weekday 0-6 Sunday - monday
  day: number;
  timestamp: TimeStamp;
  template_id: number;
}

interface taskData<T> {
  task: T | null;
  setTask: (task: T | null) => void;
}

//both the tasks as well as the taskTemplates have separate indexing systems
//update: they both share the same IDs now, 
//taskTemplates have non-repeating IDs. They're the paintbrushes while
//tasks have repeating IDs. They're the painted pigments in the calendar that the paintbrushes have made.
interface taskTemplateStoreData<T> {
  tasks: T[];
  //returns the number of tasks
  loadTasks: (db: SQLiteDatabase) => Promise<number>;

  //returns the id number
  createTask: (db: SQLiteDatabase, task: T) => Promise<number>;
  deleteTask: (db:SQLiteDatabase, id: number) => Promise<number>;
  updateTask: (db:SQLiteDatabase, task: T) => Promise<void>;
}

interface taskStoreData<T> extends taskTemplateStoreData<T>{
  deleteTasksFromId: (db: SQLiteDatabase, id: number) => Promise<number>;
  loadTasksFromId: (db: SQLiteDatabase, id: number) => Promise<number>;
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

export const useTaskTemplates = create<taskTemplateStoreData<TaskTemplate>>((set) => (
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

    updateTask: async (db, task): Promise<void> => {
      await updateToTaskTemplates(db, task);
      set((state) => {
        const idx = state.tasks.findIndex(t => t.id == task.id)
        const updated_tasks = [...state.tasks.slice(0, idx), task, ...state.tasks.slice(idx + 1)];
        return {tasks: updated_tasks};
      })
    }
  }
));

export const useWeeklyTaskTemplates = create<taskTemplateStoreData<WeeklyTaskTemplate>>((set) => (
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
    updateTask: async (db, task): Promise<void> => {
      await updateToWeeklyTaskTemplates(db, task);
      set((state) => {
        const idx = state.tasks.findIndex(t => t.id == task.id)
        const updated_tasks = [...state.tasks.slice(0, idx), task, ...state.tasks.slice(idx + 1)];
        return {tasks: updated_tasks};
      })
    }
  }
));

export const useTasks = create<taskStoreData<Task>>((set) => (
  {
    tasks: [],
    loadTasks: async (db): Promise<number> => {
      const data = await getTasks(db);
      set(() => ({tasks: data}))
      return data.length;
    },

    loadTasksFromId: async(db, id): Promise<number> => {
      const updated = await getTasksFromTemplateId(db, id);

      const indexTable: Record<number, number> = {};

      updated.forEach((v, i) => indexTable[v.id] = i);

      set(s => ({
        tasks: s.tasks.map(t => {
          if (t.id in indexTable) {
            return updated[indexTable[t.id]];
          }
          return t;
        })
      }));

      return updated.length;
    },

    createTask: async (db, {...task}): Promise<number> => {
      const id = await addToTasks(db, task);
      set((state) => ({tasks: state.tasks.concat([{...task, id}])}));

      return id;
    },

    deleteTask: async (db, id): Promise<number> => {
      await deleteFromTasks(db, id);
      set((state) => ({tasks: state.tasks.filter((t) => t.id !== id)}))
      return id;
      
    },

    deleteTasksFromId: async (db, id): Promise<number> => {
      await deleteTasksFromTemplateId(db, id);
      set(s => ({tasks: s.tasks.filter(t => t.template_id !== id)}));
      return id;
    },

    updateTask: async (db, task): Promise<void> => {
      await updateToTasks(db, task);
      set((state) => {
        const idx = state.tasks.findIndex(t => t.id == task.id)
        const updated_tasks = [...state.tasks.slice(0, idx), task, ...state.tasks.slice(idx + 1)];
        return {tasks: updated_tasks};
      })
    }

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

    loadTasksFromId: async(db, id): Promise<number> => {
      const updated = await getWeeklyTasksFromTemplateId(db, id);

      const indexTable: Record<number, number> = {};

      updated.forEach((v, i) => indexTable[v.id] = i);

      set(s => ({
        tasks: s.tasks.map(t => {
          if (t.id in indexTable) {
            return updated[indexTable[t.id]];
          }
          return t;
        })
      }));

      return updated.length;
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

    deleteTasksFromId: async (db, id): Promise<number> => {
      await deleteWeeklyTasksFromTemplateId(db, id);
      set(s => ({tasks: s.tasks.filter(t => t.template_id !== id)}));
      return id;
    },

    updateTask: async (db, task): Promise<void> => {
      await updateToWeelyTasks(db, task);
      set((state) => {
        const idx = state.tasks.findIndex(t => t.id == task.id)
        const updated_tasks = [...state.tasks.slice(0, idx), task, ...state.tasks.slice(idx + 1)];
        return {tasks: updated_tasks};
      })
    }

  }
));

export type TaskState<T> = UseBoundStore<StoreApi<taskTemplateStoreData<T>>>
export type ExtendedTaskState<T> = UseBoundStore<StoreApi<taskStoreData<T>>>
