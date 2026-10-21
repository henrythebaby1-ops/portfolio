import{r as E,R as H,T as P,P as U,V as g,M as _,j as D}from"./index-D0zNZLAK.js";function W({hue:o=0,hoverIntensity:i=.2,rotateOnHover:n=!0,forceHoverState:s=!1,backgroundColor:r="#000000"}){const l=E.useRef(null),m=`
    precision highp float;
    attribute vec2 position;
    attribute vec2 uv;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `,h=`
    precision highp float;

    uniform float iTime;
    uniform vec3 iResolution;
    uniform float hue;
    uniform float hover;
    uniform float rot;
    uniform float hoverIntensity;
    uniform vec3 backgroundColor;
    varying vec2 vUv;

    vec3 rgb2yiq(vec3 c) {
      float y = dot(c, vec3(0.299, 0.587, 0.114));
      float i = dot(c, vec3(0.596, -0.274, -0.322));
      float q = dot(c, vec3(0.211, -0.523, 0.312));
      return vec3(y, i, q);
    }
    
    vec3 yiq2rgb(vec3 c) {
      float r = c.x + 0.956 * c.y + 0.621 * c.z;
      float g = c.x - 0.272 * c.y - 0.647 * c.z;
      float b = c.x - 1.106 * c.y + 1.703 * c.z;
      return vec3(r, g, b);
    }
    
    vec3 adjustHue(vec3 color, float hueDeg) {
      float hueRad = hueDeg * 3.14159265 / 180.0;
      vec3 yiq = rgb2yiq(color);
      float cosA = cos(hueRad);
      float sinA = sin(hueRad);
      float i = yiq.y * cosA - yiq.z * sinA;
      float q = yiq.y * sinA + yiq.z * cosA;
      yiq.y = i;
      yiq.z = q;
      return yiq2rgb(yiq);
    }

    vec3 hash33(vec3 p3) {
      p3 = fract(p3 * vec3(0.1031, 0.11369, 0.13787));
      p3 += dot(p3, p3.yxz + 19.19);
      return -1.0 + 2.0 * fract(vec3(
        p3.x + p3.y,
        p3.x + p3.z,
        p3.y + p3.z
      ) * p3.zyx);
    }

    float snoise3(vec3 p) {
      const float K1 = 0.333333333;
      const float K2 = 0.166666667;
      vec3 i = floor(p + (p.x + p.y + p.z) * K1);
      vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);
      vec3 e = step(vec3(0.0), d0 - d0.yzx);
      vec3 i1 = e * (1.0 - e.zxy);
      vec3 i2 = 1.0 - e.zxy * (1.0 - e);
      vec3 d1 = d0 - (i1 - K2);
      vec3 d2 = d0 - (i2 - K1);
      vec3 d3 = d0 - 0.5;
      vec4 h = max(0.6 - vec4(
        dot(d0, d0),
        dot(d1, d1),
        dot(d2, d2),
        dot(d3, d3)
      ), 0.0);
      vec4 n = h * h * h * h * vec4(
        dot(d0, hash33(i)),
        dot(d1, hash33(i + i1)),
        dot(d2, hash33(i + i2)),
        dot(d3, hash33(i + 1.0))
      );
      return dot(vec4(31.316), n);
    }

    vec4 extractAlpha(vec3 colorIn) {
      float a = max(max(colorIn.r, colorIn.g), colorIn.b);
      return vec4(colorIn.rgb / (a + 1e-5), a);
    }

    const vec3 baseColor1 = vec3(0.611765, 0.262745, 0.996078);
    const vec3 baseColor2 = vec3(0.298039, 0.760784, 0.913725);
    const vec3 baseColor3 = vec3(0.062745, 0.078431, 0.600000);
    const float innerRadius = 0.6;
    const float noiseScale = 0.65;

    float light1(float intensity, float attenuation, float dist) {
      return intensity / (1.0 + dist * attenuation);
    }
    float light2(float intensity, float attenuation, float dist) {
      return intensity / (1.0 + dist * dist * attenuation);
    }

    vec4 draw(vec2 uv) {
      vec3 color1 = adjustHue(baseColor1, hue);
      vec3 color2 = adjustHue(baseColor2, hue);
      vec3 color3 = adjustHue(baseColor3, hue);
      
      float ang = atan(uv.y, uv.x);
      float len = length(uv);
      float invLen = len > 0.0 ? 1.0 / len : 0.0;

      float bgLuminance = dot(backgroundColor, vec3(0.299, 0.587, 0.114));
      
      float n0 = snoise3(vec3(uv * noiseScale, iTime * 0.5)) * 0.5 + 0.5;
      float r0 = mix(mix(innerRadius, 1.0, 0.4), mix(innerRadius, 1.0, 0.6), n0);
      float d0 = distance(uv, (r0 * invLen) * uv);
      float v0 = light1(1.0, 10.0, d0);

      v0 *= smoothstep(r0 * 1.05, r0, len);
      float innerFade = smoothstep(r0 * 0.8, r0 * 0.95, len);
      v0 *= mix(innerFade, 1.0, bgLuminance * 0.7);
      float cl = cos(ang + iTime * 2.0) * 0.5 + 0.5;
      
      float a = iTime * -1.0;
      vec2 pos = vec2(cos(a), sin(a)) * r0;
      float d = distance(uv, pos);
      float v1 = light2(1.5, 5.0, d);
      v1 *= light1(1.0, 50.0, d0);
      
      float v2 = smoothstep(1.0, mix(innerRadius, 1.0, n0 * 0.5), len);
      float v3 = smoothstep(innerRadius, mix(innerRadius, 1.0, 0.5), len);
      
      vec3 colBase = mix(color1, color2, cl);
      float fadeAmount = mix(1.0, 0.1, bgLuminance);
      
      vec3 darkCol = mix(color3, colBase, v0);
      darkCol = (darkCol + v1) * v2 * v3;
      darkCol = clamp(darkCol, 0.0, 1.0);
      
      vec3 lightCol = (colBase + v1) * mix(1.0, v2 * v3, fadeAmount);
      lightCol = mix(backgroundColor, lightCol, v0);
      lightCol = clamp(lightCol, 0.0, 1.0);
      
      vec3 finalCol = mix(darkCol, lightCol, bgLuminance);
      
      return extractAlpha(finalCol);
    }

    vec4 mainImage(vec2 fragCoord) {
      vec2 center = iResolution.xy * 0.5;
      float size = min(iResolution.x, iResolution.y);
      vec2 uv = (fragCoord - center) / size * 2.0;
      
      float angle = rot;
      float s = sin(angle);
      float c = cos(angle);
      uv = vec2(c * uv.x - s * uv.y, s * uv.x + c * uv.y);
      
      uv.x += hover * hoverIntensity * 0.1 * sin(uv.y * 10.0 + iTime);
      uv.y += hover * hoverIntensity * 0.1 * sin(uv.x * 10.0 + iTime);
      
      return draw(uv);
    }

    void main() {
      vec2 fragCoord = vUv * iResolution.xy;
      vec4 col = mainImage(fragCoord);
      gl_FragColor = vec4(col.rgb * col.a, col.a);
    }
  `;return E.useEffect(()=>{const t=l.current;if(!t)return;const v=new H({alpha:!0,premultipliedAlpha:!1}),e=v.gl;e.clearColor(0,0,0,0),t.appendChild(e.canvas);const c=new P(e),u=new U(e,{vertex:m,fragment:h,uniforms:{iTime:{value:0},iResolution:{value:new g(e.canvas.width,e.canvas.height,e.canvas.width/e.canvas.height)},hue:{value:o},hover:{value:0},rot:{value:0},hoverIntensity:{value:i},backgroundColor:{value:k(r)}}}),M=new _(e,{geometry:c,program:u});function x(){if(!t)return;const a=window.devicePixelRatio||1,d=t.clientWidth,f=t.clientHeight;v.setSize(d*a,f*a),e.canvas.style.width=d+"px",e.canvas.style.height=f+"px",u.uniforms.iResolution.value.set(e.canvas.width,e.canvas.height,e.canvas.width/e.canvas.height)}window.addEventListener("resize",x),x();let p=0,C=0,b=0;const j=.3,w=a=>{const d=t.getBoundingClientRect(),f=a.clientX-d.left,F=a.clientY-d.top,I=d.width,q=d.height,A=Math.min(I,q),K=I/2,B=q/2,L=(f-K)/A*2,T=(F-B)/A*2;Math.sqrt(L*L+T*T)<.8?p=1:p=0},R=()=>{p=0};t.addEventListener("mousemove",w),t.addEventListener("mouseleave",R);let y;const z=a=>{y=requestAnimationFrame(z);const d=(a-C)*.001;C=a,u.uniforms.iTime.value=a*.001,u.uniforms.hue.value=o,u.uniforms.hoverIntensity.value=i,u.uniforms.backgroundColor.value=k(r);const f=s?1:p;u.uniforms.hover.value+=(f-u.uniforms.hover.value)*.1,n&&f>.5&&(b+=d*j),u.uniforms.rot.value=b,v.render({scene:M})};return y=requestAnimationFrame(z),()=>{var a;cancelAnimationFrame(y),window.removeEventListener("resize",x),t.removeEventListener("mousemove",w),t.removeEventListener("mouseleave",R),t.removeChild(e.canvas),(a=e.getExtension("WEBGL_lose_context"))==null||a.loseContext()}},[o,i,n,s,r]),D.jsx("div",{ref:l,className:"orb-container"})}function S(o,i,n){let s,r,l;if(i===0)s=r=l=n;else{const m=(v,e,c)=>(c<0&&(c+=1),c>1&&(c-=1),c<.16666666666666666?v+(e-v)*6*c:c<.5?e:c<.6666666666666666?v+(e-v)*(.6666666666666666-c)*6:v),h=n<.5?n*(1+i):n+i-n*i,t=2*n-h;s=m(t,h,o+1/3),r=m(t,h,o),l=m(t,h,o-1/3)}return new g(s,r,l)}function k(o){if(o.startsWith("#")){const s=parseInt(o.slice(1,3),16)/255,r=parseInt(o.slice(3,5),16)/255,l=parseInt(o.slice(5,7),16)/255;return new g(s,r,l)}const i=o.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);if(i)return new g(parseInt(i[1])/255,parseInt(i[2])/255,parseInt(i[3])/255);const n=o.match(/hsla?\((\d+),\s*(\d+)%,\s*(\d+)%/);if(n){const s=parseInt(n[1])/360,r=parseInt(n[2])/100,l=parseInt(n[3])/100;return S(s,r,l)}return new g(0,0,0)}export{W as default};
