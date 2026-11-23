-- ============================================================
-- 몽글 MBTI 검사 결과 저장 테이블(test_results) 생성 SQL
-- 같은 SQL을 여러 번 실행해도 오류가 나지 않도록 작성했습니다.
-- ============================================================

-- 1. 검사 결과를 저장할 test_results 테이블을 만듭니다 (이미 있으면 건너뜁니다).
create table if not exists public.test_results (
  -- 결과가 저장될 때마다 1씩 자동으로 늘어나는 고유 번호(기본 키)입니다.
  id bigint generated always as identity primary key,

  -- 결과를 저장한 회원의 ID입니다.
  -- auth.users 테이블의 id를 참조하며, 회원이 탈퇴(삭제)되면 결과도 함께 삭제됩니다.
  -- 기본값으로 auth.uid()를 지정해, 앱이 user_id를 따로 보내지 않아도 로그인한 회원 ID가 자동으로 들어갑니다.
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,

  -- 계산된 4글자 MBTI 유형 코드입니다.
  -- 정규식 체크 제약으로 E/I, S/N, T/F, J/P 조합의 4글자만 저장되도록 제한합니다.
  mbti_type text not null check (mbti_type ~ '^[EI][SN][TF][JP]$'),

  -- 결과가 저장된 날짜와 시각입니다. 기본값은 현재 시각(now())입니다.
  created_at timestamptz not null default now()
);

-- 2. 내 검사 기록을 최신순(created_at 내림차순)으로 빠르게 찾을 수 있게 인덱스를 만듭니다.
create index if not exists idx_test_results_user_created_at
  on public.test_results (user_id, created_at desc);

-- 3. API 접근 권한(GRANT)을 설정합니다.
-- 로그인하지 않은 방문자(anon)에게는 모든 권한을 회수해 접근을 막습니다.
revoke all on table public.test_results from anon;

-- 로그인한 회원(authenticated)에게만 조회(select), 저장(insert), 삭제(delete) 권한을 줍니다.
grant select, insert, delete on table public.test_results to authenticated;

-- 4. 행 수준 보안(RLS)을 켜서 다른 사람의 결과를 보거나 지우지 못하게 막습니다.
alter table public.test_results enable row level security;

-- 5. 기존 정책이 있다면 먼저 지운 뒤 3가지 정책을 새로 만듭니다 (재실행 시 오류 방지).

-- [정책 1] 조회(SELECT): 로그인한 회원은 자기 자신의 결과만 볼 수 있습니다.
drop policy if exists "본인 결과만 조회 가능" on public.test_results;
create policy "본인 결과만 조회 가능"
  on public.test_results
  for select
  to authenticated
  using (auth.uid() = user_id);

-- [정책 2] 저장(INSERT): 로그인한 회원은 자기 자신의 user_id로만 결과를 저장할 수 있습니다.
drop policy if exists "본인 이름으로만 저장 가능" on public.test_results;
create policy "본인 이름으로만 저장 가능"
  on public.test_results
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- [정책 3] 삭제(DELETE): 로그인한 회원은 자기 자신의 결과만 삭제할 수 있습니다.
drop policy if exists "본인 결과만 삭제 가능" on public.test_results;
create policy "본인 결과만 삭제 가능"
  on public.test_results
  for delete
  to authenticated
  using (auth.uid() = user_id);
