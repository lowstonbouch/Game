import AssetsLoader from '../utils/AssetsLoader';
import game from './main.js';
import Menu from './menu.js';

let clickMusic, menuMusic, musicOn = false;
let buttonMusicOn;
let buttonMusicOff;
const Settings = {
    preload: function(){
        const assetsLoader = new AssetsLoader(Settings);
        assetsLoader.getAssets();
      },
    create: function() {
        const background = this.add.sprite(0, 0, 'backgroundMenu');
        const style = {
            font: "bold 55px Algerian",
            fill: 'chocolate',
            boundsAlignH: "center",
            boundsAlignV: "middle"
        };
        const controls = this.add.text(400, 80, "CONTROLS", style);
        controls.setShadow(1, 1, 'rgba(0,0,0,0.5)', 2);
        controls.anchor.setTo(0.5, 0.5);
        controller('buttonA', 'Move left', 100, 180);
        controller('buttonD', 'Move right', 250, 180);
        controller('buttonSpace', 'Jump', 400, 180);
        controller('buttonMouse', 'Hook', 550, 180);
        controller('buttonEsc', 'Menu', 700, 180);

        const back = this.add.button(400, 410, 'backButton', this.menu, this); 
        

        back.anchor.setTo(0.5, 0.5);
        menuMusic = this.add.audio('music_menu');
        menuMusic.loop = true;

        if(Phaser.Sound.volume === 1){
            menuMusic.play();
            buttonMusicOn = this.add.button(750,30, 'buttonMusicOn', this.musicOf, this);
        }
        else if(Phaser.Sound.volume === 0){
            buttonMusicOff = this.add.button(750,30, 'buttonMusicOff', this.musicOn, this);
            
        }
      

        clickMusic = this.add.audio('button_click');
    },
    musicOf: function(){
        Phaser.Sound.volume = 0;
        menuMusic.volume = 0;
        clickMusic.volume = 0;
        Phaser.Sound.volume = 0;
        buttonMusicOn.kill();
        buttonMusicOn = null;
        buttonMusicOff = this.add.button(750,30, 'buttonMusicOff', this.musicOn, this);
    },
    musicOn: function(){
        Phaser.Sound.volume = 1;
        menuMusic.volume = 1;
        clickMusic.volume = 1;
        menuMusic.play();
        buttonMusicOff.kill();
        buttonMusicOff = null;
        buttonMusicOn = this.add.button(750,30, 'buttonMusicOn', this.musicOf, this);
    },
    menu: function() {
        if(buttonMusicOn){
            clickMusic.play();
        }
        menuMusic.stop();
        this.state.start('Menu',true,false,menuMusic.volume);
    }
}


function controller(button, message, x, y) {
    const style = {
        font: "bold 14px Press Start 2P",
        fill: 'white',
        boundsAlignH: "center",
        boundsAlignV: "middle"
    };
    const text = Settings.add.text(x, y - 40, message, style);
    text.setShadow(1, 1, 'rgba(0,0,0,0.5)', 2);
    text.anchor.setTo(0.5, 0.5);
    const image = Settings.add.sprite(x, y, button);
    image.scale.setTo(0.5, 0.5);
    image.anchor.setTo(0.5, 0.5);
}

export default Settings;