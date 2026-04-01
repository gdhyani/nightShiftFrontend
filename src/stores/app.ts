import { atom } from 'jotai'
import type { Candle } from '@/types/api'

export const sidebarOpenAtom = atom(true)
export const activeSymbolAtom = atom('EUR_USD')
export const activeTimeframeAtom = atom('H1')

export const livePricesAtom = atom<Record<string, Candle>>({})
export const wsStatusAtom = atom<'connected' | 'reconnecting' | 'disconnected'>('disconnected')
