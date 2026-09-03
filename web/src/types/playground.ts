export interface PlaygroundSettings {
  minutesPerUnit: number
  pricePerUnit: number
}

export type SessionStatus = 'active' | 'finished'

export interface PlaygroundSession {
  id: string
  name: string
  units: number
  paid: boolean
  startedAt: number
  endsAt: number
  total: number
  status: SessionStatus
  notified: boolean
}

export interface NewSession {
  name: string
  units: number
  paid: boolean
}

export interface PlaygroundState {
  settings: PlaygroundSettings
  sessions: PlaygroundSession[]
}
