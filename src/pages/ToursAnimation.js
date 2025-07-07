import gsap from "gsap";
import { SplitText } from "gsap/all";

export default function toursAnimation(){
  const tl = gsap.timeline();
  let split = SplitText.create(".tourTitle", { type: "words, chars" });
  gsap.set(".tourImageContainer", {
    transformPerspective: 1000,
    transformStyle: "preserve-3d"
  });

  tl.from(".tourImageContainer", { 
    translateZ: 500,
    duration: 1.5,
    opacity:0,
    ease: "expo.out"
  }, "+=2")
  .from(".tourImage", {opacity:0, duration:1.3}, "<0.5")
  .from(".scotchTape", { width: 0, duration: 1 }, "<")
  .from(split.chars, {
        yPercent: 20,
        opacity: 0,
        stagger: .15,
        duration: .4,
});

}
