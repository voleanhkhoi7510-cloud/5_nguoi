import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { initialPersons, initialRelations } from './genealogyData'
import type { Person, Relation } from './genealogyData'

interface GenealogyValue {
  persons: Person[]
  relations: Relation[]
  addRelation: (data: Omit<Relation, 'id'>) => void
  updateRelation: (id: string, data: Omit<Relation, 'id'>) => void
  deleteRelation: (id: string) => void
}

const GenealogyContext = createContext<GenealogyValue | null>(null)

const newId = () => `r${Math.random().toString(36).slice(2, 9)}`

// Giữ dữ liệu dùng chung cho trang Cây gia phả và trang Quan hệ.
// Dữ liệu chỉ nằm trong bộ nhớ. Khi có backend, thay các hàm bên dưới bằng lời gọi API.
export function GenealogyProvider({ children }: { children: ReactNode }) {
  const [persons] = useState<Person[]>(initialPersons)
  const [relations, setRelations] = useState<Relation[]>(initialRelations)

  const value: GenealogyValue = {
    persons,
    relations,
    addRelation: (data) => setRelations((rs) => [...rs, { id: newId(), ...data }]),
    updateRelation: (id, data) => setRelations((rs) => rs.map((r) => (r.id === id ? { id, ...data } : r))),
    deleteRelation: (id) => setRelations((rs) => rs.filter((r) => r.id !== id)),
  }

  return <GenealogyContext.Provider value={value}>{children}</GenealogyContext.Provider>
}

export function useGenealogy(): GenealogyValue {
  const value = useContext(GenealogyContext)
  if (!value) throw new Error('useGenealogy phải được dùng bên trong GenealogyProvider')
  return value
}
