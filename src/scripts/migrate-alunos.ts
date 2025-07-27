import { collection, getDocs, updateDoc, doc } from 'firebase/firestore'
import { db } from '../config/firebase'

const COLLECTION_NAME = 'alunos'

async function migrateAlunos() {
  const alunosCollection = collection(db, COLLECTION_NAME)
  const querySnapshot = await getDocs(alunosCollection)
  
  console.log(`Found ${querySnapshot.size} records to migrate...`)
  
  for (const docSnapshot of querySnapshot.docs) {
    const data = docSnapshot.data()
    if (!data.userId) {
      console.log(`Migrating document ${docSnapshot.id}...`)
      await updateDoc(doc(db, COLLECTION_NAME, docSnapshot.id), {
        userId: 'MIGRATION_USER_ID' // Replace with the actual user ID
      })
    }
  }
  
  console.log('Migration completed!')
}

migrateAlunos().catch(console.error) 