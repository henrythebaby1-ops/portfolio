import{r as R,R as q,T as L,P as j,M as U,j as B}from"./index-D0zNZLAK.js";const X=({baseColor:m=[.1,.1,.1],speed:d=.2,amplitude:h=.3,frequencyX:g=3,frequencyY:p=3,interactive:r=!0,...E})=>{const a=R.useRef(null);return R.useEffect(()=>{if(!a.current)return;const n=a.current,c=new q({antialias:!0}),e=c.gl;e.clearColor(1,1,1,1);const F=`
      attribute vec2 position;
      attribute vec2 uv;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `,M=`
      precision highp float;
      uniform float uTime;
      uniform vec3 uResolution;
      uniform vec3 uBaseColor;
      uniform float uAmplitude;
      uniform float uFrequencyX;
      uniform float uFrequencyY;
      uniform vec2 uMouse;
      varying vec2 vUv;

      vec4 renderImage(vec2 uvCoord) {
          vec2 fragCoord = uvCoord * uResolution.xy;
          vec2 uv = (2.0 * fragCoord - uResolution.xy) / min(uResolution.x, uResolution.y);

          for (float i = 1.0; i < 10.0; i++){
              uv.x += uAmplitude / i * cos(i * uFrequencyX * uv.y + uTime + uMouse.x * 3.14159);
              uv.y += uAmplitude / i * cos(i * uFrequencyY * uv.x + uTime + uMouse.y * 3.14159);
          }

          vec2 diff = (uvCoord - uMouse);
          float dist = length(diff);
          float falloff = exp(-dist * 20.0);
          float ripple = sin(10.0 * dist - uTime * 2.0) * 0.03;
          uv += (diff / (dist + 0.0001)) * ripple * falloff;

          vec3 color = uBaseColor / abs(sin(uTime - uv.y - uv.x));
          return vec4(color, 1.0);
      }

      void main() {
          vec4 col = vec4(0.0);
          int samples = 0;
          for (int i = -1; i <= 1; i++){
              for (int j = -1; j <= 1; j++){
                  vec2 offset = vec2(float(i), float(j)) * (1.0 / min(uResolution.x, uResolution.y));
                  col += renderImage(vUv + offset);
                  samples++;
              }
          }
          gl_FragColor = col / float(samples);
      }
    `,A=new L(e),u=new j(e,{vertex:F,fragment:M,uniforms:{uTime:{value:0},uResolution:{value:new Float32Array([e.canvas.width,e.canvas.height,e.canvas.width/e.canvas.height])},uBaseColor:{value:new Float32Array(m)},uAmplitude:{value:h},uFrequencyX:{value:g},uFrequencyY:{value:p},uMouse:{value:new Float32Array([0,0])}}}),T=new U(e,{geometry:A,program:u});function l(){c.setSize(n.offsetWidth*1,n.offsetHeight*1);const t=u.uniforms.uResolution.value;t[0]=e.canvas.width,t[1]=e.canvas.height,t[2]=e.canvas.width/e.canvas.height}window.addEventListener("resize",l),l();function x(o){const t=n.getBoundingClientRect(),i=(o.clientX-t.left)/t.width,f=1-(o.clientY-t.top)/t.height,s=u.uniforms.uMouse.value;s[0]=i,s[1]=f}function y(o){if(o.touches.length>0){const t=o.touches[0],i=n.getBoundingClientRect(),f=(t.clientX-i.left)/i.width,s=1-(t.clientY-i.top)/i.height,C=u.uniforms.uMouse.value;C[0]=f,C[1]=s}}r&&(n.addEventListener("mousemove",x),n.addEventListener("touchmove",y));let v;function w(o){v=requestAnimationFrame(w),u.uniforms.uTime.value=o*.001*d,c.render({scene:T})}return v=requestAnimationFrame(w),n.appendChild(e.canvas),()=>{var o;cancelAnimationFrame(v),window.removeEventListener("resize",l),r&&(n.removeEventListener("mousemove",x),n.removeEventListener("touchmove",y)),e.canvas.parentElement&&e.canvas.parentElement.removeChild(e.canvas),(o=e.getExtension("WEBGL_lose_context"))==null||o.loseContext()}},[m,d,h,g,p,r]),B.jsx("div",{ref:a,className:"liquidChrome-container",...E})};export{X as LiquidChrome,X as default};
