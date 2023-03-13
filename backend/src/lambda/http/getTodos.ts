import 'source-map-support/register'
import { getAllTodos } from '../../helpers/businessLogic/todos'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

export const getAllToDosHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {

        const auth = event.headers.Authorization
        const jwt = auth.split(' ')[1]
        const toDos = await getAllTodos(jwt)

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                items: toDos,
            }),
        }
    } catch (error) {
        console.error(`Error getting all TODO items: ${error.message}`)

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
