import { ExtendedTaskState, TaskState, TaskTemplate, useTasks, useTaskTarget, useTaskTemplates, useWeeklyTasks, useWeeklyTaskTarget, useWeeklyTaskTemplates, WeeklyTaskTemplate } from "@/lib/task/task";
import Form from "./Form";
import { ThemedButton, ThemedText, ThemedView } from "./ThemedComponents";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";

export interface PromptButton {
  text: string;
  func: () => Promise<void>;
  className?: string;

}

interface Props {
  text: string, 
  buttons: PromptButton[];
}

interface ConfirmProp {
  text: string,
  func: () => Promise<void>;
  noClassName?: string;
  yesClassName?: string;
}

interface DeleteOptionProp {
  del: () => Promise<void>;
  delAll: () => Promise<void>;
}
export default function Prompt({text, buttons}: Props) {

  return (
  <Form>
      <Form.Header>{text}</Form.Header>

      <ThemedView className="flex flex-col justify-evenly mt-12">
      {
        buttons.map((button, i) => (
          
          <ThemedButton key={i} className={"mb-4 " + button.className || ""} onPressOut={button.func}>
            <ThemedText>{button.text}</ThemedText>
          </ThemedButton>
        ))
      }
      </ThemedView>
  </Form>
  )
}

Prompt.Confirm = ({text, func, noClassName="bg-slate-500", yesClassName="bg-green-200"}: ConfirmProp) => {
  const buttons: PromptButton[] = [
    {
      text: "Yes",
      func: func,
      className: yesClassName,
    },
    {
      text: "No",
      func: async() => {},
      className: noClassName,
    },
  ]
  return <Prompt text={text} buttons={buttons} />
}

Prompt.UrgentConfirm = ({yesClassName="bg-red-200", ...props}: ConfirmProp) => (
  <Prompt.Confirm {...props} yesClassName={yesClassName}/>
)

Prompt.DeleteOptions = ({del, delAll}: DeleteOptionProp) => {
  const text = "There are some tasks associated with this template. Would you like to delete those tasks as well?";

  const buttons: PromptButton[] = [
    {
      text: "Delete associated tasks",
      func: async() => {
        await delAll(); 
        router.back();
      },
      className: "dark:bg-red-400"
    }, 
    {
      text: "Delete template only",
      func: async() => {
        await del();
        router.back();
      },
      className: "dark:bg-red-300"
    }
  ]

  return <Prompt text={text} buttons={buttons} />

}
Prompt.TaskTemplateDeleteOptions = ({id}: {id: number}) => {
  const db = useSQLiteContext();
  const tasks = useTasks(s => s.tasks);
  const templates = useTaskTemplates(s => s.tasks);
  

  const updateTask = useTasks(s => s.updateTask);

  const deleteTasksById = useTasks(s => s.deleteTasksFromId);

  const addTemplate = useTaskTemplates(s => s.createTask);
  const deleteTemplate = useTaskTemplates(s => s.deleteTask);

  const setTarget = useTaskTarget(s => s.setTask);

  const delAll = async() => {
    const template = templates.find(t => t.id == id)
    if (!template) {
      throw new Error(`task template not found from ID: ${id}`);
    }
    await deleteTasksById(db, template.id);
    await deleteTemplate(db, template.id);
    setTarget(null);
  } 

  const del = async() => {
    //create template for every task
    //change their template id to match that
    //update each template
    //delete the overarching template
    for (let i=0; i<tasks.length; i++) {
      const {date, template_id, ...derived_template} = tasks[i];
      const derived_id = await addTemplate(db, {...derived_template, visible: false});
      tasks[i].template_id = derived_id

      await updateTask(db, tasks[i]);
    }
    const template = templates.find(t => t.id == id)
    if (!template) {
      throw new Error(`task template not found from ID: ${id}`);
    }
    await deleteTemplate(db, template.id);

    setTarget(null);

  }

  return <Prompt.DeleteOptions del={del} delAll={delAll} />

}

Prompt.WeeklyTaskTemplateDeleteOptions = ({id}: {id: number}) => {
  const db = useSQLiteContext();
  const tasks = useWeeklyTasks(s => s.tasks);
  const templates = useWeeklyTaskTemplates(s => s.tasks);
  

  const updateTask = useWeeklyTasks(s => s.updateTask);

  const deleteTasksById = useWeeklyTasks(s => s.deleteTasksFromId);

  const addTemplate = useWeeklyTaskTemplates(s => s.createTask);
  const deleteTemplate = useWeeklyTaskTemplates(s => s.deleteTask);

  const setTarget = useWeeklyTaskTarget(s => s.setTask);

  const delAll = async() => {
    const template = templates.find(t => t.id == id)
    if (!template) {
      throw new Error(`task template not found from ID: ${id}`);
    }
    await deleteTasksById(db, template.id);
    await deleteTemplate(db, template.id);
    setTarget(null);
  } 

  const del = async() => {
    //create template for every task
    //change their template id to match that
    //update each template
    //delete the overarching template
    for (let i=0; i<tasks.length; i++) {
      const {day, template_id, ...derived_template} = tasks[i];
      const derived_id = await addTemplate(db, {...derived_template, visible: false});
      tasks[i].template_id = derived_id

      await updateTask(db, tasks[i]);
    }
    const template = templates.find(t => t.id == id)
    if (!template) {
      throw new Error(`task template not found from ID: ${id}`);
    }
    await deleteTemplate(db, template.id);

    setTarget(null);

  }

  return <Prompt.DeleteOptions del={del} delAll={delAll} />

}
