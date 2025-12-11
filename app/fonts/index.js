import localFont from 'next/font/local'

export const mainFont = localFont({
  variable: '--font-main',
  display: 'swap',
  src: [
    {
      path: './times-new-roman/TimesNewRomanPSMT.woff2',
      weight: 'normal',
      style: 'normal',
    },
    {
      path: './times-new-roman/TimesNewRomanPS-BoldMT.woff2',
      weight: 'bold',
      style: 'normal',
    },
    {
      path: './times-new-roman/TimesNewRomanPS-ItalicMT.woff2',
      weight: 'normal',
      style: 'italic',
    },
    {
      path: './times-new-roman/TimesNewRomanPS-BoldItalicMT.woff2',
      weight: 'bold',
      style: 'italic',
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
