import create from 'zustand'

interface StoreState {
    store: any
    setStore: (store: any) => void
}
export const useStore = create<StoreState>()((set) => ({
    store: null,
    setStore: (store) => set(() => ({ store: store }))
}))