import { getTransactionReceipt } from '@wagmi/core'
import { config } from './config'

await getTransactionReceipt(config, {
  hash: '0x4ca7ee652d57678f26e887c149ab0735f41de37bcad58c9f6d3ed5824f15b74d',
})