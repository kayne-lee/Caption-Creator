import { GetTranscriptionJobCommand, StartTranscriptionJobCommand, TranscribeClient } from "@aws-sdk/client-transcribe";

function getClient() {
    return new TranscribeClient({
        region: 'ca-central-1',
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
    });
}

function createTranscriptCommand(filename) {
    return new StartTranscriptionJobCommand({
        TranscriptionJobName: filename,
        OutputBucketName: process.env.BUCKET_NAME,
        OutputKey: filename + '.transcription',
        IdentifyLanguage: true,
        Media: {
            MediaFileUrl: 's3://' + process.env.BUCKET_NAME + '/' + filename,
        },
    });
}
export async function GET(req) {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);
    const filename = searchParams.get('filename')

    const transcribeClient = getClient();

    const transcriptionStatus = new GetTranscriptionJobCommand({
        TranscriptionJobName: filename,
    });

    let exitstingJobFound = false;
    try {
        const jobStatusResult = await transcribeClient.send(
            transcriptionStatus
        );
        exitstingJobFound = true;
    } catch (e) {

    }

    console.log(jobStatusResult);
    
    if (!exitstingJobFound) {
        const transcriptionCommand = StartTranscriptionJobCommand(filename);
        const result = await transcribeClient.send(transcriptionCommand);
    }

    
    return Response.json('ok')
    


}