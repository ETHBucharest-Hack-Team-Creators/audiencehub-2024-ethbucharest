"use client";

import React, { useEffect, useState } from "react";
import { StarIcon } from "@heroicons/react/24/outline";
import { useFB } from "~~/hooks/useFB";

type Creator = {
  name: string;
  description: string;
  creator: string;
  imgURL: string;
  bannerURL: string;
};

const Page = () => {
  const { getCreators } = useFB();
  const [creators, setCreators] = useState<Creator[]>([]);

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const creatorsData = await getCreators();
        setCreators(creatorsData);
      } catch (e) {
        console.error(e);
      }
    };
    fetchCreators();
  }, []);

  return (
    <div className="flex flex-col px-12 pt-5">
      <div className="flex flex-row gap-3 py-8 justify-center">
        <StarIcon className="w-10 h-10 text-yellow-500 -m-1" />
        <h1 className="text-3xl text-center">Find new Creators</h1>
        <StarIcon className="w-10 h-10 text-yellow-500 -m-1" />
      </div>
      <div className="flex flex-col gap-5">
        {creators &&
          creators.map((creator, index) => (
            <div key={index} className="flex flex-row items-center overflow-x-auto shadow-md rounded-lg">
              <div className="flex-none" style={{ position: "relative", width: 350, height: 165 }}>
                <img
                  src={creator.bannerURL}
                  alt="creator banner"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <img
                  src={creator.imgURL}
                  alt="creator image"
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 70,
                    height: 70,
                    borderRadius: "100%",
                  }}
                />
              </div>
              <div className="flex flex-1 flex-col overflow-hidden">
                <div className="items-start text-center">Name</div>
                <div className="text-center">{creator.name}</div>
              </div>
              <div className="flex flex-1 flex-col overflow-hidden">
                <span className="items-start text-center">Description</span>
                <span className="text-center">{creator.description}</span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Page;
