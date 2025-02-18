import { env } from '@/env'

const CLIENT_ID = env.SPOTIFY_CLIENT_ID
const CLIENT_SECRET = env.SPOTIFY_CLIENT_SECRET
const REFRESH_TOKEN = env.SPOTIFY_REFRESH_TOKEN

const BASIC = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')
const NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing'
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token'

type Song = {
  is_playing: boolean
  item: {
    name: string
    artists: { name: string }[]
    album: {
      name: string
      images: { url: string }[]
    }
    external_urls: { spotify: string }
  }
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

const getNowPlaying = async () => {
  try {
    const { access_token } = await getAccessToken()

    const response = await fetch(NOW_PLAYING_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${access_token}`
      },
      cache: 'no-store'
    })

    if (response.status === 204) {
      return { status: response.status, isPlaying: false }
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch now playing: ${response.statusText}`)
    }

    const song: Song = await response.json()

    return {
      status: response.status,
      data: song,
      isPlaying: song.is_playing
    }
  } catch (error) {
    console.error('Error in getNowPlaying:', error)
    return { status: 500, isPlaying: false, error: String(error) }
  }
}

export default getNowPlaying
