import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";
import sablierabi from '../abi/sablierLinear.json';
import daiabi from '../abi/dai.json';

/**
 * @example
 * const externalContracts = {
 *   1: {
 *     DAI: {
 *       address: "0x...",
 *       abi: [...],
 *     },
 *   },
 * } as const;
 */



 const externalContracts = {
    11155111: {
     Sablier: {
       address: "0x7a43F8a888fa15e68C103E18b0439Eb1e98E4301",
       abi: sablierabi,
     },
     DAI: {
      address: '0x776b6fC2eD15D6Bb5Fc32e0c89DE68683118c62A',
      abi: daiabi
     },
   },
 } as const;



// const externalContracts = {} as const;

// export default externalContracts satisfies GenericContractsDeclaration;
export default externalContracts;
