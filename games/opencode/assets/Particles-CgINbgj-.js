import{r as P,R as X,G as Y,P as $,M as k,j as J}from"./index-tDOHgNLd.js";import{C as K}from"./Camera-i6VaXDOB.js";const Q=["#ffffff","#ffffff","#ffffff"],U=n=>{n=n.replace(/^#/,""),n.length===3&&(n=n.split("").map(m=>m+m).join(""));const s=parseInt(n.slice(0,6),16),d=(s>>16&255)/255,f=(s>>8&255)/255,i=(s&255)/255;return[d,f,i]},V=`
  attribute vec3 position;
  attribute vec4 random;
  attribute vec3 color;
  
  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;
  uniform float uSpread;
  uniform float uBaseSize;
  uniform float uSizeRandomness;
  
  varying vec4 vRandom;
  varying vec3 vColor;
  
  void main() {
    vRandom = random;
    vColor = color;
    
    vec3 pos = position * uSpread;
    pos.z *= 10.0;
    
    vec4 mPos = modelMatrix * vec4(pos, 1.0);
    float t = uTime;
    mPos.x += sin(t * random.z + 6.28 * random.w) * mix(0.1, 1.5, random.x);
    mPos.y += sin(t * random.y + 6.28 * random.x) * mix(0.1, 1.5, random.w);
    mPos.z += sin(t * random.w + 6.28 * random.y) * mix(0.1, 1.5, random.z);
    
    vec4 mvPos = viewMatrix * mPos;

    if (uSizeRandomness == 0.0) {
      gl_PointSize = uBaseSize;
    } else {
      gl_PointSize = (uBaseSize * (1.0 + uSizeRandomness * (random.x - 0.5))) / length(mvPos.xyz);
    }

    gl_Position = projectionMatrix * mvPos;
  }
`,Z=`
  precision highp float;
  
  uniform float uTime;
  uniform float uAlphaParticles;
  varying vec4 vRandom;
  varying vec3 vColor;
  
  void main() {
    vec2 uv = gl_PointCoord.xy;
    float d = length(uv - vec2(0.5));
    
    if(uAlphaParticles < 0.5) {
      if(d > 0.5) {
        discard;
      }
      gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), 1.0);
    } else {
      float circle = smoothstep(0.5, 0.4, d) * 0.8;
      gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), circle);
    }
  }
`,H=({particleCount:n=200,particleSpread:s=10,speed:d=.1,particleColors:f,moveParticlesOnHover:i=!1,particleHoverFactor:m=1,alphaParticles:R=!1,particleBaseSize:S=100,sizeRandomness:C=1,cameraDistance:T=20,disableRotation:A=!1,pixelRatio:h=1,className:G})=>{const E=P.useRef(null),p=P.useRef({x:0,y:0});return P.useEffect(()=>{const a=E.current;if(!a)return;const g=new X({dpr:h,depth:!1,alpha:!0}),t=g.gl;a.appendChild(t.canvas),t.clearColor(0,0,0,0);const x=new K(t,{fov:15});x.position.set(0,0,T);const y=()=>{const e=a.clientWidth,o=a.clientHeight;g.setSize(e,o),x.perspective({aspect:t.canvas.width/t.canvas.height})};window.addEventListener("resize",y,!1),y();const F=e=>{const o=a.getBoundingClientRect(),c=(e.clientX-o.left)/o.width*2-1,l=-((e.clientY-o.top)/o.height*2-1);p.current={x:c,y:l}};i&&a.addEventListener("mousemove",F);const u=n,j=new Float32Array(u*3),_=new Float32Array(u*4),b=new Float32Array(u*3),B=f&&f.length>0?f:Q;for(let e=0;e<u;e++){let o,c,l,w;do o=Math.random()*2-1,c=Math.random()*2-1,l=Math.random()*2-1,w=o*o+c*c+l*l;while(w>1||w===0);const z=Math.cbrt(Math.random());j.set([o*z,c*z,l*z],e*3),_.set([Math.random(),Math.random(),Math.random(),Math.random()],e*4);const W=U(B[Math.floor(Math.random()*B.length)]);b.set(W,e*3)}const N=new Y(t,{position:{size:3,data:j},random:{size:4,data:_},color:{size:3,data:b}}),L=new $(t,{vertex:V,fragment:Z,uniforms:{uTime:{value:0},uSpread:{value:s},uBaseSize:{value:S*h},uSizeRandomness:{value:C},uAlphaParticles:{value:R?1:0}},transparent:!0,depthTest:!1}),r=new k(t,{mode:t.POINTS,geometry:N,program:L});let M,I=performance.now(),v=0;const q=e=>{M=requestAnimationFrame(q);const o=e-I;I=e,v+=o*d,L.uniforms.uTime.value=v*.001,i?(r.position.x=-p.current.x*m,r.position.y=-p.current.y*m):(r.position.x=0,r.position.y=0),A||(r.rotation.x=Math.sin(v*2e-4)*.1,r.rotation.y=Math.cos(v*5e-4)*.15,r.rotation.z+=.01*d),g.render({scene:r,camera:x})};return M=requestAnimationFrame(q),()=>{window.removeEventListener("resize",y),i&&a.removeEventListener("mousemove",F),cancelAnimationFrame(M),a.contains(t.canvas)&&a.removeChild(t.canvas)}},[n,s,d,i,m,R,S,C,T,A,h]),J.jsx("div",{ref:E,className:`particles-container ${G}`})};export{H as default};
