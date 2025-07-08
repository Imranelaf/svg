import gsap from "gsap";
import { ScrollTrigger, SplitText } from "gsap/all";

export default function toursAnimation() {
  gsap.registerPlugin(ScrollTrigger, SplitText);

  const isMobile = window.innerWidth < 768;
  let startValue = isMobile ? "top 80%" : "top 10%";

  const containers = document.querySelectorAll('.tourImageContainer');

  containers.forEach((container, index) => {
    const splitTitle = new SplitText(container.querySelector(".tourTitle"), { type: "words, chars" });
    

    const tourSection = container.closest('.tourSection');
    const descEl = tourSection.querySelector(".parag");
    
    if (!descEl || !tourSection || !splitTitle ) {
      console.warn(`element not found ${index}`);
      return;
    }
    
    const splitDesc = new SplitText(descEl, { type: "words, chars" });

    gsap.set(container, {
      transformPerspective: 1000,
      transformStyle: "preserve-3d"
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: startValue,
        end: isMobile ? "bottom" : "bottom 55%",
        toggleActions: "play reset play reverse",
        markers: false,
        refreshPriority: -1,
      }
    });

    tl.from(container, {
      translateZ: isMobile ? 200 : 500,
      duration: 1.2,
      opacity: 0,
      ease: "expo.out"
    })
    .from(container.querySelector(".tourImage"), { 
      opacity: 0, 
      duration: 1 
    }, "<0.5")
    .from(container.querySelector(".scotchTape"), { 
      width: 0, 
      duration: 0.3 
    }, "<")
    .from(splitTitle.chars, {
      yPercent: 20,
      opacity: 0,
      stagger: 0.12,
      duration: 0.2
    })
    .from(splitDesc.words, {
      y: isMobile ? 30 : 50,
      autoAlpha: 0,
      stagger: {
        amount: 0.5,
        from: 'random',
      },
      ease: 'back.out(1.7)',
      duration: 1,
    }, "<-0.8");
  });

  // Handle window resize for better mobile experience
  const handleResize = () => {
    ScrollTrigger.refresh();
  };

  window.addEventListener('resize', handleResize);

  // Refresh ScrollTrigger after all SplitText instances created
  ScrollTrigger.refresh();

  // Return cleanup function
  return () => {
    window.removeEventListener('resize', handleResize);
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  };
}