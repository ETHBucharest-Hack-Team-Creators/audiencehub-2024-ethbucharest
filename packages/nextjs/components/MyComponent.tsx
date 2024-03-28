import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { useAccount } from "wagmi";

function MyComponent() {

    
    const {address} = useAccount();
    const handleButtonPress = async () => {
      // Execute first hook
      const {
        writeAsync: writeAsyncSablier,
        isLoading: isLoadingSablier,
        isMining: isMiningSablier,
        error: errorSablier
      } = useScaffoldContractWrite({
        contractName: "Sablier",
        functionName: "createWithDurations",
        args: [
          [
            address,
            "0x64336a17003cDCcde3cebEcff1CDEc2f9AeEdB7d",
            10000000000000000,
            "0x776b6fC2eD15D6Bb5Fc32e0c89DE68683118c62A",
            true,
            true,
            [0, 3600],
            ["0x0000000000000000000000000000000000000000", 0]
          ]
        ],
        blockConfirmations: 1,
        onBlockConfirmation: txnReceipt => {
          console.log("Sablier Transaction blockHash", txnReceipt.blockHash);
        },
      });
  
      // Execute second hook
      const {
        writeAsync: writeAsyncDAI,
        isLoading: isLoadingDAI,
        isMining: isMiningDAI,
        error: errorDAI
      } = useScaffoldContractWrite({
        contractName: "DAI",
        functionName: "increaseAllowance",
        args: ["0x7a43F8a888fa15e68C103E18b0439Eb1e98E4301", "10000000000000000000000"],
        blockConfirmations: 1,
        onBlockConfirmation: txnReceipt => {
          console.log("DAI Transaction blockHash", txnReceipt.blockHash);
        },
      });
  
      // Execute both hooks
      await writeAsyncSablier();
      await writeAsyncDAI();
    };
  
    return (
      <button onClick={handleButtonPress}>Press me</button>
    );
  }
  
  export default MyComponent;