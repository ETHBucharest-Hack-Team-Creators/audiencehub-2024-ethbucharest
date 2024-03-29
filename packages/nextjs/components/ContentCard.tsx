/* eslint-disable @next/next/no-img-element */
import React from "react";
// import Image from "next/image";

interface CardProps {
  title: string;
  description: string;
  imgUrl: string;
  // onClick: () => void;
}

const ContentCard: React.FC<CardProps> = ({ title, description, imgUrl }) => {
  const handleClickCard = () => {
    console.log("card clicked");
  };

  return (
    <div className="content-card card card-side bg-base-100 shadow-xl my-7" onClick={handleClickCard}>
      <figure className="sm:w-full md:w-1/2">
        <img src={imgUrl} alt={title} style={{ height: "100%" }} />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p>{description}</p>
        {/* <div className="card-actions justify-end">
          <button className="btn btn-primary">Open</button>
        </div> */}
      </div>
    </div>
  );
};

export default ContentCard;
