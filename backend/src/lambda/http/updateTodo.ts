
import 'source-map-support/register'
import { updateTodo } from '../../helpers/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

export const updateToDoHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {

        const auth = event.headers.Authorization
        const jwt = auth.split(' ')[1]

        const todoId = event.pathParameters.todoId
        const updatedTodoReq: UpdateTodoRequest = JSON.parse(event.body)

        const toDoItem = await updateTodo(updatedTodoReq, todoId, jwt)

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                item: toDoItem,
            }),
        }
    } catch (error) {
        console.error(`Error updating TODO item: ${error.message}`)

        return {
            statusCode: error.statusCode || 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                error: error.message,
            }),
        }
    }
}
