import gsap from "gsap";
import yeast from "yeast";
import $ from "jquery";
import {makeSpark} from "../modules/neons";
import {lenis} from "../modules/smoothScrolling";
import {fetchProjects} from "../modules/fetchProjects";
import {isProjectPage} from "../modules/pathDetector";
import {generateProject} from "../modules/projects";
import {prefersReducedMotion} from "../utils/prefersReducedMotion";

let hasLoadedImages = true;
let tl = gsap.timeline({});
let fns = [];

const isMobileWidth = () => window.innerWidth < 600;

function logImageLoadingProgress() {
    function loadedEverything(){
        setTimeout(()=>{
            if (lenis) lenis.scrollTo(0,{duration:0.1});
        }, 50);
        if(tl.paused()){
            tl.resume();
        }
        gsap.to('.loading-text,.loader h3',{
            opacity:0,
            duration:0.2
        });
        hasLoadedImages = true;
    }
    function load(){
        return new Promise(resolve => {
            let loaded = 0;
            let resolved = false;
            const images = Array.from(document.images);
            const total = images.length;

            function finish() {
                if (!resolved) {
                    resolved = true;
                    resolve();
                }
            }

            // Never block the user for more than 400ms on network images
            setTimeout(finish, 400);

            if (total === 0) {
                finish();
                return;
            }

            function update() {
                loaded++;
                const percent = Math.round((loaded / total) * 100);
                $(".loading-text").text(percent);
                if (loaded >= total) finish();
            }

            images.forEach(img => {
                if (img.complete || img.getAttribute('loading') === 'lazy') {
                    update();
                } else {
                    img.addEventListener('load', update, { once: true });
                    img.addEventListener('error', update, { once: true });
                }
            });
        });
    }
    load().then(loadedEverything);
}

function initAnimations(p){
    p.then(logImageLoadingProgress);
    return new Promise(resolve => {
        // Fast path for reduced motion OR return visitors in same session
        const alreadySeen = sessionStorage.getItem('intro_seen');
        if (prefersReducedMotion() || alreadySeen) {
            $('.loader').hide();
            gsap.set('.grid-item', {
                "--grid-item-width": "0%",
                "--grid-item-width2": "0%"
            });
            gsap.set('.nav4 > div > *', { opacity: 1 });
            gsap.set('[data-scramble-on-enter]', {
                text: (i, target) => target.dataset.scrambleOnEnter
            });
            resolve();
            fns.forEach(fn => fn());
            return;
        }

        tl.set('.nav4 > div > *',{
            opacity:0
        });
        tl.set('.nav4',{
            gap:0
        });

        // Snappy, energetic cyber intro (0.35s total steps)
        tl.fromTo('.loader h3.align-left',{
            right:"50%"
        },{
            right:"75%",
            duration:0.35,
            scrambleText: {
                text: (i, target) => target.dataset.text,
                chars: (i, target) => target.dataset.scrambleChars || ",._&*;:'\"-+=~`|/\\",
                speed: 1,
            },
        });
        tl.fromTo('.loader h3.align-right',{
            left:"50%"
        },{
            left:"75%",
            duration:0.35,
            scrambleText: {
                text: (i, target) => target.dataset.text,
                chars: (i, target) => target.dataset.scrambleChars || ",._&*;:'\"-+=~`|/\\",
                speed: 1,
            },
        },"<");
        tl.to('.loader', {
            top: '12px',
            left: '12px',
            bottom: '12px',
            right: '12px',
            duration:0.3,
            ease: "power2.inOut"
        },"<");

        tl.to('.loader', {
            top: '134px',
            left: '264px',
            duration: 0.3,
            ease: "power1.inOut"
        },"<0.2");
        tl.to('.nav4',{
            gap:"2px"
        },"<");
        tl.to('.nav4 > div > *',{
            opacity:1
        });
        tl.to('.loader', {
            opacity:0,
            duration:0.2,
            ease: "power2.inOut"
        },"<");
        tl.to('.grid-item',{
            "--grid-item-width": "0%",
            ease: "power3.inOut",
            duration:0.35,
            stagger:0.01
        },"<");
        tl.to('.grid-item',{
            "--grid-item-width2": "0%",
            ease: "power3.inOut",
            duration:0.35,
            stagger:0.01
        },"<0.05");
        tl.to('[data-scramble-on-enter]',{
            scrambleText: {
                text: (i, target) => target.dataset.scrambleOnEnter,
                chars: (i, target) => target.dataset.scrambleChars || ",._",
                speed: 1,
            },
            ease: "power3.inOut",
            duration: 0.4,
            stagger:0.03
        },"<0.1");

        tl.set('.loader',{
            display: "none",
            onComplete: () => {
                sessionStorage.setItem('intro_seen', 'true');
                resolve();
                fns.forEach(fn => fn());
            }
        },"<0.2");
    });
}

function subscribeToEndOfIntro(fn){
    fns.push(fn);
}

function initIntro(p){
    return initAnimations(p);
}

export {initIntro, subscribeToEndOfIntro};
