import AssetsLoader from '../utils/AssetsLoader';
import game from './main.js';

let  clickMusic, menuMusic, musicOn = false;
let buttonMusicOn;
let buttonMusicOff;
const Win = {
    preload: function(){
        const assetsLoader = new AssetsLoader(Win);
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
        const controls = this.add.text(400, 80, "You WIN!!!", style);
        controls.setShadow(1, 1, 'rgba(0,0,0,0.5)', 2);
        controls.anchor.setTo(0.5, 0.5);

        const back = this.add.button(400, 210, 'backButton', this.menu, this);
        buttonMusicOn = this.add.button(750,30, 'buttonMusicOn', this.musicOf, this);
        back.anchor.setTo(0.5, 0.5);
        menuMusic = this.add.audio('music_menu');
        menuMusic.loop = true;
        menuMusic.play();

        clickMusic = this.add.audio('button_click');
    },
    musicOf: function(){
        menuMusic.stop();
        buttonMusicOn.kill();
        buttonMusicOff = this.add.button(750,30, 'buttonMusicOff', this.musicOn, this);
    },
    musicOn: function(){
        menuMusic.play();
        buttonMusicOff.kill();
        buttonMusicOn = this.add.button(750,30, 'buttonMusicOn', this.musicOf, this);
    },
    menu: function() {
        clickMusic.play();
        menuMusic.stop();
        this.state.start('Menu');
    }
}


export default Win;