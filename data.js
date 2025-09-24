// 자동 생성된 데이터 파일
// 마지막 업데이트: 2025. 9. 24. 오후 6:44:37
window.dashboardData = {
  "totalPosts": 12,
  "currentDay": 2,
  "participantCount": 8,
  "totalWords": 12869,
  "overallCompletionRate": 2,
  "maxStreak": 2,
  "genreDistribution": {
    "기타": 11,
    "에세이": 1
  },
  "participantStats": [
    {
      "author": "무화과",
      "postCount": 2,
      "wordCount": 3309,
      "completionRate": 2
    },
    {
      "author": "강아지",
      "postCount": 2,
      "wordCount": 829,
      "completionRate": 2
    },
    {
      "author": "유희",
      "postCount": 2,
      "wordCount": 2762,
      "completionRate": 2
    },
    {
      "author": "빛",
      "postCount": 2,
      "wordCount": 1429,
      "completionRate": 2
    },
    {
      "author": "태린",
      "postCount": 1,
      "wordCount": 1247,
      "completionRate": 1
    },
    {
      "author": "두루",
      "postCount": 1,
      "wordCount": 303,
      "completionRate": 1
    },
    {
      "author": "후무",
      "postCount": 1,
      "wordCount": 900,
      "completionRate": 1
    },
    {
      "author": "산호",
      "postCount": 1,
      "wordCount": 2090,
      "completionRate": 1
    }
  ],
  "recentPosts": [
    {
      "id": "2785b962-8bb9-80b4-8e39-e85f4fa87259",
      "title": "무화과 #002 2진법",
      "author": "무화과",
      "date": "2025-09-24",
      "genre": "기타",
      "tags": [],
      "memo": "",
      "wordCount": 1238,
      "day": 2
    },
    {
      "id": "2785b962-8bb9-80ef-9c5e-f02d96395286",
      "title": "강아지 #002",
      "author": "강아지",
      "date": "2025-09-24",
      "genre": "기타",
      "tags": [],
      "memo": "",
      "wordCount": 203,
      "day": 2
    },
    {
      "id": "2785b962-8bb9-8083-af0d-fd14f22988b8",
      "title": "유희 #002 피바람",
      "author": "유희",
      "date": "2025-09-24",
      "genre": "기타",
      "tags": [],
      "memo": "",
      "wordCount": 1604,
      "day": 2
    }
  ],
  "lastUpdated": "2025-09-24T18:44:37.850Z",
  "projectInfo": {
    "startDate": "2025-09-23",
    "endDate": "2025-12-31",
    "totalDays": 100,
    "totalTargetPosts": 800
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