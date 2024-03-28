"use client";

import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import { useAccount } from "wagmi";
import { useFB } from "~~/hooks/useFB";
import { notification } from "~~/utils/scaffold-eth";

type FormData = {
  title: string;
  description: string;
};

export default function Page({ params }: { params: { creator: string } }) {
  const [formData, setFormData] = useState<FormData>({ title: "", description: "" });
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { address } = useAccount();
  const { postContent, uploadImages } = useFB();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      setFiles((prev: any) => [...prev, ...selectedFiles]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!address || !formData.title) return;
    setLoading(true);

    try {
      const downloadUrls = await uploadImages(files);
      await postContent(address, formData.title, formData.description, downloadUrls);

      notification.success(`${params.creator}: Content published`);

      setFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setFormData({ title: "", description: "" });
    } catch (error) {
      console.log(error);
      notification.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="md:container md:mx-auto py-5 px-2">
      {/* <h1 className="text-xl">Create a new exclusive content</h1> */}
      <form onSubmit={handleSubmit} className="flex flex-col py-5">
        <input
          type="text"
          id="title"
          name="title"
          placeholder="✎  Title goes here"
          className="input input-ghost w-full max-w-xs rounded text-xl"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <textarea
          id="description"
          name="description"
          value={formData.description}
          className="textarea textarea-bordered my-3 rounded w-full text-base"
          placeholder="Dream it, write it"
          onChange={handleChange}
          required
        ></textarea>
        <div>
          <input
            ref={fileInputRef}
            className="file-input w-full my-3 text-sm"
            type="file"
            multiple
            onChange={handleFileChange}
          />
          {files.length > 0 && (
            <div>
              <ul className="flex flex-row flex-wrap">
                {files.map((file: File, index: React.Key | null | undefined) => (
                  <li key={index} className="text-sm font-thin m-2" style={{ width: "200px" }}>
                    {file.name}
                    {file.type.startsWith("image/") && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={URL.createObjectURL(file)}
                        alt="Preview"
                        style={{ width: "200px", height: "200px", objectFit: "cover" }}
                      />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <button
          className="btn btn-wide my-3 flex justify-center btn-primary text-white text-xl self-center"
          type="submit"
        >
          {loading && <span className="loading loading-spinner"></span>}
          Publish
        </button>
      </form>
    </div>
  );
}
