# Tinnitus Audio Simulator

A web application that allows users to create and layer audio tones to simulate different types of tinnitus sounds. This tool is designed for educational purposes to help people without tinnitus understand what tinnitus sufferers experience.

## Features

- **Multiple Tone Generation**: Create multiple audio tones simultaneously
- **Frequency Control**: Adjust frequency from 20Hz to 20kHz for each tone
- **Waveform Selection**: Choose from sine, square, sawtooth, and triangle waves
- **Volume Control**: Individual volume control for each tone plus master volume
- **Real-time Mixing**: Layer multiple tones in real-time
- **Responsive Design**: Works on desktop and mobile devices
- **Azure App Service Ready**: Can be deployed directly to Azure App Service

## Technology Stack

- **Frontend**: Next.js 15 with React
- **Styling**: Tailwind CSS
- **Audio**: Web Audio API (no external dependencies needed)
- **Deployment**: Ready for Azure App Service deployment

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Usage

1. **Add Tones**: Click "Add New Tone" to create a new audio tone
2. **Adjust Frequency**: Use the frequency slider or input field (20-20,000 Hz)
3. **Select Waveform**: Choose from sine (pure), square (harsh), sawtooth (buzzy), or triangle (mellow)
4. **Control Volume**: Adjust individual tone volume and master volume
5. **Play/Stop**: Use "Play All Tones" to start audio simulation
6. **Layer Sounds**: Add multiple tones to create complex tinnitus simulations

## Deployment to Azure App Service

### Option 1: Static Export (Recommended)

1. Add to `next.config.mjs`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
```

2. Build and export:
```bash
npm run build
```

3. Deploy the `out` folder to Azure Static Web Apps or App Service

### Option 2: Node.js App Service

1. Add `web.config` for IIS:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <handlers>
      <add name="iisnode" path="server.js" verb="*" modules="iisnode"/>
    </handlers>
    <rewrite>
      <rules>
        <rule name="DynamicContent">
          <match url="/*" />
          <action type="Rewrite" url="server.js"/>
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

2. Deploy directly to Azure App Service with Node.js runtime

## Audio Safety

- **Volume Warning**: Start with low volumes and adjust gradually
- **Headphone Recommended**: For best simulation experience
- **Educational Purpose**: This tool is for understanding tinnitus, not medical diagnosis
- **Stop if Discomfort**: Discontinue use if you experience any discomfort

## Browser Compatibility

- Chrome 34+
- Firefox 25+
- Safari 14.1+
- Edge 12+

Requires Web Audio API support for audio generation.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with Next.js and Tailwind CSS
- Uses Web Audio API for audio synthesis
- Designed to raise awareness about tinnitus
