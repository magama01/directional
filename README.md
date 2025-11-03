# Directional 프로젝트

이 문서는 Directional 프로젝트에 대한 정보를 제공합니다.

## 프로젝트 실행 방법

1.  **저장소 복제**
    ```bash
    git clone https://github.com/magama01/directional.git
    cd directional
    ```

2.  **의존성 설치**
    ``next@16 을 mui와 auth.js가 공식적으로 지원하질 않아 강제 설치가 필요합니다.``
    ```bash
    npm install --legacy-peer-deps
    ```

3.  **개발 서버 실행**
    ```bash
    npm run dev
    ```

    브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하여 확인할 수 있습니다.
    ``이미 사용되는 포트번호라 다른 포트로 열린다면 .env.local 에 수정이 필요합니다. ``

## 사용한 기술 스택

*   **Framework**: [Next.js](https://nextjs.org/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **UI Library**: [Material-UI (MUI)](https://mui.com/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Authentication**: [Auth.js](https://next-auth.js.org/)
*   **Charting**: [ApexCharts](https://apexcharts.com/)



## 주요 구현 기능 요약

*   **사용자 인증**: NextAuth.js를 사용한 로그인 / client-fetcher, server-fetcher 를 통한 api 호출시 인증 주입 / 최대한 server action 위주로 쓰려했습니다.
*   **차트**: ApexCharts를 사용한 차트
*   **UI**: Material-UI 및 Tailwind CSS를 이용한 디자인 구성


## (선택사항) 배포 링크

https://directional.vercel.app/
