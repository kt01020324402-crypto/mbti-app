import { createClient } from "@supabase/supabase-js";

// .env.local(또는 Vercel 환경 변수)에 적어 둔 Supabase 프로젝트 주소와 공개 키를 읽어옵니다.
// Next.js 빌드(사전 렌더링) 시점에 환경 변수가 비어 있어도 빌드가 중단되지 않도록 안전한 기본값을 둡니다.
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "placeholder-key";

// 앱 전체에서 함께 사용할 Supabase 클라이언트입니다.
// 브라우저에서 직접 Supabase를 호출하는 단순한 구조로 사용합니다.
export const supabase = createClient(supabaseUrl, supabasePublishableKey);
