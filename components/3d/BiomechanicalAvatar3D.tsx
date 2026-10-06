"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useAssessment } from "@/lib/store/useAssessment";
import { sound } from "@/lib/audio/soundEffects";
import {
  RotateCcw,
  Maximize2,
  Eye,
  Activity,
  AlertTriangle,
  Zap,
  Info,
} from "lucide-react";

export interface BiomechanicalAvatar3DProps {
  className?: string;
  focusStage?: number;
  compact?: boolean;
}

interface JointData {
  id: string;
  name: string;
  category: "upper" | "lower" | "core";
  position: [number, number, number];
  painKey?: string;
  notes: string;
}

const JOINTS: JointData[] = [
  { id: "head", name: "Cranial / Cervical", category: "upper", position: [0, 2.2, 0], notes: "Cervical spine alignment & vestibular stability" },
  { id: "neck", name: "C7 Vertebral Pivot", category: "upper", position: [0, 1.85, 0], notes: "Trapezius origin & scapular elevation axis" },
  { id: "shoulder_l", name: "Left Glenohumeral", category: "upper", position: [-0.68, 1.7, 0], painKey: "Shoulders", notes: "Rotator cuff, anterior delt, horizontal abduction" },
  { id: "shoulder_r", name: "Right Glenohumeral", category: "upper", position: [0.68, 1.7, 0], painKey: "Shoulders", notes: "Rotator cuff, anterior delt, horizontal abduction" },
  { id: "elbow_l", name: "Left Olecranon", category: "upper", position: [-0.98, 1.1, 0], painKey: "Elbows", notes: "Triceps insertion, medial/lateral epicondyle" },
  { id: "elbow_r", name: "Right Olecranon", category: "upper", position: [0.98, 1.1, 0], painKey: "Elbows", notes: "Triceps insertion, medial/lateral epicondyle" },
  { id: "wrist_l", name: "Left Radiocarpal", category: "upper", position: [-1.15, 0.5, 0], painKey: "Wrists", notes: "Wrist extensors/flexors, false grip tolerance" },
  { id: "wrist_r", name: "Right Radiocarpal", category: "upper", position: [1.15, 0.5, 0], painKey: "Wrists", notes: "Wrist extensors/flexors, false grip tolerance" },
  { id: "thorax", name: "Thoracic T1-T12", category: "core", position: [0, 1.45, 0.05], notes: "Scapulothoracic glide & extension reserve" },
  { id: "lumbar", name: "Lumbar L1-L5", category: "core", position: [0, 1.05, 0.02], painKey: "Lower back", notes: "Anti-extension & pelvic brace transfer" },
  { id: "pelvis", name: "Sacroiliac / Pelvis", category: "core", position: [0, 0.75, 0], notes: "Kinetic energy transfer between core and legs" },
  { id: "hip_l", name: "Left Acetabulofemoral", category: "lower", position: [-0.38, 0.65, 0], painKey: "Hips", notes: "Hip flexion/extension, gluteus medius tracking" },
  { id: "hip_r", name: "Right Acetabulofemoral", category: "lower", position: [0.38, 0.65, 0], painKey: "Hips", notes: "Hip flexion/extension, gluteus medius tracking" },
  { id: "knee_l", name: "Left Patellofemoral", category: "lower", position: [-0.44, -0.2, 0.05], painKey: "Knees", notes: "Patellar tendon load, tibial rotation buffer" },
  { id: "knee_r", name: "Right Patellofemoral", category: "lower", position: [0.44, -0.2, 0.05], painKey: "Knees", notes: "Patellar tendon load, tibial rotation buffer" },
  { id: "ankle_l", name: "Left Talocrural", category: "lower", position: [-0.48, -1.05, 0], painKey: "Ankles", notes: "Dorsiflexion depth, Achilles stretch reserve" },
  { id: "ankle_r", name: "Right Talocrural", category: "lower", position: [0.48, -1.05, 0], painKey: "Ankles", notes: "Dorsiflexion depth, Achilles stretch reserve" },
];

const BONES: [string, string][] = [
  ["head", "neck"],
  ["neck", "thorax"],
  ["thorax", "lumbar"],
  ["lumbar", "pelvis"],
  ["neck", "shoulder_l"],
  ["neck", "shoulder_r"],
  ["shoulder_l", "elbow_l"],
  ["shoulder_r", "elbow_r"],
  ["elbow_l", "wrist_l"],
  ["elbow_r", "wrist_r"],
  ["pelvis", "hip_l"],
  ["pelvis", "hip_r"],
  ["hip_l", "knee_l"],
  ["hip_r", "knee_r"],
  ["knee_l", "ankle_l"],
  ["knee_r", "ankle_r"],
  ["shoulder_l", "thorax"],
  ["shoulder_r", "thorax"],
  ["hip_l", "lumbar"],
  ["hip_r", "lumbar"],
];

