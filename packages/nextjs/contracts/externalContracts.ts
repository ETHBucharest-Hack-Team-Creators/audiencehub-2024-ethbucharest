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

   421614: {
    Sablier: {
      address: "0x483bdd560dE53DC20f72dC66ACdB622C5075de34",
      abi: sablierabi,
    },
    DAI: {
     address: '0xc3826E277485c33F3D99C9e0CBbf8449513210EE',
     abi: daiabi
    },


  },

  84532: {
    Sablier: {
      address: "0xbd7AAA2984c0a887E93c66baae222749883763d3",
      abi: sablierabi,
    },
    DAI: {
     address: '0x04C1b393f5eE228C8FA464D5F4f2904a663dC4C4',
     abi: daiabi
    },
  }
  
 } as const;



// const externalContracts = {} as const;

// export default externalContracts satisfies GenericContractsDeclaration;
export default externalContracts;
