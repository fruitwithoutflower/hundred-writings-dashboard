// 자동 생성된 데이터 파일
// 마지막 업데이트: 2025. 9. 23. 오후 1:19:57
window.dashboardData = {
  "totalPosts": 6,
  "currentDay": 1,
  "participantCount": 6,
  "totalWords": 7237,
  "overallCompletionRate": 1,
  "maxStreak": 1,
  "genreDistribution": {
    "기타": 5,
    "에세이": 1
  },
  "participantStats": [
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
      "id": "2775b962-8bb9-805d-8def-f92954c06a3f",
      "title": "태린 #001 친구가 죽었다.",
      "author": "태린",
      "date": "2025-09-23",
      "genre": "기타",
      "tags": [],
      "memo": "",
      "wordCount": 1247,
      "day": 1
    },
    {
      "id": "2775b962-8bb9-807a-b0a0-ff034b5aa5e1",
      "title": "두루 #001 연기",
      "author": "두루",
      "date": "2025-09-23",
      "genre": "기타",
      "tags": [],
      "memo": "",
      "wordCount": 303,
      "day": 1
    },
    {
      "id": "2775b962-8bb9-8014-b463-cb5563ab2918",
      "title": "강아지 #001 친구는 양보하는 역할이다.",
      "author": "강아지",
      "date": "2025-09-23",
      "genre": "기타",
      "tags": [],
      "memo": "",
      "wordCount": 626,
      "day": 1
    }
  ],
  "lastUpdated": "2025-09-23T13:19:57.598Z",
  "projectInfo": {
    "startDate": "2025-09-23",
    "endDate": "2025-12-31",
    "totalDays": 100,
    "totalTargetPosts": 600
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