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

// 안전한 노션 연결 테스트
async function testNotionConnection() {
  try {
    console.log('🧪 노션 연결 테스트 중...');
    console.log('Database ID:', databaseId);
    
    // 데이터베이스 정보 확인
    const database = await notion.databases.retrieve({
      database_id: databaseId
    });
    
    console.log('✅ 데이터베이스 접근 성공!');
    console.log('데이터베이스 이름:', database.title?.[0]?.plain_text || '이름 없음');
    
    // properties 안전하게 확인
    console.log('\n📋 데이터베이스 속성 확인:');
    console.log('Raw properties:', database.properties ? 'exists' : 'null/undefined');
    console.log('Properties type:', typeof database.properties);
    
    if (database.properties && typeof database.properties === 'object') {
      const propertyNames = Object.keys(database.properties);
      console.log(`✅ ${propertyNames.length}개 속성 발견:`);
      
      propertyNames.forEach(name => {
        const prop = database.properties[name];
        console.log(`  ✓ ${name}: ${prop?.type || 'unknown'}`);
      });
      
      // 필수 속성 확인
      const requiredProps = ['제목', '작성자', '날짜'];
      const missingProps = requiredProps.filter(prop => !propertyNames.includes(prop));
      
      if (missingProps.length > 0) {
        console.warn('\n⚠️  누락된 필수 속성:', missingProps.join(', '));
      } else {
        console.log('\n✅ 모든 필수 속성이 존재합니다!');
      }
      
      return true;
    } else {
      console.warn('\n⚠️  속성 정보가 없습니다. 이는 권한 문제일 수 있습니다.');
      console.warn('하지만 기본 쿼리로 데이터 가져오기를 시도해보겠습니다...');
      return true; // 일단 계속 진행
    }
    
  } catch (error) {
    console.error('❌ 노션 연결 테스트 실패:', error.message);
    
    if (error.code === 'object_not_found') {
      console.error('\n💡 DATABASE_ID가 잘못되었거나 권한이 없습니다.');
      return false;
    } else if (error.code === 'unauthorized') {
      console.error('\n💡 NOTION_TOKEN이 유효하지 않습니다.');
      return false;
    } else {
      console.error('상세 오류:', error);
      return true; // 다른 오류는 일단 진행
    }
  }
}

// 안전한 데이터 쿼리
async function queryDatabaseSafely() {
  try {
    console.log('🔍 데이터베이스 쿼리 시도...');
    
    const response = await notion.databases.query({
      database_id: databaseId,
      page_size: 10, // 작은 크기로 테스트
    });
    
    console.log(`✅ 쿼리 성공! ${response.results.length}개 항목 발견`);
    
    if (response.results.length > 0) {
      const firstItem = response.results[0];
      console.log('\n📄 첫 번째 항목 속성 확인:');
      
      if (firstItem.properties) {
        Object.keys(firstItem.properties).forEach(name => {
          const prop = firstItem.properties[name];
          console.log(`  ${name}: ${prop?.type || 'unknown'} 타입`);
        });
      } else {
        console.warn('첫 번째 항목에 속성이 없습니다.');
      }
    }
    
    return response.results;
  } catch (error) {
    console.error('❌ 데이터베이스 쿼리 실패:', error.message);
    return [];
  }
}

// 안전한 속성값 추출
function getPropertyValue(properties, propertyName, expectedType = null) {
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
      case 'number':
        return prop.number || null;
      default:
        return null;
    }
  } catch (error) {
    console.warn(`속성 ${propertyName} 추출 실패:`, error.message);
    return null;
  }
}

// 간단한 통계 계산
function calculateBasicStats(posts) {
  const today = new Date();
  const startDate = new Date('2025-09-23');
  const currentDay = Math.min(Math.max(Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) + 1, 1), 100);
  
  const validPosts = posts.filter(post => {
    const title = getPropertyValue(post.properties, '제목', 'title');
    const author = getPropertyValue(post.properties, '작성자', 'select');
    const date = getPropertyValue(post.properties, '날짜', 'date');
    return title && author && date;
  });
  
  const authors = [...new Set(validPosts.map(post => 
    getPropertyValue(post.properties, '작성자', 'select')
  ))].filter(Boolean);
  
  return {
    totalPosts: validPosts.length,
    currentDay: currentDay,
    participantCount: authors.length,
    authors: authors,
    validPosts: validPosts
  };
}

