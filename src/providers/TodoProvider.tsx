import { createContext, useContext, useState } from "react";
import { useAuthContext } from "./AuthProvider";

import { api, getErrorMessage } from "../utils/networking";

export interface Subtask {
  id: number;
  description: string;
  completed: boolean;
}

export interface SubtaskRequest {
  description: string;
  completed: boolean;
}

export interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string; // ISO string from backend
  subtasks: Subtask[];
}

export interface TodoRequest {
  title: string;
  description: string;
  completed: boolean;
}

export interface SuccessResponse {
  message: string;
}

interface ContextType {
    todos: Todo[];
    fetchTodos: () => Promise<void>;
    postTodo: (todoRequest: TodoRequest) => Promise<void>;
    patchTodo: (todoRequest: Partial<TodoRequest>, todoId: number) => Promise<void>;
    deleteTodo: (todoId: number) => Promise<void>;
    postSubtask: (subtaskRequest: SubtaskRequest, todoId: number) => Promise<void>;
    patchSubtask: (subtaskRequest: Partial<SubtaskRequest>, subtaskId: number) => Promise<void>;
    deleteSubtask: (subtaskId: number, todoId: number) => Promise<void>;

}

const TodoContext = createContext<ContextType>({
    todos: [],
    fetchTodos: async () => {},
    postTodo: async () => {},
    patchTodo: async () => {},
    deleteTodo: async () => {},
    postSubtask: async () => {},
    patchSubtask: async () => {},
    deleteSubtask: async () => {},
})

export const useTodoContext = () => {
    return useContext(TodoContext)
}

export const TodoProvider = (props: any) => {
    const {currentUser} = useAuthContext()
    const [todos, setTodos] = useState<Todo[]>([])

    // Todos

    const fetchTodos = async () => {
        if (!currentUser) return
        try {
            const res = await api.get(`/todos/user/${currentUser.id}`)
            setTodos(res.data)
        } catch (e) {
            const error = getErrorMessage(e)
            console.log(error)
            throw error
        }
    }

    const postTodo = async (todoRequest: TodoRequest) => {
        try {
            const res = await api.post('/todos', todoRequest)
            setTodos(curr => ([
                ...curr,
                res.data
            ]))
        } catch (e) {
            const error = getErrorMessage(e)
            console.log(error)
            throw error
        }
    }

    const patchTodo = async (todoRequest: Partial<TodoRequest>, todoId: number) => {
        try {
            const res = await api.patch(`/todos/${todoId}`, todoRequest)
            setTodos(curr => curr.map(t => t.id == todoId ? res.data : t))
        } catch (e) {
            const error = getErrorMessage(e)
            console.log(error)
            throw error
        }
    }

    const deleteTodo = async (todoId: number) => {
        try {
            const res = await api.delete(`/todos/${todoId}`)
            setTodos(curr => curr.filter(t => t.id != todoId))
        } catch (e) {
            const error = getErrorMessage(e)
            console.log(error)
            throw error
        }
    }

    // Subtasks

    const postSubtask = async (subtaskRequest: SubtaskRequest, todoId: number) => {
        try {
            const res = await api.post(`/subtasks/todo/${todoId}`, subtaskRequest)
            setTodos(curr => curr.map(t => t.id == todoId ? res.data : t))
        } catch (e) {
            const error = getErrorMessage(e)
            console.log(error)
            throw error
        }
    }

    const patchSubtask = async (subtaskRequest: Partial<SubtaskRequest>, subtaskId: number) => {
        try {
            const res = await api.patch(`/subtasks/${subtaskId}`, subtaskRequest)
            const todo = res.data
            setTodos(curr => curr.map(t => t.id == todo.id ? todo : t))
        } catch (e) {
            const error = getErrorMessage(e)
            console.log(error)
            throw error
        }
    }

    const deleteSubtask = async (subtaskId: number, todoId: number) => {
        try {
            const res = await api.delete(`/subtasks/${subtaskId}`)
            setTodos(curr => curr.map(t => t.id != todoId ? t
                : {
                    ...t,
                    subtasks: t.subtasks.filter(s => s.id != subtaskId)
                }
            ))
        } catch (e) {
            const error = getErrorMessage(e)
            console.log(error)
            throw error
        }
    }

    return (
        <TodoContext.Provider value={{
            todos,
            fetchTodos, postTodo, patchTodo, deleteTodo, 
            patchSubtask, postSubtask, deleteSubtask
        }}>
            {props.children}
        </TodoContext.Provider>
    )
}

