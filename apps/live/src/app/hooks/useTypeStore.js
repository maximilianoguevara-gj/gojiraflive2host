import { useEffect, useState } from 'react'

export const useTypeStore = (store) => {
  const [storeMode, setStoreMode] = useState('')

  const { isOneToManySale } = store?.store || {}
  const { allowsMultipleBuyers } = store?.store?.storeConfigurations || {}

  const getStoreMode = (isOneToManySale, allowMultipleBuyers) => {
    if (isOneToManySale) return 'OTM'
    if (allowMultipleBuyers) return 'OTF'
    return 'OTO'
  }

  useEffect(() => {
    if (store.store) {
      setStoreMode(getStoreMode(isOneToManySale, allowsMultipleBuyers))
    }
  }, [isOneToManySale, allowsMultipleBuyers])

  return {
    storeMode,
  }
}
