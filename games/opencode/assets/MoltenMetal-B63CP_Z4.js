import{r as F,R as Q,T as U,P as Z,M as ee,j as oe}from"./index-tDOHgNLd.js";const h=u=>{const l=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(u);return l?[parseInt(l[1],16)/255,parseInt(l[2],16)/255,parseInt(l[3],16)/255]:[1,1,1]},te=u=>u==="ember"?1:u==="frost"?2:0,ne=`#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`,ie=`#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uSpeed;
uniform float uScale;
uniform float uDetail;
uniform float uGlow;
uniform float uCoreSize;
uniform float uSwirl;
uniform float uFold;
uniform float uBlackPoint;
uniform float uBrightness;
uniform float uColorMode;
uniform float uGrain;
uniform float uGrainIntensity;
uniform float uOpacity;
uniform vec2 uMouse;
uniform float uMouseStrength;
uniform bool uEnableMouse;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uBackgroundColor;
uniform bool uLightMode;
out vec4 fragColor;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  float time = iTime * uSpeed;
  vec2 p = uScale * ((gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y) - 0.5;

  vec2 drift = vec2(0.0);
  if (uEnableMouse) {
    drift = (uMouse - 0.5) * uMouseStrength * 2.0;
  }
  p += drift;

  vec2 i = p;
  float c = 0.0;
  float r = length(p + vec2(sin(time), sin(time * 0.3 + 5.0)) * 0.5);
  float d = length(p);
  float rot = d + time + p.x * uSwirl;

  float cosRot = cos(rot);
  mat2 warp = mat2(cos(rot - sin(time / 5.0)), sin(rot), -sin(cosRot - time), cosRot) * uFold;
  float glowCore = uGlow * uCoreSize;

  for (float n = 0.0; n < 8.0; n++) {
    if (n >= uDetail) break;
    p *= warp;
    float t = r - time / (n + 3.0);
    i -= p + vec2(cos(t - i.x - r) + sin(t + i.y), sin(t - i.y) + cos(t + i.x) + r);
    c += glowCore / length(vec2(sin(i.x + t), cos(i.y + t)));
  }

  c /= 6.0;

  float intensity = max(c - uBlackPoint, 0.0) * uBrightness;

  float g = clamp(intensity, 0.0, 1.0);

  float mid = 0.5;
  if (uColorMode > 1.5) {
    mid = 0.65;
  } else if (uColorMode > 0.5) {
    mid = 0.35;
  }

  vec3 col = mix(uColor1, uColor2, smoothstep(0.0, mid, g));
  col = mix(col, uColor3, smoothstep(mid, 1.0, g));

  float a = g;
  if (uGrain > 0.5) {
    float gr = hash(gl_FragCoord.xy + iTime);
    a += (gr - 0.5) * uGrainIntensity;
  }
  a = clamp(a, 0.0, 1.0) * uOpacity;
  if (uLightMode) {
    float signal = 1.0 - exp(-max(c, 0.0) * 6.5);
    float body = smoothstep(0.075, 0.68, signal);
    float ridge = smoothstep(0.42, 0.92, signal);

    vec3 lightCol = mix(uColor1, uColor2, smoothstep(0.08, 0.52, signal));
    lightCol = mix(lightCol, uColor3, smoothstep(0.52, 0.96, signal));
    lightCol = mix(lightCol, lightCol * 0.72, ridge * 0.24);

    float coverage = body * mix(0.2, 0.86, signal) * uOpacity;
    if (uGrain > 0.5) {
      float gr = hash(gl_FragCoord.xy + iTime);
      coverage += (gr - 0.5) * uGrainIntensity * body * 0.16;
    }
    fragColor = vec4(mix(uBackgroundColor, lightCol, clamp(coverage, 0.0, 0.92)), 1.0);
  } else {
    fragColor = vec4(col * a, a);
  }
}
`,w=new WeakMap,re=({color1:u="#5227FF",color2:l="#FF9FFC",color3:S="#FFFFFF",speed:b=.35,scale:B=4,detail:R=3,glow:E=1.6,coreSize:G=.1,swirl:L=1,fold:k=-.2,blackPoint:A=.05,brightness:T=1.3,colorMode:I="molten",grain:P=!0,grainIntensity:O=.05,mouseInteraction:z=!0,mouseStrength:_=.3,opacity:D=1,backgroundColor:j="#FFFFFF",lightMode:V=!1,className:Y=""})=>{const p=F.useRef(null);return F.useEffect(()=>{const t=p.current;if(!t)return;const r=new Q({webgl:2,alpha:!0,premultipliedAlpha:!0,antialias:!1,dpr:Math.min(window.devicePixelRatio||1,2)}),e=r.gl;e.clearColor(0,0,0,0);const o=e.canvas;o.style.width="100%",o.style.height="100%",o.style.display="block",t.appendChild(o);const g=new U(e),i=new Z(e,{vertex:ne,fragment:ie,uniforms:{iTime:{value:0},iResolution:{value:new Float32Array([1,1])},uSpeed:{value:.35},uScale:{value:4},uDetail:{value:3},uGlow:{value:1.6},uCoreSize:{value:.1},uSwirl:{value:1},uFold:{value:-.2},uBlackPoint:{value:.05},uBrightness:{value:1.3},uColorMode:{value:0},uGrain:{value:1},uGrainIntensity:{value:.05},uOpacity:{value:1},uMouse:{value:new Float32Array([.5,.5])},uMouseStrength:{value:.3},uEnableMouse:{value:!0},uColor1:{value:new Float32Array([1,1,1])},uColor2:{value:new Float32Array([1,1,1])},uColor3:{value:new Float32Array([1,1,1])},uBackgroundColor:{value:new Float32Array([1,1,1])},uLightMode:{value:!1}}}),s=new ee(e,{geometry:g,program:i});w.set(t,{renderer:r,program:i,mesh:s});const c=()=>{const n=t.getBoundingClientRect(),d=Math.max(1,Math.floor(n.width)),K=Math.max(1,Math.floor(n.height));r.setSize(d,K);const X=i.uniforms.iResolution.value;X[0]=e.drawingBufferWidth,X[1]=e.drawingBufferHeight,r.render({scene:s})},f=new ResizeObserver(c);f.observe(t),c();const a=[.5,.5],m=[.5,.5],W=n=>{const d=o.getBoundingClientRect();a[0]=(n.clientX-d.left)/d.width,a[1]=1-(n.clientY-d.top)/d.height},q=()=>{a[0]=.5,a[1]=.5};o.addEventListener("mousemove",W),o.addEventListener("mouseleave",q);let v=0,C=!0,M=!document.hidden;const J=performance.now(),N=n=>{i.uniforms.iTime.value=(n-J)*.001,m[0]+=.05*(a[0]-m[0]),m[1]+=.05*(a[1]-m[1]),i.uniforms.uMouse.value[0]=m[0],i.uniforms.uMouse.value[1]=m[1],r.render({scene:s}),v=requestAnimationFrame(N)},y=()=>{C&&M&&v===0&&(v=requestAnimationFrame(N))},x=()=>{v!==0&&(cancelAnimationFrame(v),v=0)},$=new IntersectionObserver(([n])=>{C=n.isIntersecting,C?y():x()},{threshold:0});$.observe(t);const H=()=>{M=!document.hidden,M?y():x()};return document.addEventListener("visibilitychange",H),y(),()=>{var n;x(),f.disconnect(),$.disconnect(),document.removeEventListener("visibilitychange",H),o.removeEventListener("mousemove",W),o.removeEventListener("mouseleave",q),w.delete(t),o.parentNode===t&&t.removeChild(o),(n=e.getExtension("WEBGL_lose_context"))==null||n.loseContext()}},[]),F.useEffect(()=>{const t=p.current;if(!t)return;const r=w.get(t);if(!r)return;const e=r.program.uniforms;e.uSpeed.value=b,e.uScale.value=B,e.uDetail.value=R,e.uGlow.value=E,e.uCoreSize.value=Math.max(G,.001),e.uSwirl.value=L,e.uFold.value=k,e.uBlackPoint.value=A,e.uBrightness.value=T,e.uColorMode.value=te(I),e.uGrain.value=P?1:0,e.uGrainIntensity.value=O,e.uOpacity.value=D,e.uMouseStrength.value=_,e.uEnableMouse.value=z,e.uLightMode.value=V;const o=h(u),g=h(l),i=h(S),s=h(j),c=e.uColor1.value,f=e.uColor2.value,a=e.uColor3.value;c[0]=o[0],c[1]=o[1],c[2]=o[2],f[0]=g[0],f[1]=g[1],f[2]=g[2],a[0]=i[0],a[1]=i[1],a[2]=i[2],e.uBackgroundColor.value[0]=s[0],e.uBackgroundColor.value[1]=s[1],e.uBackgroundColor.value[2]=s[2]},[u,l,S,b,B,R,E,G,L,k,A,T,I,P,O,z,_,D,j,V]),oe.jsx("div",{ref:p,className:`molten-metal-container ${Y}`.trim()})};export{re as default};
