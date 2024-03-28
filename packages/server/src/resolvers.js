import { collection, addDoc } from 'firebase/firestore'

const resolvers = {
  Query: {
    content: async () => {
      try {
        return 'my content'
      } catch (error) {
        console.error('Error in content resolver:', error)
        throw new Error(error.message)
      }
    }
  },
  Mutation: {
    postContent: async (creatorAddress) => {
      try {
        const docRef = await addDoc(collection(db, 'creatorsContent'), {
          creator: creatorAddress,
          contet: 'blalbalba'
        })
        console.log('Document written with ID: ', docRef.id)
        return {
          succes: true,
          docRef: docRef.id
        }
      } catch (e) {
        console.error('Error adding document: ', e)
      }
    }
  }
}

export default resolvers
