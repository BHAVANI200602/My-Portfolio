import ShaderSwitcher from './shaders/ShaderSwitcher';

interface WebGLHeroShaderProps {
  activeShader?: number;
}

export default function WebGLHeroShader({ activeShader = 0 }: WebGLHeroShaderProps) {
  return (
    <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'hidden' }}>
      <ShaderSwitcher activeShader={activeShader} />
    </div>
  );
}
