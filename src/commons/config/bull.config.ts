export default {
    BULL_JOB_CONCURRENCY: parseInt(process.env.BULL_JOB_CONCURRENCY || '10', 10)
};
