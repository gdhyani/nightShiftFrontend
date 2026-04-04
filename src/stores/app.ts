import { atom } from 'jotai'
import type { Candle } from '@/types/api'

export const sidebarOpenAtom = atom(true)
export const activeSymbolAtom = atom('NSE_EQ|INE848E01016')
export const activeTimeframeAtom = atom('H1')

export const livePricesAtom = atom<Record<string, Candle>>({})
export const wsStatusAtom = atom<'connected' | 'reconnecting' | 'disconnected'>('disconnected')
