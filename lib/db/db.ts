import * as SQLite from "expo-sqlite"
import {Task, TaskTemplate} from "../task/task";
import {getTimeStampfromString, timeStampToString} from "../time/time";

async function migrateTaskList (db: SQLite.SQLiteDatabase) {
    await db.execAsync("DROP TABLE IF EXISTS task_list;");

    await db.execAsync("PRAGMA foreign_keys = ON;")

    await db.execAsync(
      `
      CREATE TABLE IF NOT EXISTS task_list (
        id INTEGER PRIMARY KEY,
        date TEXT,
        template_id INTEGER,
        FOREIGN KEY (template_id) REFERENCES task_index (id)
      );
      `
  )
  

}

async function migrateTaskIndex (db: SQLite.SQLiteDatabase) {

  await db.execAsync("DROP TABLE IF EXISTS task_index;");

  await db.execAsync(
    `
    CREATE TABLE IF NOT EXISTS task_index (
      id INTEGER PRIMARY KEY,
      color TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      native BOOLEAN NOT NULL,

      timestamp TEXT,
      duration INTEGER
    );
    `
  )

}

export async function migrateDB(db: SQLite.SQLiteDatabase) {


  await migrateTaskIndex(db);

  await migrateTaskList(db);

  console.log("migrate done")
}

export async function getTaskList(db: SQLite.SQLiteDatabase): Promise<Task[]> {

  const res = await db.getAllAsync<any>(
    `
    SELECT * 
    FROM task_list 
    INNER JOIN task_index ON task_list.template_id = task_index.id
    `
  );

  return res.map((i) => ({
    id: i.id,
    color: i.color,
    title: i.title,
    description: i.description,
    date: (i.date && new Date(i.date)) || undefined,
    timestamp: (i.timestamp && getTimeStampfromString(i.timestamp)) || undefined,
    duration: i.duration || undefined,
    template_id: i.index_id,
    native: i.native,
  }));
  
}
export async function addToTaskList(db: SQLite.SQLiteDatabase, task: Task): Promise<number> {

  const res = await db.runAsync(
    `
    INSERT INTO task_list (date, template_id) 
    VALUES (?, ?);
    `, 
    [
      (task.date && task.date.toISOString()) || null,
      task.template_id,
    ] 
  );
  console.log("add task list")
  return res.lastInsertRowId;
}
export async function deleteFromTaskList(db: SQLite.SQLiteDatabase, id: number): Promise<void> {

  try {
    await db.runAsync(
      `
      DELETE FROM task_list
      WHERE id = ?;
      `, 
      [id]
    );
  }
  catch (e) {
    throw e;
  }
  console.log("delete task list");
}

export async function getTaskIndex(db: SQLite.SQLiteDatabase): Promise<TaskTemplate[]> {

  const res = await db.getAllAsync<any>(
    `
    SELECT * 
    FROM task_index 
    `
  );
  console.log("task index")

  return res.map((i) => ({
    id: i.id,
    color: i.color,
    title: i.title,
    description: i.description,
    native: i.native,

    timestamp: (i.timestamp && getTimeStampfromString(i.timestamp)) || undefined,
    duration: i.duration || undefined,
  }));
 
  
}

export async function addToTaskIndex(db: SQLite.SQLiteDatabase, task: TaskTemplate): Promise<number> {

  const res = await db.runAsync(
    `
    INSERT INTO task_index (title, description, color, native, timestamp, duration) 
    VALUES (?, ?, ?, ?, ?, ?);
    `, 
    [
      task.title, 
      task.description, 
      task.color.toString(), 
      task.native,
      (task.timestamp && timeStampToString(task.timestamp)) || null,
      task.duration || null,
    ]
  );
  console.log(" add task index")
  return res.lastInsertRowId;
}


export async function deleteFromTaskIndex(db: SQLite.SQLiteDatabase, id: number): Promise<void> {

  try {
    await db.runAsync(
      `
      DELETE FROM task_index
      WHERE id = ?;
      `, 
      [id]
    );
  }
  catch (e) {
    throw e;
  }
  console.log(" delete task index")
}
