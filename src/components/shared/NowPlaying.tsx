'use client'

import React from 'react'
import fetcher from '@/lib/utils'
import useSWR from 'swr'
import Image from 'next/image'
import { useEffect, useState } from 'react'

type NowPlayingSong = {
  isPlaying: boolean
  name: string
  artist: string
  album: string
  albumImage: string
  songUrl: string
}


export default function Spotify() {
  const { data, error } = useSWR<NowPlayingSong>('/api/nowplaying', fetcher)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (data || error) {
      const delay = setTimeout(() => setLoading(false), 1000)
      return () => clearTimeout(delay)
    }
  }, [data, error])

  if (loading) {
    return (
      <div>
        <div className='flex flex-col justify-center items-center gap-2 select-none'>
          <span className='inline-block w-4 h-4 border-2 border-zinc-300 border-t-transparent rounded-full animate-spin'></span>
        </div>
      </div>
    )
  }

  if (error) {
    console.error('Error fetching Spotify data:', error)
    return (
      <div>
        <p className='text-zinc-400 font-extrabold text-lg sm:text-xl'>
          Error loading Spotify data
        </p>
      </div>
    )
  }

  return (
    <div>
      <div>
        {!data?.isPlaying ? (
          <div>
            <p className='flex items-center text-zinc-400 font-extrabold text-lg sm:text-xl'>
              Not Playing
            </p>
          </div>
        ) : (
          <>
            <div className='items-center flex gap-1 text-zinc-400'>
              <Image
                src={data.albumImage}
                alt='album image'
                className='object-cover object-right rounded-half rounded-md shrink-0'
                width={40}
                height={40}
                loading='lazy'
              />
              <div>
                <a
                  className='font-medium max-w-sm'
                  href={data.songUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <span>
                    {data.name}
                  </span>
                  <span className='truncate font-medium w-48'>
                    <span className='font-semibold '> by</span> {data.artist}
                  </span><br />
                  <span className='truncate font-medium w-48'>
                    <span className='font-semibold '>on</span> {data.album}
                  </span>
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
