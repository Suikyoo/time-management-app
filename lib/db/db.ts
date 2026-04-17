import * as SQLite from "expo-sqlite"
import {Task, TaskTemplate, WeeklyTask, WeeklyTaskTemplate} from "../task/task";
import {getTimeStampfromString, timeStampToString} from "../time/time";



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

async function migrateWeeklyTaskTemplates (db: SQLite.SQLiteDatabase) {

  await db.execAsync("DROP TABLE IF EXISTS weekly_task_templates;");

  await db.execAsync(
    `
    CREATE TABLE IF NOT EXISTS weekly_task_templates (
      id INTEGER PRIMARY KEY,
      color TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      duration INTEGER NOT NULL,
      timestamp TEXT,
      visible BOOLEAN
    );
    `
  )

}

async function migrateTasks (db: SQLite.SQLiteDatabase) {
    await db.execAsync("DROP TABLE IF EXISTS tasks;");

    await db.execAsync("PRAGMA foreign_keys = ON;")

    await db.execAsync(
      `
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY,
        date TEXT NOT NULL,
        timestamp TEXT,
        duration INTEGER,
        template_id INTEGER,
        FOREIGN KEY (template_id) REFERENCES task_templates (id)
      );
      `
  )
  

}

/*
 * how weekly_task_templates and task_templates work:
 * weekly_task_templates: duration          , timestamp(optional) 
 *        task_templates: duration(optional), timestamp
 *
 *              COALESCE: duration          , timestamp
 *
 *     each of these fields would always have a non-null value in them
  */

async function migrateWeeklyTasks (db: SQLite.SQLiteDatabase) {
    await db.execAsync("DROP TABLE IF EXISTS weekly_tasks;");

    await db.execAsync("PRAGMA foreign_keys = ON;")

    await db.execAsync(
      `
      CREATE TABLE IF NOT EXISTS weekly_tasks (
        id INTEGER PRIMARY KEY,
        day INTEGER NOT NULL,
        timestamp TEXT NOT NULL,
        duration INTEGER,
        template_id INTEGER,
        FOREIGN KEY (template_id) REFERENCES weekly_task_templates (id)
      );
      `
  )
  

}

