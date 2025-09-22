const { Client } = require('@notionhq/client');
const fs = require('fs');

// 환경변수 검증
console.log('🔍 환경변수 확인 중...');
console.log('NOTION_TOKEN 존재:', !!process.env.NOTION_TOKEN);
console.log('DATABASE_ID 존재:', !!process.env.DATABASE_ID);

if (!process.env.NOTION_TOKEN) {
  console.error('❌ NOTION_TOKEN 환경변수가 설정되지 않았습니다.');
  console.error('GitHub Secrets에서 NOTION_TOKEN을 확인해주세요.');
  process.exit(1);
}

if (!process.env.DATABASE_ID) {
  console.error('❌ DATABASE_ID 환경변수가 설정되지 않았습니다.');
  console.error('GitHub Secrets에서 DATABASE_ID를 확인해주세요.');
  process.exit(1);
}

// 노션 클라이언트 초기화
let notion;
try {
  console.log('🔧 노션 클라이언트 초기화 중...');
  notion = new Client({
    auth: process.env.NOTION_TOKEN,
  });
  console.log('✅ 노션 클라이언트 초기화 성공');
} catch (error) {
  console.error('❌ 노션 클라이언트 초기화 실패:', error.message);
  process.exit(1);
}

const databaseId = process.env.DATABASE_ID;

// 노션 연결 테스트 함수
async function testNotionConnection() {
  try {
    console.log('🧪 노션 연결 테스트 중...');
    console.log('Database ID:', databaseId);
    
    // 데이터베이스 정보 먼저 확인
    const database = await notion.databases.retrieve({
      database_id: databaseId
    });
    
    console.log('✅ 데이터베이스 접근 성공!');
    console.log('데이터베이스 이름:', database.title?.[0]?.plain_text || '이름 없음');
    
    // 속성 확인
    console.log('\n📋 데이터베이스 속성:');
    Object.entries(database.properties).forEach(([name, prop]) => {
      console.log(`  ${name}: ${prop.type}`);
    });
    
    return true;
  } catch (error) {
    console.error('❌ 노션 연결 테스트 실패:', error.message);
    console.error('상세 오류:', error);
    
    if (error.code === 'object_not_found') {
      console.error('\n💡 해결 방법:');
      console.error('1. DATABASE_ID가 올바른지 확인하세요');
      console.error('2. 노션에서 인테그레이션을 해당 페이지에 연결하세요');
      console.error('   - 노션 페이지 → 공유 → 연결 추가 → 인테그레이션 선택');
    } else if (error.code === 'unauthorized') {
      console.error('\n💡 해결 방법:');
      console.error('1. NOTION_TOKEN이 올바른지 확인하세요');
      console.error('2. 토큰이 만료되지 않았는지 확인하세요');
    }
    
    return false;
  }
}

