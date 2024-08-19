import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export async function POST(request) {

    try {
        const formData = await request.formData();
        const file = formData.get('file');
        const links = [];

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }


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
            ACL: 'public-read',
        });
        
        const link =`https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION || 'eu-central-1'}.amazonaws.com/${fileName}`;
        links.push(link);

        const result = await client.send(command);

        return NextResponse.json({ links
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