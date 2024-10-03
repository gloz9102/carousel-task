import React, { useState, useRef, useEffect, useMemo } from 'react';

function CardCarousel({ cards = [], cardWidth, cardHeight }) {
  const [currentIndex, setCurrentIndex] = useState(0); // 현재 카드 인덱스
  const [deltaX, setDeltaX] = useState(0); // 드래그 이동 거리 계산
  const [isDragging, setIsDragging] = useState(false); // 드래그 여부

  const startXRef = useRef(0); // 드래그 시작 X 좌표
  const startTimeRef = useRef(0); // 드래그 시작 시간
  const autoTransitionTimerRef = useRef(null); // 자동 타이머
  const animationRef = useRef(null);

  useEffect(() => {
    initAutoTransitionTimer(); // 초기화
    // clean up
    return () => {
      clearTimeout(autoTransitionTimerRef.current);
      cancelAnimationFrame(animationRef.current);
    };
  }, [currentIndex]);

  // 자동 타이머 리셋
  const initAutoTransitionTimer = () => {

    clearTimeout(autoTransitionTimerRef.current);
    autoTransitionTimerRef.current = setTimeout(() => {
      goToNextCard(true);
    }, 3000);
  };

  // 클릭이나 터치시 이벤트
  const onStart = (event) => {
    if (event.type === 'mousedown' && event.button !== 0) return; // 좌클릭이 아닌 경우 무시
    event.preventDefault();
    const clientX = event.touches ? event.touches[0].clientX : event.clientX; // 터치랑 마우스이벤트 호환
    startXRef.current = clientX; // 드래그 시작 위치 저장
    startTimeRef.current = Date.now(); // 드래그 시작 시간 저장
    setIsDragging(true);
    initAutoTransitionTimer(); // 자동 전환 타이머 리셋
  };

  // 이동 이벤트
  const onMove = (event) => {
    if (!isDragging) return;
    event.preventDefault();
    const clientX = event.touches ? event.touches[0].clientX : event.clientX; // 터치랑 마우스이벤트 호환
    const deltaX = clientX - startXRef.current;
    setDeltaX(deltaX);
  };

  // 드래그 종료 이벤트
  const onEnd = () => {
    if (!isDragging) return; // 드래그 중 아니면 무시
    const dragDistance = deltaX; // 드래그 거리
    const dragTime = Date.now() - startTimeRef.current; // 드래그 시간
    const velocity = dragDistance / dragTime; // 속도 계산
    const flipThreshold = 0.45; // 플립 속도 임계값

    if (Math.abs(velocity) > flipThreshold) { // 플립 시도
      if (velocity != 0) {
        goToNextCard();
      }
    } else if (Math.abs(dragDistance) > cardWidth * 0.5) { // 50% 이상 드래그
      if (dragDistance != 0) {
        goToNextCard();
      }
    } else { // 복구
      animateSwipe(0, () => {
        setDeltaX(0);
      });
    }

    setIsDragging(false);
  };

  // 카드 클릭 이벤트 핸들러
  const onClick = (event) => {
    event.preventDefault();
    if (deltaX === 0 && !isDragging) {
      alert(`CLICK: ${cards[currentIndex]}`);
    }
  };

  // 다음 카드로
  const goToNextCard = (isAuto) => {
    const nextCardIndex = (currentIndex + 1) % cards.length;
    const cardWidthByDirection = deltaX > 0 || isAuto ? cardWidth : -cardWidth;

    animateSwipe(cardWidthByDirection, () => {
      
      setCurrentIndex(nextCardIndex);
      setDeltaX(0);
    });
  };
  // 스와이프 애니메이션 함수
  const animateSwipe = (toValue, callback) => {
    const startTime = performance.now();
    const fromValue = deltaX; // 현재 위치에서 시작

    const animate = (currentTime) => {
      const animationDuration = 500;

      const elapsed = currentTime - startTime; // 현재시간이랑 애니메이션 시작시간 차이
      const progress = Math.min(elapsed / animationDuration, 1); // 0에서 1 사이의 값
      const easeOutProgress = 1 - Math.pow(1 - progress, 3); // ease-out 효과

      // 애니메이션 계산
      const newDeltaX = fromValue + (toValue - fromValue) * easeOutProgress;
      setDeltaX(newDeltaX);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        callback();
      }
    };

    // 애니메이션 시작
    animationRef.current = requestAnimationFrame(animate);
  };

  const nextCardIndex = (currentIndex + 1) % cards.length;

  // 
  const progress = Math.min(Math.abs(deltaX) / cardWidth, 1);

  // 스타일
  const cardWrapperStyle = { 
    overflow: 'visible', 
    width: '100%', 
    height: cardHeight,
    position: 'relative', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
  };

  
  const baseCardStyle = {
    width: cardWidth,
    height: cardHeight,
    position: 'absolute',
    top: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    opacity: 1,
    zIndex: 1,
  };

  const currentCardStyle = {
    ...baseCardStyle,
    transform: `translateX(${deltaX}px)`,
    opacity: 1 - progress,
    transition: isDragging ? 'transform 0.5s ease-out, opacity 0.5s ease-out' : 'none',
    backgroundColor: cards[currentIndex],
    transformOrigin: 'center',
    zIndex: 3,
  };

  const nextCardStyle = {
    ...baseCardStyle,
    backgroundColor: cards[nextCardIndex],
    opacity: deltaX !== 0 ? 1 : 0,
  };

  const memoStatusText = useMemo(() => {
    if(!isDragging){
      return 'AUTO TRANSITION';
    } else {
      const prefix = deltaX < 0 ? 'LEFT' : 'RIGHT';
      return `${prefix} SWIPE`;
    }
  }, [isDragging, deltaX]);

  return (
    <>
      <div>
        {memoStatusText}
      </div>
      <div
        className="card-carousel"
        onTouchStart={onStart}
        onTouchMove={onMove}
        onTouchEnd={onEnd}
        onMouseDown={onStart}
        onMouseMove={onMove}
        onMouseUp={onEnd}
        onMouseLeave={onEnd}
        onClick={onClick}
        style={cardWrapperStyle}
      >
        <div
          className="card next-card"
          style={nextCardStyle}
        >
          {cards[nextCardIndex]}
        </div>
        <div
          className="card current-card"
          style={currentCardStyle}
        >
          {cards[currentIndex]}
        </div>
      </div>

      <div>
        {JSON.stringify(cards)}
      </div>
    </>
  );
}

export default CardCarousel;
