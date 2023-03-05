import 'source-map-support/register'
import { createTodo } from '../../helpers/todos'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

// Function to create a new TODO item
export const createTodoHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {

        const auth = event.headers.Authorization
        const jwt = auth.split(' ')[1]

        const todoRequest: CreateTodoRequest = JSON.parse(event.body)
        const createdTodoItem = await createTodo(todoRequest, jwt)

        return {
            statusCode: 201,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                item: createdTodoItem,
            }),
        }
    } catch (error) {
        console.error(`Error creating TODO item: ${error.message}`)

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

