const { Client } = require('@notionhq/client');
const fs = require('fs');

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const databaseId = process.env.DATABASE_ID;

// 에러 처리 개선
if (!process.env.NOTION_TOKEN) {
  console.error('❌ NOTION_TOKEN 환경변수가 설정되지 않았습니다.');
  process.exit(1);
}

if (!process.env.DATABASE_ID) {
  console.error('❌ DATABASE_ID 환경변수가 설정되지 않았습니다.');
  process.exit(1);
}

// 페이지 텍스트 내용 추출 함수 (개선된 버전)
async function extractPageContent(pageId, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const blocks = await notion.blocks.children.list({ 
        block_id: pageId,
        page_size: 100 // 한 번에 더 많은 블록 가져오기
      });
      
      let textContent = '';
      
      for (const block of blocks.results) {
        const content = extractTextFromBlock(block);
        if (content) {
          textContent += content + ' ';
        }
      }
      
      return textContent.trim();
    } catch (error) {
      console.warn(`Attempt ${attempt}/${retries} failed for page ${pageId}:`, error.message);
      
      if (attempt === retries) {
        console.error(`❌ Could not extract content for page ${pageId} after ${retries} attempts`);
        return '';
      }
      
      // 재시도 전 대기 (지수 백오프)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
}

// 블록에서 텍스트 추출하는 헬퍼 함수
function extractTextFromBlock(block) {
  const blockTypes = [
    'paragraph', 'heading_1', 'heading_2', 'heading_3',
    'bulleted_list_item', 'numbered_list_item', 'to_do', 
    'quote', 'code', 'callout'
  ];
  
  for (const type of blockTypes) {
    if (block.type === type && block[type]?.rich_text) {
      return block[type].rich_text.map(t => t.plain_text).join('');
    }
  }
  
  return '';
}

// 연속 기록 계산 함수 (개선된 버전)
function calculateStreak(posts, author) {
  const authorPosts = posts.filter(post => 
    post.properties.작성자?.select?.name === author
  );
  
  if (authorPosts.length === 0) return 0;
  
  // 날짜별로 정렬 (최신순)
  const sortedDates = authorPosts
    .map(post => post.properties.날짜?.date?.start)
    .filter(date => date)
    .sort()
    .reverse();
  
  if (sortedDates.length === 0) return 0;
  
  let streak = 0;
  const today = new Date();
  const startDate = new Date('2025-09-23');
  
  // 오늘부터 거꾸로 확인
  for (let i = 0; i <= 100; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);
    
    if (checkDate < startDate) break;
    
    const dateString = checkDate.toISOString().split('T')[0];
    
    if (sortedDates.includes(dateString)) {
      streak++;
    } else if (i > 0) { // 첫 날이 아닌 경우에만 중단
      break;
    }
  }
  
  return streak;
}

