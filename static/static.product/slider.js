async function handleSlider2(params) {
    const slider=document.querySelector("#slider2");


//wait for all content to load
const imageList =slider.querySelectorAll("img");
const onLoadPromiseList=[];

for(const image of imageList) {
    if(image.complete) continue;

    const onLoadPromise=new Promise((resolve, reject)=>{
        if(image.complete) return resolve();
        image.onload=resolve;
        image.onerror=resolve;
    });
    onLoadPromiseList.push(onLoadPromise);

}

await Promise.all(onLoadPromiseList);

//set max width and height to prevent slider from overflowing
slider.style.maxWidth=getComputedStyle(slider).width;
slider.style.maxHeight=getComputedStyle(slider).height;

const sliderParent=slider.parentElement;
const sliderTrack=document.querySelector("#slider2 > .swiper-wrapper");
const sliderItems=document.querySelectorAll("#slider2 > .swiper-wrapper > .swiper-slide");

//clone slides for infinite loop
const slidesToShow=1;
const slidesRequired=2;
for(let i=0; slidesRequired.length <= slidesToShow && i <= slidesRequired - 1; i++){
    const index=i % slidesToShow;
    const clone=slides[index]?.cloneNode(true);
    clone?.setAttribute("cloned", "");
    sliderTrack?.appendChild(clone);
}

const swiper=new Swiper(slider, {
    grabCursor:true,
    loop:true,
    slidesOffsetAfter:0,
    slidesOffsetBefore:0,
    slidesPreView:1,
    breakpoints:{
        0:{ slidesPreView:1},
        551:{ slidesPreView:1},
        1051:{ slidesPreView:1}
    },
});
}

document.addEventListener("DOMContentLoaded", async ()=>{
    try{
        await handleSlider2();
    }catch(error){
        console.error(error);
    }
});

    
<!-- <script>
async function handleSlider2(params) {
const slider=document.querySelector("#slider2");


//wait for all content to load
const imageList =slider.querySelectorAll("img");
const onLoadPromiseList=[];

for(const image of imageList) {
if(image.complete) continue;

const onLoadPromise=new Promise((resolve, reject)=>{
if(image.complete) return resolve();
image.onload=resolve;
image.onerror=resolve;
});
onLoadPromiseList.push(onLoadPromise);

}

await Promise.all(onLoadPromiseList);

//set max width and height to prevent slider from overflowing
slider.style.maxWidth=getComputedStyle(slider).width;
slider.style.maxHeight=getComputedStyle(slider).height;

const sliderParent=slider.parentElement;
const sliderTrack=document.querySelector("#slider2 > .swiper-wrapper");
const sliderItems=document.querySelectorAll("#slider2 > .swiper-wrapper > .swiper-slide");

//clone slides for infinite loop
const slidesToShow=1;
const slidesRequired=2;
for(let i=0; slidesRequired.length <= slidesToShow && i <= slidesRequired - 1; i++){
const index=i % slidesToShow;
const clone=slides[index]?.cloneNode(true);
clone?.setAttribute("cloned", "");
sliderTrack?.appendChild(clone);
}

const swiper=new Swiper(slider, {
grabCursor:true,
loop:true,
slidesOffsetAfter:0,
slidesOffsetBefore:0,
slidesPreView:1,
breakpoints:{
0:{ slidesPreView:1},
551:{ slidesPreView:1},
1051:{ slidesPreView:1}
},
});
}

document.addEventListener("DOMContentLoaded", async ()=>{
try{
await handleSlider2();
}catch(error){
console.error(error);
}
});

</script> -->

