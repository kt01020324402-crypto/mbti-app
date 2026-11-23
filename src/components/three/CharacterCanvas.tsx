"use client";

import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import type { MbtiTypeCode } from "@/data/types";
import MbtiCharacter from "./MbtiCharacter";

// 선택한 MBTI 유형에 맞는 3D 캐릭터와 조명·그림자·회전 컨트롤을 묶은 캔버스입니다.
export default function CharacterCanvas({
  typeCode,
}: {
  typeCode: MbtiTypeCode;
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true }}
      camera={{ position: [0, 0.34, 3.45], fov: 40 }}
      style={{ background: "transparent" }}
    >
      {/* 외부 HDR 환경맵 없이 코드로 만든 부드러운 조명만 사용합니다 */}
      <ambientLight intensity={0.85} />
      <hemisphereLight args={["#fff8f0", "#d8e8e2", 0.7]} />
      <directionalLight position={[3, 5, 4]} intensity={1.1} />
      <directionalLight position={[-3, 2, -2]} intensity={0.45} color="#e0f7fa" />

      {/* 전달받은 유형 코드에 따라 16가지 동물 중 하나를 그립니다 */}
      <MbtiCharacter typeCode={typeCode} />

      {/* 캐릭터 아래에 떨어지는 부드러운 바닥 그림자 (모바일 성능을 위해 해상도를 가볍게 유지) */}
      <ContactShadows
        position={[0, -0.95, 0]}
        opacity={0.35}
        scale={3.5}
        blur={2.2}
        far={2.5}
        resolution={128}
        color="#2d4a3e"
      />

      {/* 마우스 끌기·손가락 밀기로 회전만 가능하고, 확대/축소와 이동은 막습니다 */}
      <OrbitControls
        target={[0, 0.25, 0]}
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.85}
      />
    </Canvas>
  );
}
