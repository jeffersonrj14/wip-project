import { NextResponse } from 'next/server'
import getNowPlaying from '@/lib/getNowPlaying'

export const dynamic = 'force-dynamic'

export const GET = async () => {
  try {
    const response = await getNowPlaying()

    if (!response.isPlaying || response.status !== 200 || !response.data) {
      return NextResponse.json({ isPlaying: false })
    }

    const { item } = response.data

    return NextResponse.json({
      isPlaying: true,
      name: item.name,
      artist: item.artists.map((artist) => artist.name).join(', '),
      album: item.album.name,
      albumImage: item.album.images[0].url,
      songUrl: item.external_urls.spotify
    })
  } catch (error) {
    console.error('Error in nowplaying API route:', error)
    return NextResponse.json(
      {
        isPlaying: false,
        message: 'Error getting Now Playing from Spotify'
      },
      { status: 500 }
    )
  }
}
