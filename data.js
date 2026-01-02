// 자동 생성된 데이터 파일
// 마지막 업데이트: 2026. 1. 2. 오전 6:27:12
window.dashboardData = {
  "totalPosts": 98,
  "currentDay": 100,
  "participantCount": 8,
  "totalWords": 100354,
  "overallCompletionRate": 12,
  "maxStreak": 0,
  "genreDistribution": {
    "기타": 98
  },
  "participantStats": [
    {
      "author": "무화과",
      "postCount": 20,
      "wordCount": 31721,
      "completionRate": 20
    },
    {
      "author": "태린",
      "postCount": 22,
      "wordCount": 12945,
      "completionRate": 22
    },
    {
      "author": "유희",
      "postCount": 26,
      "wordCount": 23430,
      "completionRate": 26
    },
    {
      "author": "후무",
      "postCount": 14,
      "wordCount": 20574,
      "completionRate": 14
    },
    {
      "author": "두루",
      "postCount": 3,
      "wordCount": 728,
      "completionRate": 3
    },
    {
      "author": "산호",
      "postCount": 4,
      "wordCount": 4660,
      "completionRate": 4
    },
    {
      "author": "빛",
      "postCount": 8,
      "wordCount": 5352,
      "completionRate": 8
    },
    {
      "author": "강아지",
      "postCount": 1,
      "wordCount": 944,
      "completionRate": 1
    }
  ],
  "recentPosts": [
    {
      "id": "2a85b962-8bb9-8063-a805-cfabd96b312f",
      "title": "무화과 #036 노래방",
      "author": "무화과",
      "date": "2025-11-10",
      "genre": "기타",
      "tags": [],
      "memo": "",
      "wordCount": 936,
      "day": 49
    },
    {
      "id": "2a85b962-8bb9-808a-860a-cfa0bbc916db",
      "title": "태린 #037",
      "author": "태린",
      "date": "2025-11-08",
      "genre": "기타",
      "tags": [],
      "memo": "",
      "wordCount": 461,
      "day": 47
    },
    {
      "id": "2a85b962-8bb9-80ea-b882-ef45c6dc3f09",
      "title": "태린 #036",
      "author": "태린",
      "date": "2025-11-07",
      "genre": "기타",
      "tags": [],
      "memo": "",
      "wordCount": 598,
      "day": 46
    }
  ],
  "lastUpdated": "2026-01-02T06:27:12.447Z",
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