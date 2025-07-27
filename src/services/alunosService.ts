import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  orderBy,
  Timestamp 
} from 'firebase/firestore'
import { db } from '../config/firebase'
import type { Aluno, AlunoInput } from '../stores/alunos/types'

const COLLECTION_NAME = 'alunos'

export interface FirebaseAluno {
  id: string
  nome: string
  idade: number
  createdAt: Timestamp
  updatedAt: Timestamp
}

const alunosCollection = collection(db, COLLECTION_NAME)

export const alunosService = {
  async getAll(): Promise<Aluno[]> {
    try {
      const q = query(alunosCollection, orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        nome: doc.data().nome,
        idade: doc.data().idade,
      }))
    } catch (error) {
      console.error('Erro ao buscar alunos:', error)
      throw new Error('Falha ao carregar dados dos alunos')
    }
  },

  async add(aluno: AlunoInput): Promise<string> {
    try {
      const now = Timestamp.now()
      const docRef = await addDoc(alunosCollection, {
        nome: aluno.nome,
        idade: aluno.idade,
        createdAt: now,
        updatedAt: now,
      })
      return docRef.id
    } catch (error) {
      console.error('Erro ao adicionar aluno:', error)
      throw new Error('Falha ao cadastrar aluno')
    }
  },

  async update(id: string, aluno: AlunoInput): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id)
      await updateDoc(docRef, {
        nome: aluno.nome,
        idade: aluno.idade,
        updatedAt: Timestamp.now(),
      })
    } catch (error) {
      console.error('Erro ao atualizar aluno:', error)
      throw new Error('Falha ao atualizar dados do aluno')
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id)
      await deleteDoc(docRef)
    } catch (error) {
      console.error('Erro ao deletar aluno:', error)
      throw new Error('Falha ao excluir aluno')
    }
  },

  subscribeToChanges(callback: (alunos: Aluno[]) => void): () => void {
    const q = query(alunosCollection, orderBy('createdAt', 'desc'))
    
    return onSnapshot(q, (querySnapshot) => {
      const alunos: Aluno[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        nome: doc.data().nome,
        idade: doc.data().idade,
      }))
      callback(alunos)
    }, (error) => {
      console.error('Erro no listener:', error)
    })
  },

  async testConnection(): Promise<boolean> {
    try {
      await getDocs(query(alunosCollection))
      return true
    } catch (error) {
      console.warn('Firebase desconectado:', error)
      return false
    }
  }
} 