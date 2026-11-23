import type { Config } from "tailwindcss";

// Tailwind CSS가 스타일을 적용할 파일 경로와 기본 폰트를 설정합니다.
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Noto Sans KR Variable"',
          '"Apple SD Gothic Neo"',
          '"Malgun Gothic"',
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
