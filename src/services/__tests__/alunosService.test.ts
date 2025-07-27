import { vi, describe, it, expect, beforeEach } from 'vitest'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore'
import { alunosService } from '../alunosService'
import { db } from '../../config/firebase'

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  getDocs: vi.fn(),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  doc: vi.fn(),
  onSnapshot: vi.fn(),
  query: vi.fn(),
  orderBy: vi.fn(),
  Timestamp: {
    now: () => ({ seconds: 1234567890, nanoseconds: 0 }),
  },
}))

describe('alunosService', () => {
  const mockAlunos = [
    { id: '1', nome: 'João', idade: 20 },
    { id: '2', nome: 'Maria', idade: 22 },
  ]

  const mockQuerySnapshot = {
    docs: mockAlunos.map(aluno => ({
      id: aluno.id,
      data: () => ({ nome: aluno.nome, idade: aluno.idade }),
    })),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(collection as any).mockReturnValue('mockCollection')
    ;(query as any).mockReturnValue('mockQuery')
    ;(orderBy as any).mockReturnValue('mockOrderBy')
  })

  describe('getAll', () => {
    it('should return all alunos', async () => {
      ;(getDocs as any).mockResolvedValue(mockQuerySnapshot)

      const result = await alunosService.getAll()

      expect(collection).toHaveBeenCalledWith(db, 'alunos')
      expect(query).toHaveBeenCalledWith('mockCollection', 'mockOrderBy')
      expect(orderBy).toHaveBeenCalledWith('createdAt', 'desc')
      expect(getDocs).toHaveBeenCalledWith('mockQuery')
      expect(result).toEqual(mockAlunos)
    })

    it('should throw error when getDocs fails', async () => {
      ;(getDocs as any).mockRejectedValue(new Error('Firebase error'))

      await expect(alunosService.getAll()).rejects.toThrow('Falha ao carregar dados dos alunos')
    })
  })

  describe('add', () => {
    const newAluno = { nome: 'Pedro', idade: 25 }
    const mockDocRef = { id: '3' }

    it('should add a new aluno', async () => {
      ;(addDoc as any).mockResolvedValue(mockDocRef)

      const result = await alunosService.add(newAluno)

      expect(collection).toHaveBeenCalledWith(db, 'alunos')
      expect(addDoc).toHaveBeenCalledWith('mockCollection', {
        ...newAluno,
        createdAt: expect.any(Object),
        updatedAt: expect.any(Object),
      })
      expect(result).toBe('3')
    })

    it('should throw error when addDoc fails', async () => {
      ;(addDoc as any).mockRejectedValue(new Error('Firebase error'))

      await expect(alunosService.add(newAluno)).rejects.toThrow('Falha ao cadastrar aluno')
    })
  })

  describe('update', () => {
    const updateData = { nome: 'João Atualizado', idade: 21 }

    it('should update an aluno', async () => {
      ;(doc as any).mockReturnValue('mockDoc')
      ;(updateDoc as any).mockResolvedValue(undefined)

      await alunosService.update('1', updateData)

      expect(doc).toHaveBeenCalledWith(db, 'alunos', '1')
      expect(updateDoc).toHaveBeenCalledWith('mockDoc', {
        ...updateData,
        updatedAt: expect.any(Object),
      })
    })

    it('should throw error when updateDoc fails', async () => {
      ;(doc as any).mockReturnValue('mockDoc')
      ;(updateDoc as any).mockRejectedValue(new Error('Firebase error'))

      await expect(alunosService.update('1', updateData)).rejects.toThrow('Falha ao atualizar dados do aluno')
    })
  })

  describe('delete', () => {
    it('should delete an aluno', async () => {
      ;(doc as any).mockReturnValue('mockDoc')
      ;(deleteDoc as any).mockResolvedValue(undefined)

      await alunosService.delete('1')

      expect(doc).toHaveBeenCalledWith(db, 'alunos', '1')
      expect(deleteDoc).toHaveBeenCalledWith('mockDoc')
    })

    it('should throw error when deleteDoc fails', async () => {
      ;(doc as any).mockReturnValue('mockDoc')
      ;(deleteDoc as any).mockRejectedValue(new Error('Firebase error'))

      await expect(alunosService.delete('1')).rejects.toThrow('Falha ao excluir aluno')
    })
  })

  describe('subscribeToChanges', () => {
    it('should subscribe to changes and return unsubscribe function', () => {
      const mockUnsubscribe = vi.fn()
      const mockCallback = vi.fn()
      ;(onSnapshot as any).mockImplementation((query, callback) => {
        callback(mockQuerySnapshot)
        return mockUnsubscribe
      })

      const unsubscribe = alunosService.subscribeToChanges(mockCallback)

      expect(query).toHaveBeenCalledWith('mockCollection', 'mockOrderBy')
      expect(orderBy).toHaveBeenCalledWith('createdAt', 'desc')
      expect(mockCallback).toHaveBeenCalledWith(mockAlunos)
      expect(unsubscribe).toBe(mockUnsubscribe)
    })
  })

  describe('testConnection', () => {
    it('should return true when connection is successful', async () => {
      ;(getDocs as any).mockResolvedValue(mockQuerySnapshot)

      const result = await alunosService.testConnection()

      expect(result).toBe(true)
    })

    it('should return false when connection fails', async () => {
      ;(getDocs as any).mockRejectedValue(new Error('Firebase error'))

      const result = await alunosService.testConnection()

      expect(result).toBe(false)
    })
  })
}) 