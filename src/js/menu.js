import AssetsLoader from '../utils/AssetsLoader';
import game from './main.js';


let load_complete = false;
let menuMusic, musicOn = false;
let clickMusic;
let buttonMusicOn;
let buttonMusicOff;
const Menu = {
    preload: function(){
        this.load.onLoadStart.add(loadMenuStart, this);
        this.load.onFileComplete.add(fileMenuComplete, this);
        this.load.onLoadComplete.add(loadMenuComplete, this);
        const assetsLoader = new AssetsLoader(Menu);
        assetsLoader.getAssets();
      },
    create: function() {
        const background = this.add.sprite(0, 0, 'backgroundMenu')
        const style = {
            font: "bold 55px Algerian",
            fill: 'chocolate',
            boundsAlignH: "center",
            boundsAlignV: "middle"
        };
        const menu_text = this.add.text(400, 80, "HOOK LIFE", style);
        menu_text.setShadow(1, 1, 'rgba(0,0,0,0.5)', 2);
        menu_text.anchor.setTo(0.5, 0.5);
        if (load_complete) menu_text.visible = true;
        const startButton = this.add.button(400, 200, 'startGameButton', this.startGame, this);
        const settings = this.add.button(400, 350, 'settingsButton', this.settings, this);
       
        startButton.anchor.setTo(0.5, 0.5);
        settings.anchor.setTo(0.5, 0.5);

        menuMusic = this.add.audio('music_menu');
        menuMusic.loop = true;

        if(Phaser.Sound.volume === 1){
            menuMusic.play();
            buttonMusicOn = this.add.button(750,30, 'buttonMusicOn', this.musicOf, this);
        }
        else if (Phaser.Sound.volume === 0){
            buttonMusicOff = this.add.button(750,30, 'buttonMusicOff', this.musicOn, this);
        }
        else{
            buttonMusicOn = this.add.button(750,30, 'buttonMusicOn', this.musicOf, this);
            Phaser.Sound.volume = 1;
            menuMusic.play();
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
    startGame: function() {
        clickMusic.play();
        menuMusic.stop();
        this.state.start('Game',true,true);
    },
    settings: function() {
        clickMusic.play();     
        menuMusic.stop();
        this.state.start('Settings',true,false,menuMusic.volume);
    }
};

let text;
let main_loading;

function loadMenuStart() {
    main_loading = this.add.text(400, 240, 'Loading...', {
        font: "16px Press Start 2P",
        fill: '#ffffff'
    });
    main_loading.anchor.setTo(0.5, 0.5);
}

function fileMenuComplete(progress, cacheKey, success, totalLoaded) {
    main_loading.setText("Loading: " + progress + "%");
}

function loadMenuComplete() {
    load_complete = true;
    main_loading.kill();
}

export default Menu;