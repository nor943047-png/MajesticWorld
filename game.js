const c = document.getElementById("game")
const ctx = c.getContext("2d")

c.width = innerWidth
c.height = innerHeight

let data
let images = []

let save = JSON.parse(localStorage.getItem("save")) || {
gems:100,
heroesOwned:[0],
current:0,
inv:[]
}

// загрузка
fetch("data.json")
.then(r=>r.json())
.then(d=>{
data=d

// загрузка спрайтов
data.heroes.forEach(h=>{
let img=new Image()
img.src=h.sprite
images.push(img)
})

start()
})

// игрок
let p={x:200,y:200}
let enemies=[{x:600,y:300,hp:100,type:"boss"}]

// управление
document.addEventListener("keydown",e=>{
if(e.key=="w")p.y-=20
if(e.key=="s")p.y+=20
if(e.key=="a")p.x-=20
if(e.key=="d")p.x+=20
if(e.key=="e")skill()
})

// атака
function attack(){
enemies.forEach(e=>{
if(dist(e)<80)e.hp-=10
})
}

// скилл
function skill(){
let h=data.heroes[save.current]

enemies.forEach(e=>{
if(dist(e)<120){

if(h.skill=="fire") e.hp-=30
if(h.skill=="ice") e.hp-=15
if(h.skill=="electric") e.hp-=20
if(h.skill=="heal") {}
if(h.skill=="dark") e.hp-=35

}
})
}

// дистанция
function dist(e){
return Math.hypot(p.x-e.x,p.y-e.y)
}

// гача
function wish(){
if(save.gems<10)return
save.gems-=10

let r=Math.random()

if(r<0.3){
save.heroesOwned.push( Math.floor(Math.random()*data.heroes.length) )
log.innerText="🎉 новый герой"
}else{
log.innerText="💎 ничего"
}

saveData()
}

// UI
function toggle(id){
let el=document.getElementById(id)
el.style.display=el.style.display=="none"?"block":"none"
}

// save
function saveData(){
localStorage.setItem("save",JSON.stringify(save))
}

// игра
function start(){

let frame=0

function loop(){

frame++

ctx.fillStyle="#020617"
ctx.fillRect(0,0,c.width,c.height)

// анимация (движение вверх-вниз)
let offset = Math.sin(frame/10)*5

// игрок (СПРАЙТ)
ctx.drawImage(
images[save.current],
p.x,
p.y+offset,
48,48
)

// враг
enemies.forEach(e=>{
ctx.fillStyle="red"
ctx.fillRect(e.x,e.y,60,60)
})

requestAnimationFrame(loop)
}

loop()
}
