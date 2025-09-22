// 자동 생성된 데이터 파일
// 마지막 업데이트: 2025. 9. 22. 오후 6:47:10
window.dashboardData = {
  "totalPosts": 4,
  "currentDay": 1,
  "participantCount": 2,
  "totalWords": 33,
  "overallCompletionRate": 2,
  "maxStreak": 0,
  "genreDistribution": {
    "일기": 3,
    "에세이": 1
  },
  "participantStats": [
    {
      "author": "익명A",
      "postCount": 3,
      "wordCount": 5,
      "completionRate": 3
    },
    {
      "author": "익명B",
      "postCount": 1,
      "wordCount": 28,
      "completionRate": 1
    }
  ],
  "recentPosts": [
    {
      "id": "2765b962-8bb9-8034-a4ae-f1e8adf09b5f",
      "title": "샘플 4",
      "author": "익명A",
      "date": "2025-09-25",
      "genre": "일기",
      "tags": [],
      "memo": "",
      "wordCount": 0,
      "day": 3
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
      "day": 2
    },
    {
      "id": "2765b962-8bb9-8039-b01c-f4e6f3ddc499",
      "title": "샘플",
      "author": "익명A",
      "date": "2025-09-23",
      "genre": "일기",
      "tags": [],
      "memo": "",
      "wordCount": 5,
      "day": 1
    }
  ],
  "lastUpdated": "2025-09-22T18:47:10.246Z",
  "projectInfo": {
    "startDate": "2025-09-23",
    "endDate": "2025-12-31",
    "totalDays": 100,
    "totalTargetPosts": 200
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