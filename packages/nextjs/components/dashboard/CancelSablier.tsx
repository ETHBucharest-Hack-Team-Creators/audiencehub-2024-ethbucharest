import React from "react";

const CancelSablier = () => {
  return (
    <td>
      <button className="btn btn-sm" onClick={() => alert("Receipt already signed")}>
        Cancel Subscription
      </button>
    </td>
  );
};

export default CancelSablier;
