# 🗃️ Sistema de Cache LocalStorage

Este projeto implementa um sistema robusto de cache usando localStorage para persistir dados dos módulos Zustand.

## 📋 Características

### ✅ **Cache Automático**
- **Persistência transparente** de todas as stores Zustand
- **Sincronização automática** entre localStorage e estado da aplicação
- **Hidratação automática** na inicialização da aplicação

### 🛡️ **Tratamento de Erros**
- **SafeStorageAdapter** com tratamento gracioso de falhas
- **Logs de debug** para identificar problemas
- **Fallbacks** para quando localStorage não está disponível

### 🔧 **Utilitários**

#### `storage.ts`
```typescript
import { storageUtils } from './utils/storage'

// Salvar dados JSON
storageUtils.setJSON('minha-chave', { dados: 'valor' })

// Recuperar dados JSON com fallback
const dados = storageUtils.getJSON('minha-chave', {})

// Exportar todos os dados
const backup = storageUtils.exportData()

// Importar dados de backup
storageUtils.importData(backup)

// Limpar todos os dados
storageUtils.clearAll()
```

#### `usePersistentStore.ts`
```typescript
import { createPersistentStore } from './hooks/usePersistentStore'

// Criar store persistente
const useMinhaStore = createPersistentStore(
  (set) => ({
    dados: [],
    addDado: (item) => set(state => ({ dados: [...state.dados, item] }))
  }),
  'minha-store-key'
)
```

## 🏗️ **Arquitetura**

### **Camada de Storage**
```
Application State (Zustand)
         ↕
   Persist Middleware
         ↕
  SafeStorageAdapter
         ↕
     localStorage
```

### **Fluxo de Dados**
1. **Escrita**: Estado → Zustand → Persist → SafeAdapter → localStorage
2. **Leitura**: localStorage → SafeAdapter → Persist → Zustand → Estado
3. **Hidratação**: localStorage → Estado inicial da aplicação

## 🔑 **Chaves de Storage**

```typescript
// src/constants/index.ts
export const STORAGE_KEYS = {
  THEME: 'theme',              // Tema da aplicação
  LANGUAGE: 'i18nextLng',      // Idioma selecionado
  ALUNOS_STORE: 'alunos-store' // Dados dos alunos
} as const
```

## 🐛 **Debug e Desenvolvimento**

### **StorageDebug Component**
- **Visualização** de todos os dados no localStorage
- **Tamanho** e tipo de cada item
- **Export/Import** de dados para backup
- **Limpeza seletiva** ou completa
- **Disponível apenas em DEV** (botão flutuante inferior direito)

### **Funcionalidades de Debug**
- 📊 **Visualização tabular** dos dados
- 📁 **Export para JSON** com timestamp
- 📂 **Import de backup** com validação
- 🗑️ **Limpeza granular** por chave
- 🧹 **Limpeza completa** com confirmação

## 🚀 **Uso Prático**

### **Store de Alunos**
```typescript
// Automaticamente persistida no localStorage
const useAlunosStore = createPersistentStore(
  (set) => ({
    alunos: [],
    addAluno: (aluno) => set(state => ({
      alunos: [...state.alunos, { ...aluno, id: generateId() }]
    }))
  }),
  STORAGE_KEYS.ALUNOS_STORE
)
```

### **Context de Tema**
```typescript
// Persistência manual com tratamento de erros
const getStoredTheme = (): Theme => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.THEME)
    return (stored as Theme) || DEFAULT_VALUES.THEME
  } catch {
    return DEFAULT_VALUES.THEME
  }
}
```

## 📈 **Performance**

- **Lazy loading** dos dados do cache
- **Serialização otimizada** com JSON nativo
- **Parcialização** para stores grandes (via `partialize`)
- **Versionamento** para migração de schemas

## 🔒 **Segurança**

- **Validação de chaves** contra lista conhecida
- **Sanitização** de dados importados
- **Tratamento de JSON malformado**
- **Isolamento** de dados por aplicação

## 🔄 **Compatibilidade**

- ✅ **Todos os navegadores** com localStorage
- ✅ **SSR/SSG** com verificação de `window`
- ✅ **React 19** com APIs modernas
- ✅ **TypeScript** com tipagem completa

## 📚 **Exemplo Completo**

```typescript
// 1. Definir tipos
interface MinhaStore {
  dados: string[]
  addDado: (item: string) => void
}

// 2. Criar store persistente
const useMinhaStore = createPersistentStore<MinhaStore>(
  (set) => ({
    dados: [],
    addDado: (item) => set(state => ({ 
      dados: [...state.dados, item] 
    }))
  }),
  'minha-store'
)

// 3. Usar na aplicação
function MeuComponente() {
  const { dados, addDado } = useMinhaStore()
  
  return (
    <div>
      {dados.map(item => <div key={item}>{item}</div>)}
      <button onClick={() => addDado('novo item')}>
        Adicionar
      </button>
    </div>
  )
}
```

---

Este sistema garante **persistência robusta**, **performance otimizada** e **experiência de desenvolvimento** excepcional! 🎉 