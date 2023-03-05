
import 'source-map-support/register'
import { deleteTodo } from '../../helpers/todos'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

export const deleteTodoHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {

        const auth = event.headers.Authorization
        const jwt = auth.split(' ')[1]

        const todoId = event.pathParameters.todoId
        const deleteResult = await deleteTodo(todoId, jwt)

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify(deleteResult),
        }
    } catch (error) {
        console.error(`Error deleting TODO item: ${error.message}`)

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
