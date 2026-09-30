// 더미 데이터로 화면 보여주기
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('sajuForm');
    const resultSection = document.getElementById('resultSection');

    // 결과 섹션 처음부터 보여주기 (더미데이터 테스트용)
    resultSection.classList.add('active');

    // 폼 제출 시 기본 동작 막기
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 실제로는 여기서 입력값을 가져와서 분석 로직 실행
        // 지금은 더미데이터만 보여주기
        alert('사주 분석 기능은 아직 구현 중입니다. 더미데이터를 확인해주세요!');
    });

    // 저장 버튼 클릭
    document.querySelector('.save-btn').addEventListener('click', function() {
        alert('결과 저장 기능은 아직 구현 중입니다.');
    });

    // 공유 버튼 클릭
    document.querySelector('.share-btn').addEventListener('click', function() {
        alert('결과 공유 기능은 아직 구현 중입니다.');
    });
});
