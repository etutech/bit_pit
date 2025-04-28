import { MetadataRoute } from 'next'

const manifest = (): MetadataRoute.Manifest => ({
  name: 'Bit Pit',
  description: 'blur blur blur',
  icons: [
    {
      src: '/logo.png',
      sizes: '64x64 32x32 24x24 16x16',
      type: 'image/png'
    }
  ],
  orientation: 'portrait',
  display: 'standalone',
  start_url: '.',
  theme_color: 'oklch(98% 0.014 180.72)'
})

export default manifest
