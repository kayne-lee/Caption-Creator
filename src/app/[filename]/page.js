'use client'
import { clearTranscriptionItems } from "@/libs/awsTranscriptionHelpers";
import axios from "axios";
import { useEffect, useState } from "react";
import TranscriptionItem from "../components/TranscriptionItem";
import SparklesIcons from "../components/SparklesIcon";


export default function FilePage({params}) {
    const filename = params.filename;
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [isFetchingInfo, setIsFetchingInfo] = useState(false);
    const [awsTranscriptionItems, setAwsTranscriptionItems] = useState([]);
    useEffect(() => {
        getTranscription();
    }, [filename]);

    function getTranscription() {
        setIsFetchingInfo(true);
        axios.get('/api/transcribe?filename='+filename).then(response => {
            setIsFetchingInfo(false);
            const status = response.data?.status;
            const transcription = response.data?.transcription;
            if(status === 'IN_PROGRESS') {
                setIsTranscribing(true);
                setTimeout(getTranscription, 3000);
            } else {
                setIsTranscribing(false);
                setAwsTranscriptionItems(clearTranscriptionItems(transcription.results.items))
            }
        });
    }
    if (isTranscribing) {
        return (
            <div>Transcribing your video...</div>
        );
    }
    if (isFetchingInfo) {
        return (
            <div>
                Fetching information...
            </div>
        )
    }
    return (
        <div>
            <div className="grid grid-cols-2 gap-16">
                <div className="">
                    <h2 className="text-2xl mb-4 text-white/80">Transcription</h2>
                    <div className="grid grid-cols-3 gap-1 sticky top-0 bg-blue-800/80 p-2 rounded-md">
                        <div>From</div>
                        <div>End</div>
                        <div>Content</div>
                    </div>
                    {awsTranscriptionItems.length > 0 && awsTranscriptionItems.map(item => (
                        <TranscriptionItem item={item} />
                ))}
                </div>
                <div>
                    <h2 className="text-2xl mb-4 text-white/80">Result</h2>
                    <div className="mb-4 ">
                        <button className="inline-flex gap-2 bg-green-600 py-2 px-6 rounded-full cursor-pointer">
                            <SparklesIcons />
                            <span>Apply captions</span>
                        </button>
                    </div>
                        <div className="rounded-xl overflow-hidden">
                            <video 
                                controls
                                src={"https://caption-creator.s3.amazonaws.com/"+filename}
                            ></video>
                        </div>
                </div>
            </div>
            

        </div>
    )
}