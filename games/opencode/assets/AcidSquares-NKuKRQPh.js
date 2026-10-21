import{r as i,R as ye,T as Me,P as ve,M as me,j as Ce,a as de}from"./index-D0zNZLAK.js";const B=d=>{const v=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(d);return v?[parseInt(v[1],16)/255,parseInt(v[2],16)/255,parseInt(v[3],16)/255]:[1,1,1]},pe={low:20,medium:32,high:48},Se=d=>pe[d]||pe.medium,ge=`#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`,be=`#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uSpeed;
uniform float uWaveDepth;
uniform float uZoom;
uniform float uDensity;
uniform float uSpread;
uniform float uStepSize;
uniform float uGlow;
uniform float uExposure;
uniform float uColorShift;
uniform float uContrast;
uniform float uBrightness;
uniform float uOpacity;
uniform float uSteps;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec2 uMouse;
uniform float uMouseStrength;
uniform float uMouseRadius;
uniform float uEnableMouse;
uniform float uMouseActive;
uniform float uGrain;
uniform float uGrainIntensity;
uniform float uLightMode;
out vec4 fragColor;

void main() {
  vec2 frag = gl_FragCoord.xy;
  float zoom = max(uZoom, 0.05);
  float aspect = iResolution.x / iResolution.y;
  vec2 ndc = (2.0 * frag - iResolution.xy) / iResolution.y;
  vec2 dir = ndc * (0.5 / zoom);

  vec2 mouseNdc = vec2(uMouse.x * aspect, uMouse.y);
  float mr = max(uMouseRadius, 0.01);
  vec2 md = ndc - mouseNdc;
  float dent = exp(-dot(md, md) / (mr * mr)) * (3.0 * uMouseStrength * uEnableMouse * uMouseActive);

  float travel = sin(iTime * uSpeed) * uWaveDepth;
  float density = max(uDensity, 1.0);
  float spread = clamp(uSpread, 0.05, 0.6);
  float stepSize = max(uStepSize, 0.0005);
  float glowGain = max(uGlow, 0.0);

  vec3 tOffset = vec3(0.0, dent, travel);
  vec3 p = vec3(0.0);
  float s = 0.0;
  float glow = 0.0;

  for (int i = 0; i < 64; i++) {
    if (float(i) >= uSteps) break;
    p += vec3(dir * s, s);
    vec3 q = p + tOffset;
    s += density - length(q.xz) + length(ceil(q).xy);
    s = stepSize + abs(s) * spread;
    glow += glowGain / s;
  }

  float e = glow / max(uExposure, 1.0);
  float shimmer = 0.5 + 0.5 * dot(cos(iTime * uColorShift + p), vec3(0.3333));
  float v = tanh(e * uBrightness * mix(0.7, 1.05, shimmer));
  v = clamp((v - 0.5) * uContrast + 0.5, 0.0, 1.0);

  vec3 col = mix(uColor1, uColor2, smoothstep(0.0, 0.55, v));
  col = mix(col, uColor3, smoothstep(0.55, 1.0, v));
  col *= v;

  float a = clamp(v, 0.0, 1.0) * uOpacity;
  vec3 outRgb = col * a;
  if (uGrain > 0.5) {
    float gv = (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233)) + iTime) * 43758.5453) - 0.5) * uGrainIntensity;
    outRgb = clamp(outRgb + gv, 0.0, 1.0);
    a = clamp(a + gv, 0.0, 1.0);
  }
  if (uLightMode > 0.5) {
    float peak = max(col.r, max(col.g, col.b));
    vec3 chroma = pow(clamp(col / max(peak, 0.0001), 0.0, 1.0), vec3(1.16));
    fragColor = vec4(mix(vec3(1.0), chroma, a * 0.94), 1.0);
  } else {
    fragColor = vec4(outRgb, a);
  }
}
`,Fe=`#version 300 es
precision highp float;
uniform sampler2D tMap;
uniform vec2 iResolution;
uniform vec2 uDirection;
uniform float uRadius;
uniform float uGrain;
uniform float uGrainIntensity;
uniform float iTime;
out vec4 fragColor;

vec4 samp(vec2 uv) {
  return texture(tMap, uv);
}

void main() {
  vec2 uv = gl_FragCoord.xy / iResolution;
  vec2 texel = uDirection / iResolution;
  float st = uRadius * 0.25;
  vec4 sum = samp(uv) * 0.2026;
  sum += (samp(uv + texel * st) + samp(uv - texel * st)) * 0.179;
  sum += (samp(uv + texel * (st * 2.0)) + samp(uv - texel * (st * 2.0))) * 0.124;
  sum += (samp(uv + texel * (st * 3.0)) + samp(uv - texel * (st * 3.0))) * 0.0672;
  sum += (samp(uv + texel * (st * 4.0)) + samp(uv - texel * (st * 4.0))) * 0.0285;
  vec4 col = sum;
  if (uGrain > 0.5) {
    float gv = (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233)) + iTime) * 43758.5453) - 0.5) * uGrainIntensity;
    col.rgb = clamp(col.rgb + gv, 0.0, 1.0);
    col.a = clamp(col.a + gv, 0.0, 1.0);
  }
  fragColor = col;
}
`,I=new WeakMap,Ee=({color1:d="#5227FF",color2:v="#A855F7",color3:O="#FFFFFF",detail:W="medium",speed:_=.7,waveDepth:q=1,zoom:P=1.3,density:k=10,glow:Z=1,exposure:j=2700,spread:N=.3,stepSize:V=.002,colorShift:H=0,contrast:$=1,brightness:X=1,opacity:Y=1,mouseInteraction:w=!0,mouseStrength:y=.1,mouseRadius:J=.35,blur:M=0,grain:C=!0,grainIntensity:S=.05,lightMode:K=!1,className:he=""})=>{const b=i.useRef(null),Q=i.useRef([0,0]),xe=i.useRef([0,0]),F=i.useRef(w),U=i.useRef(y),G=i.useRef(0),E=i.useRef(0),T=i.useRef(M),ee=i.useRef(C),te=i.useRef(S);return i.useEffect(()=>{const r=b.current;if(!r)return;const l=new ye({webgl:2,alpha:!0,premultipliedAlpha:!0,antialias:!1,dpr:Math.min(window.devicePixelRatio||1,2)}),o=l.gl;o.clearColor(0,0,0,0);const e=o.canvas;e.style.width="100%",e.style.height="100%",e.style.display="block",r.appendChild(e);const p=new Me(o),n=new ve(o,{vertex:ge,fragment:be,uniforms:{iTime:{value:0},iResolution:{value:new Float32Array([1,1])},uSpeed:{value:.7},uWaveDepth:{value:1},uZoom:{value:1.3},uDensity:{value:10},uSpread:{value:.3},uStepSize:{value:.002},uGlow:{value:1},uExposure:{value:2700},uColorShift:{value:0},uContrast:{value:1},uBrightness:{value:1},uOpacity:{value:1},uSteps:{value:32},uColor1:{value:new Float32Array([1,1,1])},uColor2:{value:new Float32Array([1,1,1])},uColor3:{value:new Float32Array([1,1,1])},uMouse:{value:new Float32Array([0,0])},uMouseStrength:{value:.1},uMouseRadius:{value:.35},uEnableMouse:{value:1},uMouseActive:{value:0},uGrain:{value:1},uGrainIntensity:{value:.05},uLightMode:{value:0}}}),m=new me(o,{geometry:p,program:n}),c=new ve(o,{vertex:ge,fragment:Fe,uniforms:{tMap:{value:null},iResolution:{value:new Float32Array([1,1])},uDirection:{value:new Float32Array([1,0])},uRadius:{value:0},uGrain:{value:0},uGrainIntensity:{value:.05},iTime:{value:0}}}),g=new me(o,{geometry:p,program:c});let s=null,h=null;const Re=()=>{if(!s){const u=o.drawingBufferWidth,t=o.drawingBufferHeight;s=new de(o,{width:u,height:t,depth:!1}),h=new de(o,{width:u,height:t,depth:!1})}},oe=()=>{const u=ee.current?1:0,t=te.current;if(n.uniforms.uGrainIntensity.value=t,c.uniforms.uGrainIntensity.value=t,T.current>0){Re(),n.uniforms.uGrain.value=0,l.render({scene:m,target:s});const a=c.uniforms;a.uRadius.value=T.current*14,a.tMap.value=s.texture,a.uDirection.value[0]=1,a.uDirection.value[1]=0,a.uGrain.value=0,l.render({scene:g,target:h}),a.tMap.value=h.texture,a.uDirection.value[0]=0,a.uDirection.value[1]=1,a.uGrain.value=u,l.render({scene:g})}else n.uniforms.uGrain.value=u,l.render({scene:m})};I.set(r,{renderer:l,program:n,mesh:m});const ue=()=>{const u=r.getBoundingClientRect(),t=Math.max(1,Math.floor(u.width)),a=Math.max(1,Math.floor(u.height));l.setSize(t,a);const f=o.drawingBufferWidth,R=o.drawingBufferHeight,ce=n.uniforms.iResolution.value;ce[0]=f,ce[1]=R;const fe=c.uniforms.iResolution.value;fe[0]=f,fe[1]=R,s&&(s.setSize(f,R),h.setSize(f,R)),oe()},re=new ResizeObserver(ue);re.observe(r),ue();const ne=u=>{const t=r.getBoundingClientRect(),a=((u.clientX-t.left)/t.width-.5)*2,f=-((u.clientY-t.top)/t.height-.5)*2;Q.current=[a,f],E.current=1},ae=()=>{E.current=0};r.addEventListener("mousemove",ne),r.addEventListener("mouseleave",ae);let x=0,A=!0,D=!document.hidden;const we=performance.now(),se=u=>{n.uniforms.iTime.value=(u-we)*.001;const t=xe.current,a=Q.current;t[0]+=.05*(a[0]-t[0]),t[1]+=.05*(a[1]-t[1]);const f=n.uniforms.uMouse.value;f[0]=t[0],f[1]=t[1];const R=F.current?E.current:0;G.current+=.05*(R-G.current),n.uniforms.uMouseActive.value=G.current,n.uniforms.uEnableMouse.value=F.current?1:0,n.uniforms.uMouseStrength.value=U.current,c.uniforms.iTime.value=n.uniforms.iTime.value,oe(),x=requestAnimationFrame(se)},L=()=>{A&&D&&x===0&&(x=requestAnimationFrame(se))},z=()=>{x!==0&&(cancelAnimationFrame(x),x=0)},ie=new IntersectionObserver(([u])=>{A=u.isIntersecting,A?L():z()},{threshold:0});ie.observe(r);const le=()=>{D=!document.hidden,D?L():z()};return document.addEventListener("visibilitychange",le),L(),()=>{var u;z(),re.disconnect(),ie.disconnect(),document.removeEventListener("visibilitychange",le),r.removeEventListener("mousemove",ne),r.removeEventListener("mouseleave",ae),I.delete(r),s&&(o.deleteFramebuffer(s.buffer),o.deleteFramebuffer(h.buffer),s.textures.forEach(t=>o.deleteTexture(t.texture)),h.textures.forEach(t=>o.deleteTexture(t.texture)));try{r.removeChild(e)}catch{}(u=o.getExtension("WEBGL_lose_context"))==null||u.loseContext()}},[]),i.useEffect(()=>{const r=b.current;if(!r)return;const l=I.get(r);if(!l)return;const{program:o}=l,e=o.uniforms;e.uSpeed.value=_,e.uWaveDepth.value=q,e.uZoom.value=P,e.uDensity.value=k,e.uSpread.value=N,e.uStepSize.value=V,e.uGlow.value=Z,e.uExposure.value=j,e.uColorShift.value=H,e.uContrast.value=$,e.uBrightness.value=X,e.uOpacity.value=Y,e.uLightMode.value=K?1:0,e.uSteps.value=Se(W),e.uMouseRadius.value=J;const p=B(d),n=e.uColor1.value;n[0]=p[0],n[1]=p[1],n[2]=p[2];const m=B(v),c=e.uColor2.value;c[0]=m[0],c[1]=m[1],c[2]=m[2];const g=B(O),s=e.uColor3.value;s[0]=g[0],s[1]=g[1],s[2]=g[2],F.current=w,U.current=y,T.current=M,ee.current=C,te.current=S},[d,v,O,W,_,q,P,k,Z,j,N,V,H,$,X,Y,w,y,J,M,C,S,K]),Ce.jsx("div",{ref:b,className:`acid-squares-container ${he}`.trim()})};export{Ee as default};
