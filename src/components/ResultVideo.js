import SparklesIcons from "@/components/SparklesIcon";
import { transcriptionItemstoSrt } from "@/libs/awsTranscriptionHelpers";
import {FFmpeg} from "@ffmpeg/ffmpeg";
import {toBlobURL, fetchFile} from "@ffmpeg/util";
import {useEffect, useState, useRef} from "react";
import roboto from '../fonts/Roboto-Regular.ttf';
import robotoBold from '../fonts/Roboto-Bold.ttf';

export default function ResultVideo({filename, transcriptionItems}) {
    const videoUrl = "https://caption-creator.s3.amazonaws.com/"+filename;
    const [loaded, setLoaded] = useState(false);
    const ffmpegRef = useRef(new FFmpeg());
    const videoRef = useRef(null);

    useEffect(() => {
        videoRef.current.src =videoUrl;
        load();
    })

    const load = async () => {
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
        const ffmpeg = ffmpegRef.current;
        await ffmpeg.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
            wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        });
        await ffmpeg.writeFile('/tmp/roboto.ttf', await fetchFile(roboto));
        await ffmpeg.writeFile('/tmp/roboto-bold.ttf', await fetchFile(robotoBold));
        setLoaded(true);
    }

    const transcode = async () => {
        const ffmpeg = ffmpegRef.current;
        const srt = transcriptionItemstoSrt(transcriptionItems);
        await ffmpeg.writeFile(filename, await fetchFile(videoUrl));
        await ffmpeg.writeFile('subs.srt', srt);
        
        ffmpeg.on('log', ({ message }) => {
            console.log(message);
        });
        await ffmpeg.exec([
            '-i', filename, 
            'to', '00:00:05',
            '-vf',  `subtitles=subs.srt:fontsdir=/tmp:force_style=""`,
            'output.mp4'
        ]);
        const data = await ffmpeg.readFile('output.mp4');
        videoRef.current.src =
            URL.createObjectURL(new Blob([data.buffer], {type: 'video/mp4'}));
    }

    return (
        <>
            <div className="mb-4">
                <button 
                    onClick={transcode}
                    className="inline-flex gap-2 bg-green-600 py-2 px-6 rounded-full cursor-pointer">
                    <SparklesIcons />   
                    <span>Apply captions</span>
                </button>
            </div>
            <div className="rounded-xl overflow-hidden">
                <video 
                    data-video={0}
                    ref={videoRef}
                    controls>
                </video>
            </div>
        </>
    )
}