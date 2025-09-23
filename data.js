// 자동 생성된 데이터 파일
// 마지막 업데이트: 2025. 9. 23. 오후 4:22:05
window.dashboardData = {
  "totalPosts": 8,
  "currentDay": 1,
  "participantCount": 8,
  "totalWords": 9279,
  "overallCompletionRate": 1,
  "maxStreak": 1,
  "genreDistribution": {
    "기타": 7,
    "에세이": 1
  },
  "participantStats": [
    {
      "author": "유희",
      "postCount": 1,
      "wordCount": 1158,
      "completionRate": 1
    },
    {
      "author": "빛",
      "postCount": 1,
      "wordCount": 884,
      "completionRate": 1
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
      "author": "강아지",
      "postCount": 1,
      "wordCount": 626,
      "completionRate": 1
    },
    {
      "author": "후무",
      "postCount": 1,
      "wordCount": 900,
      "completionRate": 1
    },
    {
      "author": "무화과",
      "postCount": 1,
      "wordCount": 2071,
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
      "id": "2775b962-8bb9-80c9-aba3-f48dfea1b3e9",
      "title": "유희 #001 가을과 불안",
      "author": "유희",
      "date": "2025-09-23",
      "genre": "기타",
      "tags": [],
      "memo": "",
      "wordCount": 1158,
      "day": 1
    },
    {
      "id": "2775b962-8bb9-80c2-a31a-f02b47852c19",
      "title": "빛 #001 일",
      "author": "빛",
      "date": "2025-09-23",
      "genre": "기타",
      "tags": [],
      "memo": "",
      "wordCount": 884,
      "day": 1
    },
    {
      "id": "2775b962-8bb9-805d-8def-f92954c06a3f",
      "title": "태린 #001 친구가 죽었다.",
      "author": "태린",
      "date": "2025-09-23",
      "genre": "기타",
      "tags": [],
      "memo": "",
      "wordCount": 1247,
      "day": 1
    }
  ],
  "lastUpdated": "2025-09-23T16:22:05.402Z",
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