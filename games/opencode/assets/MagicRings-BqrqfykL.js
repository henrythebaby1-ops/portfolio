import{r as a,j as ne}from"./index-tDOHgNLd.js";import{W as ae,S as re,s as ie,h as P,C as B,p as se,b as le,t as ce}from"./three.module-BgPORkTe.js";const ve=`
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,me=`
precision highp float;

uniform float uTime, uAttenuation, uLineThickness;
uniform float uBaseRadius, uRadiusStep, uScaleRate;
uniform float uOpacity, uNoiseAmount, uRotation, uRingGap;
uniform float uFadeIn, uFadeOut;
uniform float uMouseInfluence, uHoverAmount, uHoverScale, uParallax, uBurst;
uniform float uCoverageAlpha;
uniform vec2 uResolution, uMouse;
uniform vec3 uColor, uColorTwo;
uniform int uRingCount;

const float HP = 1.5707963;
const float CYCLE = 3.45;

float fade(float t) {
  return t < uFadeIn ? smoothstep(0.0, uFadeIn, t) : 1.0 - smoothstep(uFadeOut, CYCLE - 0.2, t);
}

float ring(vec2 p, float ri, float cut, float t0, float px) {
  float t = mod(uTime + t0, CYCLE);
  float r = ri + t / CYCLE * uScaleRate;
  float d = abs(length(p) - r);
  float a = atan(abs(p.y), abs(p.x)) / HP;
  float th = max(1.0 - a, 0.5) * px * uLineThickness;
  float h = (1.0 - smoothstep(th, th * 1.5, d)) + 1.0;
  d += pow(cut * a, 3.0) * r;
  return h * exp(-uAttenuation * d) * fade(t);
}

