import{r as v,R as L,T as F,P as I,C as A,M as S,j as T}from"./index-tDOHgNLd.js";const N=`
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`,O=`
precision highp float;

uniform float iTime;
uniform vec3 iResolution;
uniform vec3 uColor;
uniform float uAmplitude;
uniform float uDistance;
uniform vec2 uMouse;

#define PI 3.1415926538

const int u_line_count = 40;
const float u_line_width = 7.0;
const float u_line_blur = 10.0;

float Perlin2D(vec2 P) {
    vec2 Pi = floor(P);
    vec4 Pf_Pfmin1 = P.xyxy - vec4(Pi, Pi + 1.0);
    vec4 Pt = vec4(Pi.xy, Pi.xy + 1.0);
    Pt = Pt - floor(Pt * (1.0 / 71.0)) * 71.0;
    Pt += vec2(26.0, 161.0).xyxy;
    Pt *= Pt;
    Pt = Pt.xzxz * Pt.yyww;
    vec4 hash_x = fract(Pt * (1.0 / 951.135664));
    vec4 hash_y = fract(Pt * (1.0 / 642.949883));
    vec4 grad_x = hash_x - 0.49999;
    vec4 grad_y = hash_y - 0.49999;
    vec4 grad_results = inversesqrt(grad_x * grad_x + grad_y * grad_y)
        * (grad_x * Pf_Pfmin1.xzxz + grad_y * Pf_Pfmin1.yyww);
    grad_results *= 1.4142135623730950;
    vec2 blend = Pf_Pfmin1.xy * Pf_Pfmin1.xy * Pf_Pfmin1.xy
               * (Pf_Pfmin1.xy * (Pf_Pfmin1.xy * 6.0 - 15.0) + 10.0);
    vec4 blend2 = vec4(blend, vec2(1.0 - blend));
    return dot(grad_results, blend2.zxzx * blend2.wwyy);
}

float pixel(float count, vec2 resolution) {
    return (1.0 / max(resolution.x, resolution.y)) * count;
}

float lineFn(vec2 st, float width, float perc, float offset, vec2 mouse, float time, float amplitude, float distance) {
    float split_offset = (perc * 0.4);
    float split_point = 0.1 + split_offset;

    float amplitude_normal = smoothstep(split_point, 0.7, st.x);
    float amplitude_strength = 0.5;
    float finalAmplitude = amplitude_normal * amplitude_strength
                           * amplitude * (1.0 + (mouse.y - 0.5) * 0.2);

    float time_scaled = time / 10.0 + (mouse.x - 0.5) * 1.0;
    float blur = smoothstep(split_point, split_point + 0.05, st.x) * perc;

    float xnoise = mix(
        Perlin2D(vec2(time_scaled, st.x + perc) * 2.5),
        Perlin2D(vec2(time_scaled, st.x + time_scaled) * 3.5) / 1.5,
        st.x * 0.3
    );

    float y = 0.5 + (perc - 0.5) * distance + xnoise / 2.0 * finalAmplitude;

    float line_start = smoothstep(
        y + (width / 2.0) + (u_line_blur * pixel(1.0, iResolution.xy) * blur),
        y,
        st.y
    );

    float line_end = smoothstep(
        y,
        y - (width / 2.0) - (u_line_blur * pixel(1.0, iResolution.xy) * blur),
        st.y
    );

    return clamp(
        (line_start - line_end) * (1.0 - smoothstep(0.0, 1.0, pow(perc, 0.3))),
        0.0,
        1.0
    );
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;

    float line_strength = 1.0;
    for (int i = 0; i < u_line_count; i++) {
        float p = float(i) / float(u_line_count);
        line_strength *= (1.0 - lineFn(
            uv,
            u_line_width * pixel(1.0, iResolution.xy) * (1.0 - p),
            p,
            (PI * 1.0) * p,
            uMouse,
            iTime,
            uAmplitude,
            uDistance
        ));
    }

    float colorVal = 1.0 - line_strength;
    fragColor = vec4(uColor * colorVal, colorVal);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
`,q=({color:_=[1,1,1],amplitude:p=1,distance:h=0,enableMouseInteraction:x=!1,...E})=>{const g=v.useRef(null),u=v.useRef(0),l=v.useRef({color:_,amplitude:p,distance:h,enableMouseInteraction:x});return l.current={color:_,amplitude:p,distance:h,enableMouseInteraction:x},v.useEffect(()=>{const t=g.current;if(!t)return;const c=new L({alpha:!0}),e=c.gl;e.clearColor(0,0,0,0),e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA),t.appendChild(e.canvas);const z=new F(e),n=new I(e,{vertex:N,fragment:O,uniforms:{iTime:{value:0},iResolution:{value:new A(e.canvas.width,e.canvas.height,e.canvas.width/e.canvas.height)},uColor:{value:new A(...l.current.color)},uAmplitude:{value:l.current.amplitude},uDistance:{value:l.current.distance},uMouse:{value:new Float32Array([.5,.5])}}}),D=new S(e,{geometry:z,program:n}),P=1920;function f(){const{clientWidth:o,clientHeight:i}=t,s=Math.min(window.devicePixelRatio||1,2),a=Math.max(o,i)*s,d=a>P?s*P/a:s;c.dpr=d,c.setSize(o,i),n.uniforms.iResolution.value.r=e.canvas.width,n.uniforms.iResolution.value.g=e.canvas.height,n.uniforms.iResolution.value.b=e.canvas.width/e.canvas.height}const y=new ResizeObserver(f);y.observe(t),window.addEventListener("resize",f),f();const r=[.5,.5];let m=[.5,.5];function w(o){const i=t.getBoundingClientRect(),s=(o.clientX-i.left)/i.width,a=1-(o.clientY-i.top)/i.height;m=[s,a]}function b(){m=[.5,.5]}t.addEventListener("mousemove",w),t.addEventListener("mouseleave",b);let R=!0;const M=new IntersectionObserver(o=>{R=o[0].isIntersecting},{threshold:0});M.observe(t);function C(o){if(u.current=requestAnimationFrame(C),!R||document.hidden)return;const{color:i,amplitude:s,distance:a,enableMouseInteraction:d}=l.current;n.uniforms.uColor.value.set(...i),n.uniforms.uAmplitude.value=s,n.uniforms.uDistance.value=a,d?(r[0]+=.05*(m[0]-r[0]),r[1]+=.05*(m[1]-r[1]),n.uniforms.uMouse.value[0]=r[0],n.uniforms.uMouse.value[1]=r[1]):(n.uniforms.uMouse.value[0]=.5,n.uniforms.uMouse.value[1]=.5),n.uniforms.iTime.value=o*.001,c.render({scene:D})}return u.current=requestAnimationFrame(C),()=>{var o;u.current&&cancelAnimationFrame(u.current),y.disconnect(),M.disconnect(),window.removeEventListener("resize",f),t.removeEventListener("mousemove",w),t.removeEventListener("mouseleave",b),t.contains(e.canvas)&&t.removeChild(e.canvas),(o=e.getExtension("WEBGL_lose_context"))==null||o.loseContext()}},[]),T.jsx("div",{ref:g,className:"threads-container",...E})};export{q as default};
