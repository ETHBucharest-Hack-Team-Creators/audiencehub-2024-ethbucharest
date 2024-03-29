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
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    if (!address) return;
    setLoading(true);
    const fetchData = async (address: string) => {
      try {
        const requests = await getFanSubscriptions(address);
        const addresses = requests.map((item: any) => item.creator);
        const creators = await getCreatorsByAdresses(addresses);
        setRequests(creators);
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

  return (
    <div className="overflow-x-auto shadow-md rounded-xl">
      {requests.map(item => (
        <Link href={`/audiencehub/creator-content/${item.creator}`} key={item.creator}>
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="mask mask-hexagon w-16 h-16">
                <img src={item.imgUrl} alt={item.name} />
              </div>
            </div>
            <div>
              <div className="font-bold pl-1">Fish man</div>
            </div>
          </div>
          {/* <th>
            <button className="btn btn-sm">Close Subscription</button>
          </th> */}
        </Link>
      ))}
    </div>
  );
}
