import { env } from '@/env'

const CLIENT_ID = env.SPOTIFY_CLIENT_ID
const CLIENT_SECRET = env.SPOTIFY_CLIENT_SECRET
const REFRESH_TOKEN = env.SPOTIFY_REFRESH_TOKEN

const BASIC = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')
const RECENTLY_PLAYED_ENDPOINT = 'https://api.spotify.com/v1/me/player/recently-played'
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token'

type RecentlyPlayedResponse = {
  items: {
    track: {
      name: string
      artists: { name: string }[]
      album: {
        name: string
        images: { url: string }[]
      }
      external_urls: { spotify: string }
    }
    played_at: string
  }[]
}

type AccessToken = {
  access_token: string
}

const getAccessToken = async (): Promise<AccessToken> => {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${BASIC}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: REFRESH_TOKEN
    }),
    cache: 'no-store'
  })

  if (!response.ok) {
    throw new Error(`Failed to get access token: ${response.statusText}`)
  }

  return response.json()
}

const getRecentlyPlayed = async () => {
  try {
    const { access_token } = await getAccessToken()

    const response = await fetch(RECENTLY_PLAYED_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${access_token}`
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch recently played: ${response.statusText}`)
    }

    const data: RecentlyPlayedResponse = await response.json()

    return {
      status: response.status,
      data
    }
  } catch (error) {
    console.error('Error in getRecentlyPlayed:', error)
    return { status: 500, error: String(error) }
  }
}

export default getRecentlyPlayed
