import{r as F,R as A,b as B,T as N,P as L,M as P,j as k}from"./index-D0zNZLAK.js";function I(a){const l=a.replace("#","");return[parseInt(l.slice(0,2),16)/255,parseInt(l.slice(2,4),16)/255,parseInt(l.slice(4,6),16)/255]}function U(a=256){const l=new Uint8Array(a*a*4);function f(s,c,t){let o=s*374761393+c*668265263+t*1274126177;return o=Math.imul(o^o>>>13,1274126177),((o^o>>>16)>>>0)/4294967296}function d(s,c,t,o){const m=s/a*t,v=c/a*t,r=Math.floor(m),u=Math.floor(v),n=m-r,p=v-u,e=t|0,E=f((r%e+e)%e,(u%e+e)%e,o),g=f(((r+1)%e+e)%e,(u%e+e)%e,o),i=f((r%e+e)%e,((u+1)%e+e)%e,o),w=f(((r+1)%e+e)%e,((u+1)%e+e)%e,o);return E*(1-n)*(1-p)+g*n*(1-p)+i*(1-n)*p+w*n*p}for(let s=0;s<a;s++)for(let c=0;c<a;c++){let t=0,o=.4,m=0;for(let u=0;u<8;u++){const n=32*(1<<u);t+=o*d(c,s,n,u*31),m+=o,o*=.65}t/=m,t=(t-.5)*2.2+.5,t=Math.max(0,Math.min(1,t));const v=Math.round(t*255),r=(s*a+c)*4;l[r]=v,l[r+1]=v,l[r+2]=v,l[r+3]=255}return l}const b=`
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`,D=`
precision highp float;

uniform float uTime;
uniform vec3 uResolution;
uniform sampler2D uNoiseTexture;
uniform float uPupilSize;
uniform float uIrisWidth;
uniform float uGlowIntensity;
uniform float uIntensity;
uniform float uScale;
uniform float uNoiseScale;
uniform vec2 uMouse;
uniform float uPupilFollow;
uniform float uFlameSpeed;
uniform vec3 uEyeColor;
uniform vec3 uBgColor;
uniform bool uLightMode;

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - uResolution.xy) / uResolution.y;
  uv /= uScale;
  float ft = uTime * uFlameSpeed;

  float polarRadius = length(uv) * 2.0;
  float polarAngle = (2.0 * atan(uv.x, uv.y)) / 6.28 * 0.3;
  vec2 polarUv = vec2(polarRadius, polarAngle);

  vec4 noiseA = texture2D(uNoiseTexture, polarUv * vec2(0.2, 7.0) * uNoiseScale + vec2(-ft * 0.1, 0.0));
  vec4 noiseB = texture2D(uNoiseTexture, polarUv * vec2(0.3, 4.0) * uNoiseScale + vec2(-ft * 0.2, 0.0));
  vec4 noiseC = texture2D(uNoiseTexture, polarUv * vec2(0.1, 5.0) * uNoiseScale + vec2(-ft * 0.1, 0.0));

  float distanceMask = 1.0 - length(uv);

  // Inner ring
  float innerRing = clamp(-1.0 * ((distanceMask - 0.7) / uIrisWidth), 0.0, 1.0);
  innerRing = (innerRing * distanceMask - 0.2) / 0.28;
  innerRing += noiseA.r - 0.5;
  innerRing *= 1.3;
  innerRing = clamp(innerRing, 0.0, 1.0);

  float outerRing = clamp(-1.0 * ((distanceMask - 0.5) / 0.2), 0.0, 1.0);
  outerRing = (outerRing * distanceMask - 0.1) / 0.38;
  outerRing += noiseC.r - 0.5;
  outerRing *= 1.3;
  outerRing = clamp(outerRing, 0.0, 1.0);

  innerRing += outerRing;

  // Inner eye
  float innerEye = distanceMask - 0.1 * 2.0;
  innerEye *= noiseB.r * 2.0;

  // Pupil with cursor tracking
  vec2 pupilOffset = uMouse * uPupilFollow * 0.12;
  vec2 pupilUv = uv - pupilOffset;
  float pupil = 1.0 - length(pupilUv * vec2(9.0, 2.3));
  pupil *= uPupilSize;
  pupil = clamp(pupil, 0.0, 1.0);
  pupil /= 0.35;

  // Outer eye
  float outerEyeGlow = 1.0 - length(uv * vec2(0.5, 1.5));
  outerEyeGlow = clamp(outerEyeGlow + 0.5, 0.0, 1.0);
  outerEyeGlow += noiseC.r - 0.5;
  float outerBgGlow = outerEyeGlow;
  outerEyeGlow = pow(outerEyeGlow, 2.0);
  outerEyeGlow += distanceMask;
  outerEyeGlow *= uGlowIntensity;
  outerEyeGlow = clamp(outerEyeGlow, 0.0, 1.0);
  outerEyeGlow *= pow(1.0 - distanceMask, 2.0) * 2.5;

  // Outer eye bg glow
  outerBgGlow += distanceMask;
  outerBgGlow = pow(outerBgGlow, 0.5);
  outerBgGlow *= 0.15;

  vec3 eyeEnergy = uEyeColor * uIntensity * clamp(max(innerRing + innerEye, outerEyeGlow + outerBgGlow) - pupil, 0.0, 3.0);
  vec3 color;
  if (uLightMode) {
    vec3 mapped = vec3(1.0) - exp(-max(eyeEnergy, vec3(0.0)) * 1.3);
    float energy = clamp(max(mapped.r, max(mapped.g, mapped.b)), 0.0, 1.0);
    vec3 hue = mapped / max(energy, 0.0001);
    hue = pow(clamp(hue, 0.0, 1.0), vec3(1.2));
    color = mix(uBgColor, hue, smoothstep(0.02, 0.82, energy) * 0.96);
  } else {
    color = eyeEnergy + uBgColor;
  }

  gl_FragColor = vec4(color, 1.0);
}
`;function O({eyeColor:a="#FF6F37",intensity:l=1.5,pupilSize:f=.6,irisWidth:d=.25,glowIntensity:s=.35,scale:c=.8,noiseScale:t=1,pupilFollow:o=1,flameSpeed:m=1,backgroundColor:v="#000000",lightMode:r=!1}){const u=F.useRef(null);return F.useEffect(()=>{if(!u.current)return;const n=u.current,p=new A({alpha:!0,premultipliedAlpha:!1}),e=p.gl;e.clearColor(0,0,0,0);const E=U(256),g=new B(e,{image:E,width:256,height:256,generateMipmaps:!1,flipY:!1});g.minFilter=e.LINEAR,g.magFilter=e.LINEAR,g.wrapS=e.REPEAT,g.wrapT=e.REPEAT;const i={x:0,y:0,tx:0,ty:0};function w(y){const x=n.getBoundingClientRect();i.tx=(y.clientX-x.left)/x.width*2-1,i.ty=-((y.clientY-x.top)/x.height*2-1)}function G(){i.tx=0,i.ty=0}n.addEventListener("mousemove",w),n.addEventListener("mouseleave",G);let h;function R(){p.setSize(n.offsetWidth,n.offsetHeight),h&&(h.uniforms.uResolution.value=[e.canvas.width,e.canvas.height,e.canvas.width/e.canvas.height])}window.addEventListener("resize",R),R();const C=new N(e);h=new L(e,{vertex:b,fragment:D,uniforms:{uTime:{value:0},uResolution:{value:[e.canvas.width,e.canvas.height,e.canvas.width/e.canvas.height]},uNoiseTexture:{value:g},uPupilSize:{value:f},uIrisWidth:{value:d},uGlowIntensity:{value:s},uIntensity:{value:l},uScale:{value:c},uNoiseScale:{value:t},uMouse:{value:[0,0]},uPupilFollow:{value:o},uFlameSpeed:{value:m},uEyeColor:{value:I(a)},uBgColor:{value:I(v)},uLightMode:{value:r}}});const S=new P(e,{geometry:C,program:h});n.appendChild(e.canvas);let M;function T(y){M=requestAnimationFrame(T),i.x+=(i.tx-i.x)*.05,i.y+=(i.ty-i.y)*.05,h.uniforms.uMouse.value=[i.x,i.y],h.uniforms.uTime.value=y*.001,p.render({scene:S})}return M=requestAnimationFrame(T),()=>{var y;cancelAnimationFrame(M),window.removeEventListener("resize",R),n.removeEventListener("mousemove",w),n.removeEventListener("mouseleave",G),n.removeChild(e.canvas),(y=e.getExtension("WEBGL_lose_context"))==null||y.loseContext()}},[a,l,f,d,s,c,t,o,m,v,r]),k.jsx("div",{ref:u,className:"evil-eye-container"})}export{O as default};
