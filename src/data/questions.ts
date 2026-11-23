// MBTI 4가지 지표(E/I, S/N, T/F, J/P)를 나타내는 타입입니다.
export type MbtiDimension = "EI" | "SN" | "TF" | "JP";

// 각 선택지가 가리키는 성향 글자 타입입니다.
export type MbtiTrait = "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P";

// 질문에 포함된 선택지 1개의 데이터 구조입니다.
export interface QuestionOption {
  // 화면에 보여줄 선택지 문구
  text: string;
  // 이 선택지를 골랐을 때 점수가 올라가는 성향 글자
  trait: MbtiTrait;
}

// 검사 문항 1개의 데이터 구조입니다.
export interface Question {
  // 문항 번호 (1 ~ 12)
  id: number;
  // 어떤 지표를 묻는 문항인지 구분합니다.
  dimension: MbtiDimension;
  // 사용자에게 보여줄 일상 상황 질문
  question: string;
  // 2개의 선택지 (항상 2개)
  options: [QuestionOption, QuestionOption];
}

// 몽글 MBTI 검사에 사용할 12개 문항 목록입니다.
// 같은 지표가 연달아 나오지 않도록 EI → SN → TF → JP 순서로 번갈아 배치했습니다.
export const QUESTIONS: Question[] = [
  {
    id: 1,
    dimension: "EI",
    question: "주말에 오랜만에 아무 약속이 비었을 때, 어떤 하루가 더 끌리나요?",
    options: [
      {
        text: "친구들에게 먼저 연락해서 가볍게 만나고 싶어요.",
        trait: "E",
      },
      {
        text: "집에서 좋아하는 영상이나 책을 보며 혼자 쉬고 싶어요.",
        trait: "I",
      },
    ],
  },
  {
    id: 2,
    dimension: "SN",
    question: "새로 문을 연 디저트 가게에 들어갔을 때, 가장 먼저 눈에 들어오는 것은 무엇인가요?",
    options: [
      {
        text: "진열된 빵의 먹음직스러운 모양과 가격표가 먼저 보여요.",
        trait: "S",
      },
      {
        text: "가게의 독특한 분위기와 어떤 콘셉트로 만들었을지가 궁금해져요.",
        trait: "N",
      },
    ],
  },
  {
    id: 3,
    dimension: "TF",
    question: "가까운 친구가 \"오늘 괜히 우울해서 쇼핑을 좀 했어\"라고 말하면 어떻게 반응하나요?",
    options: [
      {
        text: "\"무슨 일 있었어? 뭐 샀는지 궁금하다!\" 하고 이유와 물건부터 물어요.",
        trait: "T",
      },
      {
        text: "\"오늘 많이 힘들었구나, 그래도 기분이 좀 풀렸으면 좋겠다.\" 하고 마음을 다독여요.",
        trait: "F",
      },
    ],
  },
  {
    id: 4,
    dimension: "JP",
    question: "다음 달에 친구와 1박 2일 여행을 가기로 했다면, 준비 스타일은 어떤가요?",
    options: [
      {
        text: "숙소와 맛집, 이동 동선을 미리 표로 깔끔하게 정리해 두어요.",
        trait: "J",
      },
      {
        text: "숙소만 정해 두고, 당일 날씨와 기분에 따라 움직이는 게 좋아요.",
        trait: "P",
      },
    ],
  },
  {
    id: 5,
    dimension: "SN",
    question: "학교나 회사에서 새로운 프로젝트를 시작할 때, 가장 먼저 궁금한 것은 무엇인가요?",
    options: [
      {
        text: "구체적인 일정표와 내가 맡아야 할 정확한 역할부터 확인해요.",
        trait: "S",
      },
      {
        text: "이 프로젝트가 앞으로 어떤 큰 그림과 변화를 만들지부터 떠올려요.",
        trait: "N",
      },
    ],
  },
  {
    id: 6,
    dimension: "EI",
    question: "새로운 취미 모임에 처음 나갔을 때, 나는 주로 어떤 편인가요?",
    options: [
      {
        text: "옆 사람에게 먼저 말을 걸며 금방 어울리는 편이에요.",
        trait: "E",
      },
      {
        text: "조용히 분위기를 살피며 필요한 말만 나누는 편이에요.",
        trait: "I",
      },
    ],
  },
  {
    id: 7,
    dimension: "TF",
    question: "함께 진행하는 일에서 의견이 부딪혔을 때, 무엇을 더 중요하게 보나요?",
    options: [
      {
        text: "누가 말했는지보다 어떤 방법이 가장 합리적이고 효율적인지 따져요.",
        trait: "T",
      },
      {
        text: "모두의 기분이 상하지 않고 원만하게 합의할 수 있는지를 살펴요.",
        trait: "F",
      },
    ],
  },
  {
    id: 8,
    dimension: "JP",
    question: "며칠 뒤로 다가온 마감을 앞둔 일은 언제 처리하는 편인가요?",
    options: [
      {
        text: "미리 일정을 나누어 조금씩 끝내 두어야 마음이 편해요.",
        trait: "J",
      },
      {
        text: "마감 기한이 가까워졌을 때 집중력이 올라서 한 번에 끝내요.",
        trait: "P",
      },
    ],
  },
  {
    id: 9,
    dimension: "EI",
    question: "바쁘고 힘든 한 주를 보낸 금요일 저녁, 에너지를 채우는 방법은 무엇인가요?",
    options: [
      {
        text: "북적이는 맛집이나 카페에서 사람들과 수다를 떨어요.",
        trait: "E",
      },
      {
        text: "아무도 방해하지 않는 나만의 공간에서 조용히 쉬어요.",
        trait: "I",
      },
    ],
  },
  {
    id: 10,
    dimension: "SN",
    question: "새로운 요리를 처음 만들어 볼 때, 레시피를 어떻게 활용하나요?",
    options: [
      {
        text: "계량 스푼으로 재료와 시간을 정확히 지켜서 만들어요.",
        trait: "S",
      },
      {
        text: "전체 흐름만 파악한 뒤 나만의 재료를 더해 응용해 봐요.",
        trait: "N",
      },
    ],
  },
  {
    id: 11,
    dimension: "TF",
    question: "친구가 오랜 고민 끝에 내린 결정을 들었을 때, 나도 모르게 먼저 나오는 말은 무엇인가요?",
    options: [
      {
        text: "\"그럼 다음 단계는 어떻게 할 거야?\" 하고 현실적인 계획을 물어요.",
        trait: "T",
      },
      {
        text: "\"그동안 고민 많았겠다, 네 선택을 응원해!\" 하고 진심을 전해요.",
        trait: "F",
      },
    ],
  },
  {
    id: 12,
    dimension: "JP",
    question: "외출 준비를 하다가 갑자기 약속 시간이 30분 뒤로 미뤄졌을 때, 어떤 기분이 드나요?",
    options: [
      {
        text: "맞춰 둔 일정이 틀어져서 잠시 당황스럽고 다시 계획을 세워요.",
        trait: "J",
      },
      {
        text: "오히려 여유가 생겨서 느긋하게 차를 마시거나 딴짓을 해요.",
        trait: "P",
      },
    ],
  },
];
