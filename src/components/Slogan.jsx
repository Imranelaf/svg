import { useRef, useEffect } from 'react';
import './slogan.css';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

const Slogan = () => {
  const textRef = useRef();

  useEffect(() => {
    const split = new SplitText(textRef.current, { type: 'chars,words' });

    gsap.from(split.chars, {
      y: 100,
      autoAlpha: 0,
      stagger: {
        amount: 0.5,
        from: 'random',
      },
      ease: 'bounce',
      duration: 2,
    });
  }, []);

  return (
    <div className="slogan shape">
      <h1 ref={textRef} className="sloganText">
        France: Unforgettable Moments, Exquisite Experiences
      </h1>
    </div>
  );
};

export default Slogan;
