import 'core-js';
import 'reflect-metadata';
import { container } from 'tsyringe';
import Elysia from 'elysia';
import { cors } from '@elysiajs/cors';
import { staticPlugin } from '@elysiajs/static';
import { AppDataSource } from '../commons/db/postgres';
import { RedisService } from '../commons/provider/redis.service';
import { JobSchedulerService } from '../commons/job-scheduler.service';
import appConfig from '../commons/config/app.config';
import module from '../modules/modules';

export class Application {
    private app: Elysia;
    private readonly jobScheduler: JobSchedulerService;
    private readonly redisService: RedisService;

    constructor() {
        this.app = new Elysia();
        this.jobScheduler = new JobSchedulerService();
        this.redisService = container.resolve(RedisService);
    }

    private setupMiddleware(): void {
        this.app
            .use(cors())
            .use(module)
            .use(staticPlugin())
            .onError(this.handleError);
    }

    private handleError({ error, code }: { error: Error; code: number }) {
        if (code === 404) {
            return {
                message: 'Route not found',
                status: 404
            };
        }

        return {
            message: error.message || 'Internal Server Error',
            status: code || 500
        };
    }

    private async initializeDatabase(): Promise<void> {
        try {
            await AppDataSource.initialize();
            console.log('Database connected successfully');
        } catch (err) {
            console.error(
                `Database connection failed: ${err instanceof Error ? err.message : 'Unknown error'}`
            );
            throw err;
        }
    }

    private async initializeScheduler(): Promise<void> {
        try {
            await this.jobScheduler.initializeScheduledJobs();
            console.log('Job scheduler initialized successfully');
        } catch (err) {
            console.error(
                `Job scheduler initialization failed: ${err instanceof Error ? err.message : 'Unknown error'}`
            );
            throw err;
        }
    }

    public async start(): Promise<void> {
        try {
            await this.initializeDatabase();
            await this.initializeScheduler();
            this.setupMiddleware();

            this.app.listen(appConfig.PORT);
            console.log(
                `🦊 Server is running at ${this.app.server?.hostname}:${this.app.server?.port}`
            );

            this.setupGracefulShutdown();
        } catch (err) {
            console.error('Application failed to start:', err);
            await this.shutdown(1);
        }
    }

    private setupGracefulShutdown(): void {
        const signals = ['SIGINT', 'SIGTERM', 'beforeExit'] as const;
        signals.forEach((signal) => {
            process.once(signal, () => this.shutdown(0));
        });
    }

    private async shutdown(exitCode: number): Promise<never> {
        console.log('Initiating graceful shutdown...');

        try {
            await this.app.stop();
            console.log('HTTP server closed');

            await AppDataSource.destroy();
            console.log('Database connection closed');

            this.redisService.close();
            console.log('Redis connection closed');

            process.exit(exitCode);
        } catch (err) {
            console.error('Error during shutdown:', err);
            process.exit(1);
        }
    }
}
