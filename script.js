// API 키
const API_KEY = 'sajuapi_free_n0aKA15ygK2CM9pTflXyTEqIy3agLgi';

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('sajuForm');
    const resultSection = document.getElementById('resultSection');

    // 결과 섹션 처음에는 숨기기
    resultSection.classList.remove('active');

    // 폼 제출 시 API 호출
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // 입력값 가져오기
        const name = document.getElementById('name').value;
        const birthdate = document.getElementById('birthdate').value;
        const gender = document.getElementById('gender').value;
        const mbti = document.getElementById('mbti').value;

        // 생년월일 파싱
        const date = new Date(birthdate);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        // 성별 변환
        const genderCode = gender === 'male' ? 'M' : 'F';

        try {
            // API 호출
            const response = await fetch('https://saju-api.pages.dev/api/v1/calculate', {
                method: 'POST',
                headers: {
                    'X-API-Key': API_KEY,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    year: year,
                    month: month,
                    day: day,
                    hour: 12, // 시간을 모르면 정오로 설정
                    gender: genderCode,
                    lang: 'ko'
                })
            });

            const data = await response.json();
            
            // 결과 화면 업데이트
            updateResult(data, name, birthdate, gender, mbti);
            
            // 결과 섹션 보여주기
            resultSection.classList.add('active');
            
        } catch (error) {
            console.error('API 호출 실패:', error);
            alert('사주 분석 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
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

function updateResult(data, name, birthdate, gender, mbti) {
    // 기본 정보 업데이트
    const birthdateFormatted = new Date(birthdate).toLocaleDateString('ko-KR');
    const genderText = gender === 'male' ? '남성' : '여성';
    
    document.querySelector('.result-card p:nth-child(2)').innerHTML = `<strong>이름:</strong> ${name}`;
    document.querySelector('.result-card p:nth-child(3)').innerHTML = `<strong>생년월일:</strong> ${birthdateFormatted}`;
    document.querySelector('.result-card p:nth-child(4)').innerHTML = `<strong>성별:</strong> ${genderText}`;
    document.querySelector('.result-card p:nth-child(5)').innerHTML = `<strong>MBTI:</strong> ${mbti}`;

    // 사주 정보 업데이트
    const pillars = data.pillars;
    const elements = data.elements;
    const dayMaster = data.day_master;
    const zodiac = data.zodiac;

    // 사주명식 업데이트
    updateSajuTable(pillars);

    // 오행 그래프 업데이트
    updateElementsChart(elements);

    // 성격 분석 (일주 + 오행 + MBTI 기반)
    const personalityText = generatePersonality(dayMaster, elements, mbti, pillars);
    document.querySelector('.personality p').textContent = personalityText;

    // 연애운 (오행 + 일주 + 띠 기반)
    const loveText = generateLoveFortune(elements, dayMaster, zodiac);
    document.querySelector('.love p').textContent = loveText;

    // 금전운 (오행 + 일주 기반)
    const moneyText = generateMoneyFortune(elements, dayMaster);
    document.querySelector('.money p').textContent = moneyText;
}

function generatePersonality(dayMaster, elements, mbti, pillars) {
    const elementTraits = {
        'wood': {
            base: '창의적이고 성장 지향적인 성격',
            strengths: ['새로운 아이디어를 빠르게 흡수', '유연한 사고방식', '타인과의 조화'],
            weaknesses: ['충동적인 행동', '꼼꼼함 부족', '완벽주의 결여'],
            mbti: {
                'ENFP': '빠른 아이디어 생성과 인간관계 구축에 탁월합니다.',
                'INFP': '깊은 통찰력과 가치관에 기반한 창의성을 발휘합니다.',
                'ENTP': '전략적 사고와 논쟁 능력이 뛰어납니다.',
                'INTP': '분석적 사고와 혁신적인 문제 해결 능력이 있습니다.'
            }
        },
        'fire': {
            base: '열정적이고 리더십이 있는 성격',
            strengths: ['주도적인 행동', '높은 에너지', '자신감 넘침'],
            weaknesses: ['충동적 결정', '인내심 부족', '남들의 의견 무시'],
            mbti: {
                'ENFJ': '카리스마 있는 리더십과 팀 빌딩 능력이 탁월합니다.',
                'ENTJ': '전략적 비전과 실행력이 뛰어난 지도자형입니다.',
                'ESFP': '사교적이고 분위기를 조성하는 능력이 있습니다.',
                'ESTP': '위기 대처 능력과 순발력이 뛰어납니다.'
            }
        },
        'earth': {
            base: '안정적이고 신중한 성격',
            strengths: ['신뢰할 수 있는 의지력', '꼼꼼한 계획', '책임감'],
            weaknesses: ['변화에 대한 저항', '고집', '새로운 시도에 소극적'],
            mbti: {
                'ISTJ': '체계적인 계획과 원칙 준수에 탁월합니다.',
                'ISFJ': '헌신적인 태도와 세심한 배려심이 있습니다.',
                'ESTJ': '효율적인 조직 관리와 실행력이 뛰어납니다.',
                'ESFJ': '조화로운 인간관계 구축과 팀워크에 강점이 있습니다.'
            }
        },
        'metal': {
            base: '원칙적이고 결단력 있는 성격',
            strengths: ['명확한 기준', '빠른 의사결정', '강한 의지력'],
            weaknesses: ['융통성 부족', '비판적 태도', '감정 표현 어려움'],
            mbti: {
                'INTJ': '전략적 사고와 장기 계획 수립 능력이 탁월합니다.',
                'INFJ': '깊은 통찰력과 이상주의적 비전을 가집니다.',
                'ISTP': '기술적 문제 해결과 실용적 접근에 강점이 있습니다.',
                'INTP': '논리적 분석과 추상적 사고 능력이 뛰어납니다.'
            }
        },
        'water': {
            base: '유연하고 통찰력 있는 성격',
            strengths: ['직관적 통찰', '적응력', '감정적 지능'],
            weaknesses: ['우유부단', '과도한 고민', '자기 의심'],
            mbti: {
                'INFP': '깊은 내면 세계와 가치 추구에 집중합니다.',
                'INFJ': '직관적 통찰과 타인 이해 능력이 탁월합니다.',
                'ISFP': '예술적 감각과 순간 포착 능력이 있습니다.',
                'ISFJ': '세심한 관찰력과 헌신적인 태도를 가집니다.'
            }
        }
    };

    const trait = elementTraits[dayMaster.element] || elementTraits['earth'];
    const mbtiInsight = trait.mbti[mbti] || 'MBTI와 사주의 조화로 균형 잡힌 성격을 형성합니다.';
    
    // 오행 분석 추가
    const elementAnalysis = analyzeElements(elements);
    
    return `${trait.base}을 가지고 있습니다. 일주가 ${dayMaster.stem}(${dayMaster.element})로서, ${trait.base}의 특성을 잘 보여줍니다.\n\n` +
           `강점: ${trait.strengths.join(', ')}\n` +
           `보완점: ${trait.weaknesses.join(', ')}\n\n` +
           `MBTI(${mbti})와 사주의 조화: ${mbtiInsight}\n\n` +
           `오행 분석: ${elementAnalysis}`;
}

function generateLoveFortune(elements, dayMaster, zodiac) {
    const dominantElement = Object.keys(elements).reduce((a, b) => elements[a] > elements[b] ? a : b);
    
    const loveFortunes = {
        'wood': {
            main: '새로운 만남이 기대되며, 관계에서 성장과 발전을 경험할 수 있습니다.',
            detail: '자연스러운 만남과 함께하는 성장을 중요시합니다. 서로의 가치를 존중하며 관계를 발전시키는 능력이 뛰어납니다.',
            advice: '상대방의 꿈과 목표를 지지해주는 관계를 만드세요.',
            compatibility: '목, 화 오행을 가진 상대와 궁합이 좋습니다.'
        },
        'fire': {
            main: '열정적인 사랑이 기대되며, 주도적으로 관계를 이끌어갈 수 있습니다.',
            detail: '뜨거운 열정과 로맨틱한 분위기를 조성합니다. 적극적인 표현과 리드하는 스타일이 특징입니다.',
            advice: '열정을 조절하고 상대방의 속도를 존중하는 것이 중요합니다.',
            compatibility: '토, 금 오행을 가진 상대와 안정적인 관계를 형성할 수 있습니다.'
        },
        'earth': {
            main: '안정적인 관계를 원하며, 신뢰를 바탕으로 한 깊은 유대감을 형성할 수 있습니다.',
            detail: '신뢰와 헌신을 중요시하며, 장기적인 관계를 지향합니다. 현실적인 면에서도 든든한 파트너가 됩니다.',
            advice: '보수적인 태도를 조금 더 유연하게 가져보세요.',
            compatibility: '화, 수 오행을 가진 상대와 균형 잡힌 관계가 가능합니다.'
        },
        'metal': {
            main: '원칙을 중요시하며, 깔끔하고 명확한 관계를 선호합니다.',
            detail: '명확한 기준과 원칙을 가지고 관계를 맺습니다. 약속을 중요시하고 책임감 있는 태도를 보입니다.',
            advice: '융통성을 조금 더 발휘하고 감정 표현에도 노력해보세요.',
            compatibility: '수, 목 오행을 가진 상대와 조화를 이룰 수 있습니다.'
        },
        'water': {
            main: '유연하고 직관적인 사랑을 하며, 감정적인 교류를 중요시합니다.',
            detail: '직관적인 이해와 깊은 감정적 교류를 중요시합니다. 상대방의 마음을 읽는 능력이 뛰어납니다.',
            advice: '명확한 의사소통과 결단력을 조금 더 길러보세요.',
            compatibility: '토, 화 오행을 가진 상대와 안정과 열정의 균형을 이룰 수 있습니다.'
        }
    };

    const fortune = loveFortunes[dominantElement] || loveFortunes['earth'];
    const zodiacInfo = getZodiacLoveInfo(zodiac);
    
    return `${fortune.main}\n\n` +
           `상세 분석: ${fortune.detail}\n\n` +
           `조언: ${fortune.advice}\n\n` +
           `궁합: ${fortune.compatibility}\n\n` +
           `띠별 연애운: ${zodiacInfo}`;
}

function generateMoneyFortune(elements, dayMaster) {
    const dominantElement = Object.keys(elements).reduce((a, b) => elements[a] > elements[b] ? a : b);
    
    const moneyFortunes = {
        'wood': {
            main: '성장 투자에 유리하며, 새로운 기회를 잘 포착할 수 있습니다.',
            detail: '새로운 사업이나 투자 기회에 민감합니다. 성장 가능성이 있는 분야에 관심이 많습니다.',
            advice: '장기적인 관점에서 투자를 계획하고, 인맥을 통한 기회 포착에 힘쓰세요.',
            suitableInvestment: '스타트업, 교육, 자기계발, 인프라'
        },
        'fire': {
            main: '리스크를 감수하는 투자에 유리하며, 대박을 노릴 수 있습니다.',
            detail: '고수익 고위험 투자에 적합합니다. 빠른 의사결정과 대담한 투자 성향이 있습니다.',
            advice: '손실을 감당할 수 있는 범위 내에서 리스크를 관리하세요.',
            suitableInvestment: '주식, 암호화폐, 벤처 캐피털, 엔터테인먼트'
        },
        'earth': {
            main: '안정적인 자산 관리에 유리하며, 꾸준한 저축이 중요합니다.',
            detail: '안정적인 자산 증식을 선호합니다. 부동산이나 예금 등 안전한 투자에 적합합니다.',
            advice: '분산 투자를 통해 리스크를 최소화하고 꾸준한 증식을 목표로 하세요.',
            suitableInvestment: '부동산, 예금, 채권, 보험'
        },
        'metal': {
            main: '원칙적인 재정 관리가 필요하며, 계획적인 투자가 좋습니다.',
            detail: '체계적인 재정 관리와 명확한 투자 전략이 필요합니다. 계획적인 접근이 강점입니다.',
            advice: '자산 배분 비율을 철저히 지키고 정기적인 점검을 하세요.',
            suitableInvestment: 'ETF, 펀드, 정기적 적립식 투자'
        },
        'water': {
            main: '유연한 자금 운용이 가능하며, 기회에 따라 대응할 수 있습니다.',
            detail: '시장의 흐름을 잘 읽고 유연하게 대응합니다. 직관적인 투자 결정이 가능합니다.',
            advice: '직관과 분석을 균형 있게 활용하고 과도한 변동성은 피하세요.',
            suitableInvestment: '유동성이 높은 자산, 글로벌 투자, 시장 타이밍'
        }
    };

    const fortune = moneyFortunes[dominantElement] || moneyFortunes['earth'];
    const dayMasterAdvice = getDayMasterMoneyAdvice(dayMaster);
    
    return `${fortune.main}\n\n` +
           `상세 분석: ${fortune.detail}\n\n` +
           `조언: ${fortune.advice}\n\n` +
           `적합한 투자 분야: ${fortune.suitableInvestment}\n\n` +
           `일주별 금전운: ${dayMasterAdvice}`;
}

function analyzeElements(elements) {
    const total = Object.values(elements).reduce((sum, val) => sum + val, 0);
    const elementNames = {
        'wood': '목',
        'fire': '화',
        'earth': '토',
        'metal': '금',
        'water': '수'
    };
    
    let analysis = '오행 분포: ';
    Object.entries(elements).forEach(([key, value]) => {
        const percentage = Math.round((value / total) * 100);
        analysis += `${elementNames[key]} ${percentage}% `;
    });
    
    const dominant = Object.keys(elements).reduce((a, b) => elements[a] > elements[b] ? a : b);
    const weak = Object.keys(elements).reduce((a, b) => elements[a] < elements[b] ? a : b);
    
    analysis += `\n가장 강한 오행: ${elementNames[dominant]}, 보완이 필요한 오행: ${elementNames[weak]}`;
    
    return analysis;
}

function getZodiacLoveInfo(zodiac) {
    const zodiacLove = {
        'rat': '쥐띠는 섬세하고 주의 깊은 연애 스타일입니다. 상대방을 세심하게 챙기는 능력이 있습니다.',
        'ox': '소띠는 신중하고 헌신적인 연애를 합니다. 한번 마음을 주면 변치 않는 충성심이 있습니다.',
        'tiger': '호랑이띠는 열정적이고 주도적인 연애 스타일입니다. 리드하는 것을 좋아하고 대담한 표현을 합니다.',
        'rabbit': '토끼띠는 부드럽고 조화로운 연애를 선호합니다. 상대방의 감정을 잘 이해하고 배려합니다.',
        'dragon': '용띠는 카리스마 있고 매력적인 연애 스타일입니다. 자신감 넘치는 태도로 상대방을 끌어들입니다.',
        'snake': '뱀띠는 신비롭고 직관적인 연애를 합니다. 깊은 이해와 감정적 교류를 중요시합니다.',
        'horse': '말띠는 자유롭고 활기찬 연애 스타일입니다. 새로운 경험과 모험을 함께하고 싶어 합니다.',
        'goat': '양띠는 온화하고 헌신적인 연애를 합니다. 평화로운 관계를 추구하고 상대방을 헌신적으로 돕습니다.',
        'monkey': '원숭이띠는 재미있고 융통성 있는 연애 스타일입니다. 지루하지 않은 관계를 만들고자 합니다.',
        'rooster': '닭띠는 원칙적이고 계획적인 연애를 합니다. 명확한 기준과 계획을 가지고 관계를 맺습니다.',
        'dog': '개띠는 충실하고 보호적인 연애 스타일입니다. 상대방을 든든하게 지키고 헌신합니다.',
        'pig': '돼지띠는 관대하고 헌신적인 연애를 합니다. 상대방을 포용해주고 깊은 애정을 표현합니다.'
    };
    
    return zodiacLove[zodiac] || '균형 잡힌 연애운을 가지고 있습니다.';
}

function getDayMasterMoneyAdvice(dayMaster) {
    const dayMasterMoney = {
        'yang_wood': '양목 일주는 성장 지향적인 투자가 적합합니다. 새로운 기회에 과감히 도전하세요.',
        'yin_wood': '음목 일주는 신중한 성장 투자가 좋습니다. 단계적인 발전을 계획하세요.',
        'yang_fire': '양화 일주는 리더십 있는 사업 투자에 유리합니다. 대담하게 리드하세요.',
        'yin_fire': '음화 일주은 섬세한 투자 감각이 있습니다. 디테일을 놓치지 마세요.',
        'yang_earth': '양토 일주는 대규모 안정 투자에 적합합니다. 튼튼한 기반을 마련하세요.',
        'yin_earth': '음토 일주은 꼼꼼한 자산 관리가 필요합니다. 세부적인 계획을 세우세요.',
        'yang_metal': '양금 일주는 원칙적인 투자가 좋습니다. 철저한 기준을 지키세요.',
        'yin_metal': '음금 일주은 정교한 투자 전략이 필요합니다. 섬세한 분석을 하세요.',
        'yang_water': '양수 일주는 유연한 자금 운용이 가능합니다. 기회에 맞춰 대응하세요.',
        'yin_water': '음수 일주은 직관적 투자 감각이 있습니다. 통찰력을 활용하세요.'
    };
    
    const key = `${dayMaster.polarity}_${dayMaster.element}`;
    return dayMasterMoney[key] || '균형 잡힌 금전운을 가지고 있습니다.';
}

function updateSajuTable(pillars) {
    const sajuPillars = document.querySelectorAll('.saju-pillar');
    
    // 연주
    sajuPillars[0].querySelector('.pillar-stem').textContent = pillars.year.stem_hanja;
    sajuPillars[0].querySelector('.pillar-branch').textContent = pillars.year.branch_hanja;
    
    // 월주
    sajuPillars[1].querySelector('.pillar-stem').textContent = pillars.month.stem_hanja;
    sajuPillars[1].querySelector('.pillar-branch').textContent = pillars.month.branch_hanja;
    
    // 일주
    sajuPillars[2].querySelector('.pillar-stem').textContent = pillars.day.stem_hanja;
    sajuPillars[2].querySelector('.pillar-branch').textContent = pillars.day.branch_hanja;
    
    // 시주
    sajuPillars[3].querySelector('.pillar-stem').textContent = pillars.hour.stem_hanja;
    sajuPillars[3].querySelector('.pillar-branch').textContent = pillars.hour.branch_hanja;
}

function updateElementsChart(elements) {
    const total = Object.values(elements).reduce((sum, val) => sum + val, 0);
    const elementBars = document.querySelectorAll('.element-bar');
    
    const elementOrder = ['wood', 'fire', 'earth', 'metal', 'water'];
    
    elementOrder.forEach((element, index) => {
        const percentage = total > 0 ? Math.round((elements[element] / total) * 100) : 0;
        const barFill = elementBars[index].querySelector('.bar-fill');
        const barValue = elementBars[index].querySelector('.bar-value');
        
        barFill.style.width = `${percentage}%`;
        barValue.textContent = `${percentage}%`;
    });
}