// 페이지 텍스트 내용 추출 함수
async function extractPageContent(pageId, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const blocks = await notion.blocks.children.list({ 
        block_id: pageId,
        page_size: 100
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
      console.warn(`⚠️  페이지 ${pageId} 시도 ${attempt}/${retries} 실패:`, error.message);
      
      if (attempt === retries) {
        console.error(`❌ 페이지 ${pageId} 최종 실패`);
        return '';
      }
      
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
}

// 블록에서 텍스트 추출
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

// 연속 기록 계산
function calculateStreak(posts, author) {
  const authorPosts = posts.filter(post => 
    post.properties.작성자?.select?.name === author
  );
  
  if (authorPosts.length === 0) return 0;
  
  const sortedDates = authorPosts
    .map(post => post.properties.날짜?.date?.start)
    .filter(date => date)
    .sort()
    .reverse();
  
  if (sortedDates.length === 0) return 0;
  
  let streak = 0;
  const today = new Date();
  const startDate = new Date('2025-09-23');
  
  for (let i = 0; i <= 100; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);
    
    if (checkDate < startDate) break;
    
    const dateString = checkDate.toISOString().split('T')[0];
    
    if (sortedDates.includes(dateString)) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }
  
  return streak;
}

// Day 계산
function calculateDay(dateString) {
  if (!dateString) return 0;
  const postDate = new Date(dateString);
  const startDate = new Date('2025-09-23');
  return Math.floor((postDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
}

// 메인 함수
async function updateDashboardData() {
  try {
    // 1. 노션 연결 테스트
    const connectionSuccess = await testNotionConnection();
    if (!connectionSuccess) {
      console.error('❌ 노션 연결 실패로 인해 종료합니다.');
      process.exit(1);
    }
    
    // 2. 데이터 가져오기
    console.log('\n🔄 노션에서 데이터 가져오는 중...');
    
    const response = await notion.databases.query({
      database_id: databaseId,
      sorts: [
        {
          property: '날짜',
          direction: 'descending',
        },
      ],
      page_size: 100,
    });

    console.log(`📝 총 ${response.results.length}개 항목 발견`);
    
    // 3. 데이터 검증
    const allPosts = response.results;
    const validPosts = allPosts.filter(post => 
      post.properties.날짜?.date?.start && 
      post.properties.작성자?.select?.name
    );
    
    console.log(`✅ 유효한 글: ${validPosts.length}개`);
    
    if (validPosts.length === 0) {
      console.warn('⚠️  유효한 글이 없습니다. 기본 데이터를 생성합니다.');
      // 기본 데이터 생성
      const defaultData = {
        totalPosts: 0,
        currentDay: Math.max(1, Math.floor((new Date() - new Date('2025-09-23')) / (1000 * 60 * 60 * 24)) + 1),
        participantCount: 0,
        totalWords: 0,
        overallCompletionRate: 0,
        maxStreak: 0,
        genreDistribution: {},
        participantStats: [],
        recentPosts: [],
        lastUpdated: new Date().toISOString(),
        projectInfo: {
          startDate: '2025-09-23',
          endDate: '2025-12-31',
          totalDays: 100,
        }
      };
      
      const jsContent = `window.dashboardData = ${JSON.stringify(defaultData, null, 2)};`;
      fs.writeFileSync('data.js', jsContent);
      console.log('✅ 기본 데이터 파일 생성 완료');
      return;
    }
    
    // 4. 실제 데이터 처리 (기존 로직)
    const participants = [...new Set(validPosts.map(post => 
      post.properties.작성자?.select?.name
    ))].filter(Boolean);
    
    console.log(`👥 참가자: ${participants.join(', ')}`);
    
    const today = new Date();
    const startDate = new Date('2025-09-23');
    const currentDay = Math.min(Math.max(Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) + 1, 1), 100);
    
    console.log('📊 글자수 계산 중...');
    let totalWords = 0;
    const postsWithWordCount = [];
    
    for (let i = 0; i < Math.min(validPosts.length, 20); i++) { // 처음 20개만 처리
      const post = validPosts[i];
      const title = post.properties.제목?.title?.[0]?.text?.content || '제목없음';
      console.log(`처리 중 ${i + 1}/${Math.min(validPosts.length, 20)}: ${title}`);
      
      try {
        const content = await extractPageContent(post.id);
        const wordCount = content.length;
        totalWords += wordCount;
        
        postsWithWordCount.push({
          id: post.id,
          title: title,
          author: post.properties.작성자?.select?.name || '익명',
          date: post.properties.날짜?.date?.start || '',
          genre: post.properties.장르?.select?.name || '기타',
          tags: post.properties.태그?.multi_select?.map(tag => tag.name) || [],
          memo: post.properties.메모?.rich_text?.[0]?.text?.content || '',
          wordCount: wordCount,
          day: calculateDay(post.properties.날짜?.date?.start),
        });
        
        await new Promise(resolve => setTimeout(resolve, 500)); // 더 긴 지연
      } catch (error) {
        console.warn(`⚠️  ${title} 처리 실패:`, error.message);
        postsWithWordCount.push({
          id: post.id,
          title: title,
          author: post.properties.작성자?.select?.name || '익명',
          date: post.properties.날짜?.date?.start || '',
          genre: post.properties.장르?.select?.name || '기타',
          tags: [],
          memo: '',
          wordCount: 0,
          day: calculateDay(post.properties.날짜?.date?.start),
        });
      }
    }
    
    // 나머지 글들은 글자수 0으로 추가
    for (let i = 20; i < validPosts.length; i++) {
      const post = validPosts[i];
      postsWithWordCount.push({
        id: post.id,
        title: post.properties.제목?.title?.[0]?.text?.content || '제목없음',
        author: post.properties.작성자?.select?.name || '익명',
        date: post.properties.날짜?.date?.start || '',
        genre: post.properties.장르?.select?.name || '기타',
        tags: post.properties.태그?.multi_select?.map(tag => tag.name) || [],
        memo: post.properties.메모?.rich_text?.[0]?.text?.content || '',
        wordCount: 0,
        day: calculateDay(post.properties.날짜?.date?.start),
      });
    }
    
    // 통계 계산
    const genreDistribution = {};
    postsWithWordCount.forEach(post => {
      const genre = post.genre || '기타';
      genreDistribution[genre] = (genreDistribution[genre] || 0) + 1;
    });
    
    const participantStats = participants.map(author => {
      const authorPosts = postsWithWordCount.filter(post => post.author === author);
      const authorWords = authorPosts.reduce((sum, post) => sum + post.wordCount, 0);
      const streak = calculateStreak(validPosts, author);
      
      return {
        author,
        postCount: authorPosts.length,
        wordCount: authorWords,
        streak: streak,
        completionRate: Math.round((authorPosts.length / currentDay) * 100),
      };
    });
    
    const recentPosts = postsWithWordCount.slice(0, 3);
    const overallCompletionRate = Math.round((validPosts.length / (currentDay * participants.length)) * 100);
    const maxStreak = Math.max(...participantStats.map(p => p.streak), 0);
    
    const dashboardData = {
      totalPosts: validPosts.length,
      currentDay: currentDay,
      participantCount: participants.length,
      totalWords: totalWords,
      overallCompletionRate: overallCompletionRate,
      maxStreak: maxStreak,
      genreDistribution: genreDistribution,
      participantStats: participantStats,
      recentPosts: recentPosts,
      lastUpdated: new Date().toISOString(),
      projectInfo: {
        startDate: '2025-09-23',
        endDate: '2025-12-31',
        totalDays: 100,
      }
    };

    const jsContent = `// 자동 생성된 데이터 파일
// 마지막 업데이트: ${new Date().toLocaleString('ko-KR')}
window.dashboardData = ${JSON.stringify(dashboardData, null, 2)};

if (typeof window !== 'undefined') {
  console.log('✅ Dashboard data loaded!');
}`;

    fs.writeFileSync('data.js', jsContent);
    
    console.log('✅ 대시보드 데이터 업데이트 완료!');
    console.log('📊 최종 통계:', {
      totalPosts: validPosts.length,
      participants: participants.length,
      currentDay: currentDay,
      completionRate: overallCompletionRate + '%',
      totalWords: totalWords.toLocaleString() + '자',
      maxStreak: maxStreak + '일'
    });

  } catch (error) {
    console.error('❌ 전체 프로세스 오류:', error.message);
    console.error('스택 트레이스:', error.stack);
    
    // 오류 발생시 기본 데이터라도 생성
    const emergencyData = {
      totalPosts: 0,
      currentDay: 1,
      participantCount: 0,
      totalWords: 0,
      overallCompletionRate: 0,
      maxStreak: 0,
      genreDistribution: {},
      participantStats: [],
      recentPosts: [],
      lastUpdated: new Date().toISOString(),
      projectInfo: {
        startDate: '2025-09-23',
        endDate: '2025-12-31',
        totalDays: 100,
      }
    };
    
    const emergencyContent = `// 오류 발생으로 인한 응급 데이터
window.dashboardData = ${JSON.stringify(emergencyData, null, 2)};`;
    
    fs.writeFileSync('data.js', emergencyContent);
    console.log('🚑 응급 데이터 파일 생성 완료');
    
    process.exit(1);
  }
}

updateDashboardData();
