import React from "react"
import { StoreApi, useStore } from "zustand"
import getStore from "./store"
import { LayerStore } from "./types"

const createZustandContext = <TInitial, TStore extends StoreApi<LayerStore>>(
    getStore: (initial: TInitial) => TStore
) => {
    const Context = React.createContext<TStore | null>(null)

    const Provider = (props: {
        children?: React.ReactNode
        initialValue: TInitial
    }) => {
        const [store] = React.useState(getStore(props.initialValue))

        return <Context.Provider value={store}>{props.children}</Context.Provider>
    }

    return {
        useContext: () => React.useContext(Context),
        Context,
        Provider,
    }
}

export type LayerStoreInitialState = {
    layers: LayerStore['layers']
    layerComparisonMode: boolean
}

const LayerStoreContext = createZustandContext<LayerStoreInitialState, StoreApi<LayerStore>>(getStore)
export { LayerStoreContext as LayerStore }

export function useLayerStore<T>(selector: (state: LayerStore) => T) {
    const store = React.useContext(LayerStoreContext.Context)
    if (!store) {
        throw new Error("Missing LayerStore provider")
    }
    return useStore(store, selector)
} 