void main() {
  float px = 1.0 / min(uResolution.x, uResolution.y);
  vec2 p = (gl_FragCoord.xy - 0.5 * uResolution.xy) * px;
  float cr = cos(uRotation), sr = sin(uRotation);
  p = mat2(cr, -sr, sr, cr) * p;
  p -= uMouse * uMouseInfluence;
  float sc = mix(1.0, uHoverScale, uHoverAmount) + uBurst * 0.3;
  p /= sc;
  vec3 c = vec3(0.0);
  float coverage = 0.0;
  float rcf = max(float(uRingCount) - 1.0, 1.0);
  for (int i = 0; i < 10; i++) {
    if (i >= uRingCount) break;
    float fi = float(i);
    vec2 pr = p - fi * uParallax * uMouse;
    vec3 rc = mix(uColor, uColorTwo, fi / rcf);
    float ringAmount = ring(pr, uBaseRadius + fi * uRadiusStep, pow(uRingGap, fi), i == 0 ? 0.0 : 2.95 * fi, px);
    c = mix(c, rc, vec3(ringAmount));
    coverage = max(coverage, ringAmount);
  }
  c *= 1.0 + uBurst * 2.0;
  float n = fract(sin(dot(gl_FragCoord.xy + uTime * 100.0, vec2(12.9898, 78.233))) * 43758.5453);
  c += (n - 0.5) * uNoiseAmount;
  float intensity = max(c.r, max(c.g, c.b));
  vec3 emissiveColor = intensity > 0.0001 ? clamp(c / intensity, 0.0, 1.0) : vec3(0.0);
  vec3 outputColor = mix(emissiveColor, clamp(c, 0.0, 1.0), uCoverageAlpha);
  float outputAlpha = mix(intensity, coverage, uCoverageAlpha);
  gl_FragColor = vec4(outputColor, clamp(outputAlpha * uOpacity, 0.0, 1.0));
}
`;function pe({color:k="#fc42ff",colorTwo:G="#42fcff",speed:z=1,ringCount:N=6,attenuation:V=10,lineThickness:Y=2,baseRadius:j=.35,radiusStep:W=.1,scaleRate:_=.1,opacity:q=1,blur:C=0,noiseAmount:X=.1,rotation:$=0,ringGap:D=1.5,fadeIn:J=.7,fadeOut:K=.5,followMouse:Q=!1,mouseInfluence:U=.2,hoverScale:Z=1.2,parallax:ee=.05,clickBurst:te=!1,alphaMode:oe="luminance"}){const w=a.useRef(null),x=a.useRef(null),i=a.useRef([0,0]),s=a.useRef([0,0]),f=a.useRef(0),d=a.useRef(!1),l=a.useRef(0);return x.current={color:k,colorTwo:G,speed:z,ringCount:N,attenuation:V,lineThickness:Y,baseRadius:j,radiusStep:W,scaleRate:_,opacity:q,noiseAmount:X,rotation:$,ringGap:D,fadeIn:J,fadeOut:K,followMouse:Q,mouseInfluence:U,hoverScale:Z,parallax:ee,clickBurst:te,alphaMode:oe},a.useEffect(()=>{const n=w.current;if(!n)return;let o;try{o=new ae({alpha:!0})}catch{return}if(!o.capabilities.isWebGL2){o.dispose();return}o.setClearColor(0,0),n.appendChild(o.domElement);const A=new re,E=new ie(-.5,.5,.5,-.5,.1,10);E.position.z=1;const t={uTime:{value:0},uAttenuation:{value:0},uResolution:{value:new P},uColor:{value:new B},uColorTwo:{value:new B},uLineThickness:{value:0},uBaseRadius:{value:0},uRadiusStep:{value:0},uScaleRate:{value:0},uRingCount:{value:0},uOpacity:{value:1},uNoiseAmount:{value:0},uRotation:{value:0},uRingGap:{value:1.6},uFadeIn:{value:.5},uFadeOut:{value:.75},uMouse:{value:new P},uMouseInfluence:{value:0},uHoverAmount:{value:0},uHoverScale:{value:1},uParallax:{value:0},uBurst:{value:0},uCoverageAlpha:{value:0}},M=new se({vertexShader:ve,fragmentShader:me,uniforms:t,transparent:!0}),ue=new le(new ce(1,1),M);A.add(ue);const v=()=>{const u=n.clientWidth,e=n.clientHeight,c=Math.min(window.devicePixelRatio,2);o.setSize(u,e),o.setPixelRatio(c),t.uResolution.value.set(u*c,e*c)};v(),window.addEventListener("resize",v);const L=new ResizeObserver(v);L.observe(n);const y=u=>{const e=n.getBoundingClientRect();i.current[0]=(u.clientX-e.left)/e.width-.5,i.current[1]=-((u.clientY-e.top)/e.height-.5)},S=()=>{d.current=!0},b=()=>{d.current=!1,i.current[0]=0,i.current[1]=0},T=()=>{l.current=1};window.addEventListener("mousemove",y),window.addEventListener("mouseover",S),document.documentElement.addEventListener("mouseleave",b),window.addEventListener("click",T);let r=0,p=!1,R=!document.hidden,F=0,m=0;const I=u=>{r=requestAnimationFrame(I);const e=x.current,c=m===0?0:Math.min(u-m,100);m=u,F+=c*.001*e.speed,s.current[0]+=(i.current[0]-s.current[0])*.08,s.current[1]+=(i.current[1]-s.current[1])*.08,f.current+=((d.current?1:0)-f.current)*.08,l.current*=.95,l.current<.001&&(l.current=0),t.uTime.value=F,t.uAttenuation.value=e.attenuation,t.uColor.value.set(e.color),t.uColorTwo.value.set(e.colorTwo),t.uLineThickness.value=e.lineThickness,t.uBaseRadius.value=e.baseRadius,t.uRadiusStep.value=e.radiusStep,t.uScaleRate.value=e.scaleRate,t.uRingCount.value=e.ringCount,t.uOpacity.value=e.opacity,t.uNoiseAmount.value=e.noiseAmount,t.uRotation.value=e.rotation*Math.PI/180,t.uRingGap.value=e.ringGap,t.uFadeIn.value=e.fadeIn,t.uFadeOut.value=e.fadeOut,t.uMouse.value.set(s.current[0],s.current[1]),t.uMouseInfluence.value=e.followMouse?e.mouseInfluence:0,t.uHoverAmount.value=f.current,t.uHoverScale.value=e.hoverScale,t.uParallax.value=e.parallax,t.uBurst.value=e.clickBurst?l.current:0,t.uCoverageAlpha.value=e.alphaMode==="coverage"?1:0,o.render(A,E)};r=0;const h=()=>{p&&R&&r===0&&(m=0,r=requestAnimationFrame(I))},g=()=>{r!==0&&(cancelAnimationFrame(r),r=0)},H=new IntersectionObserver(([u])=>{p=u.isIntersecting,p?h():g()},{threshold:0});H.observe(n);const O=()=>{R=!document.hidden,R?h():g()};return document.addEventListener("visibilitychange",O),h(),()=>{g(),H.disconnect(),document.removeEventListener("visibilitychange",O),window.removeEventListener("resize",v),L.disconnect(),window.removeEventListener("mousemove",y),window.removeEventListener("mouseover",S),document.documentElement.removeEventListener("mouseleave",b),window.removeEventListener("click",T),n.removeChild(o.domElement),o.dispose(),M.dispose()}},[]),ne.jsx("div",{ref:w,className:"magic-rings-container",style:C>0?{filter:`blur(${C}px)`}:void 0})}export{pe as default};
