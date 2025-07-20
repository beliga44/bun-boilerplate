import { Queue } from 'bullmq';
import { sharedRedis } from './redis-bull.service';
import { QueueJobName } from '../enum/queue-job-name';

export class QueueJob {
    private static instance: QueueJob;
    private scheduleCheckQueue = new Queue(
        QueueJobName.SCHEDULE_CHECK.toString(),
        {
            connection: sharedRedis
        }
    );
    private updateTodoQueue = new Queue(QueueJobName.UPDATE_TODO.toString(), {
        connection: sharedRedis
    });

    private constructor() {}

    static getInstance() {
        if (!this.instance) {
            this.instance = new QueueJob();
        }
        return this.instance;
    }

    static scheduleCheckQueueJob() {
        return this.getInstance().scheduleCheckQueue;
    }

    static updateTodoQueueJob() {
        return this.getInstance().updateTodoQueue;
    }
}
