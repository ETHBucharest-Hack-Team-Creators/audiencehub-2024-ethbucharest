// "use client";

// import React, { useEffect, useState } from "react";
// import { useAccount } from "wagmi";
// import ItemCard from "~~/components/ItemCard";
// import { useFB } from "~~/hooks/useFB";
// import { notification } from "~~/utils/scaffold-eth";

// export default function FanSubscriptionsTab() {
//   const [itemsList, setItemsList] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const { address } = useAccount();
//   const { getItems } = useFB();
// }


  // useEffect(() => {
  //   setLoading(true);
  //   const fetchData = async (address: string) => {
  //     try {
  //       const items = await getItems(address);
  //       console.log("items list fetched", items);
  //       setItemsList(items);
  //     } catch (error) {
  //       notification.error("Something went wrong");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };


  // return (
  //   <div className="overflow-x-auto shadow-md rounded-xl">
  //               <table className="table table-zebra-zebra">
  //                 <tbody>
  //                   {requests.map((request) => (<tr>
  //                     <td>
  //                       <div className="flex items-center gap-3">
  //                         <Link href={"/audiencehub/robert"}>
  //                           <div className="avatar">
  //                             <div className="mask mask-hexagon w-16 h-16">
  //                               <img src="/images/pfp.jpeg" alt="Avatar Tailwind CSS Component" />
  //                             </div>
  //                           </div>
  //                         </Link>
  //                         <div>
  //                           <Link href={"/audiencehub/robert"}>
  //                             <div className="font-bold pl-1">Fish man</div>
  //                           </Link>
  //                         </div>
  //                       </div>
  //                     </td>
  //                     <th>
  //                       <button className="btn btn-sm">Close Subscription</button>
  //                     </th>
  //                   </tr>)
  //                   }
  //                   {/* row 1 */}
  //                   <tr>
  //                     <td>
  //                       <div className="flex items-center gap-3">
  //                         <Link href={"/audiencehub/robert"}>
  //                           <div className="avatar">
  //                             <div className="mask mask-hexagon w-16 h-16">
  //                               <img src="/images/pfp.jpeg" alt="Avatar Tailwind CSS Component" />
  //                             </div>
  //                           </div>
  //                         </Link>
  //                         <div>
  //                           <Link href={"/audiencehub/robert"}>
  //                             <div className="font-bold pl-1">Fish man</div>
  //                           </Link>
  //                         </div>
  //                       </div>
  //                     </td>
  //                     <th>
  //                       <button className="btn btn-sm">Close Subscription</button>
  //                     </th>
  //                   </tr>
  //                   {/* row 2 */}
  //                   <tr>
  //                     <td>
  //                       <div className="flex items-center gap-3">
  //                         <div className="avatar">
  //                           <div className="mask mask-hexagon w-16 h-16">
  //                             <img src="/images/pfp.jpeg" alt="Avatar Tailwind CSS Component" />
  //                           </div>
  //                         </div>
  //                         <div>
  //                           <div className="font-bold pl-1">Fish man</div>
  //                         </div>
  //                       </div>
  //                     </td>
  //                     <th>
  //                       <button className="btn btn-sm">Close Subscription</button>
  //                     </th>
  //                   </tr>
  //                   {/* row 3 */}
  //                   <tr>
  //                     <td>
  //                       <div className="flex items-center gap-3">
  //                         <div className="avatar">
  //                           <div className="mask mask-hexagon w-16 h-16">
  //                             <img src="/images/pfp.jpeg" alt="Avatar Tailwind CSS Component" />
  //                           </div>
  //                         </div>
  //                         <div>
  //                           <div className="font-bold pl-1">Fish man</div>
  //                         </div>
  //                       </div>
  //                     </td>
  //                     <th>
  //                       <button className="btn btn-sm">Close Subscription</button>
  //                     </th>
  //                   </tr>
  //                   {/* row 4 */}
  //                   <tr>
  //                     <td>
  //                       <div className="flex items-center gap-3">
  //                         <div className="avatar">
  //                           <div className="mask mask-hexagon w-16 h-16">
  //                             <img src="/images/pfp.jpeg" alt="Avatar Tailwind CSS Component" />
  //                           </div>
  //                         </div>
  //                         <div>
  //                           <div className="font-bold pl-1">Fish man</div>
  //                         </div>
  //                       </div>
  //                     </td>
  //                     <th>
  //                       <button className="btn btn-sm">Close Subscription</button>
  //                     </th>
  //                   </tr>
  //                 </tbody>
  //               </table>
  //             </div>
  // )
  //                 }