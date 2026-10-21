import{r as ut,R as kt,G as Wt,b as $t,P as Jt,M as Kt,j as Qt}from"./index-tDOHgNLd.js";const K=4.6,lt=.82,Zt=`
precision highp float;
attribute vec2 aGrid;
attribute vec2 uv;
attribute vec3 aOffset;
attribute vec3 aNormal;

uniform float uAspect;
uniform float uTilt;
uniform float uDist;
uniform float uFit;

varying vec2 vUv;
varying vec3 vNormal;
varying float vDepth;

void main() {
  vUv = uv;

  vec2 base = vec2((aGrid.x * 2.0 - 1.0) * uAspect, 1.0 - aGrid.y * 2.0);
  vec3 p = vec3(base + aOffset.xy, aOffset.z);

  float ct = cos(uTilt);
  float st = sin(uTilt);
  float ry = p.y * ct - p.z * st;
  float rz = p.y * st + p.z * ct;
  p.y = ry;
  p.z = rz;

  float persp = uDist / (uDist - p.z);
  vec2 clip = vec2(p.x / uAspect, p.y) * persp * uFit;

  vNormal = aNormal;
  vDepth = aOffset.z;
  gl_Position = vec4(clip, 0.0, 1.0);
}
`,te=`
precision highp float;

varying vec2 vUv;
varying vec3 vNormal;
varying float vDepth;

uniform sampler2D tMap;
uniform float uHasImage;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uHighlight;
uniform float uShading;
uniform vec2 uRes;
uniform float uRadius;
uniform float uGrid;
uniform float uGridDensity;
uniform float uGridOpacity;
uniform vec3 uGridColor;

void main() {
  vec3 base;
  if (uHasImage > 0.5) {
    base = texture2D(tMap, vUv).rgb;
  } else {
    base = mix(uColor1, uColor2, clamp(vUv.y, 0.0, 1.0));
  }

  vec3 N = normalize(vNormal);
  vec3 L = normalize(vec3(-0.35, 0.55, 0.78));
  vec3 V = vec3(0.0, 0.0, 1.0);
  vec3 H = normalize(L + V);

  float diff = clamp(dot(N, L), 0.0, 1.0);
  float specRaw = pow(clamp(dot(N, H), 0.0, 1.0), 26.0);
  float specFlat = pow(clamp(H.z, 0.0, 1.0), 26.0);
  float spec = clamp((specRaw - specFlat) / (1.0 - specFlat), 0.0, 1.0);
  float ao = clamp(1.0 + vDepth * 0.45, 0.65, 1.25);

  vec3 lit = base * (1.0 - uShading * 0.28);
  lit += base * diff * uShading * 0.55;
  lit *= ao;
  lit += uHighlight * spec * uShading * 0.25;

  if (uGrid > 0.5) {
    vec2 g = vUv * uGridDensity;
    vec2 w = uGridDensity / max(uRes, vec2(1.0));
    vec2 d = abs(fract(g - 0.5) - 0.5) / max(w * 1.5, vec2(1e-4));
    float line = 1.0 - clamp(min(d.x, d.y), 0.0, 1.0);
    lit = mix(lit, uGridColor, line * uGridOpacity * (0.45 + diff * 0.55));
  }

  vec2 p = (vUv - 0.5) * uRes;
  vec2 halfRes = uRes * 0.5;
  float r = min(uRadius, min(halfRes.x, halfRes.y));
  vec2 q = abs(p) - (halfRes - r);
  float sd = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  float alpha = 1.0 - smoothstep(-1.25, 1.25, sd);
  if (alpha <= 0.002) discard;

  gl_FragColor = vec4(lit, alpha);
}
`;function D(X){let N=(X||"").replace("#","").trim();N.length===3&&(N=N.split("").map(Y=>Y+Y).join(""));const S=parseInt(N||"000000",16);return[(S>>16&255)/255,(S>>8&255)/255,(S&255)/255]}const ne=({image:X="",color1:N="#5227FF",color2:S="#B19EEF",highlight:Y="#ffffff",showGrid:ft=!0,gridDensity:vt=20,gridOpacity:mt=.28,gridColor:dt="#ffffff",borderRadius:pt=25,stiffness:Ct=.05,damping:Dt=.2,grabRadius:Nt=.6,pull:Ht=.4,wobble:Ot=5,tilt:ht=14,shading:yt=.5,resolution:gt=25,interaction:Ut="hover",enabled:It=!0,className:wt="",style:St,...Tt})=>{const xt=ut.useRef(null),F=ut.useRef({});return F.current={color1:N,color2:S,highlight:Y,showGrid:ft,gridDensity:vt,gridOpacity:mt,gridColor:dt,borderRadius:pt,stiffness:Ct,damping:Dt,grabRadius:Nt,pull:Ht,wobble:Ot,tilt:ht,shading:yt,interaction:Ut,enabled:It},ut.useEffect(()=>{const G=xt.current;if(!G)return;const Pt=window.matchMedia("(prefers-reduced-motion: reduce)").matches,nt=new kt({alpha:!0,antialias:!0,dpr:Math.min(window.devicePixelRatio||1,2)}),f=nt.gl;f.clearColor(0,0,0,0),f.enable(f.BLEND),f.blendFunc(f.SRC_ALPHA,f.ONE_MINUS_SRC_ALPHA);const s=Math.max(6,Math.min(40,Math.round(gt))),h=s*s,V=new Float32Array(h*2),ot=new Float32Array(h*2),Q=new Float32Array(h*3),k=new Float32Array(h*3);for(let t=0;t<s;t++)for(let n=0;n<s;n++){const o=t*s+n,a=n/(s-1),u=t/(s-1);V[o*2]=a,V[o*2+1]=u,ot[o*2]=a,ot[o*2+1]=u,k[o*3+2]=1}const qt=(s-1)*(s-1),H=new Uint16Array(qt*6);let T=0;for(let t=0;t<s-1;t++)for(let n=0;n<s-1;n++){const o=t*s+n,a=o+1,u=o+s,d=u+1;H[T++]=o,H[T++]=u,H[T++]=a,H[T++]=a,H[T++]=u,H[T++]=d}const at=new Wt(f,{aGrid:{size:2,data:V},uv:{size:2,data:ot},aOffset:{size:3,data:Q},aNormal:{size:3,data:k},index:{data:H}}),bt=new $t(f,{generateMipmaps:!1,flipY:!1});let _t=0;if(X){const t=new Image;t.crossOrigin="anonymous",t.src=X,t.onload=()=>{bt.image=t,v.uniforms.uHasImage.value=1}}const v=new Jt(f,{vertex:Zt,fragment:te,transparent:!0,cullFace:null,uniforms:{tMap:{value:bt},uHasImage:{value:_t},uColor1:{value:D(N)},uColor2:{value:D(S)},uHighlight:{value:D(Y)},uGrid:{value:ft?1:0},uGridDensity:{value:vt},uGridOpacity:{value:mt},uGridColor:{value:D(dt)},uShading:{value:yt},uRes:{value:[1,1]},uRadius:{value:pt},uAspect:{value:1},uTilt:{value:ht*Math.PI/180},uDist:{value:K},uFit:{value:lt}}}),jt=new Kt(f,{geometry:at,program:v}),P=new Float32Array(h),q=new Float32Array(h),e=new Float32Array(h*3),z=new Float32Array(h*3),_=new Float32Array(h*3);let Z=1;function Bt(){for(let t=0;t<h;t++)P[t]=(V[t*2]*2-1)*Z,q[t]=1-V[t*2+1]*2}function Rt(){const t=G.offsetWidth||1,n=G.offsetHeight||1;nt.setSize(t,n),Z=t/n,v.uniforms.uAspect.value=Z,v.uniforms.uRes.value=[t,n],Bt()}const zt=new ResizeObserver(Rt);zt.observe(G),Rt();const r={x:0,y:0,tx:0,ty:0,active:!1,targetActive:!1};function st(t,n){const o=G.getBoundingClientRect(),a=(t-o.left)/o.width,u=(n-o.top)/o.height,d=a*2-1,A=1-u*2,y=(F.current.tilt||0)*Math.PI/180,p=Math.cos(y),i=Math.sin(y),l=A/(p*lt*K),m=l*K/(1+l*i),x=K/(K-m*i);r.tx=d*Z/(x*lt),r.ty=m}function At(t){st(t.clientX,t.clientY),F.current.interaction==="hover"&&(r.targetActive=!0)}function Et(){F.current.interaction==="hover"&&(r.targetActive=!0)}function tt(){r.targetActive=!1}function Mt(t){F.current.interaction==="drag"&&(st(t.clientX,t.clientY),r.x=r.tx,r.y=r.ty,r.targetActive=!0)}function Ft(){F.current.interaction==="drag"&&(r.targetActive=!1)}function et(t){t.touches.length&&(st(t.touches[0].clientX,t.touches[0].clientY),r.targetActive=!0)}window.addEventListener("mousemove",At),window.addEventListener("mouseover",Et),document.documentElement.addEventListener("mouseleave",tt),window.addEventListener("mousedown",Mt),window.addEventListener("mouseup",Ft),window.addEventListener("touchstart",et,{passive:!0}),window.addEventListener("touchmove",et,{passive:!0}),window.addEventListener("touchend",tt);const it=1/120,Xt=5;let W=0,Gt=performance.now();function Yt(){const t=F.current,n=t.stiffness,o=1-t.damping,a=.06+t.wobble*.032,u=r.active&&t.enabled&&!Pt,A=1/(Math.max(.08,t.grabRadius)*1.4),y=t.pull*.009;for(let p=0;p<s;p++)for(let i=0;i<s;i++){const l=p*s+i,m=l*3,x=e[m],g=e[m+1],b=e[m+2];let w=-n*x,$=-n*g,J=-n*b,O=0,U=0,L=0,R=0;if(i>0){const c=(l-1)*3;O+=e[c],U+=e[c+1],L+=e[c+2],R++}if(i<s-1){const c=(l+1)*3;O+=e[c],U+=e[c+1],L+=e[c+2],R++}if(p>0){const c=(l-s)*3;O+=e[c],U+=e[c+1],L+=e[c+2],R++}if(p<s-1){const c=(l+s)*3;O+=e[c],U+=e[c+1],L+=e[c+2],R++}if(w+=a*(O-R*x),$+=a*(U-R*g),J+=a*(L-R*b),u){const c=r.x-(P[l]+x),j=r.y-(q[l]+g),B=Math.sqrt(c*c+j*j),E=B*A;if(E<1){const C=1-E*E;if(J+=y*C*C*6,B>1e-4){const I=E*(1-E)*(1-E)*6.75,M=y*I*1.6/B;w+=c*M,$+=j*M}}}_[m]=w,_[m+1]=$,_[m+2]=J}for(let p=0;p<h;p++){const i=p*3,l=(z[i]+_[i])*o,m=(z[i+1]+_[i+1])*o,x=(z[i+2]+_[i+2])*o;z[i]=l,z[i+1]=m,z[i+2]=x;let g=e[i]+l,b=e[i+1]+m,w=e[i+2]+x;g>1.2?g=1.2:g<-1.2&&(g=-1.2),b>1.2?b=1.2:b<-1.2&&(b=-1.2),w>1.2?w=1.2:w<-1.2&&(w=-1.2),e[i]=g,e[i+1]=b,e[i+2]=w}}function Vt(){for(let t=0;t<s;t++)for(let n=0;n<s;n++){const o=t*s+n,a=o*3,u=n>0?o-1:o,d=n<s-1?o+1:o,A=t>0?o-s:o,y=t<s-1?o+s:o,p=P[u]+e[u*3],i=q[u]+e[u*3+1],l=e[u*3+2],m=P[d]+e[d*3],x=q[d]+e[d*3+1],g=e[d*3+2],b=P[A]+e[A*3],w=q[A]+e[A*3+1],$=e[A*3+2],J=P[y]+e[y*3],O=q[y]+e[y*3+1],U=e[y*3+2],L=m-p,R=x-i,c=g-l,j=J-b,B=O-w,E=U-$;let C=R*E-c*B,I=c*j-L*E,M=L*B-R*j;M<0&&(C=-C,I=-I,M=-M);const ct=Math.sqrt(C*C+I*I+M*M)||1;k[a]=C/ct,k[a+1]=I/ct,k[a+2]=M/ct,Q[a]=e[a],Q[a+1]=e[a+1],Q[a+2]=e[a+2],Math.abs(e[a])+Math.abs(e[a+1])+Math.abs(e[a+2]),Math.abs(z[a])+Math.abs(z[a+1])+Math.abs(z[a+2])}at.attributes.aOffset.needsUpdate=!0,at.attributes.aNormal.needsUpdate=!0}let rt=0;function Lt(t){rt=requestAnimationFrame(Lt);const n=F.current;v.uniforms.uShading.value=n.shading,v.uniforms.uRadius.value=n.borderRadius,v.uniforms.uTilt.value=n.tilt*Math.PI/180,v.uniforms.uColor1.value=D(n.color1),v.uniforms.uColor2.value=D(n.color2),v.uniforms.uHighlight.value=D(n.highlight),v.uniforms.uGrid.value=n.showGrid?1:0,v.uniforms.uGridDensity.value=n.gridDensity,v.uniforms.uGridOpacity.value=n.gridOpacity,v.uniforms.uGridColor.value=D(n.gridColor);let o=(t-Gt)/1e3;Gt=t,o>.25&&(o=.25);const u=1-Math.exp(-Math.max(o,1e-4)/.06);r.x+=(r.tx-r.x)*u,r.y+=(r.ty-r.y)*u,r.active=r.targetActive,W+=o;let d=0;for(;W>=it&&d<Xt;)Yt(),W-=it,d++;W>it&&(W=0),Vt(),nt.render({scene:jt})}return rt=requestAnimationFrame(Lt),G.appendChild(f.canvas),()=>{cancelAnimationFrame(rt),zt.disconnect(),window.removeEventListener("mousemove",At),window.removeEventListener("mouseover",Et),document.documentElement.removeEventListener("mouseleave",tt),window.removeEventListener("mousedown",Mt),window.removeEventListener("mouseup",Ft),window.removeEventListener("touchstart",et),window.removeEventListener("touchmove",et),window.removeEventListener("touchend",tt),f.canvas.parentElement===G&&G.removeChild(f.canvas);const t=f.getExtension("WEBGL_lose_context");t&&t.loseContext()}},[X,gt]),Qt.jsx("div",{ref:xt,className:`elastic-mesh${wt?` ${wt}`:""}`,style:St,...Tt})};export{ne as default};
