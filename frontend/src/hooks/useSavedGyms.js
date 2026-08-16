import { useState } from 'react'

const STORAGE_KEY = 'silver-gym:saved-gyms'

function loadSavedGymIds() {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function persistSavedGymIds(ids) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
}

export function useSavedGyms() {
  const [savedGymIds, setSavedGymIds] = useState(loadSavedGymIds)

  const toggleSavedGym = (gymId) => {
    setSavedGymIds((currentIds) => {
      const nextIds = currentIds.includes(gymId)
        ? currentIds.filter((id) => id !== gymId)
        : [...currentIds, gymId]

      persistSavedGymIds(nextIds)
      return nextIds
    })
  }

  return {
    savedGymIds,
    isSaved: (gymId) => savedGymIds.includes(gymId),
    toggleSavedGym,
  }
}
