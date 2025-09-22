const { Client } = require('@notionhq/client');
const fs = require('fs');

// 환경변수 검증
console.log('🔍 환경변수 확인 중...');
console.log('NOTION_TOKEN 존재:', !!process.env.NOTION_TOKEN);
console.log('DATABASE_ID 존재:', !!process.env.DATABASE_ID);

if (!process.env.NOTION_TOKEN) {
  console.error('❌ NOTION_TOKEN 환경변수가 설정되지 않았습니다.');
  process.exit(1);
}

if (!process.env.DATABASE_ID) {
  console.error('❌ DATABASE_ID 환경변수가 설정되지 않았습니다.');
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

// 페이지 텍스트 내용 추출 함수 (글자수 계산용)
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

// 안전한 속성값 추출
function getPropertyValue(properties, propertyName) {
  if (!properties || !properties[propertyName]) {
    return null;
  }
  
  const prop = properties[propertyName];
  
  try {
    switch(prop.type) {
      case 'title':
        return prop.title?.[0]?.text?.content || null;
      case 'select':
        return prop.select?.name || null;
      case 'date':
        return prop.date?.start || null;
      case 'multi_select':
        return prop.multi_select?.map(s => s.name) || [];
      case 'rich_text':
        return prop.rich_text?.[0]?.text?.content || null;
      case 'checkbox':
        return prop.checkbox || false;
      default:
        return null;
    }
  } catch (error) {
    console.warn(`속성 ${propertyName} 추출 실패:`, error.message);
    return null;
  }
}

// Day 계산 함수
function calculateDay(dateString) {
  if (!dateString) return 0;
  const postDate = new Date(dateString);
  const startDate = new Date('2025-09-23');
  return Math.floor((postDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
}

// 연속 기록 계산 함수
function calculateStreak(posts, author) {
  console.log(`\n🔥 ${author}의 연속 기록 계산:`);
  
  const authorPosts = posts.filter(post => 
    getPropertyValue(post.properties, '작성자') === author
  );
  
  if (authorPosts.length === 0) {
    console.log(`   ${author}의 글이 없습니다.`);
    return 0;
  }
  
  // 날짜별로 정렬 (최신순)
  const sortedDates = authorPosts
    .map(post => getPropertyValue(post.properties, '날짜'))
    .filter(date => date)
    .sort()
    .reverse();
  
  console.log(`   ${author}의 작성 날짜: ${sortedDates.join(', ')}`);
  
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
      console.log(`   ${dateString}: ✅ (연속 ${streak}일)`);
    } else if (i > 0) {
      console.log(`   ${dateString}: ❌ (연속 기록 중단)`);
      break;
    }
  }
  
  console.log(`   최종 연속 기록: ${streak}일`);
  return streak;
}

// 메인 함수
async function updateDashboardData() {
  try {
    console.log('=== 1단계: 노션 연결 및 데이터 가져오기 ===');
    
    // 데이터베이스 쿼리
    const response = await notion.databases.query({
      database_id: databaseId,
      sorts: [{ property: '날짜', direction: 'descending' }],
      page_size: 100,
    });

    console.log(`📝 총 ${response.results.length}개 항목 발견`);
    
    // 유효한 글 필터링
    const validPosts = response.results.filter(post => {
      const title = getPropertyValue(post.properties, '제목');
      const author = getPropertyValue(post.properties, '작성자');
      const date = getPropertyValue(post.properties, '날짜');
      return title && author && date;
    });
    
    console.log(`✅ 유효한 글: ${validPosts.length}개`);
    
    if (validPosts.length === 0) {
      console.warn('⚠️  유효한 글이 없습니다. 기본 데이터를 생성합니다.');
      createEmergencyData();
      return;
    }
    
    // 참가자 목록
    const participants = [...new Set(validPosts.map(post => 
      getPropertyValue(post.properties, '작성자')
    ))].filter(Boolean);
    
    console.log(`👥 참가자 (${participants.length}명): ${participants.join(', ')}`);
    
    // 현재 일차 계산
    const today = new Date();
    const startDate = new Date('2025-09-23');
    const currentDay = Math.min(Math.max(Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) + 1, 1), 100);
    console.log(`📅 현재 일차: ${currentDay}`);
    
    console.log('\n=== 2단계: 글자수 계산 ===');
    let totalWords = 0;
    const postsWithWordCount = [];
    
    // 모든 글의 글자수 계산
    console.log(`📊 글자수 계산 중... (${validPosts.length}개 글 처리)`);
    
    for (let i = 0; i < validPosts.length; i++) {
      const post = validPosts[i];
      const title = getPropertyValue(post.properties, '제목') || '제목없음';
              console.log(`처리 중 ${i + 1}/${validPosts.length}: ${title}`);
      
      try {
        const content = await extractPageContent(post.id);
        const wordCount = content.length;
        totalWords += wordCount;
        
        postsWithWordCount.push({
          id: post.id,
          title: title,
          author: getPropertyValue(post.properties, '작성자') || '익명',
          date: getPropertyValue(post.properties, '날짜') || '',
          genre: getPropertyValue(post.properties, '장르') || '기타',
          tags: getPropertyValue(post.properties, '태그') || [],
          memo: getPropertyValue(post.properties, '메모') || '',
          wordCount: wordCount,
          day: calculateDay(getPropertyValue(post.properties, '날짜')),
        });
        
        console.log(`     글자수: ${wordCount}자`);
        
        // API 호출 제한을 위한 지연
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.warn(`⚠️  ${title} 처리 실패:`, error.message);
        postsWithWordCount.push({
          id: post.id,
          title: title,
          author: getPropertyValue(post.properties, '작성자') || '익명',
          date: getPropertyValue(post.properties, '날짜') || '',
          genre: getPropertyValue(post.properties, '장르') || '기타',
          tags: [],
          memo: '',
          wordCount: 0,
          day: calculateDay(getPropertyValue(post.properties, '날짜')),
        });
      }
    }
    
    // 나머지 글들은 글자수 0으로 추가
    for (let i = validPosts.length; i < validPosts.length; i++) { // 더미 루프 제거
      // 실제로는 모든 글을 처리했으므로 이 루프는 실행되지 않음
    }
    
    console.log(`📈 총 글자수: ${totalWords.toLocaleString()}자`);
    
    console.log('\n=== 3단계: 장르별 분포 계산 ===');
    const genreDistribution = {};
    postsWithWordCount.forEach(post => {
      const genre = post.genre || '기타';
      genreDistribution[genre] = (genreDistribution[genre] || 0) + 1;
    });
    
    console.log('장르별 분포:', genreDistribution);
    
    console.log('\n=== 4단계: 참가자별 통계 및 평균 완주율 계산 ===');
    const participantStats = participants.map(author => {
      const authorPosts = postsWithWordCount.filter(post => post.author === author);
      const authorWords = authorPosts.reduce((sum, post) => sum + post.wordCount, 0);
      
      return {
        author,
        postCount: authorPosts.length,
        wordCount: authorWords,
        completionRate: Math.round((authorPosts.length / 100) * 100), // 개인 완주율
      };
    });
    
    // 평균 완주율 계산
    const averageCompletionRate = participantStats.length > 0 
      ? Math.round(participantStats.reduce((sum, stat) => sum + stat.completionRate, 0) / participantStats.length)
      : 0;
    
    console.log('\n👤 참가자별 통계:');
    participantStats.forEach(stat => {
      console.log(`   ${stat.author}: ${stat.postCount}글, ${stat.wordCount}자, ${stat.completionRate}% 개인완주율`);
    });
    console.log(`📊 평균 완주율: ${averageCompletionRate}%`);
    
    // 최대 연속 기록만 계산
    console.log('\n=== 5단계: 최대 연속 기록 계산 ===');
    let maxStreak = 0;
    participants.forEach(author => {
      const streak = calculateStreak(validPosts, author);
      if (streak > maxStreak) {
        maxStreak = streak;
      }
    });
    console.log(`🔥 최대 연속 기록: ${maxStreak}일`);
    
    console.log('\n=== 6단계: 전체 완주율 계산 ===');
    // 전체 완주율: 현재 글 수 / (참가자 수 × 100) × 100
    const totalTargetPosts = participants.length * 100;
    const overallCompletionRate = Math.round((validPosts.length / totalTargetPosts) * 100);
    
    console.log(`전체 목표 글 수: ${totalTargetPosts}개 (${participants.length}명 × 100일)`);
    console.log(`현재 글 수: ${validPosts.length}개`);
    console.log(`전체 완주율: ${overallCompletionRate}%`);
    
    // 최근 글 3개
    const recentPosts = postsWithWordCount.slice(0, 3);
    
    console.log('\n=== 7단계: 최종 데이터 생성 ===');
    const dashboardData = {
      totalPosts: validPosts.length,
      currentDay: currentDay,
      participantCount: participants.length,
      totalWords: totalWords,
      overallCompletionRate: averageCompletionRate, // 평균 완주율 사용
      maxStreak: maxStreak,
      genreDistribution: genreDistribution,
      participantStats: participantStats,
      recentPosts: recentPosts,
      lastUpdated: new Date().toISOString(),
      projectInfo: {
        startDate: '2025-09-23',
        endDate: '2025-12-31',
        totalDays: 100,
        totalTargetPosts: totalTargetPosts,
      }
    };

    const jsContent = `// 자동 생성된 데이터 파일
// 마지막 업데이트: ${new Date().toLocaleString('ko-KR')}
window.dashboardData = ${JSON.stringify(dashboardData, null, 2)};

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
    
    console.log('\n✅ 대시보드 데이터 업데이트 완료!');
    console.log('📊 최종 통계:', {
      totalPosts: validPosts.length,
      participants: participants.length,
      currentDay: currentDay,
      completionRate: overallCompletionRate + '%',
      totalWords: totalWords.toLocaleString() + '자',
      maxStreak: maxStreak + '일',
      totalTargetPosts: totalTargetPosts
    });

  } catch (error) {
    console.error('❌ 전체 프로세스 오류:', error.message);
    console.error('스택 트레이스:', error.stack);
    createEmergencyData();
  }
}

// 응급 데이터 생성 함수
function createEmergencyData() {
  const today = new Date();
  const startDate = new Date('2025-09-23');
  const currentDay = Math.min(Math.max(Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) + 1, 1), 100);
  
  const emergencyData = {
    totalPosts: 0,
    currentDay: currentDay,
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
      totalTargetPosts: 0,
    }
  };
  
  const emergencyContent = `// 오류 발생으로 인한 응급 데이터
window.dashboardData = ${JSON.stringify(emergencyData, null, 2)};

if (typeof window !== 'undefined') {
  console.log('⚠️ Emergency data loaded');
}`;
  
  fs.writeFileSync('data.js', emergencyContent);
  console.log('🚑 응급 데이터 파일 생성 완료');
}

updateDashboardData();
