"use client";

import { useEffect } from "react";
import { BlockieAvatar } from "~~/components/scaffold-eth";

export default function Page({ params }: { params: { creator: string } }) {
  useEffect(() => {
    console.log(params);
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 items-center align-middle mt-12 justify-items-center">
        <div className="avatar flex justify-center">
          <div className="w-24 mask mask-hexagon">
            <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
          </div>
        </div>
        <div className="flex justify-center mt-5 font-bold">{params.creator}</div>
        <button className="btn btn-wide flex justify-center mt-2 btn-primary text-white text-xl">Subscribe</button>
      </div>
    </>
  );
}
