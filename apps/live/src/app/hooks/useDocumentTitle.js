import { useEffect } from 'react'
import { useStore } from 'state'
import { useTypeStore } from './useTypeStore'

export const useDocumentTitle = () => {
  const storeDocument = useStore()
  const { store } = storeDocument
  const { storeMode } = useTypeStore(storeDocument)
  const storeName = store?.name

  useEffect(() => {
    if (storeName) {
      document.title = `${storeName} - ${storeMode} - GoJiraf Live Shopping`
    }
  }, [storeName, storeMode])
}
