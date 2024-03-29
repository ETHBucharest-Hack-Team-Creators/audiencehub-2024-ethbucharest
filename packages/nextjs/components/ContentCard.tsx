/* eslint-disable @next/next/no-img-element */
import React from "react";

// import Image from "next/image";

interface CardProps {
  title: string;
  description: string;
  imgUrls: string[];
  // onClick: () => void;
}

const ContentCard: React.FC<CardProps> = ({ title, description, imgUrls }) => {
  const handleClickCard = () => {
    console.log("card clicked");
  };

  return (
    <div className="content-card card card-side bg-base-100 shadow-xl my-7" onClick={handleClickCard}>
      <figure className="sm:w-full md:w-1/2 max-h-60 bg-transparent">
        <div className="carousel carousel-center max-w-md p-4 space-x-4 rounded-box bg-transparent">
          {imgUrls.map((item: string) => (
            <div className="carousel-item" key={item}>
              <img src={item} alt={title} style={{ height: "100%" }} className="rounded-box" />
            </div>
          ))}
        </div>
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
