// ==========================
// 🌌 ESCENA BASE
// ==========================

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
75,
window.innerWidth/window.innerHeight,
0.1,
3000
);

camera.position.set(0,0,400);

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);
document.body.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = false;


// ==========================
// 🌌 GALAXIA PROFUNDA 3D
// ==========================

function crearCapaEstrellas(cantidad, radio, tamaño){

    const geometry = new THREE.BufferGeometry();
    const vertices = [];

    for(let i=0;i<cantidad;i++){

        const theta = Math.random()*2*Math.PI;
        const phi = Math.acos((Math.random()*2)-1);

        vertices.push(
            radio*Math.sin(phi)*Math.cos(theta),
            radio*Math.sin(phi)*Math.sin(theta),
            radio*Math.cos(phi)
        );
    }

    geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(vertices,3)
    );

    const material = new THREE.PointsMaterial({
        color:0xffffff,
        size:tamaño
    });

    return new THREE.Points(geometry, material);
}

// Capas
const starsNear  = crearCapaEstrellas(3000, 800, 2);
const starsMid   = crearCapaEstrellas(4000, 1200, 1.5);
const starsFar   = crearCapaEstrellas(5000, 1800, 1);
const starsUltra = crearCapaEstrellas(6000, 2400, 0.8);

scene.add(starsNear);
scene.add(starsMid);
scene.add(starsFar);
scene.add(starsUltra);
// ==========================
// 💖 CORAZONES
// ==========================

const heartMaterial = new THREE.PointsMaterial({
color:0xff2fa3,
size:8,
transparent:true,
blending:THREE.AdditiveBlending,
depthWrite:false
});

function createHeart(scale, count){

const geometry = new THREE.BufferGeometry();
const positions = [];

for(let i=0;i<count;i++){

    const t = Math.random()*Math.PI*2;

    const x = 16*Math.pow(Math.sin(t),3);
    const y = 13*Math.cos(t)
             -5*Math.cos(2*t)
             -2*Math.cos(3*t)
             -Math.cos(4*t);

    positions.push(
        x*scale + (Math.random()-0.5)*20,
        y*scale + (Math.random()-0.5)*20,
        (Math.random()-0.5)*100
    );
}

geometry.setAttribute(
'position',
new THREE.Float32BufferAttribute(positions,3)
);

return new THREE.Points(geometry, heartMaterial);
}

const centralHeart = createHeart(9, 2200);
scene.add(centralHeart);


// ==========================
// 💌 TEXTO CENTRAL
// ==========================

function crearTextoCentral(linea1, linea2){

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = 1024;
    canvas.height = 300;

    context.textAlign = "center";
    context.textBaseline = "middle";

    context.shadowColor = "#ff4fd8";
    context.shadowBlur = 40;

    context.font = "bold 50px Arial";
    context.fillStyle = "#ffffff";
    context.fillText(linea1, canvas.width/2, canvas.height/2 - 40);

    context.font = "bold 45px Arial";
    context.fillStyle = "#ffd6f5";
    context.fillText(linea2, canvas.width/2, canvas.height/2 + 40);

    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.SpriteMaterial({
        map: texture,
        transparent:true,
        depthTest:false
    });

    const sprite = new THREE.Sprite(material);

    sprite.scale.set(280,90,1);
    sprite.position.set(0,0,35);

    centralHeart.add(sprite);

    return sprite;
}

const textoCentral = crearTextoCentral(
    "Te amo mas que a nadie💕",
    "Te amo 💖"
);


// ==========================
// 💞 CORAZONES ORBITANDO
// ==========================

const orbitGroup = new THREE.Group();
scene.add(orbitGroup);

for(let i=0;i<12;i++){
    const heart = createHeart(3.5,800);
    orbitGroup.add(heart);
}


// ==========================
// 🌈 FRASES EN GRUPO
// ==========================

function crearTextoSprite(texto){

    const colores = [
        "#ade4e4","#e2a7e2","#c0c08f","#88c0a6",
        "#dd9393","#dac099","#a2c6d8","#b48ba6"
    ];

    const colorRandom = colores[
        Math.floor(Math.random()*colores.length)
    ];

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = 512;
    canvas.height = 128;

    context.font = "50px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";

    context.shadowColor = colorRandom;
    context.shadowBlur = 25;

    context.fillStyle = colorRandom;
    context.fillText(texto, 256, 64);

    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.SpriteMaterial({
        map: texture,
        transparent:true,
        depthTest:true,
        depthWrite:false
    });

    const sprite = new THREE.Sprite(material);
    sprite.scale.set(240,70,1);

    const radius = 700;
    const theta = Math.random()*2*Math.PI;
    const phi = Math.acos((Math.random()*2)-1);

    sprite.position.set(
        radius*Math.sin(phi)*Math.cos(theta),
        radius*Math.sin(phi)*Math.sin(theta),
        radius*Math.cos(phi)
    );

    return sprite; // 🔥 ya no lo agregamos a scene aquí
}

const frasesGroup = new THREE.Group();
scene.add(frasesGroup);

const frases = [
"Te amo 💖","Te amo 💖","Te amo 💖",
"Te amo 💖","Te amo 💖","Te amo 💖",
"Te amo 💖","Te amo 💖","Te amo 💖",
"Te amo 💖","Te amo 💖","Te amo 💖"
];

const sprites = [];

for(let i=0;i<120;i++){
    const sprite = crearTextoSprite(
        frases[Math.floor(Math.random()*frases.length)]
    );
    frasesGroup.add(sprite);
    sprites.push(sprite);
}


// ==========================
// 🎬 ANIMACIÓN
// ==========================

let angle = 0;

function animate(){
requestAnimationFrame(animate);

angle += 0.001;

starsNear.rotation.y  += 0.0012;
starsMid.rotation.y   += 0.0008;
starsFar.rotation.y   += 0.0005;
starsUltra.rotation.y += 0.0002;
frasesGroup.rotation.y += 0.0008; // 🔥 giro suave elegante

centralHeart.lookAt(camera.position);
textoCentral.lookAt(camera.position);

orbitGroup.children.forEach((heart,index)=>{
    const r = 320;
    const a = angle + index*(Math.PI*2/12);
    heart.position.x = r*Math.cos(a);
    heart.position.z = r*Math.sin(a);
    heart.lookAt(camera.position);
});

sprites.forEach(s=>{
    s.lookAt(camera.position);
});

renderer.render(scene,camera);
}

animate();

window.addEventListener('resize',()=>{
camera.aspect = window.innerWidth/window.innerHeight;
camera.updateProjectionMatrix();
renderer.setSize(window.innerWidth,window.innerHeight);
});


// ==========================
// 🎵 MÚSICA - ADORE (FIX MÓVIL)
// ==========================

const audio = new Audio("noche.mp3");
audio.loop = true;
audio.volume = 0;

function iniciarMusica() {

    audio.play().then(() => {

        let fade = setInterval(() => {
            if (audio.volume < 0.65) {
                audio.volume += 0.02;
            } else {
                clearInterval(fade);
            }
        }, 200);

    }).catch(err => {
        console.log("El navegador bloqueó el audio:", err);
    });

    window.removeEventListener("touchstart", iniciarMusica);
    window.removeEventListener("click", iniciarMusica);
}

// Para celular
window.addEventListener("touchstart", iniciarMusica);

// Para PC
window.addEventListener("click", iniciarMusica);