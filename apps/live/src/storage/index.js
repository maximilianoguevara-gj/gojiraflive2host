const storage = window.localStorage

class StorageService {
  getValue(key) {
    let value
    const el = storage.getItem(key)
    let localStorageObject = JSON.parse(el)
    const now = new Date()

    if (localStorageObject) {
      if (localStorageObject.expiry && now.getTime() > localStorageObject.expiry) {
        storage.removeItem(key)
        return null
      }
      try {
        value = JSON.parse(localStorageObject.value)
      } catch (err) {
        value = localStorageObject.value
      }
    }
    return value
  }

  setValue(key, value, ttl) {
    const now = new Date()
    const elementToSave = typeof value === 'object' ? JSON.stringify(value) : value
    const elementToSaveWithTTL = {
      value: elementToSave,
      expiry: ttl ? now.getTime() + ttl : false, // miliseconds
    }
    storage.setItem(key, JSON.stringify(elementToSaveWithTTL))
  }

  removeValue(key) {
    storage.removeItem(key)
  }
}

const instance = new StorageService()
Object.freeze(instance)

export default instance
