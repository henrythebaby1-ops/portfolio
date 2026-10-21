import{r as x,R as Q,T as U,P as ee,M as te,j as oe}from"./index-tDOHgNLd.js";const C=l=>{const s=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(l);return s?[parseInt(s[1],16)/255,parseInt(s[2],16)/255,parseInt(s[3],16)/255]:[1,1,1]},ae=l=>l==="low"?40:l==="high"?110:70,re=`#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`,ue=`#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uSpeed;
uniform float uAmplitude;
uniform float uWaveScale;
uniform float uWaveRatio;
uniform float uSwell;
uniform float uTurbulence;
uniform float uTilt;
uniform float uZoom;
uniform float uHeight;
uniform float uFogDepth;
uniform float uSteps;
uniform float uBrightness;
uniform float uOpacity;
uniform float uGrain;
uniform float uGrainIntensity;
uniform vec2 uMouse;
uniform float uParallax;
uniform bool uEnableMouse;
uniform vec3 uHorizonColor;
uniform vec3 uWaveColor;
uniform vec3 uCrestColor;
out vec4 fragColor;

const float MAX_DIST = 20000.0;

float hash21(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float plasma(vec3 r, vec2 freq, vec4 tc) {
  float mx = r.x + tc.x;
  mx += uSwell * sin((r.y + mx) / 20.0 + tc.y);
  float my = r.y - tc.z;
  my += uTurbulence * cos(r.x / 23.0 + tc.w);
  return r.z - (sin(mx * freq.x) * uAmplitude + sin(my * freq.y) * uAmplitude + uHeight);
}

float raymarch(vec3 pos, vec3 dir, vec2 freq, vec4 tc) {
  float dist = 0.0;
  for (int i = 0; i < 128; i++) {
    if (float(i) >= uSteps) break;
    float dscene = plasma(pos + dist * dir, freq, tc);
    if (abs(dscene) < 0.1) break;
    dist += 0.9 * dscene;
    if (!(abs(dist) < MAX_DIST)) return MAX_DIST;
  }
  return dist;
}

void main() {
  float T = iTime * uSpeed;
  vec2 freq = vec2(uWaveScale / 7.0, (uWaveScale * uWaveRatio) / 3.0);
  vec4 tc = vec4(T / 0.130, T / 0.810, T / 0.200, T / 0.710);
  float c, s;
  float vfov = (3.14159 / 2.3) / max(uZoom, 0.05);
  vec3 cam = vec3(0.0, 0.0, 30.0);
  vec2 uv = (gl_FragCoord.xy / iResolution.xy) - 0.5;
  uv.x *= iResolution.x / iResolution.y;
  uv.y *= -1.0;

  vec3 dir = vec3(0.0, 0.0, -1.0);
  float ulen = length(uv);
  float xrot = vfov * ulen;
  c = cos(xrot); s = sin(xrot);
  dir = mat3(1.0, 0.0, 0.0, 0.0, c, -s, 0.0, s, c) * dir;
  vec2 nuv = ulen > 1e-5 ? uv / ulen : vec2(1.0, 0.0);
  c = nuv.x; s = nuv.y;
  dir = mat3(c, -s, 0.0, s, c, 0.0, 0.0, 0.0, 1.0) * dir;
  c = cos(uTilt); s = sin(uTilt);
  dir = mat3(c, 0.0, s, 0.0, 1.0, 0.0, -s, 0.0, c) * dir;

  if (uEnableMouse) {
    float yaw = (uMouse.x - 0.5) * uParallax * 0.4;
    float pitch = (uMouse.y - 0.5) * uParallax * 0.4;
    c = cos(yaw); s = sin(yaw);
    dir = mat3(c, 0.0, s, 0.0, 1.0, 0.0, -s, 0.0, c) * dir;
    c = cos(pitch); s = sin(pitch);
    dir = mat3(1.0, 0.0, 0.0, 0.0, c, -s, 0.0, s, c) * dir;
  }

  float dist = raymarch(cam, dir, freq, tc);
  vec3 pos = cam + dist * dir;

  float t = clamp(uFogDepth / max(dist, 0.001), 0.0, 1.0);
  vec3 body = mix(uWaveColor, uCrestColor, clamp(pos.z * 0.08 + 0.5, 0.0, 1.0));
  vec3 col = mix(uHorizonColor, body, t);
  col *= uBrightness;
  col = clamp(col, 0.0, 1.0);

  float alpha = clamp(t, 0.0, 1.0) * uOpacity;
  if (uGrain > 0.5) {
    float g = hash21(gl_FragCoord.xy + mod(iTime, 64.0) * 11.0);
    alpha += (g - 0.5) * uGrainIntensity;
  }
  alpha = clamp(alpha, 0.0, 1.0);
  fragColor = vec4(col * alpha, alpha);
}
`,S=new WeakMap,ie=({horizonColor:l="#5227FF",waveColor:s="#FF9FFC",crestColor:R="#FFFFFF",speed:A=.4,amplitude:W=2.5,waveScale:E=.6,waveRatio:P=.9,swell:z=35,turbulence:G=20,tilt:q=1.11,zoom:B=1,height:H=5.5,fogDepth:I=15,detail:L="medium",brightness:_=1,opacity:D=1,mouseInteraction:h=!0,parallaxStrength:O=.5,grain:k=!0,grainIntensity:X=.05,className:J=""})=>{const y=x.useRef(null),g=x.useRef(h);return x.useEffect(()=>{const o=y.current;if(!o)return;const n=new Q({webgl:2,alpha:!0,premultipliedAlpha:!0,antialias:!1,dpr:Math.min(window.devicePixelRatio||1,2)}),a=n.gl;a.clearColor(0,0,0,0);const e=a.canvas;e.style.width="100%",e.style.height="100%",e.style.display="block",o.appendChild(e);const p=new U(a),r=new ee(a,{vertex:re,fragment:ue,uniforms:{iTime:{value:0},iResolution:{value:new Float32Array([1,1])},uSpeed:{value:.4},uAmplitude:{value:2.5},uWaveScale:{value:.6},uWaveRatio:{value:.9},uSwell:{value:35},uTurbulence:{value:20},uTilt:{value:1.11},uZoom:{value:1},uHeight:{value:5.5},uFogDepth:{value:15},uSteps:{value:70},uBrightness:{value:1},uOpacity:{value:1},uGrain:{value:1},uGrainIntensity:{value:.05},uMouse:{value:new Float32Array([.5,.5])},uParallax:{value:.5},uEnableMouse:{value:!0},uHorizonColor:{value:new Float32Array([1,1,1])},uWaveColor:{value:new Float32Array([1,1,1])},uCrestColor:{value:new Float32Array([1,1,1])}}}),c=new te(a,{geometry:p,program:r});S.set(o,{renderer:n,program:r,mesh:c});const v=()=>{const t=o.getBoundingClientRect(),i=Math.max(1,Math.floor(t.width)),T=Math.max(1,Math.floor(t.height));n.setSize(i,T);const Y=r.uniforms.iResolution.value;Y[0]=a.drawingBufferWidth,Y[1]=a.drawingBufferHeight,n.render({scene:c})},f=new ResizeObserver(v);f.observe(o),v();const u=[.5,.5],m=[.5,.5],Z=t=>{const i=e.getBoundingClientRect();m[0]=(t.clientX-i.left)/i.width,m[1]=1-(t.clientY-i.top)/i.height},j=()=>{m[0]=.5,m[1]=.5};e.addEventListener("pointermove",Z),e.addEventListener("pointerleave",j);let d=0,w=!0,b=!document.hidden;const K=performance.now(),V=t=>{r.uniforms.iTime.value=(t-K)*.001;const i=g.current?m[0]:.5,T=g.current?m[1]:.5;u[0]+=.05*(i-u[0]),u[1]+=.05*(T-u[1]),r.uniforms.uMouse.value[0]=u[0],r.uniforms.uMouse.value[1]=u[1],n.render({scene:c}),d=requestAnimationFrame(V)},F=()=>{w&&b&&d===0&&(d=requestAnimationFrame(V))},M=()=>{d!==0&&(cancelAnimationFrame(d),d=0)},$=new IntersectionObserver(([t])=>{w=t.isIntersecting,w?F():M()},{threshold:0});$.observe(o);const N=()=>{b=!document.hidden,b?F():M()};return document.addEventListener("visibilitychange",N),F(),()=>{var t;M(),f.disconnect(),$.disconnect(),document.removeEventListener("visibilitychange",N),e.removeEventListener("pointermove",Z),e.removeEventListener("pointerleave",j),S.delete(o);try{o.removeChild(e)}catch{}(t=a.getExtension("WEBGL_lose_context"))==null||t.loseContext()}},[]),x.useEffect(()=>{const o=y.current;if(!o)return;const n=S.get(o);if(!n)return;const{program:a}=n,e=a.uniforms;g.current=h,e.uSpeed.value=A,e.uAmplitude.value=W,e.uWaveScale.value=E,e.uWaveRatio.value=P,e.uSwell.value=z,e.uTurbulence.value=G,e.uTilt.value=q,e.uZoom.value=B,e.uHeight.value=H,e.uFogDepth.value=I,e.uSteps.value=ae(L),e.uBrightness.value=_,e.uOpacity.value=D,e.uGrain.value=k?1:0,e.uGrainIntensity.value=X,e.uParallax.value=O,e.uEnableMouse.value=h;const p=e.uHorizonColor.value,r=e.uWaveColor.value,c=e.uCrestColor.value,v=C(l),f=C(s),u=C(R);p[0]=v[0],p[1]=v[1],p[2]=v[2],r[0]=f[0],r[1]=f[1],r[2]=f[2],c[0]=u[0],c[1]=u[1],c[2]=u[2]},[l,s,R,A,W,E,P,z,G,q,B,H,I,L,_,D,k,X,h,O]),oe.jsx("div",{ref:y,className:`gradient-waves-container ${J}`.trim()})};export{ie as default};
