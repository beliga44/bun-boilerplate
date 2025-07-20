import { Worker, Job, ConnectionOptions } from 'bullmq';
import { TodoService } from '../todo.service';
import bullConfig from '../../../commons/config/bull.config';

export class UpdateTodoWorker {
    private worker: Worker;
    private todoService: TodoService;

    constructor(
        queueName: string,
        connection: ConnectionOptions,
        todoService: TodoService
    ) {
        this.todoService = todoService;
        this.worker = new Worker(
            queueName,
            async (job: Job) => {
                console.log(`Processing ${queueName} Job Id: ${job.id}`);

                return await this.processJob(job);
            },
            {
                connection,
                concurrency: bullConfig.BULL_JOB_CONCURRENCY,
                lockDuration: 2 * 60000
            }
        );
    }

    private async processJob(job: Job): Promise<any> {
        try {
            // Assuming job.data contains the necessary information to update a todo

            return true;
        } catch (error) {
            // Log the error and return false to indicate failure
            console.error(
                `Error processing ${job.name} Job Id: ${job.id}`,
                error
            );
            return false;
        }
    }
}
