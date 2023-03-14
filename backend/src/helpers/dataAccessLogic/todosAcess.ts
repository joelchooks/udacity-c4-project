
import { TodoUpdate } from "../../models/TodoUpdate";
import { Types } from 'aws-sdk/clients/s3';
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { TodoItem } from "../../models/TodoItem";
import { createLogger } from '../../utils/logger';
import * as AWS from "aws-sdk";
import * as AWSXRay from 'aws-xray-sdk'

// TODO: Implement the dataLayer logic

const logger = createLogger('TodosAccess');

const XAWS = AWSXRay.captureAWS(AWS)


export class ToDoAccess {
    private readonly documentClient: DocumentClient;
    private readonly mys3Client: Types;
    private readonly toDoTable: string;
    private readonly s3BuckName: string;

    constructor() {
        this.documentClient = new AWS.DynamoDB.DocumentClient();
        this.mys3Client = new XAWS.S3({ signatureVersion: 'v4' });
        this.toDoTable = process.env.TODOS_TABLE;
        this.s3BuckName = process.env.S3_BUCKET_NAME;
    }


    // Return an array of all TodoItems related to the specified userId.

    async getAllToDos(userId: string): Promise<TodoItem[]> {
        logger.info('Fetching todos');

        const params = {
            TableName: this.toDoTable,
            KeyConditionExpression: "#userId = :userId",
            ExpressionAttributeNames: {"#userId": "userId"},
            ExpressionAttributeValues: {
                ":userId": userId
            }
        };

        const response = await this.documentClient.query(params).promise();
        console.log(response);
        const items = response.Items;

        return items as TodoItem[];
    }

    
    // Creates a new TodoItem in the DynamoDB table.

    async createTodoItem(todoItem: TodoItem): Promise<TodoItem> {
        logger.info('Creating todo');

        const params = {
            TableName: this.toDoTable,
            Item: todoItem,
        };

        const response = await this.documentClient.put(params).promise();
        console.log(response);

        return todoItem as TodoItem;
    }

    
    // Updates an existing Todo Item in the DynamoDB table.

    async updateTodoItem(todoUpdate: TodoUpdate, todoId: string, userId: string): Promise<TodoUpdate> {

        logger.info('Updating a todo');

        const params = {
            TableName: this.toDoTable,
            Key: {
                "userId": userId,
                "todoId": todoId
            },
            UpdateExpression: "set #a = :a, #b = :b, #c = :c",
            ExpressionAttributeNames: {"#a": "name", "#b": "dueDate", "#c": "done"},
            ExpressionAttributeValues: {
                ":a": todoUpdate['name'],
                ":b": todoUpdate['dueDate'],
                ":c": todoUpdate['done']
            },
            ReturnValues: "ALL_NEW"
        };

        const response = await this.documentClient.update(params).promise();
        console.log(response);
        const attributes = response.Attributes;

        return attributes as TodoUpdate;
    }
    

    // Deletes a TodoItem from the DynamoDB table.
    async deleteTodoItem(todoId: string, userId: string): Promise<string> {
        
        logger.info("Deleting a todo");

        const params = {
            TableName: this.toDoTable,
            Key: {
                "userId": userId,
                "todoId": todoId
            },
        };

        const response = await this.documentClient.delete(params).promise();
        console.log(response);

        return "" as string;
    }



    
    // Generates a signed URL that can be used to upload a file to the

    async generateUploadUrl(todoId: string): Promise<string> {

        logger.info('Getting an upload url');


        const uri = this.mys3Client.getSignedUrl('putObject', {
            Bucket: this.s3BuckName,
            Key: todoId,
            Expires: 2000,
        });

        return uri as string;
    }
}
