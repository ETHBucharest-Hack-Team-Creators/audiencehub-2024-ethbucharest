"use client";

import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import ItemCard from "~~/components/ItemCard";
import { useFB } from "~~/hooks/useFB";
import { notification } from "~~/utils/scaffold-eth";

export default function FanItemsTab() {
  const [itemsList, setItemsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const { address } = useAccount();
  const { getFanItems } = useFB();

  useEffect(() => {
    setLoading(true);
    const fetchData = async (address: string) => {
      try {
        const items = await getFanItems(address);
        console.log(items);
        setItemsList(items);
      } catch (error) {
        notification.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (!address) return;
    fetchData(address);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  interface CardProps {
    title: string;
    description: string;
    imgUrls: string[];
    id: string;
    // onClick: () => void;
  }

  return (
    <div className="md-container md:mx-auto py-5 px-2 flex flex-col items-center">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className=" flex flex-row flex-wrap items-center">
          {itemsList.map((item: CardProps) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
