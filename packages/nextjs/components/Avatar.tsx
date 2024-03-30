/* eslint-disable @next/next/no-img-element */
import React, { ChangeEvent, useRef, useState } from "react";

interface AvatarProps {
  imgUrl?: string;
  setImgUrl: any;
  setImgFile: any;
  size?: "small" | "medium" | "large"; // Define size options
}

const Avatar: React.FC<AvatarProps> = ({ imgUrl, setImgUrl, setImgFile, size = "medium" }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    small: "h-12 w-12",
    medium: "h-24 w-24",
    large: "h-36 w-36",
  };

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newAvatarUrl = URL.createObjectURL(file);
      setImgUrl(newAvatarUrl);
      setImgFile(file);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className={`avatar-uploader ${sizeClasses[size]} rounded-full overflow-hidden cursor-pointer`}
        onClick={handleAvatarClick}
      >
        {imgUrl ? (
          <img src={imgUrl} alt="Avatar" className={`mask mask-hexagon object-cover ${sizeClasses[size]}`} />
        ) : (
          <div className={`flex items-center justify-center bg-gray-200 ${sizeClasses[size]}`}>
            <span className="text-sm text-gray-500">Upload Avatar</span>
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default Avatar;
