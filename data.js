// 자동 생성된 데이터 파일
// 마지막 업데이트: 2025. 9. 23. 오전 6:51:51
window.dashboardData = {
  "totalPosts": 1,
  "currentDay": 1,
  "participantCount": 1,
  "totalWords": 2090,
  "overallCompletionRate": 1,
  "maxStreak": 1,
  "genreDistribution": {
    "에세이": 1
  },
  "participantStats": [
    {
      "author": "산호",
      "postCount": 1,
      "wordCount": 2090,
      "completionRate": 1
    }
  ],
  "recentPosts": [
    {
      "id": "2765b962-8bb9-813b-ac18-e437a168fc66",
      "title": "산호 #1 어디서부터 써야 할까.",
      "author": "산호",
      "date": "2025-09-23",
      "genre": "에세이",
      "tags": [],
      "memo": "",
      "wordCount": 2090,
      "day": 1
    }
  ],
  "lastUpdated": "2025-09-23T06:51:51.359Z",
  "projectInfo": {
    "startDate": "2025-09-23",
    "endDate": "2025-12-31",
    "totalDays": 100,
    "totalTargetPosts": 100
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