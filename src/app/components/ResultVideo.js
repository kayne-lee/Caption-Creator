import SparklesIcons from "../components/SparklesIcon";
import { useEffect, useState } from "react";

export default function ResultVideo({filename}) {
    const [videoSource, setVideoSource] = useState('0');
    useEffect(() => {
        setVideoSource("https://caption-creator.s3.amazonaws.com/"+filename);
    }, []);
    return (
        <>
            <div className="mb-4 ">
                <button className="inline-flex gap-2 bg-green-600 py-2 px-6 rounded-full cursor-pointer">
                    <SparklesIcons />
                    <span>Apply captions</span>
                </button>
            </div>
            <div className="rounded-xl overflow-hidden">
                <video 
                    controls
                    data-video={videoSource}
                    src={videoSource}
                ></video>
            </div>
        </>
    )
}