type ViewMode = "tension" | "holo" | "vectors";

export const BiomechanicalAvatar3D: React.FC<BiomechanicalAvatar3DProps> = ({
  className = "",
  focusStage,
  compact = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { data, currentStage } = useAssessment();
  const effectiveStage = focusStage ?? currentStage;

  const [viewMode, setViewMode] = useState<ViewMode>("tension");
  const [hoveredJoint, setHoveredJoint] = useState<JointData | null>(null);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [activeTooltipPos, setActiveTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // Active pain points from assessment
  const activePainList = data.s1_pain || [];

  // Scene refs to manipulate dynamically
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const rootGroupRef = useRef<THREE.Group | null>(null);
  const jointMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const boneLinesRef = useRef<THREE.LineSegments | null>(null);
  const warningRingsRef = useRef<THREE.Group | null>(null);
  const vectorArrowsRef = useRef<THREE.Group | null>(null);

  // Interaction tracking
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const rotTargetRef = useRef({ x: 0, y: 0 });
  const rotCurrentRef = useRef({ x: 0, y: 0 });
  const zoomTargetRef = useRef(compact ? 4.8 : 4.4);
  const isVisibleRef = useRef(true);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 480;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.5, zoomTargetRef.current);
    cameraRef.current = camera;

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    rendererRef.current = renderer;

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 2.5); // Sky cyan key light
    dirLight1.position.set(3, 4, 4);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x10b981, 1.8); // Emerald fill light
    dirLight2.position.set(-3, -2, 3);
    scene.add(dirLight2);

    const backLight = new THREE.DirectionalLight(0x818cf8, 1.5); // Rim light
    backLight.position.set(0, 2, -4);
    scene.add(backLight);

    // 4. Avatar Root Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);
    rootGroupRef.current = rootGroup;

    // 5. Build Bones (Kinetic Struts)
    const bonePoints: number[] = [];
    const jointMap = new Map<string, JointData>();
    JOINTS.forEach((j) => jointMap.set(j.id, j));

    BONES.forEach(([idA, idB]) => {
      const a = jointMap.get(idA);
      const b = jointMap.get(idB);
      if (a && b) {
        bonePoints.push(...a.position, ...b.position);
      }
    });

    const boneGeometry = new THREE.BufferGeometry();
    boneGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(bonePoints, 3)
    );

    const boneMaterial = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.6,
      linewidth: 2,
    });
    const boneLines = new THREE.LineSegments(boneGeometry, boneMaterial);
    rootGroup.add(boneLines);
    boneLinesRef.current = boneLines;

    // 6. Build Joint Nodes
    const jointGeometry = new THREE.SphereGeometry(0.065, 16, 16);
    const jointMeshes = new Map<string, THREE.Mesh>();

    JOINTS.forEach((joint) => {
      const jointMat = new THREE.MeshStandardMaterial({
        color: 0x0ea5e9,
        emissive: 0x0284c7,
        emissiveIntensity: 0.6,
        roughness: 0.2,
        metalness: 0.8,
      });
      const mesh = new THREE.Mesh(jointGeometry, jointMat);
      mesh.position.set(...joint.position);
      mesh.userData = { jointId: joint.id };
      rootGroup.add(mesh);
      jointMeshes.set(joint.id, mesh);
    });
    jointMeshesRef.current = jointMeshes;

    // 7. Ribcage / Core Tensegrity Ring
    const ribCurve = new THREE.EllipseCurve(0, 1.45, 0.42, 0.25, 0, 2 * Math.PI, false, 0);
    const ribPoints = ribCurve.getPoints(32).map((p) => new THREE.Vector3(p.x, p.y, 0));
    const ribGeom = new THREE.BufferGeometry().setFromPoints(ribPoints);
    const ribMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.35 });
    const ribRing = new THREE.LineLoop(ribGeom, ribMat);
    ribRing.rotation.x = Math.PI / 2;
    ribRing.position.set(0, 1.45, 0);
    rootGroup.add(ribRing);

    // Pelvic Ring
    const pelvicCurve = new THREE.EllipseCurve(0, 0.75, 0.36, 0.22, 0, 2 * Math.PI, false, 0);
    const pelvicPoints = pelvicCurve.getPoints(32).map((p) => new THREE.Vector3(p.x, p.y, 0));
    const pelvicGeom = new THREE.BufferGeometry().setFromPoints(pelvicPoints);
    const pelvicRing = new THREE.LineLoop(pelvicGeom, ribMat);
    pelvicRing.rotation.x = Math.PI / 2;
    pelvicRing.position.set(0, 0.75, 0);
    rootGroup.add(pelvicRing);

    // 8. Warning Rings Group (for highlighted pain joints)
    const warningRings = new THREE.Group();
    rootGroup.add(warningRings);
    warningRingsRef.current = warningRings;

    // 9. Force Vector Arrows Group
    const vectorArrows = new THREE.Group();
    rootGroup.add(vectorArrows);
    vectorArrowsRef.current = vectorArrows;

    // 10. Ambient Coordinate Floor Grid
    const gridHelper = new THREE.GridHelper(3.5, 14, 0x0284c7, 0x1e293b);
    gridHelper.position.y = -1.35;
    scene.add(gridHelper);

    // Resize Observer
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Visibility Observer
    const visibilityObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isVisibleRef.current = entry.isIntersecting;
      });
    });
    visibilityObserver.observe(container);

    // Render Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isVisibleRef.current) return;

      const elapsed = clock.getElapsedTime();

      // Smooth damping rotation
      if (autoRotate && !isDraggingRef.current) {
        rotTargetRef.current.y += 0.006;
      }

      rotCurrentRef.current.x += (rotTargetRef.current.x - rotCurrentRef.current.x) * 0.08;
      rotCurrentRef.current.y += (rotTargetRef.current.y - rotCurrentRef.current.y) * 0.08;

      if (rootGroupRef.current) {
        rootGroupRef.current.rotation.x = rotCurrentRef.current.x;
        rootGroupRef.current.rotation.y = rotCurrentRef.current.y;
      }

      // Smooth camera zoom
      if (cameraRef.current) {
        cameraRef.current.position.z += (zoomTargetRef.current - cameraRef.current.position.z) * 0.08;
      }

      // Subtle breathing pulse for active joints
      const pulse = Math.sin(elapsed * 4) * 0.15 + 1;
      jointMeshes.forEach((mesh) => {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (mat.emissiveIntensity > 0.5) {
          mesh.scale.set(pulse, pulse, pulse);
        }
      });

      // Animate warning rings
      if (warningRingsRef.current) {
        warningRingsRef.current.children.forEach((ring, idx) => {
          ring.rotation.z += 0.03 * (idx % 2 === 0 ? 1 : -1);
          const s = 1 + Math.sin(elapsed * 5 + idx) * 0.2;
          ring.scale.set(s, s, s);
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      renderer.dispose();
      scene.clear();
    };
  }, [compact]);

  // Update dynamic visuals when stage or pain changes
  useEffect(() => {
    if (!rootGroupRef.current || !sceneRef.current) return;

    const jointMap = jointMeshesRef.current;
    const warningGroup = warningRingsRef.current;
    const vectorGroup = vectorArrowsRef.current;

    if (warningGroup) {
      // Clear existing warning rings
      while (warningGroup.children.length > 0) {
        const child = warningGroup.children[0];
        warningGroup.remove(child);
      }
    }

    if (vectorGroup) {
      while (vectorGroup.children.length > 0) {
        const child = vectorGroup.children[0];
        vectorGroup.remove(child);
      }
    }

    const ringGeom = new THREE.RingGeometry(0.1, 0.14, 24);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });

    JOINTS.forEach((joint) => {
      const mesh = jointMap.get(joint.id);
      if (!mesh) return;

      const mat = mesh.material as THREE.MeshStandardMaterial;

      // Check if this joint has active pain flagged by user
      const hasPain =
        joint.painKey &&
        activePainList.some((p) => p.toLowerCase().includes(joint.painKey!.toLowerCase()));

      // Check if this joint is highlighted based on the current active stage
      let isStageActive = false;
      if (effectiveStage <= 3 && joint.category === "upper") {
        isStageActive = true;
      } else if ((effectiveStage === 4 || effectiveStage === 5) && joint.category === "lower") {
        isStageActive = true;
      } else if (effectiveStage >= 6) {
        isStageActive = true;
      }

      if (hasPain) {
        // Red warning glow for pain flagged joints
        mat.color.setHex(0xf43f5e);
        mat.emissive.setHex(0xe11d48);
        mat.emissiveIntensity = 1.2;
        mesh.scale.set(1.4, 1.4, 1.4);

        if (warningGroup) {
          const ringMesh = new THREE.Mesh(ringGeom, ringMat);
          ringMesh.position.set(...joint.position);
          ringMesh.lookAt(0, 0, 10);
          warningGroup.add(ringMesh);
        }
      } else if (isStageActive) {
        // Cyan/Emerald glow for stage-relevant active kinetic chains
        mat.color.setHex(0x38bdf8);
        mat.emissive.setHex(0x0284c7);
        mat.emissiveIntensity = 0.8;
        mesh.scale.set(1.15, 1.15, 1.15);
      } else {
        // Subdued zinc tone for inactive chains
        mat.color.setHex(0x64748b);
        mat.emissive.setHex(0x1e293b);
        mat.emissiveIntensity = 0.2;
        mesh.scale.set(0.9, 0.9, 0.9);
      }
    });

    // Update Bone Lines Color based on viewMode
    if (boneLinesRef.current) {
      const boneMat = boneLinesRef.current.material as THREE.LineBasicMaterial;
      if (viewMode === "holo") {
        boneMat.color.setHex(0x10b981);
        boneMat.opacity = 0.4;
      } else if (viewMode === "vectors") {
        boneMat.color.setHex(0xf59e0b);
        boneMat.opacity = 0.7;
      } else {
        boneMat.color.setHex(0x38bdf8);
        boneMat.opacity = 0.6;
      }
    }

    // Add Directional Force Vectors if in vectors mode
    if (viewMode === "vectors" && vectorGroup) {
      const arrowDirUpper = new THREE.Vector3(0, 1, 0).normalize();
      const arrowUpper = new THREE.ArrowHelper(arrowDirUpper, new THREE.Vector3(0, 1.7, 0), 0.4, 0x38bdf8, 0.12, 0.08);
      vectorGroup.add(arrowUpper);

      const arrowDirLower = new THREE.Vector3(0, -1, 0).normalize();
      const arrowLower = new THREE.ArrowHelper(arrowDirLower, new THREE.Vector3(0, 0.6, 0), 0.4, 0x10b981, 0.12, 0.08);
      vectorGroup.add(arrowLower);
    }
  }, [effectiveStage, activePainList, viewMode]);

  // Pointer drag to orbit controls
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    prevMouseRef.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !cameraRef.current) return;

    if (isDraggingRef.current) {
      const deltaX = e.clientX - prevMouseRef.current.x;
      const deltaY = e.clientY - prevMouseRef.current.y;

      rotTargetRef.current.y += deltaX * 0.008;
      rotTargetRef.current.x = Math.max(
        -Math.PI / 4,
        Math.min(Math.PI / 4, rotTargetRef.current.x + deltaY * 0.008)
      );

      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    }

    // Raycast for joint node tooltips
    const rect = canvas.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), cameraRef.current);

    const meshes = Array.from(jointMeshesRef.current.values());
    const intersects = raycaster.intersectObjects(meshes, false);

    if (intersects.length > 0) {
      const hit = intersects[0].object as THREE.Mesh;
      const jointId = hit.userData.jointId;
      const joint = JOINTS.find((j) => j.id === jointId);
      if (joint) {
        setHoveredJoint(joint);
        setActiveTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }
    } else {
      setHoveredJoint(null);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    zoomTargetRef.current = Math.max(
      2.8,
      Math.min(6.5, zoomTargetRef.current + e.deltaY * 0.003)
    );
  };

  const resetCamera = () => {
    sound.playClick();
    rotTargetRef.current = { x: 0, y: 0 };
    zoomTargetRef.current = compact ? 4.8 : 4.4;
  };

  const setViewPreset = (angle: "front" | "side" | "posterior") => {
    sound.playClick();
    if (angle === "front") rotTargetRef.current = { x: 0, y: 0 };
    if (angle === "side") rotTargetRef.current = { x: 0, y: Math.PI / 2 };
    if (angle === "posterior") rotTargetRef.current = { x: 0, y: Math.PI };
  };

  return (
    <div
      ref={containerRef}
      className={`relative select-none overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0b0d13]/90 shadow-2xl backdrop-blur-xl ${className}`}
    >
      {/* 3D WebGL Canvas */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
        className="h-full w-full cursor-grab active:cursor-grabbing touch-none"
      />

      {/* Top Telemetry Header Bar */}
      <div className="pointer-events-none absolute left-3 right-3 top-3 flex items-center justify-between">
        <div className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-black/60 px-2.5 py-1 backdrop-blur-md">
          <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-cyan-300">
            KINESIOLOGY 3D // STAGE {effectiveStage}
          </span>
        </div>

        {/* Active Pain Alert Pill */}
        {activePainList.length > 0 && (
          <div className="pointer-events-auto flex items-center gap-1.5 rounded-lg border border-rose-500/40 bg-rose-950/60 px-2 py-0.5 text-[10px] font-semibold text-rose-300 backdrop-blur-md">
            <AlertTriangle className="h-3 w-3 text-rose-400" />
            <span>{activePainList.length} Flagged Joint{activePainList.length > 1 ? "s" : ""}</span>
          </div>
        )}
      </div>

      {/* Hover Joint Tooltip */}
      {hoveredJoint && activeTooltipPos && (
        <div
          className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-full transform rounded-xl border border-cyan-400/50 bg-black/85 p-2.5 shadow-xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150"
          style={{
            left: `${activeTooltipPos.x}px`,
            top: `${activeTooltipPos.y - 12}px`,
            minWidth: "160px",
            maxWidth: "220px",
          }}
        >
          <div className="flex items-center justify-between gap-2 border-b border-white/[0.08] pb-1 mb-1">
            <span className="font-mono text-[11px] font-bold text-cyan-300">
              {hoveredJoint.name}
            </span>
            <span className="rounded bg-cyan-500/20 px-1 py-0.2 text-[9px] uppercase font-mono text-cyan-200">
              {hoveredJoint.category}
            </span>
          </div>
          <p className="text-[10px] text-zinc-300 leading-tight">
            {hoveredJoint.notes}
          </p>
          {hoveredJoint.painKey && activePainList.some((p) => p.toLowerCase().includes(hoveredJoint.painKey!.toLowerCase())) && (
            <div className="mt-1.5 flex items-center gap-1 text-[10px] font-bold text-rose-400">
              <AlertTriangle className="h-3 w-3 shrink-0" />
              <span>Contraindication Active</span>
            </div>
          )}
        </div>
      )}

      {/* Bottom Floating Control Bar */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
        {/* Mode Switcher */}
        <div className="flex items-center gap-1 rounded-xl border border-white/[0.08] bg-black/70 p-1 backdrop-blur-md">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setViewMode("tension");
            }}
            className={`rounded-lg px-2 py-1 font-mono text-[10px] font-semibold transition-all ${
              viewMode === "tension"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
            title="Biotensegrity kinetic tension network"
          >
            Tension
          </button>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setViewMode("holo");
            }}
            className={`rounded-lg px-2 py-1 font-mono text-[10px] font-semibold transition-all ${
              viewMode === "holo"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
            title="Holographic scan mode"
          >
            Holo
          </button>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setViewMode("vectors");
            }}
            className={`rounded-lg px-2 py-1 font-mono text-[10px] font-semibold transition-all ${
              viewMode === "vectors"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
            title="Directional force vectors"
          >
            Vectors
          </button>
        </div>

        {/* Orbit & Preset Controls */}
        <div className="flex items-center gap-1 rounded-xl border border-white/[0.08] bg-black/70 p-1 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setViewPreset("front")}
            className="rounded-lg px-1.5 py-1 text-[10px] font-mono text-zinc-400 hover:text-zinc-100"
            title="Frontal view"
          >
            F
          </button>
          <button
            type="button"
            onClick={() => setViewPreset("side")}
            className="rounded-lg px-1.5 py-1 text-[10px] font-mono text-zinc-400 hover:text-zinc-100"
            title="Sagittal side view"
          >
            S
          </button>
          <button
            type="button"
            onClick={() => setViewPreset("posterior")}
            className="rounded-lg px-1.5 py-1 text-[10px] font-mono text-zinc-400 hover:text-zinc-100"
            title="Posterior back view"
          >
            P
          </button>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setAutoRotate(!autoRotate);
            }}
            className={`rounded-lg p-1 transition-all ${
              autoRotate ? "text-cyan-400 bg-cyan-950/30" : "text-zinc-500 hover:text-zinc-200"
            }`}
            title={autoRotate ? "Pause 360° Auto-Orbit" : "Enable 360° Auto-Orbit"}
          >
            <Activity className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={resetCamera}
            className="rounded-lg p-1 text-zinc-400 hover:text-zinc-100"
            title="Reset Camera Target"
          >
            <RotateCcw className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BiomechanicalAvatar3D;
