// 자동 생성된 데이터 파일
// 마지막 업데이트: 2025. 9. 27. 오후 1:06:59
window.dashboardData = {
  "totalPosts": 23,
  "currentDay": 5,
  "participantCount": 9,
  "totalWords": 26495,
  "overallCompletionRate": 3,
  "maxStreak": 0,
  "genreDistribution": {
    "기타": 21,
    "일기": 1,
    "에세이": 1
  },
  "participantStats": [
    {
      "author": "빛",
      "postCount": 3,
      "wordCount": 1622,
      "completionRate": 3
    },
    {
      "author": "두루",
      "postCount": 3,
      "wordCount": 1215,
      "completionRate": 3
    },
    {
      "author": "태린",
      "postCount": 3,
      "wordCount": 3558,
      "completionRate": 3
    },
    {
      "author": "카야",
      "postCount": 1,
      "wordCount": 347,
      "completionRate": 1
    },
    {
      "author": "무화과",
      "postCount": 3,
      "wordCount": 5312,
      "completionRate": 3
    },
    {
      "author": "후무",
      "postCount": 3,
      "wordCount": 4151,
      "completionRate": 3
    },
    {
      "author": "유희",
      "postCount": 3,
      "wordCount": 3688,
      "completionRate": 3
    },
    {
      "author": "산호",
      "postCount": 2,
      "wordCount": 5773,
      "completionRate": 2
    },
    {
      "author": "강아지",
      "postCount": 2,
      "wordCount": 829,
      "completionRate": 2
    }
  ],
  "recentPosts": [
    {
      "id": "27a5b962-8bb9-8033-af9f-e0f9ec3fc6d6",
      "title": "빛 #003",
      "author": "빛",
      "date": "2025-09-25",
      "genre": "기타",
      "tags": [],
      "memo": "",
      "wordCount": 193,
      "day": 3
    },
    {
      "id": "27a5b962-8bb9-802a-a51e-f25fee4c2767",
      "title": "두루 #003",
      "author": "두루",
      "date": "2025-09-25",
      "genre": "기타",
      "tags": [],
      "memo": "",
      "wordCount": 441,
      "day": 3
    },
    {
      "id": "27a5b962-8bb9-80d7-88ce-d822fb74683f",
      "title": "태린 #003",
      "author": "태린",
      "date": "2025-09-25",
      "genre": "기타",
      "tags": [],
      "memo": "",
      "wordCount": 1416,
      "day": 3
    }
  ],
  "lastUpdated": "2025-09-27T13:06:59.016Z",
  "projectInfo": {
    "startDate": "2025-09-23",
    "endDate": "2025-12-31",
    "totalDays": 100,
    "totalTargetPosts": 900
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