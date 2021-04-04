console.log('Things are looking bright for Tom Wrankmore')

import '../scss/app.scss';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { CSSRulePlugin } from "gsap/CSSRulePlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(SplitText, ScrollTrigger, CSSRulePlugin, DrawSVGPlugin, ScrollToPlugin);

let downBtn = document.querySelector(".downArrow")

downBtn.addEventListener("click", () => {
    gsap.to(window, { duration: 1, scrollTo: { y: ".intro" } });
});

gsap.to(downBtn, {
    autoAlpha: 1,
    duration: 1.2
})

let btnTl = gsap.timeline({
    repeat: -1,
    // // repeatDelay: 1,
    yoyo: true,
    ease: 'none'
})

btnTl.to(downBtn, {
    y: '-20px',
    ease: 'back'
})

const headerTl = gsap.timeline({
    defaults: {
        // ease: 'none'
    }
})

headerTl
    .to('.video-header', {
        clipPath: 'inset(0% 0 0% 0)',
        duration: 1.1,
        ease: 'power2.out'
    })
    .from('.main-logo', {
        yPercent: '500',
        opacity: '0',
        ease: 'power4.out',
        duration: 0.875
    }, '-=0.875')
    .from('.fullscreen-video-wrap.vid-left video', {
        scale: 1.875
    }, '<')
    .from('.fullscreen-video-wrap.vid-right video', {
        scale: 1.875
    }, '<')

// gsap.set('.illustration--strokes', {
//     y: '-75%'
// })

// gsap.set('.illustration--fill', {
//     y: '-122%'
// })

// Splash Illustration tl
const splashIllustrationTl = gsap.timeline({
    defaults: {
        ease: 'none'
    },
    scrollTrigger: {
        trigger: '.intro',
        start: 'top bottom',
        end: 'bottom bottom',
        scrub: true,
        }
    })
    .to('.illustration', {
        y: '0%',
    })

const headlineTl = gsap.timeline({
    defaults: {
        ease: 'none'
        }
    })
    .from('.headline', {
        y: '200px',
        autoAlpha: 0,
        scrollTrigger: {
            trigger: '.intro',
            start: 'top-=20% center',
            end: '+=250px',
            scrub: 1,
        }
    }, '<')

const sections = gsap.utils.toArray(".content");

// console.log('sections: ', sections)

sections.forEach((section, index) => {

    // Get all p tags from the section
    // Make array from nodeList of p tags in section
    // iterate over p tags in the array
    // split the text twice, second one needs to split by more than just lines to work
    // timeline for each paragraph - is this efficient?
    // stagger each line up into it's parent container
    // use index to offset the animation as it's triggered by the section and they'd all go at once otherwise.

    const splitParagraphs = section.querySelectorAll('p');
   
    const splitParaArray = Array.from(splitParagraphs)

    splitParaArray.forEach((para, index) => {
        let childLines = new SplitText(para, { type: "lines", linesClass: "lineChild" });
        let parentLines = new SplitText(para, { type: "lines, words", linesClass: "lineParent" });

        const tl = gsap.timeline({
            defaults: { ease: "back" },
            scrollTrigger: {
                trigger: section,
                start: 'top 50%',
                toggleActions: "play none none reverse"
            }
        })
        tl.from(childLines.lines, {
            yPercent: 101,
            stagger: 0.1,
            delay: index / 10
        }, '<')
    })


    const titleSplit = new SplitText(section.querySelector('.section-content--title'), { type: "chars" })   
    const squigglePath = section.querySelector('.section-content--title--underline path')
 

    // function revertTitles() {
    //     titleSplit.revert()
    // }

    // function revertParagraphs() {
    //     childLines.revert()
    //     parentLines.revert()
    // }

    let tl = gsap.timeline({
        defaults: { ease: "power1" },
        scrollTrigger: {
            trigger: section,
            start: 'top 50%',
            toggleActions: "play none none reverse"
        }
    });
    tl.from(squigglePath, {
        duration: '0.75',
        drawSVG: "0%"
    })
    tl.from(titleSplit.chars, {
        opacity: 0, x: -25,
        ease: "back(4)",
        stagger: {
            from: "start",
            each: 0.03,
            amount: 0.25
        },
        // onComplete: revertTitles
    }, '<')
    // tl.from('childLines.lines', {
    //     yPercent: 101,
    //     stagger: 0.1
    // }, '<')
    tl.from(section.querySelector('.content--bg-image'), {
        yPercent: '-30',
        scale: '1.3',
        ease: 'none',
        scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    }, '<')

    // just adds active class
    gsap.set(section, {
        scrollTrigger: {
            trigger: section,
            start: 'top bottom-=30%',
            end: 'bottom bottom-=30%',
            toggleClass: 'active'
        }
    })

})