export async function migrateDB(db: SQLite.SQLiteDatabase) {


  await migrateTaskTemplates(db);

  await migrateWeeklyTaskTemplates(db);

  await migrateTasks(db);

  await migrateWeeklyTasks(db);

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

export async function updateToTaskTemplates(db: SQLite.SQLiteDatabase, task: TaskTemplate): Promise<void> {
  try {
    await db.runAsync(
      `
      UPDATE task_templates
      SET 
        title = ?,
        description = ?,
        color = ?,
        timestamp = ?,
        duration = ?,
        visible = ?
      WHERE id = ?;
      `,
      [
        task.title,
        task.description,
        task.color.toString(),
        task.timestamp ? timeStampToString(task.timestamp) : null,
        task.duration || null,
        task.visible ? 1 : 0,
        task.id,
      ]
    )
  } catch (e) {
    throw e;
  }

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

export async function deleteWeeklyTasksFromTemplateId(db: SQLite.SQLiteDatabase, id: number): Promise<void> {

  try {
      await db.runAsync(
        `
        DELETE FROM weekly_tasks
        WHERE template_id = ?;
        `, 
        [id]
      );
  }
  catch (e) {
    throw e;
  }
}

export async function getWeeklyTaskTemplates(db: SQLite.SQLiteDatabase): Promise<WeeklyTaskTemplate[]> {

  const res = await db.getAllAsync<any>(
    `
    SELECT * 
    FROM weekly_task_templates;
    `
  );

  return res.map<WeeklyTaskTemplate>((i) => ({
    id: i.id,
    color: i.color,
    title: i.title,
    description: i.description,

    //timestamp: i.timestamp && getTimeStampfromString(i.default_timestamp),
    timestamp: i.timestamp,
    duration: i.duration,
    visible: Boolean(i.visible),
  }));
 
  
}

export async function addToWeeklyTaskTemplates(db: SQLite.SQLiteDatabase, task: WeeklyTaskTemplate): Promise<number> {

  const res = await db.runAsync(
    `
    INSERT INTO weekly_task_templates (title, description, color, timestamp, duration, visible) 
    VALUES (?, ?, ?, ?, ?, ?);
    `, 
    [
      task.title, 
      task.description, 
      task.color.toString(), 
      //(task.default_timestamp && timeStampToString(task.default_timestamp)) || null,
      task.timestamp ? timeStampToString(task.timestamp) : null,
      task.duration,
      task.visible ? 1 : 0,
    ]
  );
  return res.lastInsertRowId;
}


export async function updateToWeeklyTaskTemplates(db: SQLite.SQLiteDatabase, task: WeeklyTaskTemplate): Promise<void> {
  try {
      await db.runAsync(
        `
        UPDATE weekly_task_templates
        SET 
          title = ?,
          description = ?,
          color = ?,
          timestamp = ?,
          duration = ?,
          visible = ?
        WHERE id = ?;
        `,
        [
          task.title,
          task.description,
          task.color.toString(),
          task.timestamp ? timeStampToString(task.timestamp) : null,
          task.duration, 
          task.visible ? 1 : 0,
          task.id,
        ]
      )
    } catch (e) {
      throw e;
    }

}
export async function deleteFromWeeklyTaskTemplates(db: SQLite.SQLiteDatabase, id: number): Promise<void> {

  try {
      await db.runAsync(
        `
        DELETE FROM weekly_task_templates
        WHERE id = ?;
        `, 
        [id]
      );
  }
  catch (e) {
    throw e;
  }
}

export async function getTasks(db: SQLite.SQLiteDatabase): Promise<Task[]> {

  const res = await db.getAllAsync<any>(
    `
    SELECT COALESCE(tasks.timestamp, task_templates.timestamp) as timestamp, COALESCE(tasks.duration, task_templates.duration) as duration, tasks.id as id, color, title, description, date, visible, template_id
    FROM tasks 
    INNER JOIN task_templates ON tasks.template_id = task_templates.id;
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

export async function getTasksFromTemplateId(db: SQLite.SQLiteDatabase, id: number): Promise<Task[]> {
  const res = await db.getAllAsync<any>(
    `
    SELECT COALESCE(tasks.timestamp, task_templates.timestamp) as timestamp, COALESCE(tasks.duration, task_templates.duration) as duration, tasks.id as id, color, title, description, date, visible, template_id
    FROM tasks
    INNER JOIN task_templates ON tasks.template_id = task_templates.id;
    WHERE tasks.template_id = ?;
    `,
    [
      id,
    ]
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

export async function addToTasks(db: SQLite.SQLiteDatabase, task: Task): Promise<number> {

  const res = await db.runAsync(
    `
    INSERT INTO tasks (date, timestamp, duration, template_id) 
    VALUES (?, ?, ?, ?);
    `, 
    [
      task.date.toString(),
      task.timestamp ? timeStampToString(task.timestamp) : null,
      task.duration || null,
      task.template_id,
    ] 
  );
  return res.lastInsertRowId;
}

export async function updateToTasks(db: SQLite.SQLiteDatabase, task: Task): Promise<void> {
  try {
      await db.runAsync(
        `
        UPDATE tasks
        SET date = ?,
          timestamp = ?,
          duration = ?,
          template_id = ?
        WHERE id = ?;
        `,
        [
          task.date.toString(),
          task.timestamp ? timeStampToString(task.timestamp) : null,
          task.duration || null,
          task.template_id,
          task.id,
          
        ]
      )
    } catch (e) {
      throw e;
    }
}

export async function deleteFromTasks(db: SQLite.SQLiteDatabase, id: number): Promise<void> {

  try {
    await db.runAsync(
      `
      DELETE FROM tasks
      WHERE id = ?;
      `, 
      [id]
    );
  }
  catch (e) {
    throw e;
  }
}

export async function deleteTasksFromTemplateId(db: SQLite.SQLiteDatabase, id: number): Promise<void> {

  try {
      await db.runAsync(
        `
        DELETE FROM tasks
        WHERE template_id = ?;
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
    SELECT COALESCE(weekly_tasks.timestamp, weekly_task_templates.timestamp) as timestamp, COALESCE(weekly_tasks.duration, weekly_task_templates.duration) as duration, weekly_tasks.id as id, color, title, description, visible, template_id, day
    FROM weekly_tasks
    INNER JOIN weekly_task_templates ON weekly_tasks.template_id = weekly_task_templates.id
    `
  );

  return res.map<WeeklyTask>((i) => ({
    id: i.id,
    color: i.color,
    title: i.title,
    description: i.description,

    //timestamp: (i.timestamp && getTimeStampfromString(i.timestamp)) || undefined,
    //timestamp: (i.timestamp || i.default_timestamp) && getTimeStampfromString((i.timestamp || i.default_timestamp)),
    timestamp: getTimeStampfromString(i.timestamp),
    duration: i.duration || undefined,
    visible: Boolean(i.visible),
    template_id: i.template_id,
    day: i.day,
  }));
}

export async function getWeeklyTasksFromTemplateId(db: SQLite.SQLiteDatabase, id: number): Promise<WeeklyTask[]> {
  const res = await db.getAllAsync<any>(
    `
    SELECT COALESCE(weekly_tasks.timestamp, weekly_task_templates.timestamp) as timestamp, COALESCE(weekly_tasks.duration, weekly_task_templates.duration) as duration, weekly_tasks.id as id, color, title, description, visible, template_id, day
    FROM weekly_tasks
    INNER JOIN weekly_task_templates ON weekly_tasks.template_id = weekly_task_templates.id
    WHERE weekly_tasks.template_id = ?
    `,
    [
      id,
    ]
  );

  return res.map<WeeklyTask>((i) => ({
    id: i.id,
    color: i.color,
    title: i.title,
    description: i.description,

    //timestamp: (i.timestamp && getTimeStampfromString(i.timestamp)) || undefined,
    //timestamp: (i.timestamp || i.default_timestamp) && getTimeStampfromString((i.timestamp || i.default_timestamp)),
    timestamp: getTimeStampfromString(i.timestamp),
    duration: i.duration || undefined,
    visible: Boolean(i.visible),
    template_id: i.template_id,
    day: i.day,
  }));
}

export async function addToWeeklyTasks(db: SQLite.SQLiteDatabase, task: WeeklyTask): Promise<number> {

  const res = await db.runAsync( `
    INSERT INTO weekly_tasks (day, timestamp, duration, template_id) 
    VALUES (?, ?, ?, ?);
    `, 
    [
      task.day,
      timeStampToString(task.timestamp),
      task.duration,
      task.template_id,
    ]
  );
  return res.lastInsertRowId;
}

export async function updateToWeelyTasks(db: SQLite.SQLiteDatabase, task: WeeklyTask): Promise<void> {
  try {
      await db.runAsync(
        `
        UPDATE weekly_tasks
        SET day = ?,
          timestamp = ?,
          duration = ?,
          template_id = ?
        WHERE id = ?;
        `,
        [
          task.day,
          task.timestamp ? timeStampToString(task.timestamp) : null,
          task.duration,
          task.template_id,
          task.id,
        ]
      )
    } catch (e) {
      throw e;
    }
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
