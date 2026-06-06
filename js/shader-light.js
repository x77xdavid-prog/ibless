/* =====================================================================
   아이블레스 — 히어로 셰이더 (라이트/브랜드 톤 버전)
   원본 네온 셰이더를 밝은 배경용으로 변형:
   - 검정 배경 대신 투명 알파 → CSS의 밝은 파스텔 배경이 비쳐 보임
   - RGB 원색 대신 브랜드 컬러(주황·하늘·노랑)로 부드러운 광선
   - prefers-reduced-motion: 정지 프레임 1장 / 뷰포트 밖이면 렌더 정지
   ===================================================================== */
import * as THREE from "three";

const container = document.getElementById("heroShader");
if (container) initShader(container);

function initShader(container) {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const vertexShader = `
    void main() { gl_Position = vec4( position, 1.0 ); }
  `;

  // 밝은 배경 위에 얹는 브랜드 컬러 광선 (알파 합성)
  const fragmentShader = `
    precision highp float;
    uniform vec2 resolution;
    uniform float time;

    void main(void) {
      vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
      float t = time * 0.05;
      float lineWidth = 0.0016;

      vec3 cOrange = vec3(1.000, 0.478, 0.000);  /* #ff7a00 */
      vec3 cSky    = vec3(0.000, 0.722, 0.894);  /* #00b8e4 */
      vec3 cYellow = vec3(0.996, 0.792, 0.039);  /* #feca0a */

      vec3 col = vec3(0.0);
      float amt = 0.0;
      for (int j = 0; j < 3; j++) {
        vec3 hue = cOrange;
        if (j == 1) hue = cSky;
        else if (j == 2) hue = cYellow;

        float band = 0.0;
        for (int i = 0; i < 5; i++) {
          band += lineWidth * float(i*i) / abs(fract(t - 0.01*float(j) + float(i)*0.01)*5.0 - length(uv) + mod(uv.x+uv.y, 0.2));
        }
        col += hue * band;
        amt += band;
      }

      vec3 outColor = col / max(amt, 0.0001);            /* 색상 정규화 */
      float a = smoothstep(0.0, 0.9, clamp(amt, 0.0, 1.0)) * 0.55;  /* 부드러운 투명도 */
      gl_FragColor = vec4(outColor, a);
    }
  `;

  const camera = new THREE.Camera();
  camera.position.z = 1;

  const scene = new THREE.Scene();
  const geometry = new THREE.PlaneGeometry(2, 2);

  const uniforms = {
    time: { value: 1.0 },
    resolution: { value: new THREE.Vector2() },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
  });
  scene.add(new THREE.Mesh(geometry, material));

  // 모바일/터치(coarse pointer)에서는 DPR 1 + antialias off 로 GPU 부담 경감
  const coarse = !!(window.matchMedia && window.matchMedia("(pointer: coarse)").matches);
  const renderer = new THREE.WebGLRenderer({ antialias: !coarse, alpha: true });
  renderer.setClearColor(0x000000, 0);   // 투명 배경
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, coarse ? 1 : 1.5));
  container.appendChild(renderer.domElement);

  const resize = () => {
    const w = container.clientWidth || 1;
    const h = container.clientHeight || 1;
    renderer.setSize(w, h);
    uniforms.resolution.value.set(renderer.domElement.width, renderer.domElement.height);
  };
  resize();
  window.addEventListener("resize", resize, { passive: true });

  let running = false;
  let rafId = 0;
  let frame = 0;
  let inView = true;
  const animate = () => {
    rafId = requestAnimationFrame(animate);
    frame++;
    if (frame % 2) return;          // ~30fps 스로틀 (느린 모션이라 충분)
    uniforms.time.value += 0.1;     // 렌더 프레임이 절반이므로 속도 보정
    renderer.render(scene, camera);
  };
  const start = () => { if (!running) { running = true; animate(); } };
  const stop = () => { running = false; cancelAnimationFrame(rafId); };

  if (prefersReduced) {
    uniforms.time.value = 8.0;
    renderer.render(scene, camera);
    return;
  }

  // 탭이 백그라운드면 정지 (CPU/배터리 절약)
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else if (inView) start();
  });

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        inView = e.isIntersecting;
        if (inView && !document.hidden) start();
        else stop();
      }),
      { threshold: 0 }
    );
    io.observe(container);
  } else {
    start();
  }
}
