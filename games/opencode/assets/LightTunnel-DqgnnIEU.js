import{r as m,R as ie,T as se,P as ce,M as fe,j as ve}from"./index-tDOHgNLd.js";const R=h=>{const s=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h);return s?[parseInt(s[1],16)/255,parseInt(s[2],16)/255,parseInt(s[3],16)/255]:[1,1,1]},de=`#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`,me=`#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uSpeed;
uniform float uFlowDir;
uniform float uPulseSpeed;
uniform float uPulseLength;
uniform float uPulseBlend;
uniform float uPulseWidth;
uniform float uCableCount;
uniform float uThickness;
uniform float uRimWidth;
uniform float uWaviness;
uniform float uSway;
uniform float uSize;
uniform vec2 uCenter;
uniform vec2 uMouseOffset;
uniform float uGlow;
uniform float uFadeNear;
uniform float uFadeFar;
uniform float uBrightness;
uniform float uColorVariance;
uniform float uOpacity;
uniform vec3 uCableColor;
uniform vec3 uPulseColor;
uniform vec3 uTunnelColor;
uniform float uTunnelOpacity;
uniform float uGrain;
uniform float uGrainIntensity;
uniform float uLightMode;
out vec4 fragColor;

void mainImage(out vec4 o, in vec2 fragCoord) {
  float size = uSize * 2.0;
  float flowDir = uFlowDir;
  float speedBase = uSpeed * 4.0 * flowDir;
  float waviness = uWaviness * 0.15;
  float rotationOsc = uSway * 0.5;
  float baseThick = uThickness * 0.35 + 0.05;
  float borderWeight = uRimWidth * 0.15 + 0.01;
  float cablesCount = floor(uCableCount);

  vec2 res = iResolution.xy;
  vec2 uv = (fragCoord - 0.5 * res) / min(res.y, res.x);
  uv -= (uCenter + uMouseOffset);
  uv /= (size + 0.0001);

  float r = length(uv);
  float angle = atan(uv.y, uv.x);
  float depth = -log(r + 0.0001);

  float swing = sin(iTime * (uSpeed * 0.5 + 0.1)) * rotationOsc;
  float waveOffset = sin(depth * 1.2 + iTime * speedBase * 0.25) * waviness;

  float angleNormalized = (angle / 6.2831853) + 0.5;
  float finalAngle = fract(angleNormalized + waveOffset + swing);

  float cableID = floor(finalAngle * cablesCount);
  float gvX = (fract(finalAngle * cablesCount) - 0.5);

  float rand = fract(sin(cableID * 12.9898) * 43758.5453);
  float randSpeed = (0.4 + rand * 0.6) * speedBase * uPulseSpeed;
  float cableThick = baseThick * (0.6 + rand * 0.4);

  vec3 cableCol = uCableColor;
  cableCol *= 1.0 + (rand - 0.5) * 0.4 * uColorVariance;
  cableCol = mix(cableCol, uPulseColor, rand * 0.25 * uColorVariance);

  float scroll = depth + (iTime * randSpeed);
  float pulseFact = fract(scroll);

  float distToCore = abs(gvX);
  float wireMask = smoothstep(cableThick, cableThick - 0.05, distToCore);
  float rimGlow = smoothstep(borderWeight, 0.0, abs(distToCore - cableThick));

  float pulseThick = cableThick * uPulseWidth;
  float pulseMask = smoothstep(pulseThick, pulseThick - 0.05 * uPulseWidth, distToCore);

  float pulseDist = abs(pulseFact - 0.5);
  float pulseTotal = uPulseLength;
  float pulseCore = pulseTotal * (1.0 - uPulseBlend);
  float pulseLo = min(pulseCore, pulseTotal - max(fwidth(scroll), 1e-4));
  float dataPulse = 1.0 - smoothstep(pulseLo, pulseTotal, pulseDist);

  float aBody = wireMask * uTunnelOpacity;
  float aRim = rimGlow;
  float aPulse = clamp(dataPulse * pulseMask, 0.0, 1.0);

  vec3 fiberCol = uTunnelColor * aBody
    + cableCol * aRim * 1.3 * uGlow
    + uPulseColor * dataPulse * 3.0 * pulseMask;

  float distFade = smoothstep(0.0, uFadeNear, r) * smoothstep(uFadeFar, uFadeFar - 0.9, r);
  float inten = clamp(aBody + aRim + aPulse, 0.0, 1.0) * distFade;

  vec3 finalCol = fiberCol * uBrightness;
  float alpha = clamp(inten, 0.0, 1.0) * uOpacity;
  vec3 outRgb = finalCol * alpha;

  if (uGrain > 0.5) {
    float gv = (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233)) + iTime) * 43758.5453) - 0.5) * uGrainIntensity;
    outRgb = clamp(outRgb + gv, 0.0, 1.0);
    alpha = clamp(alpha + gv, 0.0, 1.0);
  }

  o = vec4(outRgb, alpha);
}

void main() {
  vec4 o = vec4(0.0);
  mainImage(o, gl_FragCoord.xy);
  if (uLightMode > 0.5) {
    float peak = max(o.r, max(o.g, o.b));
    vec3 chroma = pow(clamp(o.rgb / max(peak, 0.0001), 0.0, 1.0), vec3(1.16));
    fragColor = vec4(mix(vec3(1.0), chroma, o.a * 0.95), 1.0);
  } else {
    fragColor = o;
  }
}
`,x=new WeakMap,pe=({cableColor:h="#A855F7",pulseColor:s="#A855F7",tunnelColor:M="#5227FF",tunnelOpacity:k=0,speed:S=.1,flowDirection:B="outward",pulseSpeed:L=2,pulseLength:O=.28,pulseBlend:W=1,pulseWidth:A=1,cableCount:G=20,thickness:E=.35,rimWidth:z=.15,waviness:I=.3,sway:D=.5,size:V=1,centerX:N=0,centerY:_=0,glow:j=1,fadeNear:U=.5,fadeFar:q=2,brightness:X=1,colorVariance:$=!0,grain:H=!0,grainIntensity:J=.05,opacity:K=1,mouseInteraction:g=!0,mouseStrength:C=.1,lightMode:Q=!1,className:ue=""})=>{const b=m.useRef(null),Y=m.useRef(g),w=m.useRef(C);return m.useEffect(()=>{const t=b.current;if(!t)return;const r=new ie({webgl:2,alpha:!0,premultipliedAlpha:!0,antialias:!1,dpr:Math.min(window.devicePixelRatio||1,2)}),l=r.gl;l.clearColor(0,0,0,0);const e=l.canvas;e.style.width="100%",e.style.height="100%",e.style.display="block",t.appendChild(e);const p=new se(l),u=new ce(l,{vertex:de,fragment:me,uniforms:{iTime:{value:0},iResolution:{value:new Float32Array([1,1])},uSpeed:{value:.1},uFlowDir:{value:-1},uPulseSpeed:{value:2},uPulseLength:{value:.28},uPulseBlend:{value:1},uPulseWidth:{value:1},uCableCount:{value:20},uThickness:{value:.35},uRimWidth:{value:.15},uWaviness:{value:.3},uSway:{value:.5},uSize:{value:1},uCenter:{value:new Float32Array([0,0])},uMouseOffset:{value:new Float32Array([0,0])},uGlow:{value:1},uFadeNear:{value:.5},uFadeFar:{value:2},uBrightness:{value:1},uColorVariance:{value:1},uOpacity:{value:1},uCableColor:{value:new Float32Array([.65882353,.33333333,.96862745])},uPulseColor:{value:new Float32Array([.65882353,.33333333,.96862745])},uTunnelColor:{value:new Float32Array([.32156863,.15294118,1])},uTunnelOpacity:{value:0},uGrain:{value:1},uGrainIntensity:{value:.05},uLightMode:{value:0}}}),c=new fe(l,{geometry:p,program:u});x.set(t,{renderer:r,program:u,mesh:c});const f=()=>{const o=t.getBoundingClientRect(),n=Math.max(1,Math.floor(o.width)),re=Math.max(1,Math.floor(o.height));r.setSize(n,re);const le=u.uniforms.iResolution.value;le[0]=l.drawingBufferWidth,le[1]=l.drawingBufferHeight,r.render({scene:c})},v=new ResizeObserver(f);v.observe(t),f();let a=[.5,.5],i=[.5,.5];const Z=o=>{const n=e.getBoundingClientRect();i=[(o.clientX-n.left)/n.width,1-(o.clientY-n.top)/n.height]},ee=()=>{i=[.5,.5]};e.addEventListener("mousemove",Z),e.addEventListener("mouseleave",ee);let d=0,T=!0,y=!document.hidden;const ne=performance.now(),ae=o=>{u.uniforms.iTime.value=(o-ne)*.001,Y.current?(a[0]+=.05*(i[0]-a[0]),a[1]+=.05*(i[1]-a[1])):(a[0]+=.05*(.5-a[0]),a[1]+=.05*(.5-a[1]));const n=u.uniforms.uMouseOffset.value;n[0]=(a[0]-.5)*w.current,n[1]=(a[1]-.5)*w.current,r.render({scene:c}),d=requestAnimationFrame(ae)},F=()=>{T&&y&&d===0&&(d=requestAnimationFrame(ae))},P=()=>{d!==0&&(cancelAnimationFrame(d),d=0)},oe=new IntersectionObserver(([o])=>{T=o.isIntersecting,T?F():P()},{threshold:0});oe.observe(t);const te=()=>{y=!document.hidden,y?F():P()};return document.addEventListener("visibilitychange",te),F(),()=>{var o;P(),v.disconnect(),oe.disconnect(),document.removeEventListener("visibilitychange",te),e.removeEventListener("mousemove",Z),e.removeEventListener("mouseleave",ee),x.delete(t);try{t.removeChild(e)}catch{}(o=l.getExtension("WEBGL_lose_context"))==null||o.loseContext()}},[]),m.useEffect(()=>{Y.current=g,w.current=C;const t=b.current;if(!t)return;const r=x.get(t);if(!r)return;const{program:l}=r,e=l.uniforms;e.uSpeed.value=S,e.uFlowDir.value=B==="outward"?-1:1,e.uPulseSpeed.value=L,e.uPulseLength.value=O,e.uPulseBlend.value=W,e.uPulseWidth.value=A,e.uCableCount.value=G,e.uThickness.value=E,e.uRimWidth.value=z,e.uWaviness.value=I,e.uSway.value=D,e.uSize.value=V;const p=e.uCenter.value;p[0]=N,p[1]=_,e.uGlow.value=j,e.uFadeNear.value=U,e.uFadeFar.value=q,e.uBrightness.value=X,e.uColorVariance.value=$?1:0,e.uGrain.value=H?1:0,e.uGrainIntensity.value=J,e.uOpacity.value=K,e.uLightMode.value=Q?1:0;const u=R(h),c=e.uCableColor.value;c[0]=u[0],c[1]=u[1],c[2]=u[2];const f=R(s),v=e.uPulseColor.value;v[0]=f[0],v[1]=f[1],v[2]=f[2];const a=R(M),i=e.uTunnelColor.value;i[0]=a[0],i[1]=a[1],i[2]=a[2],e.uTunnelOpacity.value=k},[h,s,M,k,S,B,L,O,W,A,G,E,z,I,D,V,N,_,j,U,q,X,$,H,J,K,g,C,Q]),ve.jsx("div",{ref:b,className:`light-tunnel-container ${ue}`.trim()})};export{pe as default};
