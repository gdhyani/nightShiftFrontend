type MessageHandler = (channel: string, data: Record<string, unknown>) => void

export class NightShiftWS {
  private ws: WebSocket | null = null
  private url: string
  private channels: string[]
  private handlers: MessageHandler[] = []
  private reconnectDelay = 1000
  private maxReconnectDelay = 30000
  private shouldReconnect = true

  constructor(url: string, channels: string[] = ['price_ticks', 'store_updated']) {
    this.url = url
    this.channels = channels
  }

  connect(): void {
    this.shouldReconnect = true
    this.ws = new WebSocket(this.url)

    this.ws.onopen = () => {
      this.reconnectDelay = 1000
      this.ws?.send(JSON.stringify({ subscribe: this.channels }))
    }

    this.ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data)
        const channel = msg.channel || 'unknown'
        this.handlers.forEach((h) => h(channel, msg))
      } catch {
        // Ignore malformed
      }
    }

    this.ws.onclose = () => {
      if (this.shouldReconnect) {
        setTimeout(() => this.connect(), this.reconnectDelay)
        this.reconnectDelay = Math.min(this.reconnectDelay * 2, this.maxReconnectDelay)
      }
    }

    this.ws.onerror = () => {
      this.ws?.close()
    }
  }

  disconnect(): void {
    this.shouldReconnect = false
    this.ws?.close()
    this.ws = null
  }

  onMessage(handler: MessageHandler): () => void {
    this.handlers.push(handler)
    return () => {
      this.handlers = this.handlers.filter((h) => h !== handler)
    }
  }

  get connected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }
}
