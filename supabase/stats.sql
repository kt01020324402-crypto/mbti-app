-- ============================================================
-- 몽글 MBTI 유형별 통계 조회 함수(get_type_stats) 생성 SQL
-- 같은 SQL을 여러 번 실행해도 오류가 나지 않도록 작성했습니다.
-- ============================================================

-- 1. 모든 회원의 검사 결과를 유형별로 묶어 개수만 돌려주는 함수를 만듭니다.
--    개별 회원 정보나 세부 기록은 절대 내보내지 않습니다.
create or replace function public.get_type_stats()
returns table (
  mbti_type text,
  count bigint
)
language sql
-- 함수를 만든 사람(관리자) 권한으로 실행해 RLS를 우회하고 전체 집계를 계산합니다.
security definer
-- 보안상 search_path를 비워 두어 의도치 않은 스키마 참조를 막습니다.
set search_path = ''
as $$
  select
    tr.mbti_type,
    count(*)::bigint as count
  from public.test_results as tr
  group by tr.mbti_type
  order by count desc, tr.mbti_type asc;
$$;

-- 2. 기본 공개 권한을 먼저 정리한 뒤, 방문자(anon)와 회원(authenticated)에게 실행 권한을 줍니다.
revoke all on function public.get_type_stats() from public;
grant execute on function public.get_type_stats() to anon, authenticated;
