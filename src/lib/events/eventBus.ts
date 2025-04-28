'use client'

import OnFire from './onfire'

export const EVENTS = {
  IMAGE_PREVIEW: 'image:preview',
  SHOW_TOAST: 'toast:show',
  REMOVE_TOAST: 'toast:remove'
}

const eventBus = new OnFire('Conjug-Event-Bus') as OnFire & { events: typeof EVENTS }

export default eventBus

eventBus.events = EVENTS
