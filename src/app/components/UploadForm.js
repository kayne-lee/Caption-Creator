'use client'
import UploadIcon from "./UploadIcon";
import axios from "axios";

export default function UploadForm() {
    async function upload(ev) {
        ev.preventDefault();
        const files = ev.target.files;
        if (files.length > 0) {
            const file = files[0];
            const res = await axios.postForm('/api/upload', {
                file,
            });
            console.log(res.data);
        }
      }
    return (
        <div className="text-center">
            <label className="inline-flex gap-2 bg-green-600 py-2 px-6 rounded-full cursor-pointer">
                <UploadIcon />
                <span>Choose File</span>
                <input onChange={upload} type="file" className="hidden"/>
            </label>
        </div>
  )
}
