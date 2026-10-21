import{r as s,j as l}from"./index-D0zNZLAK.js";import{C as c,u as m,a as g}from"./react-three-fiber.esm-nR5vKGpt.js";import{C as d}from"./three.module-BgPORkTe.js";const u=e=>(e=e.replace("#",""),[parseInt(e.slice(0,2),16)/255,parseInt(e.slice(2,4),16)/255,parseInt(e.slice(4,6),16)/255]),x=`
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vPosition = position;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,p=`
varying vec2 vUv;
varying vec3 vPosition;

uniform float uTime;
uniform vec3  uColor;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uNoiseIntensity;
uniform float uLightMode;

const float e = 2.71828182845904523536;

float noise(vec2 texCoord) {
  float G = e;
  vec2  r = (G * sin(G * texCoord));
  return fract(r.x * r.y * (1.0 + texCoord.x));
}

vec2 rotateUvs(vec2 uv, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  mat2  rot = mat2(c, -s, s, c);
  return rot * uv;
}

void main() {
  float rnd        = noise(gl_FragCoord.xy);
  vec2  uv         = rotateUvs(vUv * uScale, uRotation);
  vec2  tex        = uv * uScale;
  float tOffset    = uSpeed * uTime;

  tex.y += 0.03 * sin(8.0 * tex.x - tOffset);

  float pattern = 0.6 +
                  0.4 * sin(5.0 * (tex.x + tex.y +
                                   cos(3.0 * tex.x + 5.0 * tex.y) +
                                   0.02 * tOffset) +
                           sin(20.0 * (tex.x + tex.y - 0.1 * tOffset)));

  float grain = rnd / 15.0 * uNoiseIntensity;
  vec3 result = uColor * pattern - vec3(grain);
if (uLightMode > 0.5) {
  float fold = smoothstep(0.28, 0.9, pattern);
  float specular = smoothstep(0.72, 0.98, pattern);
  vec3 shadowColor = uColor * 0.72;
  vec3 bodyColor = min(uColor * 1.18, vec3(1.0));
  vec3 lightBase = mix(shadowColor, bodyColor, fold);
  lightBase = mix(lightBase, vec3(1.0), specular * 0.92);
  float fineNoise = noise(gl_FragCoord.xy * 0.63 + vec2(17.0, 41.0));
  float grainSignal = (rnd + fineNoise - 1.0);
  float grainStrength = clamp(uNoiseIntensity * 0.038, 0.0, 0.16);
  result = lightBase + grainSignal * grainStrength;
}
  gl_FragColor = vec4(clamp(result, 0.0, 1.0), 1.0);
}
`,v=s.forwardRef(function({uniforms:r},t){const{viewport:a}=m();return s.useLayoutEffect(()=>{t.current&&t.current.scale.set(a.width,a.height,1)},[t,a]),g((n,i)=>{t.current.material.uniforms.uTime.value+=.1*i}),l.jsxs("mesh",{ref:t,children:[l.jsx("planeGeometry",{args:[1,1,1,1]}),l.jsx("shaderMaterial",{uniforms:r,vertexShader:x,fragmentShader:p})]})});v.displayName="SilkPlane";const S=({speed:e=5,scale:r=1,color:t="#7B7481",noiseIntensity:a=1.5,rotation:n=0,lightMode:i=!1})=>{const f=s.useRef(),o=s.useMemo(()=>({uSpeed:{value:e},uScale:{value:r},uNoiseIntensity:{value:a},uColor:{value:new d(...u(t))},uRotation:{value:n},uLightMode:{value:i?1:0},uTime:{value:0}}),[]);return s.useEffect(()=>{o.uSpeed.value=e,o.uScale.value=r,o.uNoiseIntensity.value=a,o.uColor.value.setRGB(...u(t)),o.uRotation.value=n,o.uLightMode.value=i?1:0},[e,r,a,t,n,i,o]),l.jsx(c,{dpr:[1,2],frameloop:"always",children:l.jsx(v,{ref:f,uniforms:o})})};export{S as default};
