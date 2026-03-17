import * as SQLite from "expo-sqlite"
import {Task, TaskTemplate, WeeklyTask} from "../task/task";
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
        FOREIGN KEY (template_id) REFERENCES task_templates (id)
      );
      `
  )
  

}

async function migrateTaskTemplates (db: SQLite.SQLiteDatabase) {

  await db.execAsync("DROP TABLE IF EXISTS task_templates;");

  await db.execAsync(
    `
    CREATE TABLE IF NOT EXISTS task_templates (
      id INTEGER PRIMARY KEY,
      color TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      timestamp TEXT,
      duration INTEGER,
      visible BOOLEAN
    );
    `
  )

}

async function migrateWeeklyTasks (db: SQLite.SQLiteDatabase) {
    await db.execAsync("DROP TABLE IF EXISTS weekly_tasks;");

    await db.execAsync("PRAGMA foreign_keys = ON;")

    await db.execAsync(
      `
      CREATE TABLE IF NOT EXISTS weekly_tasks (
        id INTEGER PRIMARY KEY,
        day INTEGER,
        template_id INTEGER,
        FOREIGN KEY (template_id) REFERENCES task_templates (id)
      );
      `
  )
  

}
export async function migrateDB(db: SQLite.SQLiteDatabase) {


  await migrateTaskTemplates(db);

  await migrateTaskList(db);

  await migrateWeeklyTasks(db);

}

export async function getTaskList(db: SQLite.SQLiteDatabase): Promise<Task[]> {

  const res = await db.getAllAsync<any>(
    `
    SELECT * 
    FROM task_list 
    INNER JOIN task_templates ON task_list.template_id = task_templates.id;
    `
  );

  return res.map<Task>((i) => ({
    id: i.id,
    color: i.color,
    title: i.title,
    description: i.description,
    date: i.date && new Date(i.date),
    //timestamp: (i.timestamp && getTimeStampfromString(i.timestamp)) || undefined,
    timestamp: i.timestamp ? getTimeStampfromString(i.timstamp) : undefined,
    duration: i.duration || undefined,
    visible: Boolean(i.visible),
    template_id: i.index_id,
  }));
  
}
export async function addToTaskList(db: SQLite.SQLiteDatabase, task: Task): Promise<number> {

  const res = await db.runAsync(
    `
    INSERT INTO task_list (date, template_id) 
    VALUES (?, ?);
    `, 
    [
      (task.date && task.date.toString()) || null,
      task.template_id,
    ] 
  );
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
}

export async function getTaskTemplates(db: SQLite.SQLiteDatabase): Promise<TaskTemplate[]> {

  const res = await db.getAllAsync<any>(
    `
    SELECT * 
    FROM task_templates;
    `
  );

  return res.map<TaskTemplate>((i) => ({
    id: i.id,
    color: i.color,
    title: i.title,
    description: i.description,

    //timestamp: i.timestamp && getTimeStampfromString(i.default_timestamp),
    timestamp: i.timestamp ? getTimeStampfromString(i.timestamp) : undefined,
    duration: i.duration || undefined,
    visible: Boolean(i.visible),
  }));
 
  
}

export async function addToTaskTemplates(db: SQLite.SQLiteDatabase, task: TaskTemplate): Promise<number> {

  const res = await db.runAsync(
    `
    INSERT INTO task_templates (title, description, color, timestamp, duration, visible) 
    VALUES (?, ?, ?, ?, ?, ?);
    `, 
    [
      task.title, 
      task.description, 
      task.color.toString(), 
      //(task.default_timestamp && timeStampToString(task.default_timestamp)) || null,
      task.timestamp ? timeStampToString(task.timestamp) : null,
      task.duration || null,
      task.visible ? 1 : 0,
    ]
  );
  return res.lastInsertRowId;
}


export async function deleteFromTaskTemplates(db: SQLite.SQLiteDatabase, id: number): Promise<void> {

  try {
      await db.runAsync(
        `
        DELETE FROM task_templates
        WHERE id = ?;
        `, 
        [id]
      );
  }
  catch (e) {
    throw e;
  }
}

export async function getWeeklyTasks(db: SQLite.SQLiteDatabase): Promise<WeeklyTask[]> {

  const res = await db.getAllAsync<any>(
    `
    SELECT * 
    FROM weekly_tasks;
    INNER JOIN task_templates ON weekly_tasks.template_id = task_templates.id
    `
  );

  return res.map<WeeklyTask>((i) => ({
    id: i.id,
    color: i.color,
    title: i.title,
    description: i.description,

    //timestamp: (i.timestamp && getTimeStampfromString(i.timestamp)) || undefined,
    //timestamp: (i.timestamp || i.default_timestamp) && getTimeStampfromString((i.timestamp || i.default_timestamp)),
    timestamp: i.timestamp ? getTimeStampfromString(i.timestamp) : undefined,
    duration: i.duration || undefined,
    visible: Boolean(i.visible),
    template_id: i.template_id,
    day: i.day,
  }));
}

export async function addToWeeklyTasks(db: SQLite.SQLiteDatabase, task: WeeklyTask): Promise<number> {

  const res = await db.runAsync( `
    INSERT INTO weekly_tasks (day, template_id) 
    VALUES (?, ?);
    `, 
    [
      task.day,
      task.template_id,
    ]
  );
  return res.lastInsertRowId;
}


export async function deleteFromWeeklyTasks(db: SQLite.SQLiteDatabase, id: number): Promise<void> {
  try {
      await db.runAsync(
        `
        DELETE FROM weekly_tasks
        WHERE id = ?;
        `, 
        [id]
      );
  }
  catch (e) {
    throw e;
  }
}
