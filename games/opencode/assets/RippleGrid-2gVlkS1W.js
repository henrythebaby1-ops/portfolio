import{r as u,R as W,T as N,P as j,M as H,j as q}from"./index-tDOHgNLd.js";const $=({enableRainbow:v=!1,gridColor:f="#ffffff",rippleIntensity:m=.05,gridSize:d=10,gridThickness:p=15,fadeDistance:g=1.5,vignetteStrength:h=2,glowIntensity:x=.1,opacity:R=1,gridRotation:y=0,mouseInteraction:r=!0,mouseInteractionRadius:I=1,lightMode:w=!1})=>{const i=u.useRef(null),l=u.useRef({x:.5,y:.5}),T=u.useRef({x:.5,y:.5}),b=u.useRef(0),t=u.useRef(null);return u.useEffect(()=>{if(!i.current)return;const E=o=>{const n=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(o);return n?[parseInt(n[1],16)/255,parseInt(n[2],16)/255,parseInt(n[3],16)/255]:[1,1,1]},c=new W({dpr:Math.min(window.devicePixelRatio,2),alpha:!0}),e=c.gl;e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA),e.canvas.style.width="100%",e.canvas.style.height="100%",i.current.appendChild(e.canvas);const D=`
attribute vec2 position;
varying vec2 vUv;
void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
}`,_=`precision highp float;
uniform float iTime;
uniform vec2 iResolution;
uniform bool enableRainbow;
uniform vec3 gridColor;
uniform float rippleIntensity;
uniform float gridSize;
uniform float gridThickness;
uniform float fadeDistance;
uniform float vignetteStrength;
uniform float glowIntensity;
uniform float opacity;
uniform float gridRotation;
uniform bool mouseInteraction;
uniform vec2 mousePosition;
uniform float mouseInfluence;
uniform float mouseInteractionRadius;
uniform bool lightMode;
varying vec2 vUv;

float pi = 3.141592;

mat2 rotate(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c);
}

void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    uv.x *= iResolution.x / iResolution.y;

    if (gridRotation != 0.0) {
        uv = rotate(gridRotation * pi / 180.0) * uv;
    }

    float dist = length(uv);
    float func = sin(pi * (iTime - dist));
    vec2 rippleUv = uv + uv * func * rippleIntensity;

    if (mouseInteraction && mouseInfluence > 0.0) {
        vec2 mouseUv = (mousePosition * 2.0 - 1.0);
        mouseUv.x *= iResolution.x / iResolution.y;
        float mouseDist = length(uv - mouseUv);
        
        float influence = mouseInfluence * exp(-mouseDist * mouseDist / (mouseInteractionRadius * mouseInteractionRadius));
        
        float mouseWave = sin(pi * (iTime * 2.0 - mouseDist * 3.0)) * influence;
        rippleUv += normalize(uv - mouseUv) * mouseWave * rippleIntensity * 0.3;
    }

    vec2 a = sin(gridSize * 0.5 * pi * rippleUv - pi / 2.0);
    vec2 b = abs(a);

    float aaWidth = 0.5;
    vec2 smoothB = vec2(
        smoothstep(0.0, aaWidth, b.x),
        smoothstep(0.0, aaWidth, b.y)
    );

    vec3 color = vec3(0.0);
    color += exp(-gridThickness * smoothB.x * (0.8 + 0.5 * sin(pi * iTime)));
    color += exp(-gridThickness * smoothB.y);
    color += 0.5 * exp(-(gridThickness / 4.0) * sin(smoothB.x));
    color += 0.5 * exp(-(gridThickness / 3.0) * smoothB.y);

    if (glowIntensity > 0.0) {
        color += glowIntensity * exp(-gridThickness * 0.5 * smoothB.x);
        color += glowIntensity * exp(-gridThickness * 0.5 * smoothB.y);
    }

    float ddd = exp(-2.0 * clamp(pow(dist, fadeDistance), 0.0, 1.0));
    
    vec2 vignetteCoords = vUv - 0.5;
    float vignetteDistance = length(vignetteCoords);
    float vignette = 1.0 - pow(vignetteDistance * 2.0, vignetteStrength);
    vignette = clamp(vignette, 0.0, 1.0);
    
    vec3 t;
    if (enableRainbow) {
        t = vec3(
            uv.x * 0.5 + 0.5 * sin(iTime),
            uv.y * 0.5 + 0.5 * cos(iTime),
            pow(cos(iTime), 4.0)
        ) + 0.5;
    } else {
        t = gridColor;
    }

    float finalFade = ddd * vignette;
    float alpha = length(color) * finalFade * opacity;
    vec3 effect = color * t * finalFade * opacity;
    if (lightMode) {
        float peak = max(effect.r, max(effect.g, effect.b));
        vec3 chroma = pow(clamp(effect / max(peak, 0.0001), 0.0, 1.0), vec3(1.2));
        gl_FragColor = vec4(mix(vec3(1.0), chroma, clamp(alpha * 0.94, 0.0, 0.94)), 1.0);
    } else {
        gl_FragColor = vec4(effect, alpha);
    }
}`,s={iTime:{value:0},iResolution:{value:[1,1]},enableRainbow:{value:v},gridColor:{value:E(f)},rippleIntensity:{value:m},gridSize:{value:d},gridThickness:{value:p},fadeDistance:{value:g},vignetteStrength:{value:h},glowIntensity:{value:x},opacity:{value:R},gridRotation:{value:y},mouseInteraction:{value:r},mousePosition:{value:[.5,.5]},mouseInfluence:{value:0},mouseInteractionRadius:{value:I},lightMode:{value:w}};t.current=s;const S=new N(e),z=new j(e,{vertex:D,fragment:_,uniforms:s}),A=new H(e,{geometry:S,program:z}),L=()=>{const{clientWidth:o,clientHeight:n}=i.current;c.setSize(o,n),s.iResolution.value=[o,n]},M=o=>{if(!r||!i.current)return;const n=i.current.getBoundingClientRect(),C=(o.clientX-n.left)/n.width,F=1-(o.clientY-n.top)/n.height;T.current={x:C,y:F}},P=()=>{r&&(b.current=1)},B=()=>{r&&(b.current=0)};window.addEventListener("resize",L),r&&(i.current.addEventListener("mousemove",M),i.current.addEventListener("mouseenter",P),i.current.addEventListener("mouseleave",B)),L();let U;const k=o=>{s.iTime.value=o*.001;const n=.1;l.current.x+=(T.current.x-l.current.x)*n,l.current.y+=(T.current.y-l.current.y)*n;const C=s.mouseInfluence.value,F=b.current;s.mouseInfluence.value+=(F-C)*.05,s.mousePosition.value=[l.current.x,l.current.y],c.render({scene:A}),U=requestAnimationFrame(k)};U=requestAnimationFrame(k);const a=i.current;return()=>{var o;cancelAnimationFrame(U),window.removeEventListener("resize",L),r&&a&&(a.removeEventListener("mousemove",M),a.removeEventListener("mouseenter",P),a.removeEventListener("mouseleave",B)),(o=c.gl.getExtension("WEBGL_lose_context"))==null||o.loseContext(),a==null||a.removeChild(e.canvas)}},[]),u.useEffect(()=>{if(!t.current)return;const E=c=>{const e=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(c);return e?[parseInt(e[1],16)/255,parseInt(e[2],16)/255,parseInt(e[3],16)/255]:[1,1,1]};t.current.enableRainbow.value=v,t.current.gridColor.value=E(f),t.current.rippleIntensity.value=m,t.current.gridSize.value=d,t.current.gridThickness.value=p,t.current.fadeDistance.value=g,t.current.vignetteStrength.value=h,t.current.glowIntensity.value=x,t.current.opacity.value=R,t.current.gridRotation.value=y,t.current.mouseInteraction.value=r,t.current.mouseInteractionRadius.value=I,t.current.lightMode.value=w},[v,f,m,d,p,g,h,x,R,y,r,I,w]),q.jsx("div",{ref:i,className:"ripple-grid-container"})};export{$ as default};
