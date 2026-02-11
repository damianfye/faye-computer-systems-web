import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

// 3D Simplex noise — Ashima Arts (compact)
const noiseGlsl = `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+10.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}

float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(
    i.z+vec4(0.0,i1.z,i2.z,1.0))
    +i.y+vec4(0.0,i1.y,i2.y,1.0))
    +i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
  vec4 m=max(0.5-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 105.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`;

const vertexShader = `
  uniform float uTime;
  uniform float uScrollProgress;
  varying vec2 vUv;
  varying float vElevation;
  varying vec3 vWorldPos;

  ${noiseGlsl}

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Large flowing folds
    float n1 = snoise(vec3(pos.xy * 1.2, uTime * 0.25)) * 0.35;
    float n2 = snoise(vec3(pos.xy * 2.5 + 10.0, uTime * 0.18)) * 0.2;
    // Fine surface detail
    float n3 = snoise(vec3(pos.xy * 5.0 + 20.0, uTime * 0.12)) * 0.08;
    // Broad directional wave
    float wave = sin(pos.x * 1.8 + pos.y * 1.2 + uTime * 0.35) * 0.18;

    float elevation = n1 + n2 + n3 + wave;
    elevation *= (1.0 + uScrollProgress * 0.3);

    pos.z += elevation;
    vElevation = elevation;
    vWorldPos = pos;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  varying vec2 vUv;
  varying float vElevation;
  varying vec3 vWorldPos;

  void main() {
    // Screen-space normals for proper lighting
    vec3 dx = dFdx(vWorldPos);
    vec3 dy = dFdy(vWorldPos);
    vec3 normal = normalize(cross(dx, dy));

    vec3 viewDir = vec3(0.0, 0.0, 1.0);

    // Fresnel rim
    float fresnel = pow(1.0 - abs(dot(normal, viewDir)), 2.5);

    // Vivid color palette
    vec3 deepBlue    = vec3(0.08, 0.12, 0.55);
    vec3 royalPurple = vec3(0.4, 0.08, 0.65);
    vec3 magenta     = vec3(0.72, 0.12, 0.42);
    vec3 cyan        = vec3(0.06, 0.55, 0.68);

    // Flowing color mixing driven by UV, time, and elevation
    float c1 = sin(vUv.x * 4.0 + uTime * 0.2 + vElevation * 4.0) * 0.5 + 0.5;
    float c2 = sin(vUv.y * 3.0 + uTime * 0.15 + vElevation * 2.0) * 0.5 + 0.5;
    float c3 = sin((vUv.x + vUv.y) * 2.5 + uTime * 0.25) * 0.5 + 0.5;
    float c4 = sin(vUv.x * 2.0 - vUv.y * 3.0 + uTime * 0.3) * 0.5 + 0.5;

    vec3 color = mix(deepBlue, royalPurple, c1);
    color = mix(color, magenta, c2 * 0.5);
    color = mix(color, cyan, c3 * 0.35);
    color = mix(color, deepBlue, c4 * 0.2);

    // Elevation-based brightness
    color *= 1.0 + vElevation * 2.5;

    // Two-point directional lighting
    vec3 l1 = normalize(vec3(0.5, 0.3, 1.0));
    vec3 l2 = normalize(vec3(-0.4, 0.5, 0.8));

    float diff1 = max(dot(normal, l1), 0.0);
    float diff2 = max(dot(normal, l2), 0.0);

    // Blinn-Phong specular
    vec3 h1 = normalize(l1 + viewDir);
    vec3 h2 = normalize(l2 + viewDir);
    float spec1 = pow(max(dot(normal, h1), 0.0), 80.0);
    float spec2 = pow(max(dot(normal, h2), 0.0), 60.0);

    // Colored light contributions
    color += vec3(0.9, 0.85, 1.0) * diff1 * 0.25;
    color += vec3(0.3, 0.15, 0.5)  * diff2 * 0.2;

    // Specular highlights
    color += vec3(1.0) * spec1 * 0.65;
    color += vec3(0.6, 0.8, 1.0) * spec2 * 0.35;

    // Iridescence at glancing angles
    vec3 iri = mix(cyan, magenta, fresnel);
    color = mix(color, iri, fresnel * 0.4);

    // Edge fade — prevents hard plane edges
    float fade = smoothstep(0.0, 0.15, vUv.x) * smoothstep(1.0, 0.85, vUv.x) *
                 smoothstep(0.0, 0.15, vUv.y) * smoothstep(1.0, 0.85, vUv.y);

    // Vignette
    color *= 1.0 - length(vUv - 0.5) * 0.25;

    float alpha = (0.82 + fresnel * 0.18) * fade;

    gl_FragColor = vec4(color, alpha);
  }
`;

function MeshPlane({ scrollProgress }: { scrollProgress: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScrollProgress: { value: 0 },
    }),
    [],
  );

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.elapsedTime;
      material.uniforms.uScrollProgress.value = scrollProgress;
      meshRef.current.rotation.z =
        Math.sin(state.clock.elapsedTime * 0.05) * 0.02;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-0.15, 0, 0]} position={[0, 0.5, 0]}>
      <planeGeometry args={[12, 10, 256, 256]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
        extensions={{ derivatives: true } as any}
      />
    </mesh>
  );
}

interface FlowingMeshProps {
  scrollProgress?: number;
}

export default function FlowingMesh({ scrollProgress = 0 }: FlowingMeshProps) {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 50 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <MeshPlane scrollProgress={scrollProgress} />
        <EffectComposer>
          <Bloom
            intensity={0.5}
            luminanceThreshold={0.6}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
