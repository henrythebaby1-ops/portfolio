import{r as S,j as U}from"./index-D0zNZLAK.js";const z=({hue:c=230,xOffset:f=0,speed:s=1,intensity:u=1,size:l=1})=>{const m=S.useRef(null);return S.useEffect(()=>{const o=m.current;if(!o)return;const a=()=>{o.width=o.clientWidth,o.height=o.clientHeight};a(),window.addEventListener("resize",a);const e=o.getContext("webgl",{alpha:!0,premultipliedAlpha:!1});if(!e){console.error("WebGL not supported");return}const x=`
      attribute vec2 aPosition;
      void main() {
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `,A=`
      precision mediump float;
      uniform vec2 iResolution;
      uniform float iTime;
      uniform float uHue;
      uniform float uXOffset;
      uniform float uSpeed;
      uniform float uIntensity;
      uniform float uSize;
      
      #define OCTAVE_COUNT 10

      vec3 hsv2rgb(vec3 c) {
          vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0,4.0,2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
          return c.z * mix(vec3(1.0), rgb, c.y);
      }

      float hash11(float p) {
          p = fract(p * .1031);
          p *= p + 33.33;
          p *= p + p;
          return fract(p);
      }

      float hash12(vec2 p) {
          vec3 p3 = fract(vec3(p.xyx) * .1031);
          p3 += dot(p3, p3.yzx + 33.33);
          return fract((p3.x + p3.y) * p3.z);
      }

      mat2 rotate2d(float theta) {
          float c = cos(theta);
          float s = sin(theta);
          return mat2(c, -s, s, c);
      }

      float noise(vec2 p) {
          vec2 ip = floor(p);
          vec2 fp = fract(p);
          float a = hash12(ip);
          float b = hash12(ip + vec2(1.0, 0.0));
          float c = hash12(ip + vec2(0.0, 1.0));
          float d = hash12(ip + vec2(1.0, 1.0));
          
          vec2 t = smoothstep(0.0, 1.0, fp);
          return mix(mix(a, b, t.x), mix(c, d, t.x), t.y);
      }

      float fbm(vec2 p) {
          float value = 0.0;
          float amplitude = 0.5;
          for (int i = 0; i < OCTAVE_COUNT; ++i) {
              value += amplitude * noise(p);
              p *= rotate2d(0.45);
              p *= 2.0;
              amplitude *= 0.5;
          }
          return value;
      }

      void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
          vec2 uv = fragCoord / iResolution.xy;
          uv = 2.0 * uv - 1.0;
          uv.x *= iResolution.x / iResolution.y;
          uv.x += uXOffset;
          
          uv += 2.0 * fbm(uv * uSize + 0.8 * iTime * uSpeed) - 1.0;
          
          float dist = abs(uv.x);
          vec3 baseColor = hsv2rgb(vec3(uHue / 360.0, 0.7, 0.8));
          vec3 col = baseColor * pow(mix(0.0, 0.07, hash11(iTime * uSpeed)) / dist, 1.0) * uIntensity;
          col = pow(col, vec3(1.0));
          float a = clamp(max(col.r, max(col.g, col.b)), 0.0, 1.0);
          fragColor = vec4(col, a);
      }

      void main() {
          mainImage(gl_FragColor, gl_FragCoord.xy);
      }
    `,p=(n,I)=>{const r=e.createShader(I);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(console.error("Shader compile error:",e.getShaderInfoLog(r)),e.deleteShader(r),null)):null},v=p(x,e.VERTEX_SHADER),d=p(A,e.FRAGMENT_SHADER);if(!v||!d)return;const t=e.createProgram();if(!t)return;if(e.attachShader(t,v),e.attachShader(t,d),e.linkProgram(t),!e.getProgramParameter(t,e.LINK_STATUS)){console.error("Program linking error:",e.getProgramInfoLog(t));return}e.useProgram(t);const L=new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),b=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,b),e.bufferData(e.ARRAY_BUFFER,L,e.STATIC_DRAW);const g=e.getAttribLocation(t,"aPosition");e.enableVertexAttribArray(g),e.vertexAttribPointer(g,2,e.FLOAT,!1,0,0);const R=e.getUniformLocation(t,"iResolution"),T=e.getUniformLocation(t,"iTime"),C=e.getUniformLocation(t,"uHue"),E=e.getUniformLocation(t,"uXOffset"),w=e.getUniformLocation(t,"uSpeed"),P=e.getUniformLocation(t,"uIntensity"),y=e.getUniformLocation(t,"uSize");let i;const F=performance.now(),h=()=>{a(),e.viewport(0,0,o.width,o.height),e.uniform2f(R,o.width,o.height);const n=performance.now();e.uniform1f(T,(n-F)/1e3),e.uniform1f(C,c),e.uniform1f(E,f),e.uniform1f(w,s),e.uniform1f(P,u),e.uniform1f(y,l),e.drawArrays(e.TRIANGLES,0,6),i=requestAnimationFrame(h)};return i=requestAnimationFrame(h),()=>{cancelAnimationFrame(i),window.removeEventListener("resize",a)}},[c,f,s,u,l]),U.jsx("canvas",{ref:m,className:"lightning-container"})};export{z as default};
