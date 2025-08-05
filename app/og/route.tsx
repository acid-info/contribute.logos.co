import { ImageResponse } from 'next/og'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title')
  const description = searchParams.get('description')

  const siteConfig = await import('@/data/siteConfig')
  const { name } = siteConfig.default

  return new ImageResponse(
    (
      <div tw="flex w-full h-full text-black bg-white">
        {(title || description) && (
          <div tw="flex absolute right-24 bottom-24 flex-row justify-center items-center text-white">
            <div tw="text-black flex text-[32px] font-semibold tracking-tight ml-2">{name}</div>
          </div>
        )}
        <div tw="flex absolute inset-0 flex-col justify-center items-center p-24 w-full h-full">
          {title || description ? (
            <div tw="flex flex-col justify-center items-center w-full h-full text-center">
              <div tw="tracking-tight flex flex-col justify-center text-black text-balance font-semibold text-[80px]">
                {title}
              </div>
              <div tw="text-[40px] text-gray-600 mt-6 text-balance font-normal">{description}</div>
            </div>
          ) : (
            <div tw="flex flex-col justify-center items-center w-full h-full text-center">
              <div tw="flex flex-row justify-center items-center space-x-4"></div>
              <div tw="text-black flex text-[80px] font-semibold tracking-tight">{name}</div>
              <div tw="flex text-2xl text-gray-600">
                <p>Logos Next Tailwind Template</p>
              </div>
            </div>
          )}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 628,
    }
  )
}