// 메인 함수
async function updateDashboardData() {
  try {
    // 1. 노션 연결 테스트
    console.log('=== 1단계: 노션 연결 테스트 ===');
    const connectionSuccess = await testNotionConnection();
    
    if (!connectionSuccess) {
      console.error('❌ 노션 연결 실패. 기본 데이터를 생성합니다.');
      createEmergencyData();
      return;
    }
    
    // 2. 데이터 쿼리
    console.log('\n=== 2단계: 데이터 가져오기 ===');
    const posts = await queryDatabaseSafely();
    
    if (posts.length === 0) {
      console.warn('⚠️  데이터가 없습니다. 기본 데이터를 생성합니다.');
      createEmergencyData();
      return;
    }
    
    // 3. 기본 통계 계산
    console.log('\n=== 3단계: 통계 계산 ===');
    const stats = calculateBasicStats(posts);
    
    console.log('📊 기본 통계:');
    console.log(`  총 글 수: ${stats.totalPosts}`);
    console.log(`  현재 일차: ${stats.currentDay}`);
    console.log(`  참가자 수: ${stats.participantCount}`);
    console.log(`  참가자: ${stats.authors.join(', ')}`);
    
    // 4. 최근 글 목록 생성
    const recentPosts = stats.validPosts.slice(0, 3).map(post => ({
      id: post.id,
      title: getPropertyValue(post.properties, '제목', 'title') || '제목없음',
      author: getPropertyValue(post.properties, '작성자', 'select') || '익명',
      date: getPropertyValue(post.properties, '날짜', 'date') || '',
      genre: getPropertyValue(post.properties, '장르', 'select') || '기타',
      tags: getPropertyValue(post.properties, '태그', 'multi_select') || [],
      memo: getPropertyValue(post.properties, '메모', 'rich_text') || '',
      wordCount: 0, // 글자수는 일단 0으로
      day: 1
    }));
    
    // 5. 참가자별 통계
    const participantStats = stats.authors.map(author => {
      const authorPosts = stats.validPosts.filter(post => 
        getPropertyValue(post.properties, '작성자', 'select') === author
      );
      
      return {
        author,
        postCount: authorPosts.length,
        wordCount: 0, // 임시로 0
        streak: 1, // 임시로 1
        completionRate: Math.round((authorPosts.length / stats.currentDay) * 100),
      };
    });
    
    // 6. 완주율 계산
    const overallCompletionRate = stats.participantCount > 0 
      ? Math.round((stats.totalPosts / (stats.currentDay * stats.participantCount)) * 100)
      : 0;
    
    // 7. 최종 데이터 생성
    const dashboardData = {
      totalPosts: stats.totalPosts,
      currentDay: stats.currentDay,
      participantCount: stats.participantCount,
      totalWords: 0, // 임시로 0
      overallCompletionRate: overallCompletionRate,
      maxStreak: 1, // 임시로 1
      genreDistribution: { '기타': stats.totalPosts },
      participantStats: participantStats,
      recentPosts: recentPosts,
      lastUpdated: new Date().toISOString(),
      projectInfo: {
        startDate: '2025-09-23',
        endDate: '2025-12-31',
        totalDays: 100,
      }
    };

    // 8. 파일 생성
    const jsContent = `// 자동 생성된 데이터 파일
// 마지막 업데이트: ${new Date().toLocaleString('ko-KR')}
window.dashboardData = ${JSON.stringify(dashboardData, null, 2)};

if (typeof window !== 'undefined') {
  console.log('✅ Dashboard data loaded!');
  console.log('📊 Stats:', {
    totalPosts: window.dashboardData.totalPosts,
    participants: window.dashboardData.participantCount,
    currentDay: window.dashboardData.currentDay,
    completionRate: window.dashboardData.overallCompletionRate + '%'
  });
}`;

    fs.writeFileSync('data.js', jsContent);
    
    console.log('\n✅ 대시보드 데이터 업데이트 완료!');
    console.log('📊 최종 결과:', {
      totalPosts: stats.totalPosts,
      participants: stats.participantCount,
      currentDay: stats.currentDay,
      completionRate: overallCompletionRate + '%'
    });

  } catch (error) {
    console.error('❌ 전체 프로세스 오류:', error.message);
    console.error('스택 트레이스:', error.stack);
    createEmergencyData();
  }
}

// 응급 데이터 생성
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
    }
  };
  
  const emergencyContent = `// 응급 데이터 파일
window.dashboardData = ${JSON.stringify(emergencyData, null, 2)};

if (typeof window !== 'undefined') {
  console.log('⚠️ Emergency data loaded');
}`;
  
  fs.writeFileSync('data.js', emergencyContent);
  console.log('🚑 응급 데이터 파일 생성 완료');
}

updateDashboardData();
