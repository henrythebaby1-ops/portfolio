import{r as F,R as _,T as G,P as U,M as z,j as D}from"./index-tDOHgNLd.js";function A(s){const a=s.replace("#","");return[parseInt(a.slice(0,2),16)/255,parseInt(a.slice(2,4),16)/255,parseInt(a.slice(4,6),16)/255]}const W=`
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`,j=`
precision highp float;

uniform float uTime;
uniform vec3 uResolution;
uniform float uSpeed;
uniform float uScale;
uniform float uRingCount;
uniform float uSpokeCount;
uniform float uRingThickness;
uniform float uSpokeThickness;
uniform float uSweepSpeed;
uniform float uSweepWidth;
uniform float uSweepLobes;
uniform vec3 uColor;
uniform vec3 uBgColor;
uniform bool uLightMode;
uniform float uFalloff;
uniform float uBrightness;
uniform vec2 uMouse;
uniform float uMouseInfluence;
uniform bool uEnableMouse;

#define TAU 6.28318530718
#define PI 3.14159265359

void main() {
  vec2 st = gl_FragCoord.xy / uResolution.xy;
  st = st * 2.0 - 1.0;
  st.x *= uResolution.x / uResolution.y;

  if (uEnableMouse) {
    vec2 mShift = (uMouse * 2.0 - 1.0);
    mShift.x *= uResolution.x / uResolution.y;
    st -= mShift * uMouseInfluence;
  }

  st *= uScale;

  float dist = length(st);
  float theta = atan(st.y, st.x);
  float t = uTime * uSpeed;

  float ringPhase = dist * uRingCount - t;
  float ringDist = abs(fract(ringPhase) - 0.5);
  float ringGlow = 1.0 - smoothstep(0.0, uRingThickness, ringDist);

  float spokeAngle = abs(fract(theta * uSpokeCount / TAU + 0.5) - 0.5) * TAU / uSpokeCount;
  float arcDist = spokeAngle * dist;
  float spokeGlow = (1.0 - smoothstep(0.0, uSpokeThickness, arcDist)) * smoothstep(0.0, 0.1, dist);

  float sweepPhase = t * uSweepSpeed;
  float sweepBeam = pow(max(0.5 * sin(uSweepLobes * theta + sweepPhase) + 0.5, 0.0), uSweepWidth);

  float fade = smoothstep(1.05, 0.85, dist) * pow(max(1.0 - dist, 0.0), uFalloff);

  float intensity = max((ringGlow + spokeGlow + sweepBeam) * fade * uBrightness, 0.0);
  vec3 signal = uColor * intensity;
  vec3 col;
  if (uLightMode) {
    vec3 mapped = vec3(1.0) - exp(-max(signal, vec3(0.0)) * 1.45);
    float energy = clamp(max(mapped.r, max(mapped.g, mapped.b)), 0.0, 1.0);
    vec3 hue = mapped / max(energy, 0.0001);
    hue = pow(clamp(hue, 0.0, 1.0), vec3(1.2));
    col = mix(uBgColor, hue, smoothstep(0.015, 0.8, energy) * 0.96);
    gl_FragColor = vec4(col, 1.0);
  } else {
    col = signal + uBgColor;
    float alpha = clamp(length(col), 0.0, 1.0);
    gl_FragColor = vec4(col, alpha);
  }
}
`;function q({speed:s=1,scale:a=.5,ringCount:p=10,spokeCount:h=10,ringThickness:d=.05,spokeThickness:g=.01,sweepSpeed:w=1,sweepWidth:S=2,sweepLobes:x=1,color:R="#9f29ff",backgroundColor:C="#000000",falloff:M=2,brightness:E=1,enableMouseInteraction:n=!0,mouseInfluence:T=.1,lightMode:y=!1}){const f=F.useRef(null);return F.useEffect(()=>{if(!f.current)return;const i=f.current,c=new _({alpha:!0,premultipliedAlpha:!1}),e=c.gl;e.clearColor(0,0,0,0);let o,u=[.5,.5],l=[.5,.5];function L(t){const r=e.canvas.getBoundingClientRect();l=[(t.clientX-r.left)/r.width,1-(t.clientY-r.top)/r.height]}function k(){l=[.5,.5]}function v(){c.setSize(i.offsetWidth,i.offsetHeight),o&&(o.uniforms.uResolution.value=[e.canvas.width,e.canvas.height,e.canvas.width/e.canvas.height])}window.addEventListener("resize",v),v();const P=new G(e);o=new U(e,{vertex:W,fragment:j,uniforms:{uTime:{value:0},uResolution:{value:[e.canvas.width,e.canvas.height,e.canvas.width/e.canvas.height]},uSpeed:{value:s},uScale:{value:a},uRingCount:{value:p},uSpokeCount:{value:h},uRingThickness:{value:d},uSpokeThickness:{value:g},uSweepSpeed:{value:w},uSweepWidth:{value:S},uSweepLobes:{value:x},uColor:{value:A(R)},uBgColor:{value:A(C)},uLightMode:{value:y},uFalloff:{value:M},uBrightness:{value:E},uMouse:{value:new Float32Array([.5,.5])},uMouseInfluence:{value:T},uEnableMouse:{value:n}}});const b=new z(e,{geometry:P,program:o});i.appendChild(e.canvas),n&&(e.canvas.addEventListener("mousemove",L),e.canvas.addEventListener("mouseleave",k));let m;function B(t){m=requestAnimationFrame(B),o.uniforms.uTime.value=t*.001,n?(u[0]+=.05*(l[0]-u[0]),u[1]+=.05*(l[1]-u[1]),o.uniforms.uMouse.value[0]=u[0],o.uniforms.uMouse.value[1]=u[1]):(o.uniforms.uMouse.value[0]=.5,o.uniforms.uMouse.value[1]=.5),c.render({scene:b})}return m=requestAnimationFrame(B),()=>{var t;cancelAnimationFrame(m),window.removeEventListener("resize",v),n&&(e.canvas.removeEventListener("mousemove",L),e.canvas.removeEventListener("mouseleave",k)),i.removeChild(e.canvas),(t=e.getExtension("WEBGL_lose_context"))==null||t.loseContext()}},[s,a,p,h,d,g,w,S,x,R,C,M,E,n,T,y]),D.jsx("div",{ref:f,className:"radar-container"})}export{q as default};
