// 기본 데이터 파일 - 노션 동기화 전까지 사용
// 마지막 업데이트: 수동 생성
window.dashboardData = {
  // 기본 통계
  totalPosts: 3,
  currentDay: 1,
  participantCount: 1,
  totalWords: 643,
  overallCompletionRate: 100,
  maxStreak: 1,
  
  // 분포 데이터
  genreDistribution: {
    "일상": 2,
    "기타": 1
  },
  participantStats: [
    {
      author: "작성자",
      postCount: 3,
      wordCount: 643,
      streak: 1,
      completionRate: 100
    }
  ],
  
  // 최근 글
  recentPosts: [
    {
      id: "sample1",
      title: "첫 번째 글",
      author: "작성자",
      date: "2025-09-23",
      genre: "일상",
      tags: [],
      memo: "",
      wordCount: 200,
      day: 1
    },
    {
      id: "sample2", 
      title: "두 번째 글",
      author: "작성자",
      date: "2025-09-23",
      genre: "일상", 
      tags: [],
      memo: "",
      wordCount: 220,
      day: 1
    },
    {
      id: "sample3",
      title: "세 번째 글", 
      author: "작성자",
      date: "2025-09-23",
      genre: "기타",
      tags: [],
      memo: "",
      wordCount: 223,
      day: 1
    }
  ],
  
  // 메타 데이터
  lastUpdated: new Date().toISOString(),
  projectInfo: {
    startDate: '2025-09-23',
    endDate: '2025-12-31',
    totalDays: 100,
  }
};

// 데이터 로드 확인
if (typeof window !== 'undefined') {
  console.log('✅ Default dashboard data loaded!');
  console.log('📊 Stats:', {
    totalPosts: window.dashboardData.totalPosts,
    participants: window.dashboardData.participantCount,
    currentDay: window.dashboardData.currentDay,
    completionRate: window.dashboardData.overallCompletionRate + '%',
    totalWords: window.dashboardData.totalWords.toLocaleString() + '자'
  });
}
