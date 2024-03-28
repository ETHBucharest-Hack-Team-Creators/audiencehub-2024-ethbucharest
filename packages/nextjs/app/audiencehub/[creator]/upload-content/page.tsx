"use client";

import React, { ChangeEvent, FormEvent, useState } from "react";
import { useAccount } from "wagmi";
import { useDB } from "~~/hooks/useDB";

// import { useEffect } from "react";
// import { useAccount } from "wagmi";
// import ApproveToken from "~~/components/ApproveToken";
// import { BlockieAvatar } from "~~/components/scaffold-eth";
// import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

export default function Page({ params }: { params: { creator: string } }) {
  const [content, setContent] = useState<string>("");

  const { address } = useAccount();
  const { postContent } = useDB();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("handle post", params.creator);
    if (!address || !content) return;
    try {
      await postContent(address, content, ["url1"]);
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
        <input type="file" className="file-input w-full my-3 max-w-xs" />
        <button className="btn btn-wide my-3 flex justify-center mt-2 btn-primary text-white text-xl" type="submit">
          post
        </button>
      </form>
    </div>
  );
}
