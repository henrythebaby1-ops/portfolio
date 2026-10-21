import{r as o,j as M,R as W,T as j,P as G,M as N}from"./index-D0zNZLAK.js";const w=a=>{const n=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(a);return n?[parseInt(n[1],16)/255,parseInt(n[2],16)/255,parseInt(n[3],16)/255]:[1,1,1]},z=a=>{switch(a){case"top-left":return[1,0];case"bottom-right":return[0,1];case"bottom-left":return[1,1];default:return[0,0]}},V=({speed:a=2.5,rayColor1:n="#EAB308",rayColor2:v="#96c8ff",intensity:m=2,spread:p=2,origin:y="top-right",tilt:R=0,saturation:g=1.5,blend:h=.75,falloff:x=1.6,opacity:S=1,className:A=""})=>{const t=o.useRef(null),u=o.useRef(null),F=o.useRef(null),f=o.useRef(null),T=o.useRef(null),s=o.useRef(null),[P,B]=o.useState(!1),d=o.useRef(null);return o.useEffect(()=>{if(t.current)return d.current=new IntersectionObserver(e=>{const r=e[0];B(r.isIntersecting)},{threshold:.1}),d.current.observe(t.current),()=>{d.current&&(d.current.disconnect(),d.current=null)}},[]),o.useEffect(()=>!P||!t.current?void 0:(s.current&&(s.current(),s.current=null),(async()=>{if(!t.current||(await new Promise(i=>setTimeout(i,10)),!t.current))return;const r=new W({dpr:Math.min(window.devicePixelRatio,2),alpha:!0});F.current=r;const l=r.gl;for(l.canvas.style.width="100%",l.canvas.style.height="100%";t.current.firstChild;)t.current.removeChild(t.current.firstChild);t.current.appendChild(l.canvas);const L=`
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`,D=`precision highp float;

uniform float iTime;
uniform vec2 iResolution;
uniform float iSpeed;
uniform vec3 iRayColor1;
uniform vec3 iRayColor2;
uniform float iIntensity;
uniform float iSpread;
uniform float iFlipX;
uniform float iFlipY;
uniform float iTilt;
uniform float iSaturation;
uniform float iBlend;
uniform float iFalloff;
uniform float iOpacity;

float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord, float seedA, float seedB, float speed) {
  vec2 sourceToCoord = coord - raySource;
  float cosAngle = dot(normalize(sourceToCoord), rayRefDirection);
  return clamp(
    (0.45 + 0.15 * sin(cosAngle * seedA + iTime * speed)) +
    (0.3 + 0.2 * cos(-cosAngle * seedB + iTime * speed)),
    0.0, 1.0) *
    clamp((iResolution.x - length(sourceToCoord)) / iResolution.x, 0.5, 1.0);
}

void main() {
  vec2 fragCoord = gl_FragCoord.xy;
  if (iFlipX > 0.5) fragCoord.x = iResolution.x - fragCoord.x;
  if (iFlipY > 0.5) fragCoord.y = iResolution.y - fragCoord.y;

  vec2 coord = vec2(fragCoord.x, iResolution.y - fragCoord.y);
  vec2 rayPos = vec2(iResolution.x * 1.1, -0.5 * iResolution.y);

  float tiltRad = iTilt * 3.14159265 / 180.0;
  float cs = cos(tiltRad);
  float sn = sin(tiltRad);
  vec2 rel = coord - rayPos;
  vec2 tiltedCoord = vec2(rel.x * cs - rel.y * sn, rel.x * sn + rel.y * cs) + rayPos;

  float halfSpread = iSpread * 0.275;
  vec2 rayRefDir1 = normalize(vec2(cos(0.785398 + halfSpread), sin(0.785398 + halfSpread)));
  vec2 rayRefDir2 = normalize(vec2(cos(0.785398 - halfSpread), sin(0.785398 - halfSpread)));

  vec4 rays1 = vec4(iRayColor1, 1.0) * rayStrength(rayPos, rayRefDir1, tiltedCoord, 36.2214, 21.11349, iSpeed);
  vec4 rays2 = vec4(iRayColor2, 1.0) * rayStrength(rayPos, rayRefDir2, tiltedCoord, 22.3991, 18.0234, iSpeed * 0.2);

  vec4 color = rays1 * (1.0 - iBlend) * 0.9 + rays2 * iBlend * 0.9;

  float distanceToLight = length(fragCoord.xy - vec2(rayPos.x, iResolution.y - rayPos.y)) / iResolution.y;
  float brightness = iIntensity * 0.4 / pow(max(distanceToLight, 0.001), iFalloff);
  color.rgb *= brightness;

  float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
  color.rgb = mix(vec3(gray), color.rgb, iSaturation);

  color.a = max(color.r, max(color.g, color.b)) * iOpacity;
  gl_FragColor = color;
}`,[X,Y]=z(y),C={iTime:{value:0},iResolution:{value:[1,1]},iSpeed:{value:a},iRayColor1:{value:w(n)},iRayColor2:{value:w(v)},iIntensity:{value:m},iSpread:{value:p},iFlipX:{value:X},iFlipY:{value:Y},iTilt:{value:R},iSaturation:{value:g},iBlend:{value:h},iFalloff:{value:x},iOpacity:{value:S}};u.current=C;const O=new j(l),_=new G(l,{vertex:L,fragment:D,uniforms:C}),I=new N(l,{geometry:O,program:_});T.current=I;const b=()=>{if(!t.current||!r)return;r.dpr=Math.min(window.devicePixelRatio,2);const{clientWidth:i,clientHeight:c}=t.current;r.setSize(i,c),C.iResolution.value=[i*r.dpr,c*r.dpr]},E=i=>{if(!(!F.current||!u.current||!T.current)){C.iTime.value=i*.001;try{r.render({scene:I}),f.current=requestAnimationFrame(E)}catch{return}}};window.addEventListener("resize",b),b(),f.current=requestAnimationFrame(E),s.current=()=>{if(f.current&&(cancelAnimationFrame(f.current),f.current=null),window.removeEventListener("resize",b),r)try{const i=r.gl.getExtension("WEBGL_lose_context");i&&i.loseContext();const c=r.gl.canvas;c&&c.parentNode&&c.parentNode.removeChild(c)}catch{}F.current=null,u.current=null,T.current=null}})(),()=>{s.current&&(s.current(),s.current=null)}),[P,a,n,v,m,p,y,R,g,h,x,S]),o.useEffect(()=>{if(!u.current)return;const e=u.current;e.iSpeed.value=a,e.iRayColor1.value=w(n),e.iRayColor2.value=w(v),e.iIntensity.value=m,e.iSpread.value=p;const[r,l]=z(y);e.iFlipX.value=r,e.iFlipY.value=l,e.iTilt.value=R,e.iSaturation.value=g,e.iBlend.value=h,e.iFalloff.value=x,e.iOpacity.value=S},[a,n,v,m,p,y,R,g,h,x,S]),M.jsx("div",{ref:t,className:`side-rays-container ${A}`.trim()})};export{V as default};
