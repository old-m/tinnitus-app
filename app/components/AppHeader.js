'use client';

export default function AppHeader() {
  return (
    <header className="text-center mb-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Tinnitus Audio Simulator
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        Create and layer audio tones to simulate different types of tinnitus sounds.<br/>
        Choose between static tones or dynamic chirping sounds with random volume fluctuations.
      </p>
    </header>
  );
}
