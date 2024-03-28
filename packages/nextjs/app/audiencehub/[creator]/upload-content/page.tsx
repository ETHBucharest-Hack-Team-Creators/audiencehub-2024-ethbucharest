"use client";

import React, { ChangeEvent, FormEvent, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useAccount } from "wagmi";
import { useFB } from "~~/hooks/useFB";

export default function Page({ params }: { params: { creator: string } }) {
  const [content, setContent] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState<string>("");

  const { address } = useAccount();
  const { postContent, storage } = useFB();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      setFiles((prev: any) => [...prev, ...selectedFiles]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("handle post", params.creator);
    setUploadStatus("Uploading...");

    console.log(files);

    if (!address || !content) return;

    try {
      const uploadPromises = files.map((file: File) => {
        if (!storage) return;
        const fileRef = ref(storage, `uploads/${file.name}`);
        return uploadBytes(fileRef, file).then(snapshot => getDownloadURL(snapshot.ref));
      });
      const downloadUrls = await Promise.all(uploadPromises);
      console.log(downloadUrls);

      console.log("Files uploaded:", downloadUrls);
      setUploadStatus("Upload complete!");

      await postContent(address, content, downloadUrls);

      setFiles([]);
      setContent("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  return (
    <div className="container mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col py-5 px-2 content-center items-center">
        <textarea
          value={content}
          onChange={handleContentChange}
          className="textarea textarea-bordered my-3 rounded w-full"
          placeholder="Your content"
        ></textarea>
        <div>
          <input className="file-input w-full my-3 max-w-xs" type="file" multiple onChange={handleFileChange} />
          {files.length > 0 && (
            <div>
              <h4>Files to Upload</h4>
              <ul>
                {files.map(
                  (
                    file: {
                      name:
                        | string
                        | number
                        | boolean
                        | React.ReactElement<any, string | React.JSXElementConstructor<any>>
                        | Iterable<React.ReactNode>
                        | React.ReactPortal
                        | Promise<React.AwaitedReactNode>
                        | null
                        | undefined;
                    },
                    index: React.Key | null | undefined,
                  ) => (
                    <li key={index}>{file.name}</li>
                  ),
                )}
              </ul>
            </div>
          )}
          {uploadStatus && <p>{uploadStatus}</p>}
        </div>

        <button className="btn btn-wide my-3 flex justify-center mt-2 btn-primary text-white text-xl" type="submit">
          post
        </button>
      </form>
    </div>
  );
}
