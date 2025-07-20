export default {
    AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
    AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
    AWS_S3_BUCKET: process.env.AWS_S3_BUCKET || 'bucket-name',
    AWS_REGION: process.env.AWS_REGION || 'ap-southeast-1',
    AWS_S3_BASE_URL:
        process.env.AWS_S3_BASE_URL ||
        'https://x.s3.ap-southeast-1.amazonaws.com'
};
