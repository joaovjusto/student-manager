import { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { useTranslation } from 'react-i18next'
import { storageUtils } from '../../utils/storage'
import { Database, Download, Upload, Trash2, RefreshCw } from 'lucide-react'

interface StorageItem {
  key: string
  value: string
  size: number
  isJSON: boolean
}

export function StorageDebug() {
  const { t } = useTranslation()
  const [storageData, setStorageData] = useState<StorageItem[]>([])
  const [totalSize, setTotalSize] = useState(0)

  const loadStorageData = () => {
    const items: StorageItem[] = []
    let total = 0

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) {
        const value = localStorage.getItem(key) || ''
        const size = new Blob([value]).size
        let isJSON = false

        try {
          JSON.parse(value)
          isJSON = true
        } catch {
          isJSON = false
        }

        items.push({ key, value, size, isJSON })
        total += size
      }
    }

    setStorageData(items.sort((a, b) => a.key.localeCompare(b.key)))
    setTotalSize(total)
  }

  useEffect(() => {
    loadStorageData()
  }, [])

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleExport = () => {
    const data = storageUtils.exportData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `storage-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        storageUtils.importData(data)
        loadStorageData()
      } catch (error) {
        console.error('Failed to import data:', error)
      }
    }
    reader.readAsText(file)
  }

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all localStorage data?')) {
      storageUtils.clearAll()
      loadStorageData()
    }
  }

  const handleDeleteItem = (key: string) => {
    if (confirm(`Delete "${key}"?`)) {
      localStorage.removeItem(key)
      loadStorageData()
    }
  }

  const formatValue = (value: string, isJSON: boolean): string => {
    if (!isJSON) return value
    
    try {
      const parsed = JSON.parse(value)
      return JSON.stringify(parsed, null, 2)
    } catch {
      return value
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="fixed bottom-4 right-4 h-12 w-12">
          <Database className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Storage Debug ({storageData.length} items, {formatSize(totalSize)})
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={loadStorageData} variant="outline" size="sm" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button onClick={handleExport} variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <label className="inline-flex">
              <Button asChild variant="outline" size="sm" className="gap-2">
                <span>
                  <Upload className="h-4 w-4" />
                  Import
                </span>
              </Button>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
            <Button 
              onClick={handleClearAll} 
              variant="destructive" 
              size="sm" 
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </Button>
          </div>

          <div className="overflow-auto max-h-[50vh]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Key</TableHead>
                  <TableHead className="w-[100px]">Type</TableHead>
                  <TableHead className="w-[80px]">Size</TableHead>
                  <TableHead>Value (Preview)</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {storageData.map((item) => (
                  <TableRow key={item.key}>
                    <TableCell className="font-mono text-sm">{item.key}</TableCell>
                    <TableCell>{item.isJSON ? 'JSON' : 'String'}</TableCell>
                    <TableCell className="text-right">{formatSize(item.size)}</TableCell>
                    <TableCell className="max-w-[300px]">
                      <pre className="text-xs overflow-hidden text-ellipsis whitespace-nowrap">
                        {formatValue(item.value, item.isJSON).slice(0, 100)}
                        {item.value.length > 100 ? '...' : ''}
                      </pre>
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleDeleteItem(item.key)}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {storageData.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No localStorage data found
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 