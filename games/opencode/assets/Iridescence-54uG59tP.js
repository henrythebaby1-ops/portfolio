import{r as l,R as E,T as M,P as A,C as m,M as S,j as T}from"./index-D0zNZLAK.js";const F=`
attribute vec2 uv;
attribute vec2 position;

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`,L=`
precision highp float;

uniform float uTime;
uniform vec3 uColor;
uniform vec3 uResolution;
uniform vec2 uMouse;
uniform float uAmplitude;
uniform float uSpeed;

varying vec2 vUv;

void main() {
  float mr = min(uResolution.x, uResolution.y);
  vec2 uv = (vUv.xy * 2.0 - 1.0) * uResolution.xy / mr;

  uv += (uMouse - vec2(0.5)) * uAmplitude;

  float d = -uTime * 0.5 * uSpeed;
  float a = 0.0;
  for (float i = 0.0; i < 8.0; ++i) {
    a += cos(i - d - a * uv.x);
    d += sin(uv.y * i + a);
  }
  d += uTime * 0.5 * uSpeed;
  vec3 col = vec3(cos(uv * vec2(d, a)) * 0.6 + 0.4, cos(a + d) * 0.5 + 0.5);
  col = cos(col * cos(vec3(d, a, 2.5)) * 0.5 + 0.5) * uColor;
  gl_FragColor = vec4(col, 1.0);
}
`;function P({color:f=[1,1,1],speed:d=1,amplitude:h=.1,mouseReact:u=!0,...y}){const s=l.useRef(null),r=l.useRef({x:.5,y:.5});return l.useEffect(()=>{if(!s.current)return;const o=s.current,a=new E,e=a.gl;e.clearColor(1,1,1,1);let t;function c(){a.setSize(o.offsetWidth*1,o.offsetHeight*1),t&&(t.uniforms.uResolution.value=new m(e.canvas.width,e.canvas.height,e.canvas.width/e.canvas.height))}window.addEventListener("resize",c,!1),c();const C=new M(e);t=new A(e,{vertex:F,fragment:L,uniforms:{uTime:{value:0},uColor:{value:new m(...f)},uResolution:{value:new m(e.canvas.width,e.canvas.height,e.canvas.width/e.canvas.height)},uMouse:{value:new Float32Array([r.current.x,r.current.y])},uAmplitude:{value:h},uSpeed:{value:d}}});const R=new S(e,{geometry:C,program:t});let v;function g(n){v=requestAnimationFrame(g),t.uniforms.uTime.value=n*.001,a.render({scene:R})}v=requestAnimationFrame(g),o.appendChild(e.canvas);function p(n){const i=o.getBoundingClientRect(),w=(n.clientX-i.left)/i.width,x=1-(n.clientY-i.top)/i.height;r.current={x:w,y:x},t.uniforms.uMouse.value[0]=w,t.uniforms.uMouse.value[1]=x}return u&&o.addEventListener("mousemove",p),()=>{var n;cancelAnimationFrame(v),window.removeEventListener("resize",c),u&&o.removeEventListener("mousemove",p),o.removeChild(e.canvas),(n=e.getExtension("WEBGL_lose_context"))==null||n.loseContext()}},[f,d,h,u]),T.jsx("div",{ref:s,className:"iridescence-container",...y})}export{P as default};
