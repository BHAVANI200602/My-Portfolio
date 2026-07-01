import { lazy, Suspense } from 'react';

// Lazy-load each shader to keep initial bundle small
const Shader1LineWaves      = lazy(() => import('./Shader1LineWaves'));
const Shader2Aurora         = lazy(() => import('./Shader2Aurora'));
const Shader3Beams          = lazy(() => import('./Shader3Beams'));
const Shader4ColorBends     = lazy(() => import('./Shader4ColorBends'));
const Shader5DarkVeil       = lazy(() => import('./Shader5DarkVeil'));
const Shader6FaultyTerminal = lazy(() => import('./Shader6FaultyTerminal'));
const Shader7Waves          = lazy(() => import('./Shader7Waves'));

const SHADERS = [
  Shader1LineWaves,
  Shader2Aurora,
  Shader3Beams,
  Shader4ColorBends,
  Shader5DarkVeil,
  Shader6FaultyTerminal,
  Shader7Waves,
];

export const SHADER_COUNT = SHADERS.length;

interface ShaderSwitcherProps {
  activeShader: number;
}

export default function ShaderSwitcher({ activeShader }: ShaderSwitcherProps) {
  const safe  = Math.max(0, Math.min(activeShader, SHADERS.length - 1));
  const Shader = SHADERS[safe];
  return (
    <Suspense fallback={null}>
      <Shader />
    </Suspense>
  );
}
