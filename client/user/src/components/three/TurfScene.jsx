import { useEffect, useRef } from "react";
import * as THREE from "three";

/* ---------- helpers: procedural textures ---------- */

// Mowed-stripe grass + white pitch markings, drawn on a canvas.
const makePitchTexture = () => {
  const W = 1024;
  const H = 640;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d");

  // mowed stripes
  const stripes = 10;
  for (let i = 0; i < stripes; i++) {
    g.fillStyle = i % 2 === 0 ? "#2f9e44" : "#37b24d";
    g.fillRect((W / stripes) * i, 0, W / stripes + 1, H);
  }

  // markings
  g.strokeStyle = "rgba(255,255,255,0.92)";
  g.lineWidth = 5;
  const m = 28; // margin
  g.strokeRect(m, m, W - m * 2, H - m * 2);
  g.beginPath();
  g.moveTo(W / 2, m);
  g.lineTo(W / 2, H - m);
  g.stroke();
  g.beginPath();
  g.arc(W / 2, H / 2, 70, 0, Math.PI * 2);
  g.stroke();
  g.fillStyle = "rgba(255,255,255,0.92)";
  g.beginPath();
  g.arc(W / 2, H / 2, 6, 0, Math.PI * 2);
  g.fill();

  // penalty boxes + goal boxes
  const boxW = 150;
  const boxH = 300;
  const smallW = 55;
  const smallH = 150;
  g.strokeRect(m, (H - boxH) / 2, boxW, boxH);
  g.strokeRect(W - m - boxW, (H - boxH) / 2, boxW, boxH);
  g.strokeRect(m, (H - smallH) / 2, smallW, smallH);
  g.strokeRect(W - m - smallW, (H - smallH) / 2, smallW, smallH);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
};

// Football pattern: white ball with dark pentagon patches.
const makeBall = () => {
  const geo = new THREE.IcosahedronGeometry(0.34, 2).toNonIndexed();
  const pos = geo.attributes.position;
  const colors = [];

  // 12 icosahedron vertex directions = pentagon centres
  const t = (1 + Math.sqrt(5)) / 2;
  const dirs = [
    [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
    [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
    [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
  ].map((d) => new THREE.Vector3(...d).normalize());

  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const cc = new THREE.Vector3();
  const centroid = new THREE.Vector3();
  const dark = new THREE.Color("#16181d");
  const light = new THREE.Color("#fafafa");

  for (let i = 0; i < pos.count; i += 3) {
    a.fromBufferAttribute(pos, i);
    b.fromBufferAttribute(pos, i + 1);
    cc.fromBufferAttribute(pos, i + 2);
    centroid.copy(a).add(b).add(cc).normalize();
    const isDark = dirs.some((d) => d.dot(centroid) > 0.9);
    const col = isDark ? dark : light;
    for (let k = 0; k < 3; k++) colors.push(col.r, col.g, col.b);
  }
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geo.computeVertexNormals();

  const mesh = new THREE.Mesh(
    geo,
    new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.45,
      metalness: 0.05,
      flatShading: true,
    })
  );
  mesh.castShadow = true;
  return mesh;
};

// Goal: posts + crossbar + translucent net.
const makeGoal = () => {
  const goal = new THREE.Group();
  const white = new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.3 });
  const w = 1.5; // width
  const h = 0.8; // height
  const d = 0.6; // depth
  const r = 0.035;

  const post = (x, y, z, len, rotZ = 0, rotX = 0) => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 12), white);
    m.position.set(x, y, z);
    m.rotation.z = rotZ;
    m.rotation.x = rotX;
    m.castShadow = true;
    goal.add(m);
  };

  post(-w / 2, h / 2, 0, h);
  post(w / 2, h / 2, 0, h);
  post(0, h, 0, w, Math.PI / 2);
  // back supports
  post(-w / 2, h / 2, -d, h);
  post(w / 2, h / 2, -d, h);
  post(0, h, -d, w, Math.PI / 2);
  post(-w / 2, h, -d / 2, d, 0, Math.PI / 2);
  post(w / 2, h, -d / 2, d, 0, Math.PI / 2);

  const net = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    new THREE.MeshBasicMaterial({
      color: "#ffffff",
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    })
  );
  net.position.set(0, h / 2, -d / 2);
  goal.add(net);
  return goal;
};

// Floodlight pole with a glowing lamp head.
const makeFloodlight = () => {
  const g = new THREE.Group();
  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.06, 2.2, 10),
    new THREE.MeshStandardMaterial({ color: "#495057", metalness: 0.6, roughness: 0.4 })
  );
  pole.position.y = 1.1;
  pole.castShadow = true;
  g.add(pole);

  const head = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.28, 0.1),
    new THREE.MeshStandardMaterial({
      color: "#fff3bf",
      emissive: "#ffe066",
      emissiveIntensity: 1.4,
    })
  );
  head.position.y = 2.25;
  g.add(head);
  return g;
};

/* ---------- component ---------- */

