import { useState, useRef } from 'react'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { storageUtils } from '../../utils/storage'
import { useTranslation } from 'react-i18next'
import { Download, Upload, RefreshCw, Trash2, X, Database } from 'lucide-react'

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatValue(value: unknown): string {
  try {
    const str = typeof value === 'string' ? value : JSON.stringify(value, null, 2)
    if (str.length > 100) {
      return str.slice(0, 97) + '...'
    }
    return str
  } catch (error) {
    return 'Invalid JSON'
  }
}

export function StorageDebug() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [data, setData] = useState<Record<string, unknown>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleOpen = () => {
    setData(storageUtils.exportData())
    setOpen(true)
  }

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'storage.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = async () => {
    const file = fileInputRef.current?.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const data = JSON.parse(text)
      storageUtils.importData(data)
      setData(storageUtils.exportData())
    } catch (error) {
      console.error('Failed to import data:', error)
    }
  }

  const handleClearAll = () => {
    if (window.confirm(t('storage.clearConfirm'))) {
      storageUtils.clearAll()
      setData({})
    }
  }

  const handleDelete = (key: string) => {
    storageUtils.removeItem(key)
    setData(storageUtils.exportData())
  }

  const handleRefresh = () => {
    setData(storageUtils.exportData())
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={handleOpen}>
        <Database className="h-4 w-4 mr-2" />
        Storage Debug
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Storage Debug</DialogTitle>
          </DialogHeader>

          <div className="flex gap-2 mb-4">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImport}
              aria-label="Import"
            />
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="destructive" size="sm" onClick={handleClearAll}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>

          {Object.keys(data).length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              No items in storage
            </div>
          ) : (
            <div className="space-y-2">
              {Object.entries(data).map(([key, value]) => (
                <div key={key} className="flex items-start justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{key}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 break-all">
                      {formatValue(value)}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">
                      {formatSize(JSON.stringify(value).length)}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-2 text-gray-400 hover:text-red-500"
                    onClick={() => handleDelete(key)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
} 