"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { MBTI_TYPES, type MbtiTypeCode } from "@/data/types";

// 동물 종류를 구분하기 위한 타입입니다.
type AnimalKind =
  | "owl"
  | "cat"
  | "lion"
  | "fox"
  | "deer"
  | "rabbit"
  | "dog"
  | "squirrel"
  | "turtle"
  | "bear"
  | "penguin"
  | "sheep"
  | "hedgehog"
  | "panda"
  | "monkey"
  | "parrot";

// 유형 코드에 맞는 동물 종류와 3D 색상을 정해 주는 설정표입니다.
const ANIMAL_STYLE: Record<
  MbtiTypeCode,
  { kind: AnimalKind; main: string; sub: string; accent: string }
> = {
  INTJ: { kind: "owl", main: "#8F82B8", sub: "#EFE9FA", accent: "#F2B84B" },
  INTP: { kind: "cat", main: "#B8DDF2", sub: "#FFFFFF", accent: "#F4A4B8" },
  ENTJ: { kind: "lion", main: "#F2B772", sub: "#FFF2DC", accent: "#C97A3E" },
  ENTP: { kind: "fox", main: "#F4975C", sub: "#FFF5EB", accent: "#E36B39" },
  INFJ: { kind: "deer", main: "#C9A27E", sub: "#FAF3EB", accent: "#8C6345" },
  INFP: { kind: "rabbit", main: "#FAD4E4", sub: "#FFF7FA", accent: "#F59BB8" },
  ENFJ: { kind: "dog", main: "#F2C679", sub: "#FFF6E5", accent: "#C78A44" },
  ENFP: { kind: "squirrel", main: "#E59866", sub: "#FFF0E0", accent: "#C46D3B" },
  ISTJ: { kind: "turtle", main: "#9CC9B0", sub: "#EAF7EF", accent: "#5E9178" },
  ISFJ: { kind: "bear", main: "#D8A47F", sub: "#FFF2E2", accent: "#F7B2B7" },
  ESTJ: { kind: "penguin", main: "#394659", sub: "#FFFFFF", accent: "#F6AE47" },
  ESFJ: { kind: "sheep", main: "#FFF8F5", sub: "#F5D0DE", accent: "#E8A6BF" },
  ISTP: { kind: "hedgehog", main: "#B8ADA0", sub: "#FBF7F2", accent: "#6F645B" },
  ISFP: { kind: "panda", main: "#FFFFFF", sub: "#2B2D36", accent: "#A3D9A5" },
  ESTP: { kind: "monkey", main: "#C88A55", sub: "#FCE3C5", accent: "#9C6134" },
  ESFP: { kind: "parrot", main: "#FF7B72", sub: "#FFE36E", accent: "#4CC9F0" },
};

