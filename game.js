const canvas = document.getElementById("game")
const ctx = canvas.getContext("2d")

canvas.width = innerWidth
canvas.height = innerHeight

let data
let save = JSON.parse(localStorage.getItem("save")) || {
gems:100,
pity:0,
heroesOwned:[0],
current:0,
teleport:0
}

// загрузка
fetch("data.json")
.then(r=>r.json())
.then(d=>{
data=d
init()
})

// карта (биомы)
const teleports = [
{x:200,y:200,name:"Луг"},
{x:800,y:200,name:"Пустыня"},
{x:400,y:500,name:"Лёд"}
]

let player={x:200,y:200,hp:100}

// враги
let enemies=[{x:500,y:300,hp:100}]

// управление
document.addEventListener("keydown",e=>{
if(e.key=="w")player.y-=20
if(e.key=="s")player.y+=20
if(e.key=="a")player.x-=20
if(e.key=="d")player.x+=20

if(e.key=="e") skill()
})

// атака
function attack(){
enemies.forEach(e=>{
if(dist(e)<80)e.hp-=10
})
}

// скиллы
function skill(){
let h=data.heroes[save.current]

enemies.forEach(e=>{
if(dist(e)<120){

if(h.skill=="fire") e.hp-=30
if(h.skill=="ice") e.hp-=15
if(h.skill=="electric") e.hp-=25
if(h.skill=="heal") player.hp+=20
if(h.skill=="earth") e.hp-=20
if(h.skill=="wind") e.hp-=18
if(h.skill=="dark") e.hp-=35
if(h.skill=="water") e.hp-=22

}
})
}

// дистанция
function dist(e){
return Math.hypot(player.x-e.x,player.y-e.y)
}

// гача
function wish(){

if(save.gems<10)return
save.gems-=10
save.pity++

let r=Math.random()

if(save.pity>=50){
save.heroesOwned.push(randHero(5))
save.pity=0
log.innerText="🔥 ГАРАНТ 5★"
}
else if(r<0.05){
save.heroesOwned.push(randHero(5))
save.pity=0
log.innerText="⭐ 5★"
}
else{
save.heroesOwned.push(randHero(4))
log.innerText="✨ 4★"
}

saveData()
updateUI()
}

function randHero(r){
let list=data.heroes.map((h,i)=>h.rarity==r?i:null).filter(x=>x!==null)
return list[Math.random()*list.length|0]
}

// телепорт
function teleport(i){
player.x=teleports[i].x
player.y=teleports[i].y
save.teleport=i
saveData()
}

// UI
function toggle(id){
let el=document.getElementById(id)
el.style.display = el.style.display=="none"?"block":"none"
}

function updateUI(){

gems.innerText=save.gems

heroes.innerHTML=""
save.heroesOwned.forEach(id=>{
let h=data.heroes[id]
heroes.innerHTML+=`
<div onclick="selectHero(${id})">
${h.name} ⭐${h.rarity}
</div>`
})
}

function selectHero(id){
save.current=id
saveData()
}

// SAVE
function saveData(){
localStorage.setItem("save",JSON.stringify(save))
}

// ИГРА
function init(){

function loop(){

ctx.fillStyle="#020617"
ctx.fillRect(0,0,canvas.width,canvas.height)

// биомы
teleports.forEach((t,i)=>{
ctx.fillStyle=i==0?"green":i==1?"orange":"cyan"
ctx.fillRect(t.x,t.y,60,60)
})

// игрок (анимация)
ctx.fillStyle=data.heroes[save.current].color
ctx.fillRect(player.x,player.y+Math.sin(Date.now()/200)*5,40,40)

// враги
enemies.forEach(e=>{
ctx.fillStyle="red"
ctx.fillRect(e.x,e.y,40,40)
})

// телепорт если рядом
teleports.forEach((t,i)=>{
if(Math.hypot(player.x-t.x,player.y-t.y)<50){
teleport(i)
}
})

requestAnimationFrame(loop)
}

updateUI()
loop()
  }
