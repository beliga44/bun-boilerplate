import { Queue } from 'bullmq';
import { QueueJob } from './provider/queue.job';
import { QueueJobName } from './enum/queue-job-name';

interface QueueJobOptions {
    jobName: string
    cronExpression: string
}

export class JobSchedulerService {
    private static readonly DEFAULT_QUEUE_CONFIG = {
        removeOnComplete: true,
        removeOnFail: true
    } as const;

    private static readonly CRON_EXPRESSIONS = {
        DAILY_MIDNIGHT: '0 0 * * *',
        EVERY_THREE_MINUTES: '*/3 * * * *',
        EVERY_ONE_MINUTES: '*/1 * * * *'
    } as const;

    private async scheduleJob(
        queue: Queue,
        options: QueueJobOptions
    ): Promise<void> {
        try {
            await queue.add(
                options.jobName,
                {},
                {
                    repeat: {
                        cron: options.cronExpression
                    },
                    ...JobSchedulerService.DEFAULT_QUEUE_CONFIG
                }
            );
            console.log(`Successfully scheduled ${options.jobName} job`);
        } catch (error) {
            console.error(
                `Failed to schedule ${options.jobName} job: ${
                    error instanceof Error ? error.message : 'Unknown error'
                }`
            );
        }
    }

    public async initializeScheduledJobs(): Promise<void> {
        await this.scheduleJob(QueueJob.scheduleCheckQueueJob(), {
            jobName: QueueJobName.SCHEDULE_CHECK.toString(),
            cronExpression: JobSchedulerService.CRON_EXPRESSIONS.DAILY_MIDNIGHT
        });
    }
}
