import{r as l,j as B}from"./index-D0zNZLAK.js";import{S as H,W as V,s as _,w as I,x as N,L as A,y as G,z as $,E as k,F as J,p as K,G as Q,t as Z,b as ee}from"./three.module-BgPORkTe.js";const te=`
uniform float time;
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,ne=`
uniform sampler2D uDataTexture;
uniform sampler2D uTexture;
uniform vec4 resolution;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  vec4 offset = texture2D(uDataTexture, vUv);
  gl_FragColor = texture2D(uTexture, uv - 0.02 * offset.rg);
}`,ie=({grid:y=15,mouse:D=.1,strength:w=.15,relaxation:g=.9,imageSrc:b,className:W=""})=>{const x=l.useRef(null),z=l.useRef(null),C=l.useRef(null),F=l.useRef(null),X=l.useRef(null),q=l.useRef(1),R=l.useRef(null),M=l.useRef(null);return l.useEffect(()=>{if(!x.current)return;const o=x.current,p=new H;z.current=p;const n=new V({antialias:!0,alpha:!0,powerPreference:"high-performance"});n.setPixelRatio(Math.min(window.devicePixelRatio,2)),n.setClearColor(0,0),C.current=n,o.innerHTML="",o.appendChild(n.domElement);const i=new _(0,0,0,0,-1e3,1e3);i.position.z=2,F.current=i;const d={time:{value:0},resolution:{value:new I},uTexture:{value:null},uDataTexture:{value:null}};new N().load(b,e=>{e.minFilter=A,e.magFilter=A,e.wrapS=G,e.wrapT=G,q.current=e.image.width/e.image.height,d.uTexture.value=e,f()});const t=y,T=new Float32Array(4*t*t);for(let e=0;e<t*t;e++)T[e*4]=Math.random()*255-125,T[e*4+1]=Math.random()*255-125;const v=new $(T,t,t,k,J);v.needsUpdate=!0,d.uDataTexture.value=v;const L=new K({side:Q,uniforms:d,vertexShader:te,fragmentShader:ne,transparent:!0}),E=new Z(1,1,t-1,t-1),h=new ee(E,L);X.current=h,p.add(h);const f=()=>{if(!o||!n||!i)return;const e=o.getBoundingClientRect(),s=e.width,u=e.height;if(s===0||u===0)return;const c=s/u;n.setSize(s,u),h&&h.scale.set(c,1,1);const r=1,m=r*c;i.left=-m/2,i.right=m/2,i.top=r/2,i.bottom=-r/2,i.updateProjectionMatrix(),d.resolution.value.set(s,u,1,1)};if(window.ResizeObserver){const e=new ResizeObserver(()=>{f()});e.observe(o),M.current=e}else window.addEventListener("resize",f);const a={x:0,y:0,prevX:0,prevY:0,vX:0,vY:0},Y=e=>{const s=o.getBoundingClientRect(),u=(e.clientX-s.left)/s.width,c=1-(e.clientY-s.top)/s.height;a.vX=u-a.prevX,a.vY=c-a.prevY,Object.assign(a,{x:u,y:c,prevX:u,prevY:c})},S=()=>{v&&(v.needsUpdate=!0),Object.assign(a,{x:0,y:0,prevX:0,prevY:0,vX:0,vY:0})};o.addEventListener("mousemove",Y),o.addEventListener("mouseleave",S),f();const j=()=>{if(R.current=requestAnimationFrame(j),!n||!p||!i)return;d.time.value+=.05;const e=v.image.data;for(let r=0;r<t*t;r++)e[r*4]*=g,e[r*4+1]*=g;const s=t*a.x,u=t*a.y,c=t*D;for(let r=0;r<t;r++)for(let m=0;m<t;m++){const P=Math.pow(s-r,2)+Math.pow(u-m,2);if(P<c*c){const U=4*(r+t*m),O=Math.min(c/Math.sqrt(P),10);e[U]+=w*100*a.vX*O,e[U+1]-=w*100*a.vY*O}}v.needsUpdate=!0,n.render(p,i)};return j(),()=>{R.current&&cancelAnimationFrame(R.current),M.current?M.current.disconnect():window.removeEventListener("resize",f),o.removeEventListener("mousemove",Y),o.removeEventListener("mouseleave",S),n&&(n.dispose(),n.forceContextLoss(),o.contains(n.domElement)&&o.removeChild(n.domElement)),E&&E.dispose(),L&&L.dispose(),v&&v.dispose(),d.uTexture.value&&d.uTexture.value.dispose(),z.current=null,C.current=null,F.current=null,X.current=null}},[y,D,w,g,b]),B.jsx("div",{ref:x,className:`distortion-container ${W}`,style:{width:"100%",height:"100%",minWidth:"0",minHeight:"0"}})};export{ie as default};
