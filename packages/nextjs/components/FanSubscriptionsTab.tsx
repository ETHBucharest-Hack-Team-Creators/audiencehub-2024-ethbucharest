/* eslint-disable @next/next/no-img-element */
// "use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { useFB } from "~~/hooks/useFB";
import { notification } from "~~/utils/scaffold-eth";

export default function FanSubscriptionsTab() {
  const [loading, setLoading] = useState(true);

  const { address } = useAccount();
  const { getFanSubscriptions, getCreatorsByAdresses } = useFB();
  const [creators, setCreators] = useState<any[]>([]);

  useEffect(() => {
    if (!address) return;
    setLoading(true);
    const fetchData = async (address: string) => {
      try {
        const requests = await getFanSubscriptions(address);
        const addresses = requests.map((item: any) => item.creator);
        const creators = await getCreatorsByAdresses(addresses);
        setCreators(creators);
      } catch (error) {
        notification.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchData(address);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  if (loading) return <p>Loading..</p>;

  return loading ? (
    <h1 className="flex justify-center pt-10">Loading...</h1>
  ) : (
    <div className="flex flex-col gap-6">
      {creators &&
        creators.map((creator, index) => (
          
          <Link key={index} href={`/audiencehub/creator-content/${creator.creator}`}>
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
  );
}
