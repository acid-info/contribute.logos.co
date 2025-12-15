import localFont from 'next/font/local'

export const mainFont = localFont({
  variable: '--font-main',
  display: 'swap',
  src: [
    {
      path: './fira-code/FiraCode-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: './fira-code/FiraCode-Regular.woff2',
      weight: 'normal',
      style: 'normal',
    },
    {
      path: './fira-code/FiraCode-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fira-code/FiraCode-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: './fira-code/FiraCode-Bold.woff2',
      weight: 'bold',
      style: 'normal',
    },
  ],
})

export const secondaryFont = localFont({
  variable: '--font-secondary',
  display: 'swap',
  src: [
    {
      path: './times-new-roman/TimesNewRomanPSMT.woff2',
      weight: 'normal',
      style: 'normal',
    },
  ],
})