// Day 계산 함수
function calculateDay(dateString) {
  if (!dateString) return 0;
  const postDate = new Date(dateString);
  const startDate = new Date('2025-09-23');
  return Math.floor((postDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
}

// 메인 함수
async function updateDashboardData() {
  try {
    console.log('🔄 Fetching data from Notion...');
    
    // 노션 데이터베이스에서 모든 글 가져오기
    const response = await notion.databases.query({
      database_id: databaseId,
      sorts: [
        {
          property: '날짜',
          direction: 'descending',
        },
      ],
      page_size: 100, // 최대 페이지 크기
    });

    console.log(`📝 Found ${response.results.length} posts`);
    
    // 기본 데이터 분석
    const allPosts = response.results;
    const validPosts = allPosts.filter(post => 
      post.properties.날짜?.date?.start && 
      post.properties.작성자?.select?.name
    );
    
    console.log(`✅ Valid posts: ${validPosts.length}`);
    
    // 참가자 목록
    const participants = [...new Set(validPosts.map(post => 
      post.properties.작성자?.select?.name
    ))].filter(Boolean);
    
    console.log(`👥 Participants: ${participants.join(', ')}`);
    
    // 현재 일차 계산
    const today = new Date();
    const startDate = new Date('2025-09-23');
    const currentDay = Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) + 1;
    const daysClamped = Math.min(Math.max(currentDay, 1), 100);
    
    // 총 글자수 계산 (페이지 내용에서)
    console.log('📊 Calculating word counts...');
    let totalWords = 0;
    const postsWithWordCount = [];
    
    for (let i = 0; i < validPosts.length; i++) {
      const post = validPosts[i];
      console.log(`Processing ${i + 1}/${validPosts.length}: ${post.properties.제목?.title?.[0]?.text?.content || 'Untitled'}`);
      
      try {
        const content = await extractPageContent(post.id);
        const wordCount = content.length;
        totalWords += wordCount;
        
        postsWithWordCount.push({
          id: post.id,
          title: post.properties.제목?.title?.[0]?.text?.content || '제목 없음',
          author: post.properties.작성자?.select?.name || '익명',
          date: post.properties.날짜?.date?.start || '',
          genre: post.properties.장르?.select?.name || '기타',
          tags: post.properties.태그?.multi_select?.map(tag => tag.name) || [],
          memo: post.properties.메모?.rich_text?.[0]?.text?.content || '',
          wordCount: wordCount,
          day: calculateDay(post.properties.날짜?.date?.start),
        });
        
        // API 호출 제한을 위한 지연
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        console.warn(`⚠️  Error processing post ${post.id}:`, error.message);
        postsWithWordCount.push({
          id: post.id,
          title: post.properties.제목?.title?.[0]?.text?.content || '제목 없음',
          author: post.properties.작성자?.select?.name || '익명',
          date: post.properties.날짜?.date?.start || '',
          genre: post.properties.장르?.select?.name || '기타',
          tags: post.properties.태그?.multi_select?.map(tag => tag.name) || [],
          memo: post.properties.메모?.rich_text?.[0]?.text?.content || '',
          wordCount: 0,
          day: calculateDay(post.properties.날짜?.date?.start),
        });
      }
    }
    
    // 장르별 분포
    const genreDistribution = {};
    postsWithWordCount.forEach(post => {
      const genre = post.genre || '기타';
      genreDistribution[genre] = (genreDistribution[genre] || 0) + 1;
    });
    
    // 참가자별 통계
    const participantStats = participants.map(author => {
      const authorPosts = postsWithWordCount.filter(post => post.author === author);
      const authorWords = authorPosts.reduce((sum, post) => sum + post.wordCount, 0);
      const streak = calculateStreak(validPosts, author);
      
      return {
        author,
        postCount: authorPosts.length,
        wordCount: authorWords,
        streak: streak,
        completionRate: Math.round((authorPosts.length / daysClamped) * 100),
      };
    });
    
    // 최근 글 3개
    const recentPosts = postsWithWordCount.slice(0, 3);
    
    // 전체 완주율
    const overallCompletionRate = Math.round((validPosts.length / (daysClamped * participants.length)) * 100);
    
    // 최대 연속 기록
    const maxStreak = Math.max(...participantStats.map(p => p.streak), 0);
    
    // 최종 데이터 객체
    const dashboardData = {
      // 기본 통계
      totalPosts: validPosts.length,
      currentDay: daysClamped,
      participantCount: participants.length,
      totalWords: totalWords,
      overallCompletionRate: overallCompletionRate,
      maxStreak: maxStreak,
      
      // 분포 데이터
      genreDistribution: genreDistribution,
      participantStats: participantStats,
      
      // 최근 글
      recentPosts: recentPosts,
      
      // 메타 데이터
      lastUpdated: new Date().toISOString(),
      projectInfo: {
        startDate: '2025-09-23',
        endDate: '2025-12-31',
        totalDays: 100,
      }
    };

    // data.js 파일 생성
    const jsContent = `// 자동 생성된 데이터 파일 - 수정하지 마세요
// 마지막 업데이트: ${new Date().toLocaleString('ko-KR')}
window.dashboardData = ${JSON.stringify(dashboardData, null, 2)};

// 데이터 로드 확인
if (typeof window !== 'undefined') {
  console.log('✅ Dashboard data loaded successfully!');
  console.log('📊 Stats:', {
    totalPosts: window.dashboardData.totalPosts,
    participants: window.dashboardData.participantCount,
    currentDay: window.dashboardData.currentDay,
    completionRate: window.dashboardData.overallCompletionRate + '%',
    totalWords: window.dashboardData.totalWords.toLocaleString() + '자'
  });
}`;

    fs.writeFileSync('data.js', jsContent);
    
    console.log('✅ Dashboard data updated successfully!');
    console.log('📊 Final Stats:', {
      totalPosts: validPosts.length,
      participants: participants.length,
      currentDay: daysClamped,
      completionRate: overallCompletionRate + '%',
      totalWords: totalWords.toLocaleString() + '자',
      maxStreak: maxStreak + '일'
    });

  } catch (error) {
    console.error('❌ Error updating dashboard data:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// 실행
updateDashboardData();
