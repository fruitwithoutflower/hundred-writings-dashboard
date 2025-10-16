// 자동 생성된 데이터 파일
// 마지막 업데이트: 2025. 10. 16. 오후 1:42:54
window.dashboardData = {
  "totalPosts": 100,
  "currentDay": 24,
  "participantCount": 9,
  "totalWords": 96045,
  "overallCompletionRate": 11,
  "maxStreak": 1,
  "genreDistribution": {
    "기타": 100
  },
  "participantStats": [
    {
      "author": "후무",
      "postCount": 15,
      "wordCount": 19490,
      "completionRate": 15
    },
    {
      "author": "유희",
      "postCount": 19,
      "wordCount": 13676,
      "completionRate": 19
    },
    {
      "author": "태린",
      "postCount": 19,
      "wordCount": 14915,
      "completionRate": 19
    },
    {
      "author": "무화과",
      "postCount": 17,
      "wordCount": 25963,
      "completionRate": 17
    },
    {
      "author": "산호",
      "postCount": 4,
      "wordCount": 2861,
      "completionRate": 4
    },
    {
      "author": "빛",
      "postCount": 12,
      "wordCount": 10794,
      "completionRate": 12
    },
    {
      "author": "강아지",
      "postCount": 4,
      "wordCount": 3953,
      "completionRate": 4
    },
    {
      "author": "두루",
      "postCount": 5,
      "wordCount": 3121,
      "completionRate": 5
    },
    {
      "author": "카야",
      "postCount": 5,
      "wordCount": 1272,
      "completionRate": 5
    }
  ],
  "recentPosts": [
    {
      "id": "28d5b962-8bb9-802b-8a67-e0f6560dacc3",
      "title": "후무 #019 무기력",
      "author": "후무",
      "date": "2025-10-15",
      "genre": "기타",
      "tags": [],
      "memo": "",
      "wordCount": 757,
      "day": 23
    },
    {
      "id": "28d5b962-8bb9-80c4-82c9-cbfc522e68ac",
      "title": "유희 #022 미스테리",
      "author": "유희",
      "date": "2025-10-14",
      "genre": "기타",
      "tags": [],
      "memo": "",
      "wordCount": 463,
      "day": 22
    },
    {
      "id": "28d5b962-8bb9-80fb-a082-e845e2e77e93",
      "title": "태린 #022",
      "author": "태린",
      "date": "2025-10-14",
      "genre": "기타",
      "tags": [],
      "memo": "",
      "wordCount": 32,
      "day": 22
    }
  ],
  "lastUpdated": "2025-10-16T13:42:54.762Z",
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