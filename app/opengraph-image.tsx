import { ImageResponse } from 'next/og'

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'
export const dynamic = 'force-static'

export default async function Image() {
  const siteConfig = await import('@/config/site')
  const { name } = siteConfig.default

  return new ImageResponse(
    (
      <div tw="flex w-full h-full text-black bg-white items-center justify-center">
        <div tw="flex flex-col items-center justify-center text-center">
          <div tw="text-black text-[80px] font-semibold tracking-tight">{name}</div>
          <div tw="text-[36px] text-gray-600 mt-6">Logos Next Tailwind Template</div>
        </div>
      </div>
    ),
    size
  )
}
