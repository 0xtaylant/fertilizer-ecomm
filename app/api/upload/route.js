import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export async function POST(request) {
    console.log('AWS_REGION:', process.env.AWS_REGION);
    console.log('AWS_BUCKET_NAME:', process.env.AWS_BUCKET_NAME);
    console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? 'Set' : 'Not Set');
    console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? 'Set' : 'Not Set');
    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        console.log('File name:', file.name);
        console.log('File type:', file.type);
        console.log('File size:', file.size);

        const client = new S3Client({
            region: process.env.AWS_REGION || 'eu-central-1',
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            }
        });

        const fileBuffer = await file.arrayBuffer();
        const ext = file.name.split('.').pop();
        const fileName = `${Date.now()}.${ext}`;

        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileName,
            Body: Buffer.from(fileBuffer),
            ContentType: file.type,
        });

        const result = await client.send(command);

        return NextResponse.json({
            message: 'Upload successful',
            fileName: fileName,
            fileUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION || 'eu-central-1'}.amazonaws.com/${fileName}`,
            s3Result: result
        }, { status: 200 });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Upload failed', details: error.message }, { status: 500 });
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
};