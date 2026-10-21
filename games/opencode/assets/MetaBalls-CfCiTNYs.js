import{r as k,R as nt,T as it,V as w,P as at,M as st,f as rt,j as lt}from"./index-D0zNZLAK.js";import{C as ct}from"./Camera-CETj5Gul.js";function G(n){const t=n.replace("#",""),i=parseInt(t.substring(0,2),16)/255,l=parseInt(t.substring(2,4),16)/255,r=parseInt(t.substring(4,6),16)/255;return[i,l,r]}function C(n){return n-Math.floor(n)}function ft(n){let t=[n*.1031,n*.103,n*.0973].map(C);const i=[t[1],t[2],t[0]],l=t[0]*(i[0]+33.33)+t[1]*(i[1]+33.33)+t[2]*(i[2]+33.33);for(let r=0;r<3;r++)t[r]=C(t[r]+l);return t}function ut(n){let t=[n[0]*.1031,n[1]*.103,n[2]*.0973].map(C);const i=[t[1],t[0],t[2]],l=t[0]*(i[0]+33.33)+t[1]*(i[1]+33.33)+t[2]*(i[2]+33.33);for(let a=0;a<3;a++)t[a]=C(t[a]+l);const r=[t[0],t[0],t[1]],y=[t[1],t[0],t[0]],x=[t[2],t[1],t[0]],m=[];for(let a=0;a<3;a++)m[a]=C((r[a]+y[a])*x[a]);return m}const mt=`#version 300 es
precision highp float;
layout(location = 0) in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`,vt=`#version 300 es
precision highp float;
uniform vec3 iResolution;
uniform float iTime;
uniform vec3 iMouse;
uniform vec3 iColor;
uniform vec3 iCursorColor;
uniform float iAnimationSize;
uniform int iBallCount;
uniform float iCursorBallSize;
uniform vec3 iMetaBalls[50];
uniform float iClumpFactor;
uniform bool enableTransparency;
out vec4 outColor;
const float PI = 3.14159265359;

float getMetaBallValue(vec2 c, float r, vec2 p) {
  vec2 d = p - c;
  float dist2 = dot(d, d);
  return (r * r) / dist2;
}

void main() {
  vec2 fc = gl_FragCoord.xy;
  float scale = iAnimationSize / iResolution.y;
  vec2 coord = (fc - iResolution.xy * 0.5) * scale;
  vec2 mouseW = (iMouse.xy - iResolution.xy * 0.5) * scale;
  float m1 = 0.0;
  for (int i = 0; i < 50; i++) {
    if (i >= iBallCount) break;
    m1 += getMetaBallValue(iMetaBalls[i].xy, iMetaBalls[i].z, coord);
  }
  float m2 = getMetaBallValue(mouseW, iCursorBallSize, coord);
  float total = m1 + m2;
  float f = smoothstep(-1.0, 1.0, (total - 1.3) / min(1.0, fwidth(total)));
  vec3 cFinal = vec3(0.0);
  if (total > 0.0) {
    float alpha1 = m1 / total;
    float alpha2 = m2 / total;
    cFinal = iColor * alpha1 + iCursorColor * alpha2;
  }
  outColor = vec4(cFinal * f, enableTransparency ? f : 1.0);
}
`,gt=({className:n="",color:t="#ffffff",speed:i=.3,enableMouseInteraction:l=!0,hoverSmoothness:r=.05,animationSize:y=30,ballCount:x=15,clumpFactor:m=1,cursorBallSize:a=3,cursorBallColor:_="#ffffff",enableTransparency:B=!1})=>{const T=k.useRef(null);return k.useEffect(()=>{const v=T.current;if(!v)return;const E=1,P=new nt({dpr:E,alpha:!0,premultipliedAlpha:!1}),e=P.gl;e.clearColor(0,0,0,B?0:1),v.appendChild(e.canvas);const V=new ct(e,{left:-1,right:1,top:1,bottom:-1,near:.1,far:10});V.position.z=1;const N=new it(e),[U,$,D]=G(t),[J,K,O]=G(_),z=[];for(let o=0;o<50;o++)z.push(new w(0,0,0));const M=new at(e,{vertex:mt,fragment:vt,uniforms:{iTime:{value:0},iResolution:{value:new w(0,0,0)},iMouse:{value:new w(0,0,0)},iColor:{value:new w(U,$,D)},iCursorColor:{value:new w(J,K,O)},iAnimationSize:{value:y},iBallCount:{value:x},iCursorBallSize:{value:a},iMetaBalls:{value:z},iClumpFactor:{value:m},enableTransparency:{value:B}}}),Q=new st(e,{geometry:N,program:M}),A=new rt;Q.setParent(A);const I=Math.min(x,50),S=[];for(let o=0;o<I;o++){const s=o+1,c=ft(s),d=c[0]*(2*Math.PI),u=.1*Math.PI+c[1]*(.4*Math.PI-.1*Math.PI),f=5+c[1]*5,p=ut(c),g=Math.floor(p[0]*2),F=.5+p[2]*(2-.5);S.push({st:d,dtFactor:u,baseScale:f,toggle:g,radius:F})}const h={x:0,y:0};let R=!1,W=0,X=0;function b(){if(!v)return;const o=v.clientWidth,s=v.clientHeight;P.setSize(o*E,s*E),e.canvas.style.width=o+"px",e.canvas.style.height=s+"px",M.uniforms.iResolution.value.set(e.canvas.width,e.canvas.height,0)}window.addEventListener("resize",b),b();function Y(o){if(!l)return;const s=v.getBoundingClientRect(),c=o.clientX-s.left,d=o.clientY-s.top;W=c/s.width*e.canvas.width,X=(1-d/s.height)*e.canvas.height}function j(){l&&(R=!0)}function q(){l&&(R=!1)}window.addEventListener("pointermove",Y),window.addEventListener("pointerover",j),document.documentElement.addEventListener("pointerleave",q);const Z=performance.now();let L;function H(o){L=requestAnimationFrame(H);const s=(o-Z)*.001;M.uniforms.iTime.value=s;for(let u=0;u<I;u++){const f=S[u],p=s*i*f.dtFactor,g=f.st+p,F=Math.cos(g),tt=Math.sin(g+p*f.toggle),et=F*f.baseScale*m,ot=tt*f.baseScale*m;z[u].set(et,ot,f.radius)}let c,d;if(R)c=W,d=X;else{const u=e.canvas.width*.5,f=e.canvas.height*.5,p=e.canvas.width*.15,g=e.canvas.height*.15;c=u+Math.cos(s*i)*p,d=f+Math.sin(s*i)*g}h.x+=(c-h.x)*r,h.y+=(d-h.y)*r,M.uniforms.iMouse.value.set(h.x,h.y,0),P.render({scene:A,camera:V})}return L=requestAnimationFrame(H),()=>{var o;cancelAnimationFrame(L),window.removeEventListener("resize",b),window.removeEventListener("pointermove",Y),window.removeEventListener("pointerover",j),document.documentElement.removeEventListener("pointerleave",q),v.removeChild(e.canvas),(o=e.getExtension("WEBGL_lose_context"))==null||o.loseContext()}},[t,_,i,l,r,y,x,m,a,B]),lt.jsx("div",{ref:T,className:`metaballs-container ${n}`})};export{gt as default};
