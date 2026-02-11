// 자동 생성된 데이터 파일
// 마지막 업데이트: 2026. 2. 11. 오전 1:55:02
window.dashboardData = {
  "totalPosts": 100,
  "currentDay": 100,
  "participantCount": 5,
  "totalWords": 59122,
  "overallCompletionRate": 20,
  "maxStreak": 0,
  "genreDistribution": {
    "기타": 100
  },
  "participantStats": [
    {
      "author": "유희",
      "postCount": 50,
      "wordCount": 22831,
      "completionRate": 50
    },
    {
      "author": "무화과",
      "postCount": 21,
      "wordCount": 25938,
      "completionRate": 21
    },
    {
      "author": "태린",
      "postCount": 26,
      "wordCount": 7133,
      "completionRate": 26
    },
    {
      "author": "산호",
      "postCount": 2,
      "wordCount": 1520,
      "completionRate": 2
    },
    {
      "author": "후무",
      "postCount": 1,
      "wordCount": 1700,
      "completionRate": 1
    }
  ],
  "recentPosts": [
    {
      "id": "2e25b962-8bb9-80a4-bd24-de931dddd839",
      "title": "유희 #100 나를 받아들이는 일",
      "author": "유희",
      "date": "2025-12-31",
      "genre": "기타",
      "tags": [],
      "memo": "",
      "wordCount": 436,
      "day": 100
    },
    {
      "id": "2e25b962-8bb9-80df-a062-f6b8d4528aed",
      "title": "유희 #099 이토록 감흥없는",
      "author": "유희",
      "date": "2025-12-31",
      "genre": "기타",
      "tags": [],
      "memo": "",
      "wordCount": 378,
      "day": 100
    },
    {
      "id": "2e25b962-8bb9-8046-a006-d85b5ddc20d1",
      "title": "유희 #098 좋은 핑계",
      "author": "유희",
      "date": "2025-12-31",
      "genre": "기타",
      "tags": [],
      "memo": "",
      "wordCount": 169,
      "day": 100
    }
  ],
  "lastUpdated": "2026-02-11T01:55:02.129Z",
  "projectInfo": {
    "startDate": "2025-09-23",
    "endDate": "2025-12-31",
    "totalDays": 100,
    "totalTargetPosts": 500
  }
};

if (typeof window !== 'undefined') {
  console.log('✅ Dashboard data loaded successfully!');
  console.log('📊 Stats:', {
    totalPosts: window.dashboardData.totalPosts,
    participants: window.dashboardData.participantCount,
    currentDay: window.dashboardData.currentDay,
    completionRate: window.dashboardData.overallCompletionRate + '%',
    totalWords: window.dashboardData.totalWords.toLocaleString() + '자'
  });
}