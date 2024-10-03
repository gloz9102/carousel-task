import './App.css'
import CardCarousel from './Components/CardCarousel';


/* 
각 카드는 3초간 아무런 액션이 없으면, 자동으로 다음 카드로 전환됩니다.(AUTO TRANSITION)

카드를 클릭하면 Alert으로 클릭한 카드의 색상을 보여줍니다.

각 카드는 좌우로 이동할 수 있는 스와이프 기능이 있으며, 마우스와 손가락 제스쳐(모바일)로 가능합니다.

스와이프 도중 - 드래그 양과 동일하게 카드가 이동해야 하며, opacity 또한 조정되야 합니다.(SWIPE)

각 카드의 넓이의 50% 이상 움직인 상태에서 카드를 놓으면, 다음 카드로 전환합니다.(TO RIGHT / LEFT)

각 카드의 넓이의 50% 미만으로 움직인 상태에서 카드를 놓으면, 기존 카드로 되돌아갑니다.(CANCEL)

Flip 기능

손가락을 떼기 직전(TouchUp 또는 MouseUp)에 일정속도 이상으로 Flip 하였다면, 총 드래그 양과 무관하게 다음 카드로 이동합니다.(Flip right / left)
*/

function App() {
  const COLOR_LIST = [["red", "orange", "green", "blue"],  ["indigo", "purple"]];

  return (
    <div
      style={
        {width:'100%', height:'100vh', border:'1px solid black', margin:'0 auto', padding:'40px'}
      }
    >
      <CardCarousel cards={COLOR_LIST[0]} cardWidth={280} cardHeight={60}  />
      <hr/>
      <CardCarousel cards={COLOR_LIST[1]}  cardWidth={200} cardHeight={120} />
    </div>
  );
}

export default App
