import React from 'react'

const Page = ({ params }: { params: { creator: string } } ) => {


    //with creator address we query firebase
    //we should get subscriptions/users/connected-user (useAccount)

    //we should get subscribed: true

    //

    // creator/subscripts/users 
    // creator/content/

//    0x90 : {
           
//            streamId: 822, -> query metadata -> see status of the stream

//     }


  return (
    <div>   <div className="flex justify-center mt-5 font-bold">{params.creator} </div></div>
  )
}

export default Page