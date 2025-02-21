import { NextResponse } from 'next/server'
import getRecentlyPlayed from '@/lib/getRecentlyPlayed'

export const dynamic = 'force-dynamic'

export const GET = async () => {
  try {
    const response = await getRecentlyPlayed()

    if (!response.data || response.status !== 200) {
      return NextResponse.json({ message: 'No recently played tracks' })
    }

    const { items } = response.data

    if (items.length === 0) {
      return NextResponse.json({ message: 'No recently played tracks' })
    }

    const lastPlayed = items[0].track

    return NextResponse.json({
      name: lastPlayed.name,
      artist: lastPlayed.artists.map((artist) => artist.name).join(', '),
      album: lastPlayed.album.name,
      albumImage: lastPlayed.album.images[0].url,
      songUrl: lastPlayed.external_urls.spotify,
      playedAt: items[0].played_at
    })
  } catch (error) {
    console.error('Error in recentlyplayed API route:', error)
    return NextResponse.json(
      {
        message: 'Error getting Recently Played from Spotify'
      },
      { status: 500 }
    )
  }
}
