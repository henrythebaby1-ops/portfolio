import{r as w,R as re,T as le,P as se,M as ce,j as fe}from"./index-tDOHgNLd.js";const b=n=>{const i=n.trim().replace(/^#/,""),u=i.length===3?i.replace(/./g,f=>f+f):i,r=/^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(u);return r?[parseInt(r[1],16)/255,parseInt(r[2],16)/255,parseInt(r[3],16)/255]:[1,1,1]},ae=(n,i)=>{const u=b(i);n.value[0]=u[0],n.value[1]=u[1],n.value[2]=u[2]},ve=`#version 300 es
in vec2 position;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`,de=`#version 300 es
precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uLayers;
uniform float uWaveAmplitude;
uniform float uWaveFrequency;
uniform float uWaveSpeed;
uniform float uLayerSpeed;
uniform float uTwist;
uniform float uTwistFrequency;
uniform float uTwistSpeed;
uniform float uLineFrequency;
uniform float uLineSpacing;
uniform float uLineSharpness;
uniform float uGlowFalloff;
uniform float uGlowIntensity;
uniform float uBrightness;
uniform float uBlueBoost;
uniform float uVignette;
uniform float uGrain;
uniform float uRotationSpeed;
uniform float uLightMode;
uniform vec3 uLineColor;
uniform vec3 uGlowColor;

out vec4 fragColor;

#define MAX_LAYERS 10

mat2 rotate2d(float angle) {
  float sine = sin(angle);
  float cosine = cos(angle);
  return mat2(cosine, -sine, sine, cosine);
}

float grainHash(vec2 point) {
  point = floor(point);
  float hash = 52.9829189 * fract(dot(point, vec2(0.065, 0.005)));
  return fract(hash);
}

float layeredGrain(vec2 fragmentPixel) {
  vec2 point = mod(fragmentPixel + vec2(uTime * 30.0, -uTime * 21.0), 1024.0);
  vec2 rotated = mat2(0.8, -0.5, 0.5, 0.8) * point;
  float grain = 0.0;
  grain += 0.40 * grainHash(rotated);
  grain += 0.25 * grainHash(rotated * 2.0 + 17.0);
  grain += 0.20 * grainHash(rotated * 4.0 + 47.0);
  grain += 0.10 * grainHash(rotated * 8.0 + 113.0);
  grain += 0.05 * grainHash(rotated * 16.0 + 191.0);
  return grain;
}

void main() {
  vec2 resolution = max(uResolution, vec2(1.0));
  vec2 uv = (2.0 * gl_FragCoord.xy - resolution) / resolution.y;
  float time = uTime * uSpeed;
  vec3 backdrop = mix(vec3(0.070588, 0.058824, 0.090196), vec3(1.0), step(0.5, uLightMode));
  vec3 centerTone = max(uLineColor * 0.85567 - uGlowColor * 0.06186, vec3(0.0));
  vec3 cloudTone = uLineColor * 0.19588 + uGlowColor * 0.2268;
  vec2 p = uv;
  p /= max(uScale, 0.05);
  p = rotate2d(radians(uRotation) + time * uRotationSpeed) * p;
  vec3 color = vec3(0.0);
  float fiberField = 0.0;

  for (int index = 0; index < MAX_LAYERS; index++) {
    float fi = float(index) + 1.0;
    if (fi > uLayers) break;

    p += uWaveAmplitude * sin(p.yx * fi * uWaveFrequency + time * (uWaveSpeed + fi * uLayerSpeed));

    float radius = length(p);
    float polarAngle = atan(p.y, p.x);
    polarAngle += sin(radius * uTwistFrequency - time * uTwistSpeed + fi) * uTwist;
    p = vec2(cos(polarAngle), sin(polarAngle)) * radius;

    float lines = abs(sin(p.x * (uLineFrequency + fi * uLineSpacing) + sin(p.y * 3.0 + time)));
    lines = pow(max(0.0, 1.0 - lines), uLineSharpness);
    fiberField += lines / fi;
    color += uLineColor * lines / fi;

    float glow = exp(-uGlowFalloff * abs(sin(p.x * 3.0 + time + fi)));
    color += uGlowColor * glow * uGlowIntensity / (fi * 2.0);
  }

  float center = exp(-2.2 * dot(uv, uv));
  color += centerTone * center;

  float cloud = exp(-1.5 * length(uv + vec2(sin(time * 0.3) * 0.25, cos(time * 0.25) * 0.18)));
  color += cloudTone * cloud;

  float vignette = 1.0 - smoothstep(0.35, 1.45, length(uv));
  color *= mix(1.0 - uVignette, 1.0, vignette);
  color = 1.0 - exp(-color * uBrightness);
  color.b *= uBlueBoost;

  vec3 outputColor;
  if (uLightMode > 0.5) {
    float edgeFade = mix(1.0 - uVignette, 1.0, vignette);
    float fibers = pow(smoothstep(0.12, 1.05, fiberField) * edgeFade, 1.5);
    float atmosphere = (center * 0.025 + cloud * 0.015) * edgeFade;
    vec3 fiberInk = mix(backdrop, uLineColor, 0.52);
    vec3 airColor = mix(backdrop, uGlowColor, 0.16);

    outputColor = mix(backdrop, airColor, atmosphere);
    outputColor = mix(outputColor, fiberInk, fibers * 0.3);
  } else {
    outputColor = backdrop + color;
  }

  float noise = (layeredGrain(gl_FragCoord.xy) - 0.5) * uGrain;
  outputColor = clamp(outputColor + noise, 0.0, 1.0);
  fragColor = vec4(outputColor, 1.0);
}
`,y=new WeakMap,pe=({lineColor:n="#140E35",glowColor:i="#3437A0",speed:u=.2,scale:r=2,rotation:f=0,rotationSpeed:C=.25,layers:S=4,waveAmplitude:F=.015,waveFrequency:T=3,waveSpeed:R=.15,layerSpeed:M=.08,twist:G=.1,twistFrequency:A=5,twistSpeed:B=1.2,lineFrequency:W=5,lineSpacing:E=2,lineSharpness:q=16,glowFalloff:I=10,glowIntensity:k=1.6,brightness:P=2,blueBoost:V=1.25,vignette:H=.8,grain:_=.05,lightMode:z=!1,dpr:g=1,fps:O=60,paused:j=!1,className:ne=""})=>{const h=w.useRef(null);return w.useEffect(()=>{const t=h.current;if(!t)return;const a=new re({webgl:2,alpha:!1,antialias:!1,dpr:Math.min(Math.max(g,.5),2)}),e=a.gl,l=e.canvas;l.style.width="100%",l.style.height="100%",l.style.display="block",l.setAttribute("aria-hidden","true"),t.appendChild(l);const ie=new le(e),v=new se(e,{vertex:ve,fragment:de,uniforms:{uResolution:{value:new Float32Array([1,1])},uTime:{value:0},uSpeed:{value:.2},uScale:{value:2},uRotation:{value:0},uRotationSpeed:{value:.25},uLayers:{value:4},uWaveAmplitude:{value:.015},uWaveFrequency:{value:3},uWaveSpeed:{value:.15},uLayerSpeed:{value:.08},uTwist:{value:.1},uTwistFrequency:{value:5},uTwistSpeed:{value:1.2},uLineFrequency:{value:5},uLineSpacing:{value:2},uLineSharpness:{value:16},uGlowFalloff:{value:10},uGlowIntensity:{value:1.6},uBrightness:{value:2},uBlueBoost:{value:1.25},uVignette:{value:.8},uGrain:{value:.05},uLightMode:{value:0},uLineColor:{value:new Float32Array(b("#140E35"))},uGlowColor:{value:new Float32Array(b("#3437A0"))}}}),N=new ce(e,{geometry:ie,program:v});let s=0,X=0,x=performance.now(),Y=0,$=60,D=!1,J=!0,K=!document.hidden;const L=window.matchMedia("(prefers-reduced-motion: reduce)"),d=()=>a.render({scene:N}),m=()=>{s!==0&&cancelAnimationFrame(s),s=0},c=()=>J&&K&&!D&&!L.matches,Q=o=>{if(s=0,!c())return;const ue=Math.min((o-x)/1e3,.1);x=o,X+=ue,o-Y>=1e3/$-.5&&(v.uniforms.uTime.value=X,d(),Y=o),s=requestAnimationFrame(Q)},p=()=>{!c()||s!==0||(x=performance.now(),s=requestAnimationFrame(Q))},U=()=>{const o=t.getBoundingClientRect();a.setSize(Math.max(1,Math.floor(o.width)),Math.max(1,Math.floor(o.height))),v.uniforms.uResolution.value[0]=e.drawingBufferWidth,v.uniforms.uResolution.value[1]=e.drawingBufferHeight,d()},Z=()=>{K=!document.hidden,c()?p():m()},ee=()=>{c()?p():(m(),d())},oe=new ResizeObserver(U);oe.observe(t);const te=new IntersectionObserver(([o])=>{J=o.isIntersecting,c()?p():m()},{threshold:0});return te.observe(t),document.addEventListener("visibilitychange",Z),L.addEventListener("change",ee),y.set(t,{renderer:a,program:v,mesh:N,render:d,setPaused(o){D=o,c()?p():(m(),d())},setFps(o){$=Math.min(Math.max(o,1),120)}}),U(),p(),()=>{var o;m(),oe.disconnect(),te.disconnect(),document.removeEventListener("visibilitychange",Z),L.removeEventListener("change",ee),y.delete(t),l.parentNode===t&&t.removeChild(l),(o=e.getExtension("WEBGL_lose_context"))==null||o.loseContext()}},[g]),w.useEffect(()=>{const t=h.current;if(!t)return;const a=y.get(t);if(!a)return;const e=a.program.uniforms;ae(e.uLineColor,n),ae(e.uGlowColor,i),e.uSpeed.value=u,e.uScale.value=r,e.uRotation.value=f,e.uRotationSpeed.value=C,e.uLayers.value=Math.min(Math.max(Math.round(S),1),10),e.uWaveAmplitude.value=F,e.uWaveFrequency.value=T,e.uWaveSpeed.value=R,e.uLayerSpeed.value=M,e.uTwist.value=G,e.uTwistFrequency.value=A,e.uTwistSpeed.value=B,e.uLineFrequency.value=W,e.uLineSpacing.value=E,e.uLineSharpness.value=q,e.uGlowFalloff.value=I,e.uGlowIntensity.value=k,e.uBrightness.value=P,e.uBlueBoost.value=V,e.uVignette.value=H,e.uGrain.value=_,e.uLightMode.value=z?1:0,a.setFps(O),a.setPaused(j),a.render()},[n,i,u,r,f,C,S,F,T,R,M,G,A,B,W,E,q,I,k,P,V,H,_,z,O,j,g]),fe.jsx("div",{ref:h,className:`ghost-fibers-container ${ne}`.trim()})};export{pe as default};
