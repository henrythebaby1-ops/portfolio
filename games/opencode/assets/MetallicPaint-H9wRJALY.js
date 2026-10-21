import{r as a,j as et}from"./index-D0zNZLAK.js";const rt=`#version 300 es
precision highp float;
in vec2 a_position;
out vec2 vP;
void main(){vP=a_position*.5+.5;gl_Position=vec4(a_position,0.,1.);}`,ot=`#version 300 es
precision highp float;
in vec2 vP;
out vec4 oC;
uniform sampler2D u_tex;
uniform float u_time,u_ratio,u_imgRatio,u_seed,u_scale,u_refract,u_blur,u_liquid;
uniform float u_bright,u_contrast,u_angle,u_fresnel,u_sharp,u_wave,u_noise,u_chroma;
uniform float u_distort,u_contour;
uniform vec3 u_lightColor,u_darkColor,u_tint;

vec3 sC,sM;

vec3 pW(vec3 v){
  vec3 i=floor(v),f=fract(v),s=sign(fract(v*.5)-.5),h=fract(sM*i+i.yzx),c=f*(f-1.);
  return s*c*((h*16.-4.)*c-1.);
}

vec3 aF(vec3 b,vec3 c){return pW(b+c.zxy-pW(b.zxy+c.yzx)+pW(b.yzx+c.xyz));}
vec3 lM(vec3 s,vec3 p){return(p+aF(s,p))*.5;}

vec2 fA(){
  vec2 c=vP-.5;
  c.x*=u_ratio>u_imgRatio?u_ratio/u_imgRatio:1.;
  c.y*=u_ratio>u_imgRatio?1.:u_imgRatio/u_ratio;
  return vec2(c.x+.5,.5-c.y);
}

vec2 rot(vec2 p,float r){float c=cos(r),s=sin(r);return vec2(p.x*c+p.y*s,p.y*c-p.x*s);}

float bM(vec2 c,float t){
  vec2 l=smoothstep(vec2(0.),vec2(t),c),u=smoothstep(vec2(0.),vec2(t),1.-c);
  return l.x*l.y*u.x*u.y;
}

float mG(float hi,float lo,float t,float sh,float cv){
  sh*=(2.-u_sharp);
  float ci=smoothstep(.15,.85,cv),r=lo;
  float e1=.08/u_scale;
  r=mix(r,hi,smoothstep(0.,sh*1.5,t));
  r=mix(r,lo,smoothstep(e1-sh,e1+sh,t));
  float e2=e1+.05/u_scale*(1.-ci*.35);
  r=mix(r,hi,smoothstep(e2-sh,e2+sh,t));
  float e3=e2+.025/u_scale*(1.-ci*.45);
  r=mix(r,lo,smoothstep(e3-sh,e3+sh,t));
  float e4=e1+.1/u_scale;
  r=mix(r,hi,smoothstep(e4-sh,e4+sh,t));
  float rm=1.-e4,gT=clamp((t-e4)/rm,0.,1.);
  r=mix(r,mix(hi,lo,smoothstep(0.,1.,gT)),smoothstep(e4-sh*.5,e4+sh*.5,t));
  return r;
}

void main(){
  sC=fract(vec3(.7548,.5698,.4154)*(u_seed+17.31))+.5;
  sM=fract(sC.zxy-sC.yzx*1.618);
  vec2 sc=vec2(vP.x*u_ratio,1.-vP.y);
  float angleRad=u_angle*3.14159/180.;
  sc=rot(sc-.5,angleRad)+.5;
  sc=clamp(sc,0.,1.);
  float sl=sc.x-sc.y,an=u_time*.001;
  vec2 iC=fA();
  vec4 texSample=texture(u_tex,iC);
  float dp=texSample.r;
  float shapeMask=texSample.a;
  vec3 hi=u_lightColor*u_bright;
  vec3 lo=u_darkColor*(2.-u_bright);
  lo.b+=smoothstep(.6,1.4,sc.x+sc.y)*.08;
  vec2 fC=sc-.5;
  float rd=length(fC+vec2(0.,sl*.15));
  vec2 ag=rot(fC,(.22-sl*.18)*3.14159);
  float cv=1.-pow(rd*1.65,1.15);
  cv*=pow(sc.y,.35);
  float vs=shapeMask;
  vs*=bM(iC,.01);
  float fr=pow(1.-cv,u_fresnel)*.3;
  vs=min(vs+fr*vs,1.);
  float mT=an*.0625;
  vec3 wO=vec3(-1.05,1.35,1.55);
  vec3 wA=aF(vec3(31.,73.,56.),mT+wO)*.22*u_wave;
  vec3 wB=aF(vec3(24.,64.,42.),mT-wO.yzx)*.22*u_wave;
  vec2 nC=sc*45.*u_noise;
  nC+=aF(sC.zxy,an*.17*sC.yzx-sc.yxy*.35).xy*18.*u_wave;
  vec3 tC=vec3(.00041,.00053,.00076)*mT+wB*nC.x+wA*nC.y;
  tC=lM(sC,tC);
  tC=lM(sC+1.618,tC);
  float tb=sin(tC.x*3.14159)*.5+.5;
  tb=tb*2.-1.;
  float noiseVal=pW(vec3(sc*8.+an,an*.5)).x;
  float edgeFactor=smoothstep(0.,.5,dp)*smoothstep(1.,.5,dp);
  float lD=dp+(1.-dp)*u_liquid*tb;
  lD+=noiseVal*u_distort*.15*edgeFactor;
  float rB=clamp(1.-cv,0.,1.);
  float fl=ag.x+sl;
  fl+=noiseVal*sl*u_distort*edgeFactor;
  fl*=mix(1.,1.-dp*.5,u_contour);
  fl-=dp*u_contour*.8;
  float eI=smoothstep(0.,1.,lD)*smoothstep(1.,0.,lD);
  fl-=tb*sl*1.8*eI;
  float cA=cv*clamp(pow(sc.y,.12),.25,1.);
  fl*=.12+(1.05-lD)*cA;
  fl*=smoothstep(1.,.65,lD);
  float vA1=smoothstep(.08,.18,sc.y)*smoothstep(.38,.18,sc.y);
  float vA2=smoothstep(.08,.18,1.-sc.y)*smoothstep(.38,.18,1.-sc.y);
  fl+=vA1*.16+vA2*.025;
  fl*=.45+pow(sc.y,2.)*.55;
  fl*=u_scale;
  fl-=an;
  float rO=rB+cv*tb*.025;
  float vM1=smoothstep(-.12,.18,sc.y)*smoothstep(.48,.08,sc.y);
  float cM1=smoothstep(.35,.55,cv)*smoothstep(.95,.35,cv);
  rO+=vM1*cM1*4.5;
  rO-=sl;
  float bO=rB*1.25;
  float vM2=smoothstep(-.02,.35,sc.y)*smoothstep(.75,.08,sc.y);
  float cM2=smoothstep(.35,.55,cv)*smoothstep(.75,.35,cv);
  bO+=vM2*cM2*.9;
  bO-=lD*.18;
  rO*=u_refract*u_chroma;
  bO*=u_refract*u_chroma;
  float sf=u_blur;
  float rP=fract(fl+rO);
  float rC=mG(hi.r,lo.r,rP,sf+.018+u_refract*cv*.025,cv);
  float gP=fract(fl);
  float gC=mG(hi.g,lo.g,gP,sf+.008/max(.01,1.-sl),cv);
  float bP=fract(fl-bO);
  float bC=mG(hi.b,lo.b,bP,sf+.008,cv);
  vec3 col=vec3(rC,gC,bC);
  col=(col-.5)*u_contrast+.5;
  col=clamp(col,0.,1.);
  col=mix(col,1.-min(vec3(1.),(1.-col)/max(u_tint,vec3(.001))),length(u_tint-1.)*.5);
  col=clamp(col,0.,1.);
  oC=vec4(col*vs,vs);
}`;function ct(v){let o=v.naturalWidth||v.width,n=v.naturalHeight||v.height;if(o>1e3||n>1e3||o<500||n<500){const r=o>n?o>1e3?1e3/o:o<500?500/o:1:n>1e3?1e3/n:n<500?500/n:1;o=Math.round(o*r),n=Math.round(n*r)}const M=document.createElement("canvas");M.width=o,M.height=n;const y=M.getContext("2d");y.drawImage(v,0,0,o,n);const A=y.getImageData(0,0,o,n).data,p=o*n,C=new Float32Array(p),i=new Uint8Array(p),P=new Uint8Array(p);for(let r=0;r<p;r++){const s=r*4,u=A[s],c=A[s+1],F=A[s+2],d=A[s+3],I=u>250&&c>250&&F>250&&d===255||d<5;C[r]=I?0:d/255,i[r]=C[r]>.1?1:0}for(let r=0;r<n;r++)for(let s=0;s<o;s++){const u=r*o+s;i[u]&&(s===0||s===o-1||r===0||r===n-1||!i[u-1]||!i[u+1]||!i[u-o]||!i[u+o])&&(P[u]=1)}const _=new Float32Array(p),O=200,N=.01,S=1.85;for(let r=0;r<O;r++)for(let s=1;s<n-1;s++)for(let u=1;u<o-1;u++){const c=s*o+u;if(!i[c]||P[c])continue;const F=(i[c+1]?_[c+1]:0)+(i[c-1]?_[c-1]:0)+(i[c+o]?_[c+o]:0)+(i[c-o]?_[c-o]:0),d=(N+F)/4;_[c]=S*d+(1-S)*_[c]}let g=0;for(let r=0;r<p;r++)_[r]>g&&(g=_[r]);g===0&&(g=1);const R=y.createImageData(o,n);for(let r=0;r<p;r++){const s=r*4,u=_[r]/g,c=Math.round(255*(1-u*u));R.data[s]=R.data[s+1]=R.data[s+2]=c,R.data[s+3]=Math.round(C[r]*255)}return R}function z(v){const x=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(v);return x?[parseInt(x[1],16)/255,parseInt(x[2],16)/255,parseInt(x[3],16)/255]:[1,1,1]}function at({imageSrc:v,seed:x=42,scale:L=4,refraction:o=.01,blur:n=.015,liquid:M=.75,speed:y=.3,brightness:B=2,contrast:A=.5,angle:p=0,fresnel:C=1,lightColor:i="#ffffff",darkColor:P="#000000",patternSharpness:_=1,waveAmplitude:O=1,noiseScale:N=.5,chromaticSpread:S=2,mouseAnimation:g=!1,distortion:R=1,contour:r=.2,tintColor:s="#feb3ff"}){const u=a.useRef(null),c=a.useRef(null),F=a.useRef(null),d=a.useRef({}),I=a.useRef(null),Z=a.useRef(0),G=a.useRef(0),b=a.useRef(null),K=a.useRef(null),k=a.useRef(y),$=a.useRef({x:.5,y:.5,targetX:.5,targetY:.5}),V=a.useRef(g),[w,J]=a.useState(!1),[W,Y]=a.useState(!1);a.useEffect(()=>{k.current=y},[y]),a.useEffect(()=>{V.current=g},[g]);const q=a.useCallback(()=>{const e=u.current;if(!e)return!1;const t=e.getContext("webgl2",{antialias:!0,alpha:!0});if(!t)return!1;const l=(D,X)=>{const U=t.createShader(X);return t.shaderSource(U,D),t.compileShader(U),t.getShaderParameter(U,t.COMPILE_STATUS)?U:(console.error(t.getShaderInfoLog(U)),null)},f=l(rt,t.VERTEX_SHADER),h=l(ot,t.FRAGMENT_SHADER);if(!f||!h)return!1;const m=t.createProgram();if(t.attachShader(m,f),t.attachShader(m,h),t.linkProgram(m),!t.getProgramParameter(m,t.LINK_STATUS))return console.error(t.getProgramInfoLog(m)),!1;const E={},T=t.getProgramParameter(m,t.ACTIVE_UNIFORMS);for(let D=0;D<T;D++){const X=t.getActiveUniform(m,D);X&&(E[X.name]=t.getUniformLocation(m,X.name))}const Q=new Float32Array([-1,-1,1,-1,-1,1,1,1]),tt=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,tt),t.bufferData(t.ARRAY_BUFFER,Q,t.STATIC_DRAW),t.useProgram(m);const H=t.getAttribLocation(m,"a_position");return t.enableVertexAttribArray(H),t.vertexAttribPointer(H,2,t.FLOAT,!1,0,0),c.current=t,F.current=m,d.current=E,!0},[]),j=a.useCallback(e=>{const t=c.current,l=d.current;if(!t||!e)return;I.current&&t.deleteTexture(I.current);const f=t.createTexture();t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,f),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,e.width,e.height,0,t.RGBA,t.UNSIGNED_BYTE,e.data),t.uniform1i(l.u_tex,0);const h=e.width/e.height;t.uniform1f(l.u_imgRatio,h),t.uniform1f(l.u_ratio,1),I.current=f,K.current=e},[]);return a.useEffect(()=>{if(!q())return;const e=u.current,t=c.current,l=1e3*devicePixelRatio;return e.width=l,e.height=l,t.viewport(0,0,l,l),J(!0),()=>{b.current&&cancelAnimationFrame(b.current),I.current&&c.current&&c.current.deleteTexture(I.current)}},[q]),a.useEffect(()=>{if(!w||!v)return;Y(!1);const e=new Image;e.crossOrigin="anonymous",e.onload=()=>{const t=ct(e);j(t),Y(!0)},e.src=v},[w,v,j]),a.useEffect(()=>{const e=c.current,t=d.current;if(!e||!w)return;e.uniform1f(t.u_seed,x),e.uniform1f(t.u_scale,L),e.uniform1f(t.u_refract,o),e.uniform1f(t.u_blur,n),e.uniform1f(t.u_liquid,M),e.uniform1f(t.u_bright,B),e.uniform1f(t.u_contrast,A),e.uniform1f(t.u_angle,p),e.uniform1f(t.u_fresnel,C);const l=z(i),f=z(P),h=z(s);e.uniform3f(t.u_lightColor,l[0],l[1],l[2]),e.uniform3f(t.u_darkColor,f[0],f[1],f[2]),e.uniform1f(t.u_sharp,_),e.uniform1f(t.u_wave,O),e.uniform1f(t.u_noise,N),e.uniform1f(t.u_chroma,S),e.uniform1f(t.u_distort,R),e.uniform1f(t.u_contour,r),e.uniform3f(t.u_tint,h[0],h[1],h[2])},[w,x,L,o,n,M,B,A,p,C,i,P,_,O,N,S,R,r,s]),a.useEffect(()=>{if(!w||!W)return;const e=c.current,t=d.current,l=u.current,f=$.current,h=E=>{const T=l.getBoundingClientRect();f.targetX=(E.clientX-T.left)/T.width,f.targetY=(E.clientY-T.top)/T.height};window.addEventListener("mousemove",h);const m=E=>{const T=E-G.current;G.current=E,V.current?(f.x+=(f.targetX-f.x)*.08,f.y+=(f.targetY-f.y)*.08,Z.current=f.x*3e3+f.y*1500):Z.current+=T*k.current,e.uniform1f(t.u_time,Z.current),e.drawArrays(e.TRIANGLE_STRIP,0,4),b.current=requestAnimationFrame(m)};return G.current=performance.now(),b.current=requestAnimationFrame(m),()=>{b.current&&cancelAnimationFrame(b.current),window.removeEventListener("mousemove",h)}},[w,W]),et.jsx("canvas",{ref:u,className:"paint-container"})}export{at as default};
