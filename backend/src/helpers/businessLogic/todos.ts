
import { TodoItem } from "../../models/TodoItem";
import { UpdateTodoRequest } from "../../requests/UpdateTodoRequest";
import { TodoUpdate } from "../../models/TodoUpdate";
import { ToDoAccess } from "../dataAccessLogic/todosAcess";
import { CreateTodoRequest } from "../../requests/CreateTodoRequest";
import { parseUserId } from "../../auth/utils";



const toDoAccess = new ToDoAccess();
const uuidv4 = require('uuid/v4');

/**
 * Retrieve all to-do items for the authenticated user.
 * 
 * @param jwtToken the authentication token for the user
 * @returns a promise containing an array of to-do items
 */
export async function getAllTodos(jwtToken: string): Promise<TodoItem[]> {
  const userId = parseUserId(jwtToken);
  return toDoAccess.getAllToDos(userId);
}

/**
 * Create a new to-do item for the authenticated user.
 * 
 * @param createTodoRequest the request object containing the details of the to-do item to be created
 * @param jwtToken the authentication token for the user
 * @returns a promise containing the newly created to-do item
 */
export function createTodo(createTodoRequest: CreateTodoRequest, jwtToken: string): Promise<TodoItem> {
  const userId = parseUserId(jwtToken);
  const todoId = uuidv4();
  const s3BucketName = process.env.S3_BUCKET_NAME;

  const newTodo = {
    userId,
    todoId,
    attachmentUrl: `https://${s3BucketName}.s3.amazonaws.com/${todoId}`,
    createdAt: new Date().getTime().toString(),
    done: false,
    ...createTodoRequest,
  };

  return toDoAccess.createTodoItem(newTodo);
}

/**
 * Update an existing to-do item for the authenticated user.
 * 
 * @param updateTodoRequest the request object containing the details of the to-do item to be updated
 * @param todoId the ID of the to-do item to be updated
 * @param jwtToken the authentication token for the user
 * @returns a promise containing the updated to-do item
 */
export function updateTodo(updateTodoRequest: UpdateTodoRequest, todoId: string, jwtToken: string): Promise<TodoUpdate> {
  const userId = parseUserId(jwtToken);
  return toDoAccess.updateTodoItem(updateTodoRequest, todoId, userId);
}

/**
 * Delete an existing to-do item for the authenticated user.
 * 
 * @param todoId the ID of the to-do item to be deleted
 * @param jwtToken the authentication token for the user
 * @returns a promise containing a success message
 */
export function deleteTodo(todoId: string, jwtToken: string): Promise<string> {
  const userId = parseUserId(jwtToken);
  return toDoAccess.deleteTodoItem(todoId, userId);
}

/**
 * Generate a pre-signed URL for uploading an attachment to a to-do item.
 * 
 * @param todoId the ID of the to-do item to upload an attachment for
 * @returns a promise containing the pre-signed URL
 */
export function generateUploadUrl(todoId: string): Promise<string> {
  return toDoAccess.generateUploadUrl(todoId);
}
