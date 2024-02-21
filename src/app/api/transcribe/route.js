import { StartTranscriptionJobCommand, TranscribeClient } from "@aws-sdk/client-transcribe";

export async function GET(req) {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);
    const filename = searchParams.get('filename');

    const transcribeClient = new TranscribeClient({
        region: 'ca-central-1',
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
    });

    const transcriptionCommand = new StartTranscriptionJobCommand({
        TranscriptionJobName: filename,
        OutputBucketName: process.env.BUCKET_NAME,
        OutputKey: filename + '.transcription',
        IdentifyLanguage: true,
        Media: {
            MediaFileUri: 's3://' + process.env.BUCKET_NAME + '/' + filename,
        }
    })

    const result = await transcribeClient.send(transcriptionCommand);
    return Response.json(result);
}