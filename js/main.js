(() => {
  "use strict";
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Preloader
  let p = 0;
  const pct = $("#pre-percent"), bar = $(".pre-line i");
  const timer = setInterval(() => {
    p = Math.min(100, p + Math.floor(Math.random()*15)+8);
    pct.textContent = p + "%"; bar.style.width = p + "%";
    if (p >= 100) {
      clearInterval(timer);
      setTimeout(() => $("#preloader")?.classList.add("done"), 350);
    }
  }, 110);

  // Mobile navigation
  const nav = $("#cz-nav"), burger = $("#nav-burger");
  burger?.addEventListener("click", () => {
    const open = nav.classList.toggle("menu-open");
    burger.classList.toggle("active", open);
    burger.setAttribute("aria-expanded", open);
    document.body.classList.toggle("menu-open", open);
  });
  $$(".nav-link").forEach(a => a.addEventListener("click", () => {
    nav.classList.remove("menu-open"); burger?.classList.remove("active");
    document.body.classList.remove("menu-open");
  }));

  // Sticky navigation
  let lastY = 0;
  addEventListener("scroll", () => {
    const y = scrollY;
    nav.classList.toggle("stuck", y > 30);
    if (y > lastY && y > 140 && !nav.classList.contains("menu-open")) nav.style.transform = "translateY(-101%)";
    else nav.style.transform = "";
    lastY = y;
    $(".back-top")?.classList.toggle("show", y > 500);
  }, {passive:true});

  // Reveal
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("in"); });
  }, {threshold:.12, rootMargin:"0px 0px -8% 0px"});
  $$(".reveal").forEach((el,i) => {
    el.style.transitionDelay = `${Math.min(i%5*70,280)}ms`;
    io.observe(el);
  });

  // Active sections + chapter rail
  const sections = $$("[data-section]");
  const rail = $("#chapter-rail");
  sections.forEach((s,i) => {
    const d=document.createElement("a"); d.className="rail-dot"; d.href="#"+(s.id||"top"); d.innerHTML="<i></i>";
    d.setAttribute("aria-label", s.dataset.section || "Section"); rail?.appendChild(d);
  });
  const dots = $$(".rail-dot");
  const sio = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const id=e.target.id;
      dots.forEach(d=>d.classList.toggle("on", d.getAttribute("href")==="#"+id));
      $$(".chapter").forEach(c=>c.classList.toggle("on", c.getAttribute("href")==="#"+id));
    });
  }, {threshold:.45});
  sections.forEach(s=>sio.observe(s));

  // Cursor
  const cursor = $(".cursor-dot");
  if (matchMedia("(hover:hover) and (pointer:fine)").matches) {
    let mx=0,my=0,cx=0,cy=0;
    addEventListener("pointermove",e=>{mx=e.clientX;my=e.clientY});
    const loop=()=>{cx+=(mx-cx)*.18;cy+=(my-cy)*.18;cursor.style.transform=`translate3d(${cx}px,${cy}px,0)`;requestAnimationFrame(loop)};
    loop();
    $$("[data-cursor]").forEach(el=>{
      el.addEventListener("mouseenter",()=>cursor.classList.add("active"));
      el.addEventListener("mouseleave",()=>cursor.classList.remove("active"));
    });
  }

  // Subtle parallax for the hero copy
  if (!reduce) {
    addEventListener("scroll", () => {
      const y = scrollY;
      const hero = $(".hero-copy");
      if (hero && y < innerHeight*1.2) hero.style.transform=`translate3d(0,${y*.12}px,0)`;
    }, {passive:true});
  }

  // Lightweight Three.js cinematic bakery scene
  const canvas=$("#cake-scene");
  if (window.THREE && canvas) {
    const THREE=window.THREE;
    const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false});
    renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));
    renderer.setSize(innerWidth,innerHeight);
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    renderer.toneMapping=THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure=1.05;

    const scene=new THREE.Scene();
    scene.background=new THREE.Color(0x080706);
    const camera=new THREE.PerspectiveCamera(42,innerWidth/innerHeight,.1,100);
    camera.position.set(0,1.2,7.2);

    scene.add(new THREE.AmbientLight(0x5c4334,1.2));
    const key=new THREE.PointLight(0xe07a35,18,16); key.position.set(2.5,3.2,2.8); scene.add(key);
    const fill=new THREE.PointLight(0xf4e9dd,8,14); fill.position.set(-3,1,-1); scene.add(fill);

    const cake=new THREE.Group(); scene.add(cake);
    const mat=(c,rough=.55)=>new THREE.MeshStandardMaterial({color:c,roughness:rough,metalness:.02});
    const base=mat(0x2a1810), cream=mat(0xf4e9dd,.75), accent=mat(0xe07a35,.45), gold=mat(0xd3ad69,.5);
    const layer=(r,h,y,m)=>{const g=new THREE.CylinderGeometry(r,r,h,64);const o=new THREE.Mesh(g,m);o.position.y=y;cake.add(o);return o};
    layer(1.45,.62,0.25,base); layer(1.12,.46,.82,cream); layer(.82,.34,1.22,accent);
    for(let i=0;i<5;i++){const c=new THREE.CylinderGeometry(.045,.045,.48,16);const o=new THREE.Mesh(c,gold);o.position.set(Math.cos(i*1.256)*.55,1.62,Math.sin(i*1.256)*.55);cake.add(o);const f=new THREE.Mesh(new THREE.SphereGeometry(.07,16,16),accent);f.position.set(o.position.x,1.92,o.position.z);cake.add(f)}
    const plate=new THREE.Mesh(new THREE.CylinderGeometry(1.75,1.75,.08,64),mat(0x17100c));plate.position.y=-.12;cake.add(plate);

    // Floating warm particles
    const count=500, pos=new Float32Array(count*3);
    for(let i=0;i<count;i++){pos[i*3]=(Math.random()-.5)*15;pos[i*3+1]=(Math.random()-.15)*8;pos[i*3+2]=(Math.random()-.5)*12}
    const pg=new THREE.BufferGeometry();pg.setAttribute("position",new THREE.BufferAttribute(pos,3));
    const pm=new THREE.PointsMaterial({color:0xe07a35,size:.018,transparent:true,opacity:.55});
    const pts=new THREE.Points(pg,pm);scene.add(pts);

    let targetX=0,targetY=0;
    addEventListener("pointermove",e=>{targetX=(e.clientX/innerWidth-.5)*.45;targetY=(e.clientY/innerHeight-.5)*.25},{passive:true});
    const clock=new THREE.Clock();
    function frame(){
      const t=clock.getElapsedTime();
      cake.rotation.y += .0025;
      cake.position.y=Math.sin(t*.7)*.08;
      cake.rotation.x += ((targetY-cake.rotation.x)*.02);
      cake.rotation.z += ((-targetX-cake.rotation.z)*.015);
      pts.rotation.y=t*.012;
      camera.position.x += (targetX*1.2-camera.position.x)*.025;
      camera.position.y += (1.2-targetY-camera.position.y)*.025;
      camera.lookAt(0,.7,0);
      renderer.render(scene,camera); requestAnimationFrame(frame);
    }
    frame();
    addEventListener("resize",()=>{renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix()});
  } else {
    canvas?.remove();
  }
})();
