import{r as Jt,R as xe,G as ye,P as me,M as ve,T as Ae,j as pe,a as Fe}from"./index-D0zNZLAK.js";const Re=`
precision highp float;
attribute vec2 position;
attribute vec2 aLocal;
attribute float aWeight;
uniform vec2 uRes;
varying vec2 vLocal;
varying float vWeight;

void main() {
  vLocal = aLocal;
  vWeight = aWeight;
  vec2 clip = (position / uRes) * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
}
`,be=`
precision highp float;
varying vec2 vLocal;
varying float vWeight;

void main() {
  float d = length(vLocal);
  float a = exp(-d * d * 3.6) * vWeight;
  gl_FragColor = vec4(a, a, a, a);
}
`,Ee=`
precision highp float;
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`,Le=`
precision highp float;
uniform sampler2D tField;
uniform vec3 uColor;
uniform vec3 uAccent;
uniform float uMerge;
uniform float uGlow;
uniform float uOpacity;
varying vec2 vUv;

void main() {
  float f = texture2D(tField, vUv).r;

  float edge = uMerge * 0.3;
  float core = smoothstep(uMerge - edge, uMerge + edge, f);
  float halo = smoothstep(uMerge * 0.12, uMerge, f);

  vec3 col = mix(uColor, uAccent, clamp(f / max(uMerge * 2.4, 0.001), 0.0, 1.0));

  float alpha = (core + halo * uGlow * (1.0 - core)) * uOpacity;
  if (alpha <= 0.002) discard;
  gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
}
`,Ut=e=>{let i=(e||"").replace("#","").trim();i.length===3&&(i=i.split("").map(v=>v+v).join(""));const a=parseInt(i||"000000",16);return[(a>>16&255)/255,(a>>8&255)/255,(a&255)/255]},Ce=()=>{const e=new Uint8Array(256);for(let a=0;a<256;a++)e[a]=a;for(let a=255;a>0;a--){const v=Math.random()*(a+1)|0,D=e[a];e[a]=e[v],e[v]=D}const i=new Uint16Array(512);for(let a=0;a<512;a++)i[a]=e[a&255];return i},Kt=e=>e*e*e*(e*(e*6-15)+10),Q=(e,i,a,v)=>{const D=e<8?i:a,V=e<4?a:e===12||e===14?i:v;return((e&1)===0?D:-D)+((e&2)===0?V:-V)},U=(e,i,a,v)=>{const D=Math.floor(i),V=Math.floor(a),Rt=Math.floor(v),bt=D&255,Et=V&255,ot=Rt&255,F=i-D,R=a-V,b=v-Rt,nt=Kt(F),ut=Kt(R),zt=Kt(b),Lt=e[bt]+Et,Ct=e[Lt&511]+ot,ft=e[Lt+1&511]+ot,u=e[bt+1&511]+Et,p=e[u&511]+ot,Wt=e[u+1&511]+ot,z=Q(e[Ct&511]&15,F,R,b),r=Q(e[p&511]&15,F-1,R,b),s=Q(e[ft&511]&15,F,R-1,b),G=Q(e[Wt&511]&15,F-1,R-1,b),E=Q(e[Ct+1&511]&15,F,R,b-1),L=Q(e[p+1&511]&15,F-1,R,b-1),ht=Q(e[ft+1&511]&15,F,R-1,b-1),Z=Q(e[Wt+1&511]&15,F-1,R-1,b-1),dt=z+nt*(r-z),at=s+nt*(G-s),st=E+nt*(L-E),Gt=ht+nt*(Z-ht),C=dt+ut*(at-dt),_t=st+ut*(Gt-st);return C+zt*(_t-C)},_e=({color:e="#ffffff",accentColor:i="#ffffff",count:a=10,size:v=10,merge:D=.77,glow:V=.75,opacity:Rt=1,spread:bt=100,separation:Et=.15,speed:ot=2.5,wander:F=.25,trail:R=.75,scatterOnClick:b=!0,enabled:nt=!0,children:ut,className:zt="",style:Lt,...Ct})=>{const ft=Jt.useRef(null),u=Jt.useRef({});return u.current={color:e,accentColor:i,count:a,size:v,merge:D,glow:V,opacity:Rt,spread:bt,separation:Et,speed:ot,wander:F,trail:R,scatterOnClick:b,enabled:nt},Jt.useEffect(()=>{const p=ft.current;if(!p)return;const Wt=window.matchMedia("(prefers-reduced-motion: reduce)").matches,z=new xe({alpha:!0,dpr:Math.min(window.devicePixelRatio||1,1.75)}),r=z.gl;r.clearColor(0,0,0,0),r.canvas.className="swarm-cursor__canvas",p.appendChild(r.canvas);const s=120,G=6e3,E=120,L=new Float32Array(G*4*2),ht=new Float32Array(G*4*2),Z=new Float32Array(G*4),dt=new Uint16Array(G*6);for(let o=0;o<G;o++){const n=o*4;ht.set([-1,-1,1,-1,1,1,-1,1],n*2),dt.set([n,n+1,n+2,n,n+2,n+3],o*6)}const at=new ye(r,{position:{size:2,data:L,usage:r.DYNAMIC_DRAW},aLocal:{size:2,data:ht},aWeight:{size:1,data:Z,usage:r.DYNAMIC_DRAW},index:{data:dt}}),st=new me(r,{vertex:Re,fragment:be,uniforms:{uRes:{value:[1,1]}},transparent:!0,depthTest:!1,depthWrite:!1,cullFace:!1});st.setBlendFunc(r.ONE,r.ONE);const Gt=new ve(r,{geometry:at,program:st}),C=new me(r,{vertex:Ee,fragment:Le,uniforms:{tField:{value:null},uColor:{value:Ut(u.current.color)},uAccent:{value:Ut(u.current.accentColor)},uMerge:{value:u.current.merge},uGlow:{value:u.current.glow},uOpacity:{value:u.current.opacity}},transparent:!0,depthTest:!1,depthWrite:!1,cullFace:!1}),_t=new ve(r,{geometry:new Ae(r),program:C});let jt=null,rt=1,ct=1;const te=()=>{rt=p.clientWidth||1,ct=p.clientHeight||1,z.setSize(rt,ct),st.uniforms.uRes.value=[rt,ct];const o=Math.max(1,Math.round(r.drawingBufferWidth)),n=Math.max(1,Math.round(r.drawingBufferHeight));jt=new Fe(r,{width:o,height:n,depth:!1})},ee=new ResizeObserver(te);ee.observe(p),te();const Y=Ce(),g=new Float32Array(s),M=new Float32Array(s),W=new Float32Array(s),_=new Float32Array(s),Dt=new Float32Array(s),oe=new Float32Array(s),ne=new Float32Array(s),It=new Float32Array(s),Nt=new Float32Array(s),kt=new Float32Array(E*s),qt=new Float32Array(E*s),ae=new Float32Array(E);let mt=0,Yt=0,Ht=-1;const se=(o,n,B)=>{const f=Math.random()*Math.PI*2,$=40+Math.random()*120;g[o]=n+Math.cos(f)*$,M[o]=B+Math.sin(f)*$,W[o]=Math.cos(f)*60,_[o]=Math.sin(f)*60;for(let h=0;h<E;h++)kt[h*s+o]=g[o],qt[h*s+o]=M[o]};for(let o=0;o<s;o++)se(o,rt*.5,ct*.5),Dt[o]=.65+Math.random()*.6,oe[o]=.75+Math.random()*.5,ne[o]=Math.random()<.5?-1:1,It[o]=Math.random()*260,Nt[o]=Math.random()*260;const j={x:rt*.5,y:ct*.5,has:!1};let X=0,re=Math.max(1,Math.min(s,Math.round(u.current.count)));const Xt=o=>{const n=p.getBoundingClientRect();j.x=o.clientX-n.left,j.y=o.clientY-n.top,j.has=!0},ce=()=>{j.has=!1},ie=o=>{if(!u.current.scatterOnClick||!u.current.enabled)return;const n=p.getBoundingClientRect(),B=o.clientX-n.left,f=o.clientY-n.top,$=620+u.current.speed*130;for(let h=0;h<s;h++){let J=g[h]-B,w=M[h]-f,it=Math.hypot(J,w);if(it<.001){const vt=Math.random()*Math.PI*2;J=Math.cos(vt),w=Math.sin(vt),it=1}const Bt=$*(.75+Math.random()*.5);W[h]=J/it*Bt,_[h]=w/it*Bt}X=1};window.addEventListener("pointermove",Xt,{passive:!0}),window.addEventListener("pointerover",Xt,{passive:!0}),document.documentElement.addEventListener("pointerleave",ce),window.addEventListener("pointerdown",ie);let Qt=0,le=performance.now();const ue=o=>{Qt=requestAnimationFrame(ue);const n=u.current,B=Math.min((o-le)/1e3,.05);if(le=o,!n.enabled||Wt){z.render({scene:_t});return}const f=Math.max(1,Math.min(s,Math.round(n.count))),$=j.has?j.x:rt*.5,h=j.has?j.y:ct*.5;for(let t=re;t<f;t++)se(t,$,h);re=f;const J=o*.001;X=Math.max(0,X-B/.5);const w=110+Math.max(.1,n.speed)*165,it=4.5+Math.max(.1,n.speed)*1.15,Bt=w*9,vt=Math.max(20,n.spread*.55),Vt=Math.max(1,n.spread*.42*(.35+n.separation)),Zt=n.wander*2.4,x=.08,$t=.0016,fe=$t*3.6;for(let t=0;t<f;t++){const c=$-g[t],l=h-M[t],d=Math.hypot(c,l)||1e-4,m=c/d,y=l/d,gt=U(Y,It[t],Nt[t],J*.13),Mt=vt*(.34+1.35*Math.max(0,Math.min(1,gt+.5))),P=Math.max(-1,Math.min(1,(d-Mt)/(vt*.85))),K=Math.sqrt(Math.max(0,1-P*P))*ne[t];let I=m*P-y*K,N=y*P+m*K;if(Zt>.001){const A=g[t]*$t,q=M[t]*$t,H=J*.22,At=(U(Y,A,q+x,H)-U(Y,A,q-x,H))/(2*x),Ft=-(U(Y,A+x,q,H)-U(Y,A-x,q,H))/(2*x),et=g[t]*fe+It[t],Ot=M[t]*fe+Nt[t],Tt=J*.55,Me=(U(Y,et,Ot+x,Tt)-U(Y,et,Ot-x,Tt))/(2*x),we=-(U(Y,et+x,Ot,Tt)-U(Y,et-x,Ot,Tt))/(2*x);I+=(At+Me*.7)*Zt,N+=(Ft+we*.7)*Zt}const wt=Math.hypot(I,N)||1e-4;I/=wt,N/=wt;const xt=it*oe[t]*(1-X);let S=(I*w-W[t])*xt,O=(N*w-_[t])*xt;X>.001&&(S-=m*w*X*5.5,O-=y*w*X*5.5);for(let A=0;A<f;A++){if(A===t)continue;const q=g[t]-g[A],H=M[t]-M[A],At=q*q+H*H;if(At>1e-4&&At<Vt*Vt){const Ft=Math.sqrt(At),et=(1-Ft/Vt)*w*3.2*n.separation;S+=q/Ft*et,O+=H/Ft*et}}const k=Math.hypot(S,O),lt=Bt*(1+X*4);k>lt&&(S=S/k*lt,O=O/k*lt),W[t]+=S*B,_[t]+=O*B;const T=Math.hypot(W[t],_[t]),yt=w*(1+X*3.5),tt=w*.32;T>yt?(W[t]=W[t]/T*yt,_[t]=_[t]/T*yt):T<tt&&T>1e-4&&(W[t]=W[t]/T*tt,_[t]=_[t]/T*tt),g[t]+=W[t]*B,M[t]+=_[t]*B}const Pt=o*.001;if(Ht<0||Pt-Ht>=.008){Ht=Pt,ae[mt]=Pt;const t=mt*s;for(let c=0;c<f;c++)kt[t+c]=g[c],qt[t+c]=M[c];mt=(mt+1)%E,Yt<E&&Yt++}const he=n.trail*.85,ge=Math.max(0,Math.floor(G/f)-1),pt=Math.min(46,ge);let St=0;const de=(t,c,l,d)=>{const m=St*8;L[m]=t-l,L[m+1]=c-l,L[m+2]=t+l,L[m+3]=c-l,L[m+4]=t+l,L[m+5]=c+l,L[m+6]=t-l,L[m+7]=c+l;const y=St*4;Z[y]=d,Z[y+1]=d,Z[y+2]=d,Z[y+3]=d,St++};for(let t=0;t<f;t++){const c=n.size*Dt[t]*2.1,l=1.06+.3*Dt[t];if(de(g[t],M[t],c,l),he<.01||pt<2||Yt<2)continue;const d=Math.max(2,n.size*Dt[t]*.5),m=d*pt;let y=g[t],gt=M[t],Mt=0,P=d,K=0;for(let I=0;I<Yt&&K<pt;I++){const N=(mt-1-I+E)%E;if(Pt-ae[N]>he)break;const wt=kt[N*s+t],xt=qt[N*s+t],S=wt-y,O=xt-gt,k=Math.hypot(S,O);if(!(k<1e-4)){for(;P<=Mt+k&&K<pt;){const lt=(P-Mt)/k,T=P/m,yt=Math.pow(Math.max(0,1-T),.55),tt=c*yt;if(tt<d){K=pt;break}const A=Math.min(l,l*d/(tt*.934));de(y+S*lt,gt+O*lt,tt,A),K++,P+=d}Mt+=k,y=wt,gt=xt}}}at.attributes.position.needsUpdate=!0,at.attributes.aWeight.needsUpdate=!0,at.setDrawRange(0,St*6),C.uniforms.uColor.value=Ut(n.color),C.uniforms.uAccent.value=Ut(n.accentColor),C.uniforms.uMerge.value=n.merge,C.uniforms.uGlow.value=n.glow,C.uniforms.uOpacity.value=n.opacity,z.render({scene:Gt,target:jt,clear:!0}),C.uniforms.tField.value=jt.texture,z.render({scene:_t})};return Qt=requestAnimationFrame(ue),()=>{cancelAnimationFrame(Qt),ee.disconnect(),window.removeEventListener("pointermove",Xt),window.removeEventListener("pointerover",Xt),document.documentElement.removeEventListener("pointerleave",ce),window.removeEventListener("pointerdown",ie),r.canvas.parentElement===p&&p.removeChild(r.canvas);const o=r.getExtension("WEBGL_lose_context");o&&o.loseContext()}},[]),pe.jsx("div",{ref:ft,className:`swarm-cursor ${zt}`.trim(),style:Lt,...Ct,children:ut?pe.jsx("div",{className:"swarm-cursor__content",children:ut}):null})};export{_e as default};