const TurfScene = ({ className = "" }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);

    // lights
    scene.add(new THREE.HemisphereLight("#d0ebff", "#2b8a3e", 0.85));
    const sun = new THREE.DirectionalLight("#fff9db", 2.1);
    sun.position.set(4, 7, 3);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.left = -5;
    sun.shadow.camera.right = 5;
    sun.shadow.camera.top = 5;
    sun.shadow.camera.bottom = -5;
    sun.shadow.bias = -0.0005;
    scene.add(sun);

    // whole model lives in one group so we can rotate/tilt it together
    const model = new THREE.Group();
    scene.add(model);

    // pitch slab (turf top + soil sides)
    const pitchW = 6.4;
    const pitchD = 4;
    const slabH = 0.28;
    const pitchTex = makePitchTexture();
    const top = new THREE.MeshStandardMaterial({ map: pitchTex, roughness: 0.95 });
    const side = new THREE.MeshStandardMaterial({ color: "#5c3d2e", roughness: 1 });
    const slab = new THREE.Mesh(new THREE.BoxGeometry(pitchW, slabH, pitchD), [
      side, side, top, side, side, side,
    ]);
    slab.position.y = -slabH / 2;
    slab.receiveShadow = true;
    model.add(slab);

    // border / kerb
    const kerb = new THREE.Mesh(
      new THREE.BoxGeometry(pitchW + 0.18, 0.06, pitchD + 0.18),
      new THREE.MeshStandardMaterial({ color: "#e9ecef", roughness: 0.6 })
    );
    kerb.position.y = -slabH - 0.02;
    model.add(kerb);

    // goals
    const goalL = makeGoal();
    goalL.position.set(-pitchW / 2 + 0.2, 0, 0);
    goalL.rotation.y = Math.PI / 2;
    const goalR = makeGoal();
    goalR.position.set(pitchW / 2 - 0.2, 0, 0);
    goalR.rotation.y = -Math.PI / 2;
    model.add(goalL, goalR);

    // floodlights on the four corners
    [
      [-1, -1],
      [1, -1],
      [-1, 1],
      [1, 1],
    ].forEach(([sx, sz]) => {
      const f = makeFloodlight();
      f.position.set(sx * (pitchW / 2 + 0.05), 0, sz * (pitchD / 2 + 0.05));
      f.lookAt(0, 1, 0);
      model.add(f);
    });

    // ball
    const ball = makeBall();
    ball.position.set(0, 0.34, 0);
    model.add(ball);

    // ball shadow blob
    const blob = new THREE.Mesh(
      new THREE.CircleGeometry(0.3, 24),
      new THREE.MeshBasicMaterial({ color: "#000", transparent: true, opacity: 0.25 })
    );
    blob.rotation.x = -Math.PI / 2;
    blob.position.y = 0.005;
    model.add(blob);

    // sizing
    const resize = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      // pull back on narrow (mobile) screens so the pitch fits
      const dist = w < 480 ? 14.5 : w < 900 ? 12.5 : 10.5;
      camera.position.set(0, dist * 0.52, dist);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    // mouse parallax
    const target = { x: 0, y: 0 };
    const onMove = (e) => {
      const rect = mount.getBoundingClientRect();
      target.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      target.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    const onLeave = () => {
      target.x = 0;
      target.y = 0;
    };
    mount.addEventListener("pointermove", onMove);
    mount.addEventListener("pointerleave", onLeave);

    // only animate while visible
    let visible = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    io.observe(mount);

    // loop
    const clock = new THREE.Clock();
    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (!visible) return;
      const t = clock.getElapsedTime();

      if (!reduceMotion) {
        // slow auto-rotate + parallax tilt
        model.rotation.y = Math.sin(t * 0.25) * 0.55 + target.x * 0.35;
        model.rotation.x = target.y * 0.12;

        // ball: roll along the pitch and bounce
        const bx = Math.sin(t * 0.8) * 2.2;
        const bz = Math.cos(t * 0.55) * 1.0;
        const bounce = Math.abs(Math.sin(t * 2.6)) * 0.55;
        ball.position.set(bx, 0.34 + bounce, bz);
        ball.rotation.x += 0.05;
        ball.rotation.z += 0.03;
        blob.position.set(bx, 0.006, bz);
        const s = 1 - bounce * 0.5;
        blob.scale.set(s, s, s);
        blob.material.opacity = 0.28 - bounce * 0.25;
      }
      renderer.render(scene, camera);
    };
    animate();

    // cleanup
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      mount.removeEventListener("pointermove", onMove);
      mount.removeEventListener("pointerleave", onLeave);
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          (Array.isArray(obj.material) ? obj.material : [obj.material]).forEach(
            (m) => {
              if (m.map) m.map.dispose();
              m.dispose();
            }
          );
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`w-full h-full ${className}`}
      role="img"
      aria-label="Interactive 3D model of a football turf with goals, floodlights and a bouncing ball"
    />
  );
};

export default TurfScene;
