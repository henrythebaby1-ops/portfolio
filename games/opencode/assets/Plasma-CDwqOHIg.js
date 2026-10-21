import{r as C,R as K,T as Z,P as ee,M as te,j as oe}from"./index-D0zNZLAK.js";const ne=r=>{const s=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(r);return s?[parseInt(s[1],16)/255,parseInt(s[2],16)/255,parseInt(s[3],16)/255]:[1,.5,.2]},ie=`#version 300 es
precision highp float;
in vec2 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`,re=60,se=r=>`#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform vec3 uCustomColor;
uniform float uUseCustomColor;
uniform float uSpeed;
uniform float uDirection;
uniform float uScale;   
uniform float uOpacity;
uniform vec2 uMouse;
uniform float uMouseInteractive;
uniform float uQuality;
uniform float uStepScale;
uniform float uLightMode;
out vec4 fragColor;

void mainImage(out vec4 o, vec2 C) {
  vec2 center = iResolution.xy * 0.5;
  C = (C - center) / uScale + center;
  
  vec2 mouseOffset = (uMouse - center) * 0.0002;
  C += mouseOffset * length(C - center) * step(0.5, uMouseInteractive);
  
  float i, d, z, T = iTime * uSpeed * uDirection;
  vec3 O, p, S;

  for (vec2 r = iResolution.xy, Q; ++i < 60.0; O += o.w/d*o.xyz) {
    p = z*normalize(vec3(C-.5*r,r.y)); 
    p.z -= 4.; 
    S = p;
    d = p.y-T;
    
    p.x += .4*(1.+p.y)*sin(d + p.x*0.1)*cos(.34*d + p.x*0.05); 
    Q = p.xz *= mat2(cos(p.y+vec4(0,11,33,0)-T)); 
    z += d = (abs(sqrt(length(Q*Q)) - .25*(5.+S.y))/3.+8e-4) * uStepScale;
    o = 1.+sin(S.y+p.z*.5+S.z-length(S-p)+vec4(2,1,0,8));
    if (i >= uQuality) break;
  }
  
  o.xyz = tanh(O/1e4);
}

bool finite1(float x){ return !(isnan(x) || isinf(x)); }
vec3 sanitize(vec3 c){
  return vec3(
    finite1(c.r) ? c.r : 0.0,
    finite1(c.g) ? c.g : 0.0,
    finite1(c.b) ? c.b : 0.0
  );
}

void main() {
  vec4 o = vec4(0.0);
  mainImage(o, gl_FragCoord.xy);
  vec3 rgb = sanitize(o.rgb);
  
  float intensity = (rgb.r + rgb.g + rgb.b) / 3.0;
  vec3 customColor = intensity * uCustomColor;
  vec3 finalColor = mix(rgb, customColor, step(0.5, uUseCustomColor));
  
  float alpha = length(rgb) * uOpacity;
  if (uLightMode > 0.5) {
    vec3 source = clamp(finalColor, 0.0, 1.0);
    float peak = max(source.r, max(source.g, source.b));
    float floorColor = min(source.r, min(source.g, source.b));
    vec3 chroma = (source - vec3(floorColor)) / max(peak - floorColor, 0.0001);
    vec3 pigment = mix(source / max(peak, 0.0001), chroma, 0.68) * 0.72;
    float energy = clamp(length(rgb) / 1.7320508, 0.0, 1.0);
    float coverage = pow(smoothstep(0.035, 0.72, energy), 0.76) * min(uOpacity, 1.0) * 0.9;
    fragColor = vec4(mix(vec3(1.0), pigment, coverage), 1.0);
  } else {
    fragColor = vec4(finalColor, alpha);
  }
}`,ue=({color:r="#ffffff",speed:s=1,direction:x="forward",scale:z=1,opacity:T=1,mouseInteractive:m=!0,renderScale:b=.55,maxDpr:L=1.5,targetFps:O=60,iterations:w=60,lightMode:D=!1})=>{const M=C.useRef(null),R=C.useRef({x:0,y:0}),p=C.useRef(null);return C.useEffect(()=>{var B;if(!M.current)return;const o=M.current,h=typeof window<"u"&&((B=window.matchMedia)==null?void 0:B.call(window,"(prefers-reduced-motion: reduce)").matches),_=r?1:0,N=r?ne(r):[1,1,1],Y=x==="reverse"?-1:1;let f;try{f=new K({webgl:2,alpha:!0,antialias:!1,dpr:Math.min(window.devicePixelRatio||1,L)})}catch{return}const a=f.gl;if(!a)return;const n=a.canvas;n.style.display="block",n.style.width="100%",n.style.height="100%",o.appendChild(n);const G=new Z(a),u=new ee(a,{vertex:ie,fragment:se(),uniforms:{iTime:{value:0},iResolution:{value:new Float32Array([1,1])},uCustomColor:{value:new Float32Array(N)},uUseCustomColor:{value:_},uSpeed:{value:s*.4},uDirection:{value:Y},uScale:{value:z},uOpacity:{value:T},uMouse:{value:new Float32Array([0,0])},uMouseInteractive:{value:m?1:0},uQuality:{value:w},uStepScale:{value:re/w},uLightMode:{value:D?1:0}}}),E=new te(a,{geometry:G,program:u}),I=e=>{if(!m)return;const i=o.getBoundingClientRect();p.current={x:e.clientX-i.left,y:e.clientY-i.top}};m&&o.addEventListener("mousemove",I,{passive:!0});let S=!1;const q=()=>{const e=o.getBoundingClientRect(),i=Math.max(1,Math.floor(e.width*b)),d=Math.max(1,Math.floor(e.height*b));f.setSize(i,d),n.style.width="100%",n.style.height="100%";const y=u.uniforms.iResolution.value;y[0]=a.drawingBufferWidth,y[1]=a.drawingBufferHeight},Q=new ResizeObserver(()=>{S||(S=!0,requestAnimationFrame(()=>{S=!1,q()}))});Q.observe(o),q();let t=0,v=!1,c=!0,g=document.visibilityState!=="hidden";const H=performance.now(),W=1e3/O;let F=0;const X=()=>{u.uniforms.iTime.value=0,f.render({scene:E})},l=e=>{if(v||!c||!g)return;if(e-F<W){t=requestAnimationFrame(l);return}if(F=e,p.current){R.current=p.current,p.current=null;const d=u.uniforms.uMouse.value;d[0]=R.current.x,d[1]=R.current.y}let i=(e-H)*.001;if(x==="pingpong"){const y=i%10,$=Math.floor(i/10)%2===0,A=y/10,j=A*A*(3-2*A),J=$?j*10:(1-j)*10;u.uniforms.uDirection.value=1,u.uniforms.iTime.value=J}else u.uniforms.iTime.value=i;f.render({scene:E}),t=requestAnimationFrame(l)},P=e=>{e.preventDefault(),v=!0,cancelAnimationFrame(t)},U=()=>{v=!1,c&&g&&!h&&(cancelAnimationFrame(t),t=requestAnimationFrame(l))};n.addEventListener("webglcontextlost",P),n.addEventListener("webglcontextrestored",U);const k=new IntersectionObserver(([e])=>{const i=c;c=e.isIntersecting,c&&!i&&!v&&g&&!h&&(cancelAnimationFrame(t),t=requestAnimationFrame(l))},{threshold:0});k.observe(o);const V=()=>{g=document.visibilityState!=="hidden",g&&c&&!v&&!h?(cancelAnimationFrame(t),F=0,t=requestAnimationFrame(l)):cancelAnimationFrame(t)};return document.addEventListener("visibilitychange",V),h?X():t=requestAnimationFrame(l),()=>{cancelAnimationFrame(t),Q.disconnect(),k.disconnect(),document.removeEventListener("visibilitychange",V),n.removeEventListener("webglcontextlost",P),n.removeEventListener("webglcontextrestored",U),m&&o&&o.removeEventListener("mousemove",I);try{o==null||o.removeChild(n)}catch{}}},[r,s,x,z,T,m,b,L,O,w,D]),oe.jsx("div",{ref:M,className:"plasma-container"})};export{ue as Plasma,ue as default};
