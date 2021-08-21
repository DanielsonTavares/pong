const cnv = document.querySelector('canvas');
const ctx = cnv.getContext('2d');

let frame = 0;

class Personagem  {
    constructor({x, y, w, h, cor}){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.cor = cor;
        this.teclado = [];

    };
    
    atualizar(){
        this.andar();

        if(this.x <= 0){
            this.x = 0
        }

        if(this.x+this.w >= cnv.width){
            this.x = cnv.width-this.w;
        }
    };

    desenhar(ctx){
        ctx.fillStyle = this.cor
        ctx.fillRect(this.x,this.y,this.w,this.h);
    };

    andar(){
        if(this.teclado.keys && this.teclado.keys['ArrowLeft']){
            this.x-=10
        }

        if(this.teclado.keys && this.teclado.keys['ArrowRight']){
            this.x+=10
        }

    };

    configKeyDown(e){
        this.teclado.keys = (this.teclado.keys || []);
        this.teclado.keys[e.code] = (e.type === 'keydown')
    };

    configKeyUp(e){
        this.teclado.keys[e.code] = (e.type === 'keydown')
    }

}

const cursor = new Personagem( {x: cnv.width/2-50/2, y: cnv.height-30, w: 100, h: 30, cor: '#000'} );

const bola = new Personagem({x: 300, y: 0, w: 10, h: 10, cor: '#f00'});
bola.andar = ()=>{};
bola.direcaoVert = 1;
bola.direcaoHori = 0;
bola.vetDirHor = [0.2, 1, 0.5, 0.4, -0.2, -1, -0.5, -0.4];
bola.atualizar = ()=>{
    bola.y+=6*bola.direcaoVert;
    if(bola.y < 0){
        bola.direcaoVert = 1;
    }
    
    bola.x += 6*bola.direcaoHori;
    if(bola.x < 0){
        bola.direcaoHori = 1;
    }

    if(bola.x > cnv.width){
        bola.direcaoHori = -1;
    }
};


function verificaColisao(){
    if( 
        cursor.x <= bola.x+bola.w &&
        cursor.x+cursor.w >= bola.x &&
        cursor.y <= bola.y+bola.h &&
        cursor.y+cursor.h >= bola.y 
         ){
            bola.direcaoVert = -1;

            const r = Math.floor(Math.random()*bola.vetDirHor.length);
            bola.direcaoHori = bola.vetDirHor[r];

        }
}

function atualizar(){
    cursor.atualizar();
    bola.atualizar();

    verificaColisao();
}

function desenhar(){
    cursor.desenhar(ctx);
    bola.desenhar(ctx);
}

function loop(){
    ctx.fillStyle = '#555'
    ctx.fillRect(0,0, cnv.width, cnv.height)
    atualizar();
    desenhar();
    frame++;
    requestAnimationFrame(loop);
}

//
//
//

document.addEventListener('keydown', (e)=>{
    cursor.configKeyDown(e);
    

})

document.addEventListener('keyup', (e)=>{
    cursor.configKeyUp(e);
})


loop();