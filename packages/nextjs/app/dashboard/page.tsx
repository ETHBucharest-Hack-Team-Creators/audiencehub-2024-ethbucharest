"use client"
import React from "react";

const Page = () => {
  const [userType, setUserType] = React.useState("fan");
  return (
    <>
      <div className="flex py-8 justify-center gap-5">
        <button className="btn btn-wide flex justify-center mt-2 btn-primary text-white text-xl" onClick={() => {setUserType("fan")}}>Fan</button>
        <button className="btn btn-wide flex justify-center mt-2 btn-primary text-white text-xl" onClick={() => {setUserType("creator")}}>Creator</button>
      </div>
      <div className="px-12 pt-5">
        {userType}
      </div>
    </>
  );
};

export default Page;
