"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { Suspense, useEffect } from "react";
import * as THREE from "three";

function BlenderScene() {
  const { scene, cameras, animations } = useGLTF("/3dassets/Untitled.glb");
  const { actions } = useAnimations(animations, scene);
  const { set, size } = useThree();

  useEffect(() => {
    const blenderCamera = cameras[0] as THREE.PerspectiveCamera;
    if (blenderCamera) {
      blenderCamera.aspect = size.width / size.height;
      blenderCamera.updateProjectionMatrix();
      set({ camera: blenderCamera });
    }
  }, [cameras, set, size]);

  useEffect(() => {
    Object.values(actions).forEach((action) => action?.reset().play());
  }, [actions]);

  return <primitive object={scene} />;
}

export default function Page() {
  return (
    <div className="w-full h-screen bg-black">
      <Canvas>
        <ambientLight intensity={1} />
        <directionalLight position={[5, 5, 5]} intensity={2} />

        <Suspense fallback={null}>
          <BlenderScene />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload("/3dassets/Untitled.glb");