import{r as n,j as $,R as X,T as Y,P as J,M as K}from"./index-D0zNZLAK.js";const O="#ffffff",B=u=>{const t=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(u);return t?[parseInt(t[1],16)/255,parseInt(t[2],16)/255,parseInt(t[3],16)/255]:[1,1,1]},U=(u,t,i)=>{switch(u){case"top-left":return{anchor:[0,-.2*i],dir:[0,1]};case"top-right":return{anchor:[t,-.2*i],dir:[0,1]};case"left":return{anchor:[-.2*t,.5*i],dir:[1,0]};case"right":return{anchor:[(1+.2)*t,.5*i],dir:[-1,0]};case"bottom-left":return{anchor:[0,(1+.2)*i],dir:[0,-1]};case"bottom-center":return{anchor:[.5*t,(1+.2)*i],dir:[0,-1]};case"bottom-right":return{anchor:[t,(1+.2)*i],dir:[0,-1]};default:return{anchor:[.5*t,-.2*i],dir:[0,1]}}},Z=({raysOrigin:u="top-center",raysColor:t=O,raysSpeed:i=1,lightSpread:g=1,rayLength:C=2,pulsating:b=!1,fadeDistance:S=1,saturation:w=1,followMouse:D=!0,mouseInfluence:h=.1,noiseAmount:P=0,distortion:A=0,lightMode:T=!1,className:j=""})=>{const o=n.useRef(null),y=n.useRef(null),d=n.useRef(null),E=n.useRef({x:.5,y:.5}),m=n.useRef({x:.5,y:.5}),p=n.useRef(null),F=n.useRef(null),f=n.useRef(null),[z,k]=n.useState(!1),x=n.useRef(null);return n.useEffect(()=>{if(o.current)return x.current=new IntersectionObserver(e=>{const r=e[0];k(r.isIntersecting)},{threshold:.1}),x.current.observe(o.current),()=>{x.current&&(x.current.disconnect(),x.current=null)}},[]),n.useEffect(()=>!z||!o.current?void 0:(f.current&&(f.current(),f.current=null),(async()=>{if(!o.current||(await new Promise(s=>setTimeout(s,10)),!o.current))return;const r=new X({dpr:Math.min(window.devicePixelRatio,2),alpha:!0});d.current=r;const a=r.gl;for(a.canvas.style.width="100%",a.canvas.style.height="100%";o.current.firstChild;)o.current.removeChild(o.current.firstChild);o.current.appendChild(a.canvas);const R=`
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}`,v=`precision highp float;

uniform float iTime;
uniform vec2  iResolution;

uniform vec2  rayPos;
uniform vec2  rayDir;
uniform vec3  raysColor;
uniform float raysSpeed;
uniform float lightSpread;
uniform float rayLength;
uniform float pulsating;
uniform float fadeDistance;
uniform float saturation;
uniform vec2  mousePos;
uniform float mouseInfluence;
uniform float noiseAmount;
uniform float distortion;
uniform float lightMode;

varying vec2 vUv;

float noise(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord,
                  float seedA, float seedB, float speed) {
  vec2 sourceToCoord = coord - raySource;
  vec2 dirNorm = normalize(sourceToCoord);
  float cosAngle = dot(dirNorm, rayRefDirection);

  float distortedAngle = cosAngle + distortion * sin(iTime * 2.0 + length(sourceToCoord) * 0.01) * 0.2;
  
  float spreadFactor = pow(max(distortedAngle, 0.0), 1.0 / max(lightSpread, 0.001));

  float distance = length(sourceToCoord);
  float maxDistance = iResolution.x * rayLength;
  float lengthFalloff = clamp((maxDistance - distance) / maxDistance, 0.0, 1.0);
  
  float fadeFalloff = clamp((iResolution.x * fadeDistance - distance) / (iResolution.x * fadeDistance), 0.5, 1.0);
  float pulse = pulsating > 0.5 ? (0.8 + 0.2 * sin(iTime * speed * 3.0)) : 1.0;

  float baseStrength = clamp(
    (0.45 + 0.15 * sin(distortedAngle * seedA + iTime * speed)) +
    (0.3 + 0.2 * cos(-distortedAngle * seedB + iTime * speed)),
    0.0, 1.0
  );

  return baseStrength * lengthFalloff * fadeFalloff * spreadFactor * pulse;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 coord = vec2(fragCoord.x, iResolution.y - fragCoord.y);
  
  vec2 finalRayDir = rayDir;
  if (mouseInfluence > 0.0) {
    vec2 mouseScreenPos = mousePos * iResolution.xy;
    vec2 mouseDirection = normalize(mouseScreenPos - rayPos);
    finalRayDir = normalize(mix(rayDir, mouseDirection, mouseInfluence));
  }

  vec4 rays1 = vec4(1.0) *
               rayStrength(rayPos, finalRayDir, coord, 36.2214, 21.11349,
                           1.5 * raysSpeed);
  vec4 rays2 = vec4(1.0) *
               rayStrength(rayPos, finalRayDir, coord, 22.3991, 18.0234,
                           1.1 * raysSpeed);

  fragColor = rays1 * 0.5 + rays2 * 0.4;

  if (noiseAmount > 0.0) {
    float n = noise(coord * 0.01 + iTime * 0.1);
    fragColor.rgb *= (1.0 - noiseAmount + noiseAmount * n);
  }

  float brightness = 1.0 - (coord.y / iResolution.y);
  fragColor.x *= 0.1 + brightness * 0.8;
  fragColor.y *= 0.3 + brightness * 0.6;
  fragColor.z *= 0.5 + brightness * 0.5;

  if (saturation != 1.0) {
    float gray = dot(fragColor.rgb, vec3(0.299, 0.587, 0.114));
    fragColor.rgb = mix(vec3(gray), fragColor.rgb, saturation);
  }

  fragColor.rgb *= raysColor;

  if (lightMode > 0.5) {
    vec3 mapped = vec3(1.0) - exp(-max(fragColor.rgb, vec3(0.0)) * 1.35);
    float energy = clamp(max(mapped.r, max(mapped.g, mapped.b)), 0.0, 1.0);
    vec3 hue = mapped / max(energy, 0.0001);
    vec3 ink = mix(hue * 0.25, hue * 0.72, energy);
    fragColor = vec4(mix(vec3(1.0), ink, energy), 1.0);
  }
}

void main() {
  vec4 color;
  mainImage(color, gl_FragCoord.xy);
  gl_FragColor  = color;
}`,c={iTime:{value:0},iResolution:{value:[1,1]},rayPos:{value:[0,0]},rayDir:{value:[0,1]},raysColor:{value:B(t)},raysSpeed:{value:i},lightSpread:{value:g},rayLength:{value:C},pulsating:{value:b?1:0},fadeDistance:{value:S},saturation:{value:w},mousePos:{value:[.5,.5]},mouseInfluence:{value:h},noiseAmount:{value:P},distortion:{value:A},lightMode:{value:T?1:0}};y.current=c;const L=new Y(a),q=new J(a,{vertex:R,fragment:v,uniforms:c}),W=new K(a,{geometry:L,program:q});F.current=W;const I=()=>{if(!o.current||!r)return;r.dpr=Math.min(window.devicePixelRatio,2);const{clientWidth:s,clientHeight:l}=o.current;r.setSize(s,l);const G=r.dpr,M=s*G,N=l*G;c.iResolution.value=[M,N];const{anchor:H,dir:V}=U(u,M,N);c.rayPos.value=H,c.rayDir.value=V},_=s=>{if(!(!d.current||!y.current||!F.current)){c.iTime.value=s*.001,D&&h>0&&(m.current.x=m.current.x*.92+E.current.x*(1-.92),m.current.y=m.current.y*.92+E.current.y*(1-.92),c.mousePos.value=[m.current.x,m.current.y]);try{r.render({scene:W}),p.current=requestAnimationFrame(_)}catch(l){console.warn("WebGL rendering error:",l);return}}};window.addEventListener("resize",I),I(),p.current=requestAnimationFrame(_),f.current=()=>{if(p.current&&(cancelAnimationFrame(p.current),p.current=null),window.removeEventListener("resize",I),r)try{const s=r.gl.canvas,l=r.gl.getExtension("WEBGL_lose_context");l&&l.loseContext(),s&&s.parentNode&&s.parentNode.removeChild(s)}catch(s){console.warn("Error during WebGL cleanup:",s)}d.current=null,y.current=null,F.current=null}})(),()=>{f.current&&(f.current(),f.current=null)}),[z,u,t,i,g,C,b,S,w,D,h,P,A,T]),n.useEffect(()=>{if(!y.current||!o.current||!d.current)return;const e=y.current,r=d.current;e.raysColor.value=B(t),e.raysSpeed.value=i,e.lightSpread.value=g,e.rayLength.value=C,e.pulsating.value=b?1:0,e.fadeDistance.value=S,e.saturation.value=w,e.mouseInfluence.value=h,e.noiseAmount.value=P,e.distortion.value=A,e.lightMode.value=T?1:0;const{clientWidth:a,clientHeight:R}=o.current,v=r.dpr,{anchor:c,dir:L}=U(u,a*v,R*v);e.rayPos.value=c,e.rayDir.value=L},[t,i,g,u,C,b,S,w,h,P,A,T]),n.useEffect(()=>{const e=r=>{if(!o.current||!d.current)return;const a=o.current.getBoundingClientRect(),R=(r.clientX-a.left)/a.width,v=(r.clientY-a.top)/a.height;E.current={x:R,y:v}};if(D)return window.addEventListener("mousemove",e),()=>window.removeEventListener("mousemove",e)},[D]),$.jsx("div",{ref:o,className:`light-rays-container ${j}`.trim()})};export{Z as default};
