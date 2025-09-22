// 자동 생성된 데이터 파일
// 마지막 업데이트: 2025. 9. 22. 오전 6:55:21
window.dashboardData = {
  "totalPosts": 3,
  "currentDay": 1,
  "participantCount": 2,
  "totalWords": 0,
  "overallCompletionRate": 150,
  "maxStreak": 1,
  "genreDistribution": {
    "기타": 3
  },
  "participantStats": [
    {
      "author": "익명A",
      "postCount": 2,
      "wordCount": 0,
      "streak": 1,
      "completionRate": 200
    },
    {
      "author": "익명B",
      "postCount": 1,
      "wordCount": 0,
      "streak": 1,
      "completionRate": 100
    }
  ],
  "recentPosts": [
    {
      "id": "2765b962-8bb9-8039-b01c-f4e6f3ddc499",
      "title": "샘플",
      "author": "익명A",
      "date": "2025-09-23",
      "genre": "일기",
      "tags": [],
      "memo": "",
      "wordCount": 0,
      "day": 1
    },
    {
      "id": "2765b962-8bb9-8005-b455-fe9a45cad647",
      "title": "샘플2",
      "author": "익명A",
      "date": "2025-09-24",
      "genre": "일기",
      "tags": [],
      "memo": "",
      "wordCount": 0,
      "day": 1
    },
    {
      "id": "2765b962-8bb9-813b-ac18-e437a168fc66",
      "title": "(예제) 백일간의 글쓰기",
      "author": "익명B",
      "date": "2025-09-23",
      "genre": "에세이",
      "tags": [],
      "memo": "글쓰기의 본질에 대한 성찰",
      "wordCount": 0,
      "day": 1
    }
  ],
  "lastUpdated": "2025-09-22T06:55:21.524Z",
  "projectInfo": {
    "startDate": "2025-09-23",
    "endDate": "2025-12-31",
    "totalDays": 100
  }
};

if (typeof window !== 'undefined') {
  console.log('✅ Dashboard data loaded!');
  console.log('📊 Stats:', {
    totalPosts: window.dashboardData.totalPosts,
    participants: window.dashboardData.participantCount,
    currentDay: window.dashboardData.currentDay,
    completionRate: window.dashboardData.overallCompletionRate + '%'
  });
}