// 유형 코드를 받아 16가지 동물 중 하나를 그리는 공통 3D 캐릭터 컴포넌트입니다.
export default function MbtiCharacter({
  typeCode,
}: {
  typeCode: MbtiTypeCode;
}) {
  const rootRef = useRef<Group>(null);
  const headRef = useRef<Group>(null);
  const leftEyeRef = useRef<Group>(null);
  const rightEyeRef = useRef<Group>(null);
  const tailRef = useRef<Group>(null);

  // 캐릭터를 눌렀을 때(탭했을 때) 폴짝 뛰어오르는 애니메이션 제어용 참조입니다.
  const jumpRequestedRef = useRef(false);
  const jumpStartRef = useRef<number | null>(null);

  const style = ANIMAL_STYLE[typeCode] ?? ANIMAL_STYLE.ISFJ;
  const { kind, main, sub, accent } = style;
  const typeInfo = MBTI_TYPES[typeCode];
  const baseColor = main || typeInfo.color;

  // 매 프레임마다 숨쉬기, 눈 깜빡임, 유형별 개성 움직임, 클릭 점프를 계산합니다.
  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // 1) 기본 숨쉬기 (살짝 커졌다 작아지기)
    const breath = 1 + Math.sin(t * 2.2) * 0.02;

    // 2) 유형별 개성 움직임 계산
    let offsetY = Math.sin(t * 1.6) * 0.05;
    let rotZ = 0;
    let rotY = 0;
    let headNod = 0;

    if (typeCode === "ENFP") {
      // 다람쥐: 신나게 통통 튀기
      offsetY = Math.abs(Math.sin(t * 3.6)) * 0.14;
    } else if (typeCode === "ISTJ") {
      // 거북이: 천천히 고개 끄덕이기
      offsetY = Math.sin(t * 1.1) * 0.025;
      headNod = Math.sin(t * 1.5) * 0.08;
    } else if (typeCode === "ESFP") {
      // 앵무새: 좌우로 흔들며 춤추기
      rotZ = Math.sin(t * 3.2) * 0.09;
      offsetY = Math.abs(Math.sin(t * 3.2)) * 0.07;
    } else if (typeCode === "ESTJ") {
      // 펭귄: 뒤뚱뒤뚱 리듬감 있는 좌우 흔들림
      rotZ = Math.sin(t * 2.8) * 0.07;
    } else if (typeCode === "INTJ" || typeCode === "INTP") {
      // 부엉이·고양이: 고개를 살짝 갸웃하기
      rotZ = Math.sin(t * 1.3) * 0.05;
    } else if (typeCode === "ISTP") {
      // 고슴도치: 차분하게 좌우 살피기
      rotY = Math.sin(t * 1.2) * 0.12;
    } else if (typeCode === "ESTP") {
      // 원숭이: 활기차게 들썩이기
      offsetY = Math.abs(Math.sin(t * 3.0)) * 0.1;
      rotZ = Math.sin(t * 2.5) * 0.06;
    } else if (typeCode === "INFP" || typeCode === "ISFP") {
      // 토끼·판다: 부드럽게 좌우로 흔들거리기
      rotZ = Math.sin(t * 1.5) * 0.05;
    }

    // 3) 클릭(탭)했을 때 폴짝 뛰어오르는 점프 계산
    if (jumpRequestedRef.current) {
      jumpStartRef.current = t;
      jumpRequestedRef.current = false;
    }

    let jumpY = 0;
    if (jumpStartRef.current !== null) {
      const elapsed = t - jumpStartRef.current;
      const duration = 0.55;
      if (elapsed < duration) {
        // 포물선 모양으로 부드럽게 튀어 올랐다가 내려옵니다.
        const progress = elapsed / duration;
        jumpY = Math.sin(progress * Math.PI) * 0.48;
      } else {
        jumpStartRef.current = null;
      }
    }

    if (rootRef.current) {
      rootRef.current.position.y = offsetY + jumpY;
      rootRef.current.rotation.z = rotZ;
      rootRef.current.rotation.y = rotY;
      rootRef.current.scale.setScalar(breath);
    }

    if (headRef.current) {
      headRef.current.rotation.x = headNod;
    }

    // 4) 꼬리 흔들기 (고양이, 강아지, 여우, 원숭이 등)
    if (tailRef.current) {
      const tailSpeed = kind === "dog" ? 7 : 3;
      tailRef.current.rotation.z = Math.sin(t * tailSpeed) * 0.22;
    }

    // 5) 3.5초 주기로 눈 깜빡이기
    const cycle = t % 3.5;
    const blinkScaleY =
      cycle > 3.25 && cycle < 3.42
        ? Math.max(0.1, Math.abs(Math.cos(((cycle - 3.25) / 0.17) * Math.PI)))
        : 1;

    if (leftEyeRef.current && rightEyeRef.current) {
      leftEyeRef.current.scale.y = blinkScaleY;
      rightEyeRef.current.scale.y = blinkScaleY;
    }
  });

  // 캐릭터를 클릭(탭)하면 다음 프레임에서 점프를 시작하도록 표시합니다.
  const handleTap = () => {
    jumpRequestedRef.current = true;
  };

  const isBird = kind === "owl" || kind === "parrot";
  const eyeColor = "#1F1B24";
  const cheekColor = "#F7A8B8";

  return (
    <group
      ref={rootRef}
      onClick={(e) => {
        e.stopPropagation();
        // useFrame과 같은 시계 기준이 아닌 경우를 대비해 ref에 플래그 대신
        // 다음 useFrame에서 처리할 수 있게 clock 시간을 쓰도록 개선합니다.
        handleTap();
      }}
    >
      {/* === [공통 머리 영역] === */}
      <group ref={headRef} position={[0, 0.56, 0]}>
        {/* 기본 둥근 머리 */}
        <mesh scale={[1.08, 0.96, 0.98]}>
          <sphereGeometry args={[0.6, 22, 22]} />
          <meshStandardMaterial color={baseColor} roughness={0.35} metalness={0.05} />
        </mesh>

        {/* 펭귄·원숭이 얼굴 앞쪽 무늬 */}
        {(kind === "penguin" || kind === "monkey") && (
          <mesh
            position={[0, kind === "monkey" ? -0.06 : -0.04, 0.25]}
            scale={kind === "monkey" ? [0.88, 0.8, 0.72] : [0.92, 0.88, 0.72]}
          >
            <sphereGeometry args={[0.5, 20, 20]} />
            <meshStandardMaterial color={sub} roughness={0.38} />
          </mesh>
        )}

        {/* 판다 검은 눈가 무늬 */}
        {kind === "panda" && (
          <>
            <mesh position={[-0.22, 0.04, 0.49]} rotation={[0, 0, 0.25]} scale={[1.1, 1.35, 0.5]}>
              <sphereGeometry args={[0.12, 20, 20]} />
              <meshStandardMaterial color={sub} roughness={0.35} />
            </mesh>
            <mesh position={[0.22, 0.04, 0.49]} rotation={[0, 0, -0.25]} scale={[1.1, 1.35, 0.5]}>
              <sphereGeometry args={[0.12, 20, 20]} />
              <meshStandardMaterial color={sub} roughness={0.35} />
            </mesh>
          </>
        )}

        {/* 부엉이 동그랗고 큰 눈테 */}
        {kind === "owl" && (
          <>
            <mesh position={[-0.22, 0.04, 0.48]} scale={[1, 1, 0.45]}>
              <sphereGeometry args={[0.18, 24, 24]} />
              <meshStandardMaterial color={sub} roughness={0.4} />
            </mesh>
            <mesh position={[0.22, 0.04, 0.48]} scale={[1, 1, 0.45]}>
              <sphereGeometry args={[0.18, 24, 24]} />
              <meshStandardMaterial color={sub} roughness={0.4} />
            </mesh>
          </>
        )}

        {/* 공통 까만 눈 2개 + 작은 하얀 반짝임 */}
        <group ref={leftEyeRef} position={[-0.22, 0.04, 0.54]}>
          <mesh>
            <sphereGeometry args={[0.07, 20, 20]} />
            <meshStandardMaterial color={eyeColor} roughness={0.15} metalness={0.1} />
          </mesh>
          <mesh position={[0.022, 0.025, 0.056]}>
            <sphereGeometry args={[0.021, 12, 12]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
        </group>

        <group ref={rightEyeRef} position={[0.22, 0.04, 0.54]}>
          <mesh>
            <sphereGeometry args={[0.07, 20, 20]} />
            <meshStandardMaterial color={eyeColor} roughness={0.15} metalness={0.1} />
          </mesh>
          <mesh position={[0.022, 0.025, 0.056]}>
            <sphereGeometry args={[0.021, 12, 12]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
        </group>

        {/* 발그레한 양 볼 (다람쥐는 볼록하게 더 크게 표현) */}
        <mesh
          position={[-0.36, -0.1, 0.46]}
          scale={kind === "squirrel" ? [1.45, 1.15, 0.8] : [1.15, 0.85, 0.5]}
        >
          <sphereGeometry args={[0.085, 16, 16]} />
          <meshStandardMaterial color={cheekColor} roughness={0.45} />
        </mesh>
        <mesh
          position={[0.36, -0.1, 0.46]}
          scale={kind === "squirrel" ? [1.45, 1.15, 0.8] : [1.15, 0.85, 0.5]}
        >
          <sphereGeometry args={[0.085, 16, 16]} />
          <meshStandardMaterial color={cheekColor} roughness={0.45} />
        </mesh>

        {/* === [입/코/부리 영역: 동물마다 다르게] === */}
        {isBird || kind === "penguin" ? (
          // 부리 (부엉이, 펭귄, 앵무새)
          <mesh
            position={[0, -0.06, 0.62]}
            rotation={[kind === "parrot" ? 1.85 : 1.5, 0, 0]}
          >
            <coneGeometry args={[0.09, kind === "parrot" ? 0.22 : 0.16, 16]} />
            <meshStandardMaterial color={accent} roughness={0.3} />
          </mesh>
        ) : kind === "fox" || kind === "hedgehog" ? (
          // 뾰족한 주둥이/코 (여우, 고슴도치)
          <group position={[0, -0.1, 0.55]}>
            <mesh rotation={[1.55, 0, 0]}>
              <coneGeometry args={[0.17, 0.24, 20]} />
              <meshStandardMaterial color={sub} roughness={0.38} />
            </mesh>
            <mesh position={[0, 0.02, 0.13]}>
              <sphereGeometry args={[0.048, 16, 16]} />
              <meshStandardMaterial color="#2D2320" roughness={0.25} />
            </mesh>
          </group>
        ) : (
          // 둥근 주둥이와 코 (곰, 고양이, 사자, 사슴, 토끼, 강아지, 다람쥐, 거북이, 양, 판다, 원숭이)
          <group position={[0, -0.13, 0.52]}>
            <mesh scale={[1.15, 0.88, 0.8]}>
              <sphereGeometry args={[0.18, 22, 22]} />
              <meshStandardMaterial color={sub} roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.05, 0.14]} scale={[1.2, 0.85, 0.8]}>
              <sphereGeometry args={[0.055, 16, 16]} />
              <meshStandardMaterial color="#3B2820" roughness={0.25} />
            </mesh>
            {/* 강아지 내민 혀 */}
            {kind === "dog" && (
              <mesh position={[0, -0.07, 0.13]} scale={[0.9, 1.2, 0.5]}>
                <sphereGeometry args={[0.055, 14, 14]} />
                <meshStandardMaterial color="#FF7B9C" roughness={0.35} />
              </mesh>
            )}
          </group>
        )}

        {/* 고양이 수염 */}
        {kind === "cat" && (
          <group position={[0, -0.1, 0.54]}>
            {[-1, 1].map((side) => (
              <group key={side}>
                <mesh
                  position={[side * 0.28, 0.03, 0]}
                  rotation={[0, 0, side * -0.15 + Math.PI / 2]}
                >
                  <cylinderGeometry args={[0.009, 0.009, 0.22, 8]} />
                  <meshStandardMaterial color="#5A5566" />
                </mesh>
                <mesh
                  position={[side * 0.28, -0.03, 0]}
                  rotation={[0, 0, side * 0.15 + Math.PI / 2]}
                >
                  <cylinderGeometry args={[0.009, 0.009, 0.22, 8]} />
                  <meshStandardMaterial color="#5A5566" />
                </mesh>
              </group>
            ))}
          </group>
        )}

        {/* === [귀 / 뿔 / 갈기 / 머리털 영역] === */}
        {/* 곰·판다·다람쥐·원숭이 둥근 귀 */}
        {(kind === "bear" || kind === "panda" || kind === "squirrel") && (
          <>
            <mesh position={[-0.44, 0.45, -0.02]}>
              <sphereGeometry args={[0.18, 22, 22]} />
              <meshStandardMaterial
                color={kind === "panda" ? sub : baseColor}
                roughness={0.35}
              />
            </mesh>
            <mesh position={[0.44, 0.45, -0.02]}>
              <sphereGeometry args={[0.18, 22, 22]} />
              <meshStandardMaterial
                color={kind === "panda" ? sub : baseColor}
                roughness={0.35}
              />
            </mesh>
          </>
        )}

        {/* 원숭이 얼굴 옆의 크고 둥근 귀 */}
        {kind === "monkey" && (
          <>
            <group position={[-0.6, 0.04, 0]}>
              <mesh scale={[0.85, 1, 0.5]}>
                <sphereGeometry args={[0.21, 20, 20]} />
                <meshStandardMaterial color={baseColor} roughness={0.35} />
              </mesh>
              <mesh position={[0, 0, 0.04]} scale={[0.6, 0.7, 0.4]}>
                <sphereGeometry args={[0.18, 16, 16]} />
                <meshStandardMaterial color={sub} roughness={0.4} />
              </mesh>
            </group>
            <group position={[0.6, 0.04, 0]}>
              <mesh scale={[0.85, 1, 0.5]}>
                <sphereGeometry args={[0.21, 20, 20]} />
                <meshStandardMaterial color={baseColor} roughness={0.35} />
              </mesh>
              <mesh position={[0, 0, 0.04]} scale={[0.6, 0.7, 0.4]}>
                <sphereGeometry args={[0.18, 16, 16]} />
                <meshStandardMaterial color={sub} roughness={0.4} />
              </mesh>
            </group>
          </>
        )}

        {/* 고양이·여우·고슴도치·부엉이(귀깃) 뾰족한 귀 */}
        {(kind === "cat" || kind === "fox" || kind === "owl") && (
          <>
            <mesh position={[-0.38, 0.52, -0.02]} rotation={[0, 0, 0.3]}>
              <coneGeometry
                args={[
                  kind === "fox" ? 0.18 : 0.15,
                  kind === "fox" ? 0.42 : 0.3,
                  18,
                ]}
              />
              <meshStandardMaterial color={baseColor} roughness={0.35} />
            </mesh>
            <mesh position={[0.38, 0.52, -0.02]} rotation={[0, 0, -0.3]}>
              <coneGeometry
                args={[
                  kind === "fox" ? 0.18 : 0.15,
                  kind === "fox" ? 0.42 : 0.3,
                  18,
                ]}
              />
              <meshStandardMaterial color={baseColor} roughness={0.35} />
            </mesh>
          </>
        )}

        {/* 토끼 길쭉한 귀 (위쪽이 잘리지 않게 높이를 맞춥니다) */}
        {kind === "rabbit" && (
          <>
            <mesh position={[-0.24, 0.62, -0.04]} rotation={[0, 0, 0.16]}>
              <capsuleGeometry args={[0.1, 0.32, 10, 14]} />
              <meshStandardMaterial color={baseColor} roughness={0.35} />
            </mesh>
            <mesh position={[0.24, 0.62, -0.04]} rotation={[0, 0, -0.16]}>
              <capsuleGeometry args={[0.1, 0.32, 10, 14]} />
              <meshStandardMaterial color={baseColor} roughness={0.35} />
            </mesh>
          </>
        )}

        {/* 강아지 아래로 처진 귀 */}
        {kind === "dog" && (
          <>
            <mesh position={[-0.54, 0.05, 0.05]} rotation={[0, 0, 0.35]}>
              <capsuleGeometry args={[0.13, 0.28, 12, 16]} />
              <meshStandardMaterial color={accent} roughness={0.4} />
            </mesh>
            <mesh position={[0.54, 0.05, 0.05]} rotation={[0, 0, -0.35]}>
              <capsuleGeometry args={[0.13, 0.28, 12, 16]} />
              <meshStandardMaterial color={accent} roughness={0.4} />
            </mesh>
          </>
        )}

        {/* 양 옆으로 난 귀 + 몽글몽글 머리 털 */}
        {kind === "sheep" && (
          <>
            <mesh position={[-0.58, 0.04, 0]} rotation={[0, 0, 1.1]}>
              <capsuleGeometry args={[0.1, 0.18, 10, 14]} />
              <meshStandardMaterial color={sub} roughness={0.45} />
            </mesh>
            <mesh position={[0.58, 0.04, 0]} rotation={[0, 0, -1.1]}>
              <capsuleGeometry args={[0.1, 0.18, 10, 14]} />
              <meshStandardMaterial color={sub} roughness={0.45} />
            </mesh>
            {[
              [-0.22, 0.54, 0.1],
              [0, 0.58, 0.12],
              [0.22, 0.54, 0.1],
              [-0.12, 0.55, -0.12],
              [0.12, 0.55, -0.12],
            ].map((pos, idx) => (
              <mesh key={idx} position={pos as [number, number, number]}>
                <sphereGeometry args={[0.16, 16, 16]} />
                <meshStandardMaterial color="#FFFFFF" roughness={0.5} />
              </mesh>
            ))}
          </>
        )}

        {/* 사자 얼굴을 두른 풍성한 갈기 */}
        {kind === "lion" && (
          <group position={[0, 0.02, -0.1]}>
            {Array.from({ length: 12 }).map((_, idx) => {
              const angle = (idx / 12) * Math.PI * 2;
              return (
                <mesh
                  key={idx}
                  position={[Math.cos(angle) * 0.58, Math.sin(angle) * 0.56, 0]}
                >
                  <sphereGeometry args={[0.22, 16, 16]} />
                  <meshStandardMaterial color={accent} roughness={0.45} />
                </mesh>
              );
            })}
          </group>
        )}

        {/* 사슴 가지 모양 뿔 */}
        {kind === "deer" && (
          <>
            {[-1, 1].map((side) => (
              <group key={side} position={[side * 0.28, 0.56, -0.02]}>
                <mesh rotation={[0, 0, side * -0.22]}>
                  <cylinderGeometry args={[0.034, 0.045, 0.46, 12]} />
                  <meshStandardMaterial color={accent} roughness={0.4} />
                </mesh>
                <mesh
                  position={[side * 0.11, 0.1, 0]}
                  rotation={[0, 0, side * -0.9]}
                >
                  <cylinderGeometry args={[0.024, 0.03, 0.24, 10]} />
                  <meshStandardMaterial color={accent} roughness={0.4} />
                </mesh>
              </group>
            ))}
          </>
        )}

        {/* 앵무새 머리 위 벼슬(보) */}
        {kind === "parrot" && (
          <group position={[0, 0.56, 0.05]}>
            <mesh position={[-0.07, 0.04, 0]} rotation={[-0.2, 0, 0.25]}>
              <coneGeometry args={[0.07, 0.22, 14]} />
              <meshStandardMaterial color={sub} roughness={0.35} />
            </mesh>
            <mesh position={[0.04, 0.08, -0.02]} rotation={[-0.3, 0, -0.1]}>
              <coneGeometry args={[0.07, 0.26, 14]} />
              <meshStandardMaterial color={accent} roughness={0.35} />
            </mesh>
          </group>
        )}
      </group>

      {/* === [공통 몸통 영역] === */}
      <group position={[0, -0.24, 0]}>
        <mesh scale={[1.05, 1, 0.95]}>
          <sphereGeometry args={[0.44, 20, 20]} />
          <meshStandardMaterial color={baseColor} roughness={0.35} metalness={0.05} />
        </mesh>

        {/* 배 부분 밝은 패치 */}
        <mesh position={[0, -0.02, 0.33]} scale={[0.92, 0.96, 0.5]}>
          <sphereGeometry args={[0.28, 16, 16]} />
          <meshStandardMaterial color={sub} roughness={0.4} />
        </mesh>

        {/* 양 몸통 몽글몽글 털 */}
        {kind === "sheep" && (
          <>
            {[
              [-0.34, 0.06, 0.16],
              [0.34, 0.06, 0.16],
              [-0.28, -0.18, 0.2],
              [0.28, -0.18, 0.2],
              [0, 0.1, -0.32],
            ].map((pos, idx) => (
              <mesh key={idx} position={pos as [number, number, number]}>
                <sphereGeometry args={[0.17, 16, 16]} />
                <meshStandardMaterial color="#FFFFFF" roughness={0.5} />
              </mesh>
            ))}
          </>
        )}

        {/* 거북이 등딱지 (정면에서도 몸 양옆으로 넓게 보이도록 크게 배치) */}
        {kind === "turtle" && (
          <group position={[0, 0.02, -0.08]}>
            <mesh scale={[1.55, 1.28, 1.02]}>
              <sphereGeometry args={[0.48, 20, 20]} />
              <meshStandardMaterial color={accent} roughness={0.4} />
            </mesh>
            {/* 등딱지 앞쪽 테두리 링 */}
            <mesh position={[0, -0.02, 0.08]} rotation={[0.1, 0, 0]} scale={[1.18, 1, 1]}>
              <torusGeometry args={[0.56, 0.075, 12, 24]} />
              <meshStandardMaterial color="#D6C49E" roughness={0.45} />
            </mesh>
          </group>
        )}

        {/* 고슴도치 등 가시 여러 개 (정면에서도 뾰족한 실루엣이 보이도록 위·옆까지 배치) */}
        {kind === "hedgehog" && (
          <group position={[0, 0.14, -0.16]}>
            {[
              [0, 0.54, -0.05, -0.25, 0],
              [-0.36, 0.44, -0.04, -0.25, 0.55],
              [0.36, 0.44, -0.04, -0.25, -0.55],
              [-0.5, 0.16, -0.06, -0.35, 1.05],
              [0.5, 0.16, -0.06, -0.35, -1.05],
              [0, 0.24, -0.16, -0.6, 0],
              [-0.28, 0.12, -0.14, -0.65, 0.6],
              [0.28, 0.12, -0.14, -0.65, -0.6],
              [0, -0.04, -0.24, -1.2, 0],
            ].map(([x, y, z, rx, rz], idx) => (
              <mesh key={idx} position={[x, y, z]} rotation={[rx, 0, rz]}>
                <coneGeometry args={[0.11, 0.34, 12]} />
                <meshStandardMaterial color={accent} roughness={0.45} />
              </mesh>
            ))}
          </group>
        )}

        {/* 사슴 등·옆구리에 하얀 점 */}
        {kind === "deer" && (
          <>
            {[
              [-0.14, 0.12, -0.37],
              [0.14, 0.1, -0.37],
              [0, -0.06, -0.4],
              [-0.36, 0.06, 0.12],
              [0.36, 0.06, 0.12],
              [-0.33, -0.12, 0.2],
              [0.33, -0.12, 0.2],
            ].map((pos, idx) => (
              <mesh key={idx} position={pos as [number, number, number]}>
                <sphereGeometry args={[0.055, 12, 12]} />
                <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
              </mesh>
            ))}
          </>
        )}

        {/* 팔 또는 날개 */}
        {isBird || kind === "penguin" ? (
          <>
            <mesh
              position={[-0.46, 0.04, 0.04]}
              rotation={[0, 0, 0.65]}
              scale={[0.6, 1.2, 1.1]}
            >
              <sphereGeometry args={[0.18, 20, 20]} />
              <meshStandardMaterial
                color={kind === "parrot" ? accent : baseColor}
                roughness={0.35}
              />
            </mesh>
            <mesh
              position={[0.46, 0.04, 0.04]}
              rotation={[0, 0, -0.65]}
              scale={[0.6, 1.2, 1.1]}
            >
              <sphereGeometry args={[0.18, 20, 20]} />
              <meshStandardMaterial
                color={kind === "parrot" ? sub : baseColor}
                roughness={0.35}
              />
            </mesh>
          </>
        ) : (
          <>
            <mesh position={[-0.45, 0.08, 0.08]} rotation={[0, 0, 0.55]}>
              <capsuleGeometry args={[0.11, 0.18, 12, 16]} />
              <meshStandardMaterial
                color={kind === "panda" ? sub : baseColor}
                roughness={0.35}
              />
            </mesh>
            <mesh position={[0.45, 0.08, 0.08]} rotation={[0, 0, -0.55]}>
              <capsuleGeometry args={[0.11, 0.18, 12, 16]} />
              <meshStandardMaterial
                color={kind === "panda" ? sub : baseColor}
                roughness={0.35}
              />
            </mesh>
          </>
        )}

        {/* 짧은 다리 2개 */}
        <mesh position={[-0.21, -0.43, 0.08]}>
          <capsuleGeometry args={[0.13, 0.15, 12, 16]} />
          <meshStandardMaterial
            color={
              kind === "penguin" || kind === "parrot"
                ? accent
                : kind === "panda"
                  ? sub
                  : baseColor
            }
            roughness={0.35}
          />
        </mesh>
        <mesh position={[0.21, -0.43, 0.08]}>
          <capsuleGeometry args={[0.13, 0.15, 12, 16]} />
          <meshStandardMaterial
            color={
              kind === "penguin" || kind === "parrot"
                ? accent
                : kind === "panda"
                  ? sub
                  : baseColor
            }
            roughness={0.35}
          />
        </mesh>

        {/* === [꼬리 영역] === */}
        <group ref={tailRef} position={[0, -0.15, -0.36]}>
          {kind === "squirrel" && (
            // 등 뒤에서 옆으로 살짝 휘어 올라와 정면에서도 보이는 크고 풍성한 다람쥐 꼬리
            <group position={[0.42, 0.34, 0.02]} rotation={[0, 0, -0.28]}>
              <mesh scale={[0.95, 1.35, 0.95]}>
                <sphereGeometry args={[0.26, 18, 18]} />
                <meshStandardMaterial color={baseColor} roughness={0.4} />
              </mesh>
              <mesh position={[0.08, 0.34, 0.04]}>
                <sphereGeometry args={[0.21, 16, 16]} />
                <meshStandardMaterial color={accent} roughness={0.4} />
              </mesh>
            </group>
          )}

          {kind === "fox" && (
            // 정면에서도 끝이 하얀 풍성한 여우 꼬리가 옆으로 보이도록 배치
            <group position={[0.4, 0.06, 0.02]} rotation={[-0.15, 0.2, -0.85]}>
              <mesh>
                <capsuleGeometry args={[0.14, 0.3, 10, 14]} />
                <meshStandardMaterial color={baseColor} roughness={0.4} />
              </mesh>
              <mesh position={[0, 0.21, 0]}>
                <sphereGeometry args={[0.14, 14, 14]} />
                <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
              </mesh>
            </group>
          )}

          {(kind === "cat" || kind === "monkey") && (
            // 길고 살랑이는 / 옆으로 말린 꼬리
            <group
              position={kind === "monkey" ? [0.42, 0.06, 0.02] : [0.24, 0.12, -0.06]}
              rotation={kind === "monkey" ? [0, 0.2, -0.85] : [-0.4, 0, -0.45]}
            >
              <mesh>
                <capsuleGeometry args={[0.055, 0.46, 10, 14]} />
                <meshStandardMaterial color={baseColor} roughness={0.35} />
              </mesh>
              {kind === "monkey" && (
                <mesh position={[0.06, 0.26, 0.04]}>
                  <sphereGeometry args={[0.075, 12, 12]} />
                  <meshStandardMaterial color={baseColor} roughness={0.35} />
                </mesh>
              )}
            </group>
          )}

          {kind === "lion" && (
            // 끝에 털 뭉치가 달린 사자 꼬리
            <group position={[0, 0.06, -0.12]} rotation={[-0.6, 0, 0]}>
              <mesh>
                <capsuleGeometry args={[0.04, 0.34, 10, 12]} />
                <meshStandardMaterial color={baseColor} roughness={0.35} />
              </mesh>
              <mesh position={[0, 0.2, 0]}>
                <sphereGeometry args={[0.1, 14, 14]} />
                <meshStandardMaterial color={accent} roughness={0.45} />
              </mesh>
            </group>
          )}

          {kind === "dog" && (
            // 흔드는 강아지 꼬리
            <mesh position={[0, 0.08, -0.06]} rotation={[-0.7, 0, 0]}>
              <capsuleGeometry args={[0.065, 0.2, 10, 14]} />
              <meshStandardMaterial color={baseColor} roughness={0.35} />
            </mesh>
          )}

          {(kind === "bear" || kind === "rabbit" || kind === "sheep" || kind === "panda") && (
            // 동글동글 솜뭉치 꼬리
            <mesh>
              <sphereGeometry args={[kind === "rabbit" ? 0.13 : 0.1, 16, 16]} />
              <meshStandardMaterial
                color={kind === "rabbit" ? "#FFFFFF" : sub}
                roughness={0.45}
              />
            </mesh>
          )}
        </group>
      </group>
    </group>
  );
}
