# Tinnitus Audio Simulation Web App

This project is a web application for simulating tinnitus audio tones that can run as an Azure App Service.

## Project Overview
- Single page application for tinnitus audio simulation
- Users can create audio tones of various pitches and timbres
- Layer multiple tones together to simulate tinnitus sounds
- Audio generation and mixing capabilities
- Deployable to Azure App Service

## Technology Stack
- Frontend: Next.js with React
- Styling: Tailwind CSS
- Audio: Web Audio API for tone generation and mixing
- Deployment: Azure App Service (static export or Node.js)

## Key Features
- Audio tone generator with adjustable frequency
- Timbre/waveform selection (sine, square, sawtooth, triangle)
- Volume control for individual tones
- Ability to layer multiple tones simultaneously
- Real-time audio mixing
- Responsive web interface

## Development Guidelines
- Use Web Audio API for all audio processing
- Keep audio processing client-side for real-time performance
- Ensure compatibility with Azure App Service deployment
- Follow accessibility guidelines for audio controls
- Use modern JavaScript (ES6+) features

## Deployment
The app includes both static export configuration and Node.js server setup for flexible Azure App Service deployment options.
