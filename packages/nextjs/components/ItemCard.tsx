/* eslint-disable @next/next/no-img-element */
import React from "react";

const ItemCard = ({ item }: any) => {
  console.log(item, item.imgUrl, item.title, item.item);
  return (
    <div className="card w-72 bg-base-100 shadow-xl mx-5 h-80 my-4">
      <figure className="p-0 h-1/2">
        <img src={item.imgUrl} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </figure>
      <div className="items-center text-center p-2">
        <h2 className="text-center text-xl font-bold">{item.title}</h2>
        <p className="m-2">{item.description}</p>
        <p className="m-2">{item.price}</p>
        <p className="text-xs break-all text-left text-slate-300">{item.id}</p>
      </div>
    </div>
  );
};

export default ItemCard;
