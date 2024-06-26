"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { StarIcon } from "@heroicons/react/24/outline";
import { useFB } from "~~/hooks/useFB";

type Creator = {
  name: string;
  description: string;
  price: number;
  creator: string;
  imgUrl: string;
  bannerURL: string;
};

const Page = () => {
  const { getCreators } = useFB();
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const { address } = useAccount();

  useEffect(() => {
    setLoading(true);
    const fetchCreators = async () => {
      try {
        const creatorsData = await getCreators();
        setCreators(creatorsData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchCreators();
  }, [address]);

  return loading ? (
    <h1 className="flex justify-center pt-10">Loading...</h1>
  ) : (
    <div className="flex flex-col px-12 pt-4">
      <div className="flex flex-row gap-3 py-8 justify-center">
        <StarIcon className="w-10 h-10 text-yellow-500 -m-1" />
        <h1 className="text-3xl text-center">Find new Creators</h1>
        <StarIcon className="w-10 h-10 text-yellow-500 -m-1" />
      </div>
      <div className="flex flex-col gap-6">
        {creators &&
          creators.map((creator, index) => (
            <Link key={index} href={`/audiencehub/${creator.creator}`}>
              <div key={index} className="flex flex-row items-center overflow-x-aut shadow-lg rounded-lg">
                <div className="flex-none" style={{ position: "relative", width: 350, height: 165 }}>
                  {(() => {
                    if (creator.bannerURL) {
                      return (
                        <img
                          src={creator.bannerURL}
                          alt="creator banner"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      );
                    } else {
                      return (
                        <img
                          src="/images/default-banner.webp"
                          alt="creator banner"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      );
                    }
                  })()}
                  <img
                    className="mask mask-hexagon"
                    src={creator.imgUrl}
                    alt="creator image"
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: 110,
                      height: 110,
                    }}
                  />
                </div>
                <div className="flex flex-1 flex-col p-1 overflow-hidden">
                  <div className="text-center">{creator.name}</div>
                </div>
                <div className="flex flex-1 flex-col p-1 overflow-hidden">
                  <span className="text-center">{creator.description}</span>
                </div>
                <div className="flex flex-1 flex-col p-1 overflow-hidden">
                  <span className="text-center">{creator.price}</span>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default Page;
