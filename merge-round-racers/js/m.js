var MainGame = {
    Config: {
        ORIENTATION: "portrait",
        DEFAULT_WIDTH: 0,
        DEFAULT_HEIGHT: 0,
        MAX_WIDTH: 0,
        MAX_HEIGHT: 0
    },
    version: "v1.25",
    EVENT_NUM: 0,
    isDebug: false,
    isAPI: true,
    isApiBreakTime: false,
    isApiGameplayStop: false,
    title: "roundracers_v1.0",
    languages: ["EN", "IT", "ES", "PT", "TR", "BR", "RU", "FR", "DE", "AR"],
    languagesN: ["00", "01", "02", "03", "04", "06", "07", "08", "05", "10"],
    language: 0,
    GAME_TEXT: null,
    TEXT_FILE: null,
    showFPS: false,
    firstLoad: true,
    firstGo: true,
    isNoSave: false,
    amount_coins: null,
    exp: null,
    nextCarLevel: null,
    currentLevel: null,
    LIMIT_parking: null,
    LIMIT_pilots: null,
    box_have: null,
    arDeltaCarLevel: null,
    lastSession: null,
    lastDataGift: null,
    freeTimeWheel: 0,
    cdNextFree: 0,
    maxTimeWheel: 3,
    dailyReward: null,
    prizeWinter: null,
    typeHelicopter: 0,
    TIME_BANNER: 10,
    lastDataBanner: null,
    initSettings: function() {
        MainGame.Config.DEFAULT_WIDTH = config.scale.width;
        MainGame.Config.DEFAULT_HEIGHT = config.scale.height;
        MainGame.Config.MAX_WIDTH = config.scale.max.width;
        MainGame.Config.MAX_HEIGHT = config.scale.max.height;
        MainGame.isDesktop = game.device.os.desktop;
        if (!MainGame.isDesktop) {
            MainGame.Config.DEFAULT_WIDTH = 640;
            MainGame.Config.DEFAULT_HEIGHT = 960;
            MainGame.Config.MAX_WIDTH = 1e3;
            MainGame.Config.MAX_HEIGHT = 1400
        }
        MainGame.loadSaves();
        if (game.device.os.desktop) {
            game.canvas.oncontextmenu = function(e) {
                e.preventDefault()
            }
            ;
            window.addEventListener("keydown", (function(e) {
                if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
                    e.preventDefault()
                }
            }
            ), false);
            window.addEventListener("wheel", e=>e.preventDefault(), {
                passive: false
            })
        }
        if (MainGame.isAPI) {
            MainGame.API_POKI = game.plugins.get("PokiApiPlugin");
            if (!MainGame.isDebug)
                MainGame.api_check();
            MainGame.API_POKI.initAPI(MainGame.api_GamePause, MainGame.api_GameContinue)
        }
    },
    api_google: function(vValue, vLevel) {
        if (vLevel) {
            console.log("api_google", vValue, vLevel)
        } else {
            console.log("api_google", vValue)
        }
        switch (vValue) {
        case "MaxLevelCar":
            // gtag("event", "GameEvent", {
            //     event_category: "SendStats",
            //     event_label: "MaxLevelCar_" + vLevel,
            //     value: vLevel
            // });
            break;
        case "DailyGift":
            // gtag("event", "GameEvent", {
            //     event_category: "SendStats",
            //     event_label: "DailyGift_" + vLevel,
            //     value: vLevel
            // });
            break
        }
    },
    api_GamePause: function() {
        MainGame.isApiBreakTime = true;
        game.sound.mute = true
    },
    api_GameContinue: function(withReward) {
        MainGame.isApiBreakTime = false;
        if (withReward && MainGame.selectedReward == "freeCar") {} else {
            if (MainGame.isApiGameplayStop) {
                MainGame.API_POKI.gameplayStart();
                MainGame.isApiGameplayStop = false
            }
        }
        game.sound.mute = false
    },
    setReward: function() {
        MainGame.selectedReward = 1
    },
    getReward: function(withReward) {
        if (withReward) {
            MainGame.state.getRewards(MainGame.selectedReward)
        } else {
            MainGame.state.showSystemMessage("Ads no ready, try later!")
        }
    },
    clickReward: function(vReward) {
        MainGame.selectedReward = vReward;
        if (MainGame.isAPI) {
            MainGame.API_POKI.rewardedBreak()
        } else {
            if (MainGame.isDebug)
                MainGame.getReward(true)
        }
    },
    api_check: function() {/*const _0x1918=["top","indexOf","aHR0cHM6Ly9wb2tpLmNvbS9zaXRlbG9jaw==","hostname","length","location","LnBva2ktZ2RuLmNvbQ==","href"];(function(_0x4a02b5,_0x5c0c3d){const _0x56a85d=function(_0x375c0e){while(--_0x375c0e){_0x4a02b5.push(_0x4a02b5.shift())}};_0x56a85d(++_0x5c0c3d)})(_0x1918,430);const _0xcdc9=function(_0x4a02b5,_0x5c0c3d){_0x4a02b5-=0;const _0x56a85d=_0x1918[_0x4a02b5];return _0x56a85d};(function checkInit(){const _0x151adb=["bG9jYWxob3N0","LnBva2kuY29t",_0xcdc9("0x0")];let _0x219654=![];const _0x558823=window[_0xcdc9("0x7")][_0xcdc9("0x5")];for(let _0x220888=0;_0x220888<_0x151adb[_0xcdc9("0x6")];_0x220888++){const _0x4a2f49=atob(_0x151adb[_0x220888]);if(_0x558823[_0xcdc9("0x3")](_0x4a2f49,_0x558823.length-_0x4a2f49.length)!==-1){_0x219654=!![];break}}if(!_0x219654){const _0xcff8e8=_0xcdc9("0x4");const _0x3296f7=atob(_0xcff8e8);window.location[_0xcdc9("0x1")]=_0x3296f7;window[_0xcdc9("0x2")][_0xcdc9("0x7")]!==window[_0xcdc9("0x7")]&&(window[_0xcdc9("0x2")][_0xcdc9("0x7")]=window[_0xcdc9("0x7")])}})()*/
    },
    updateTextWidth: function(vText, vMaxWidth) {
        var scale = 1;
        vText.setScale(scale);
        var txtWidth = vText.width;
        if (txtWidth > vMaxWidth) {
            scale = vMaxWidth / txtWidth;
            vText.setScale(scale)
        }
        return scale
    },
    loadSaves: function() {
        MainGame.amount_coins = MainGame.Storage.get(MainGame.title + "-" + "amount_coins");
        MainGame.exp = MainGame.Storage.get(MainGame.title + "-" + "exp");
        MainGame.nextCarLevel = MainGame.Storage.get(MainGame.title + "-" + "nextCarLevel");
        MainGame.currentLevel = MainGame.Storage.get(MainGame.title + "-" + "currentLevel");
        MainGame.LIMIT_parking = MainGame.Storage.get(MainGame.title + "-" + "LIMIT_parking");
        MainGame.LIMIT_pilots = MainGame.Storage.get(MainGame.title + "-" + "LIMIT_pilots");
        MainGame.box_have = MainGame.Storage.get(MainGame.title + "-" + "box_have");
        MainGame.arDeltaCarLevel = MainGame.Storage.get(MainGame.title + "-" + "arDeltaCarLevel");
        MainGame.lastSession = MainGame.Storage.get(MainGame.title + "-" + "lastSession");
        MainGame.lastDataGift = MainGame.Storage.get(MainGame.title + "-" + "lastDataGift");
        MainGame.cdBonusCoins = MainGame.Storage.get(MainGame.title + "-" + "cdBonusCoins");
        MainGame.cdBonusSpeed = MainGame.Storage.get(MainGame.title + "-" + "cdBonusSpeed");
        MainGame.buffer_boxes = MainGame.Storage.get(MainGame.title + "-" + "buffer_boxes");
        MainGame.freeTimeWheel = MainGame.Storage.get(MainGame.title + "-" + "freeTimeWheel");
        MainGame.cdNextFree = MainGame.Storage.get(MainGame.title + "-" + "cdNextFree");
        MainGame.dailyReward = MainGame.Storage.get(MainGame.title + "-" + "dailyReward");
        MainGame.prizeWinter = MainGame.Storage.get(MainGame.title + "-" + "prizeWinter");
        MainGame.typeHelicopter = MainGame.Storage.get(MainGame.title + "-" + "typeHelicopter");
        var language = MainGame.Storage.get(MainGame.title + "-" + "language");
        if (language != null)
            MainGame.language = language
    },
    saveSaves: function() {
        if (MainGame.isNoSave)
            return;
        MainGame.Storage.set(MainGame.title + "-" + "amount_coins", MainGame.amount_coins);
        MainGame.Storage.set(MainGame.title + "-" + "exp", MainGame.exp);
        MainGame.Storage.set(MainGame.title + "-" + "nextCarLevel", MainGame.nextCarLevel);
        MainGame.Storage.set(MainGame.title + "-" + "currentLevel", MainGame.currentLevel);
        MainGame.Storage.set(MainGame.title + "-" + "LIMIT_parking", MainGame.LIMIT_parking);
        MainGame.Storage.set(MainGame.title + "-" + "LIMIT_pilots", MainGame.LIMIT_pilots);
        MainGame.Storage.set(MainGame.title + "-" + "box_have", MainGame.box_have);
        MainGame.Storage.set(MainGame.title + "-" + "arDeltaCarLevel", MainGame.arDeltaCarLevel);
        MainGame.Storage.set(MainGame.title + "-" + "lastSession", MainGame.lastSession);
        MainGame.Storage.set(MainGame.title + "-" + "lastDataGift", MainGame.lastDataGift);
        MainGame.Storage.set(MainGame.title + "-" + "language", MainGame.language);
        MainGame.Storage.set(MainGame.title + "-" + "cdBonusCoins", MainGame.cdBonusCoins);
        MainGame.Storage.set(MainGame.title + "-" + "cdBonusSpeed", MainGame.cdBonusSpeed);
        MainGame.Storage.set(MainGame.title + "-" + "buffer_boxes", MainGame.buffer_boxes);
        MainGame.Storage.set(MainGame.title + "-" + "freeTimeWheel", MainGame.freeTimeWheel);
        MainGame.Storage.set(MainGame.title + "-" + "cdNextFree", MainGame.cdNextFree);
        MainGame.Storage.set(MainGame.title + "-" + "dailyReward", MainGame.dailyReward);
        MainGame.Storage.set(MainGame.title + "-" + "prizeWinter", MainGame.prizeWinter);
        MainGame.Storage.set(MainGame.title + "-" + "typeHelicopter", MainGame.typeHelicopter)
    },
    clearSaves: function() {
        MainGame.Storage.remove(MainGame.title + "-" + "amount_coins");
        MainGame.Storage.remove(MainGame.title + "-" + "exp");
        MainGame.Storage.remove(MainGame.title + "-" + "nextCarLevel");
        MainGame.Storage.remove(MainGame.title + "-" + "currentLevel");
        MainGame.Storage.remove(MainGame.title + "-" + "LIMIT_parking");
        MainGame.Storage.remove(MainGame.title + "-" + "LIMIT_pilots");
        MainGame.Storage.remove(MainGame.title + "-" + "box_have");
        MainGame.Storage.remove(MainGame.title + "-" + "arDeltaCarLevel");
        MainGame.Storage.remove(MainGame.title + "-" + "lastSession");
        MainGame.Storage.remove(MainGame.title + "-" + "lastDataGift");
        MainGame.Storage.remove(MainGame.title + "-" + "language");
        MainGame.Storage.remove(MainGame.title + "-" + "cdBonusCoins");
        MainGame.Storage.remove(MainGame.title + "-" + "cdBonusSpeed");
        MainGame.Storage.remove(MainGame.title + "-" + "buffer_boxes");
        MainGame.Storage.remove(MainGame.title + "-" + "freeTimeWheel");
        MainGame.Storage.remove(MainGame.title + "-" + "cdNextFree");
        MainGame.Storage.remove(MainGame.title + "-" + "dailyReward");
        MainGame.Storage.remove(MainGame.title + "-" + "prizeWinter");
        MainGame.Storage.remove(MainGame.title + "-" + "typeHelicopter");
        MainGame.isNoSave = true
    }
};
MainGame.Sfx = {
    manage: function(type, mode, game, button, label) {
        switch (mode) {
        case "init":
            {
                MainGame.Storage.initUnset(MainGame.title + "-" + type, true);
                MainGame.Sfx.status = MainGame.Sfx.status || [];
                MainGame.Sfx.status[type] = MainGame.Storage.get(MainGame.title + "-" + type);
                if (type == "sound") {
                    MainGame.Sfx.sounds = [];
                    MainGame.Sfx.sounds["click"] = game.sound.add("click");
                    MainGame.Sfx.sounds["merge_unlocked"] = game.sound.add("merge_unlocked3");
                    MainGame.Sfx.sounds["show_box"] = game.sound.add("show_box2");
                    MainGame.Sfx.sounds["merge_cars"] = game.sound.add("merge_cars3");
                    MainGame.Sfx.sounds["open_box"] = game.sound.add("open_box");
                    MainGame.Sfx.sounds["buy_car"] = game.sound.add("buy_car");
                    MainGame.Sfx.sounds["remove_car"] = game.sound.add("remove_car");
                    MainGame.Sfx.sounds["coin_finish"] = game.sound.add("coin_finish4");
                    MainGame.Sfx.sounds["level_up"] = game.sound.add("level_up");
                    MainGame.Sfx.sounds["offline_earning"] = game.sound.add("offline_earning");
                    MainGame.Sfx.sounds["boost_activate"] = game.sound.add("boost_activate2");
                    MainGame.Sfx.sounds["place_car"] = game.sound.add("place_car");
                    MainGame.Sfx.sounds["click"].volume = 1.2;
                    MainGame.Sfx.sounds["offline_earning"].volume = 2;
                    MainGame.Sfx.sounds["coin_finish"].volume = 3;
                    MainGame.Sfx.sounds["remove_car"].volume = 2.5;
                    MainGame.Sfx.sounds["boost_activate"].volume = 1.6;
                    MainGame.Sfx.sounds["merge_cars"].volume = 2;
                    MainGame.Sfx.sounds["merge_unlocked"].volume = 1.7;
                    MainGame.Sfx.sounds["show_box"].volume = 1.7;
                    MainGame.Sfx.sounds["level_up"].volume = 1.9;
                    MainGame.Sfx.sounds["place_car"].volume = 1.7;
                    MainGame.Sfx.sounds["open_box"].volume = 1.8;
                    MainGame.Sfx.sounds["buy_car"].volume = 1.5
                } else {
                    MainGame.Sfx.nameMusicPlaying = -1;
                    MainGame.Sfx.musics = [];
                    MainGame.Sfx.musics["main"] = game.sound.add("music-main");
                    MainGame.Sfx.musics["turbo"] = game.sound.add("music-turbo");
                    MainGame.Sfx.musics["main"].volume = 1;
                    MainGame.Sfx.musics["turbo"].volume = 1
                }
                break
            }
        case "on":
            {
                MainGame.Sfx.status[type] = true;
                break
            }
        case "off":
            {
                MainGame.Sfx.status[type] = false;
                break
            }
        case "switch":
            {
                MainGame.Sfx.status[type] = !MainGame.Sfx.status[type];
                break
            }
        default:
            {}
        }
        MainGame.Sfx.update(type, button, label);
        if (MainGame.Sfx.sounds) {
            var statusSound = !MainGame.Sfx.status["sound"];
            for (var id in MainGame.Sfx.sounds) {
                MainGame.Sfx.sounds[id].setMute(statusSound)
            }
        }
        if (MainGame.Sfx.musics) {
            var statuMusic = !MainGame.Sfx.status["music"];
            MainGame.Sfx.musics["main"].setMute(statuMusic);
            MainGame.Sfx.musics["turbo"].setMute(statuMusic)
        }
        if (MainGame.Sfx.status) {
            MainGame.Storage.set(MainGame.title + "-" + type, MainGame.Sfx.status[type])
        }
    },
    play: function(type, audio) {
        if (type == "music") {
            if (MainGame.Sfx.nameMusicPlaying == audio)
                return;
            if (MainGame.Sfx.musics) {
                if (MainGame.Sfx.musics[MainGame.Sfx.nameMusicPlaying])
                    MainGame.Sfx.musics[MainGame.Sfx.nameMusicPlaying].stop();
                if (MainGame.Sfx.musics && MainGame.Sfx.musics[audio]) {
                    MainGame.Sfx.musics[audio].play({
                        loop: true
                    });
                    MainGame.Sfx.nameMusicPlaying = audio
                }
            }
        } else {
            if (MainGame.Sfx.sounds && MainGame.Sfx.sounds[audio]) {
                MainGame.Sfx.sounds[audio].play()
            }
        }
    },
    update: function(type, button, label) {
        if (MainGame.Sfx.status == undefined)
            return;
        if (button) {
            if (MainGame.Sfx.status[type]) {
                button.setFrame("btn_" + type + "_0000")
            } else {
                button.setFrame("btn_" + type + "_0001")
            }
        }
        if (label) {
            if (MainGame.Sfx.status[type]) {
                label.setText(MainGame.GAME_TEXT[type + "_on"].toUpperCase())
            } else {
                label.setText(MainGame.GAME_TEXT[type + "_off"].toUpperCase())
            }
        }
    }
};
MainGame.fadeOutIn = function(passedCallback, context) {
    context.cameras.main.fadeOut(200);
    context.time.addEvent({
        delay: 200,
        callback: function() {
            context.cameras.main.fadeIn(200);
            passedCallback(context)
        },
        callbackScope: context
    })
}
;
MainGame.fadeOutScene = function(sceneName, context) {
    context.cameras.main.fadeOut(200);
    context.time.addEvent({
        delay: 200,
        callback: function() {
            context.scene.start(sceneName)
        },
        callbackScope: context
    })
}
;
MainGame.Storage = {
    availability: function() {
        try {
            var ls = window.localStorage
        } catch (e) {
            return
        }
        if (!!(typeof window.localStorage === "undefined")) {
            console.log("localStorage not available");
            return null
        }
    },
    get: function(key) {
        try {
            var ls = window.localStorage
        } catch (e) {
            return
        }
        this.availability();
        try {
            return JSON.parse(localStorage.getItem(key))
        } catch (e) {
            return window.localStorage.getItem(key)
        }
    },
    set: function(key, value) {
        try {
            var ls = window.localStorage
        } catch (e) {
            return
        }
        this.availability();
        try {
            window.localStorage.setItem(key, JSON.stringify(value))
        } catch (e) {
            if (e == QUOTA_EXCEEDED_ERR) {
                console.log("localStorage quota exceeded")
            }
        }
    },
    initUnset: function(key, value) {
        if (this.get(key) === null) {
            this.set(key, value)
        }
    },
    getFloat: function(key) {
        return parseFloat(this.get(key))
    },
    setHighscore: function(key, value) {
        if (value > this.getFloat(key)) {
            this.set(key, value)
        }
    },
    remove: function(key) {
        this.availability();
        window.localStorage.removeItem(key)
    },
    clear: function() {
        this.availability()
    }
};
class Boot extends Phaser.Scene {
    constructor() {
        super("Boot");
        this.wasIncorrectOrientation = false
    }
    preload() {
        this.load.plugin("PokiApiPlugin", PokiApiPlugin, true);
        if (MainGame.EVENT_NUM == 0) {
            this.load.image("back_loading", "assets/background/back_loading.png")
        } else {
            this.load.image("back_loading", "assets/background/back_loading_c.png")
        }
        this.load.image("preloader_bar", "assets/preloader_bar.png?r=2");
        this.load.image("preloader_back", "assets/preloader_back.png?r=2");
        this.load.bitmapFont("Panton", "assets/fonts/Panton40.png", "assets/fonts/Panton40.fnt")
    }
    create() {
        MainGame.world = {
            width: this.cameras.main.width,
            height: this.cameras.main.height,
            centerX: this.cameras.main.centerX,
            centerY: this.cameras.main.centerY
        };
        MainGame.initSettings();
        this.scaleForMobile();
        this.scene.start("Preloader")
    }
    scaleForMobile() {
        this.wasIncorrectOrientation = true;
        window.addEventListener("resize", this.onWindowResize.bind(this));
        this.onWindowResize()
    }
    onWindowResize() {
        if (game.device.os.desktop) {} else {
            if (window.innerWidth > window.innerHeight) {
                this.checkOriention("landscape")
            } else {
                this.checkOriention("portrait")
            }
        }
        if (MainGame.state && MainGame.state.updateResize)
            MainGame.state.updateResize();
        this.handleScroll()
    }
    checkOriention(orientation) {
        if (orientation === "portrait") {
            this.leaveIncorrectOrientation()
        } else if (orientation === "landscape") {
            this.enterIncorrectOrientation()
        }
    }
    enterIncorrectOrientation() {
        document.getElementById("orientation").style.display = "block"
    }
    leaveIncorrectOrientation() {
        document.getElementById("orientation").style.display = "none"
    }
    isLandscape() {
        return window.innerWidth > window.innerHeight
    }
    isPortrait() {
        return window.innerHeight > window.innerWidth
    }
    handleScroll() {
        if (typeof this.scrollTimeout !== "undefined") {
            clearTimeout(this.scrollTimeout)
        }
        this.scrollTimeout = setTimeout(()=>{
            window.scrollTo(0, -window.innerHeight)
        }
        , 500)
    }
}
class Preloader extends Phaser.Scene {
    constructor() {
        super("Preloader")
    }
    preload() {
        MainGame.state = this;
        this.initResize();
        this.midX = this.GAME_WIDTH / 2;
        this.midY = this.GAME_HEIGHT / 2;
        const midX = MainGame.Config.DEFAULT_WIDTH * .5;
        var back = this.add.sprite(midX, 0, "back_loading");
        back.setOrigin(.5, 0);
        this.back = back;
        this.posY = 590;
        this.preloader_back = this.add.image(midX, this.posY, "preloader_back");
        this.preloader_bar = this.add.image(midX, this.posY, "preloader_bar");
        this.preloader_crop = new Phaser.Geom.Rectangle(0,0,0,this.preloader_bar.height);
        this.preloader_bar.setCrop(this.preloader_crop);
        this.load.on(Phaser.Loader.Events.START, this.onLoadStart, this);
        this.load.on(Phaser.Loader.Events.PROGRESS, this.onLoadProgress, this);
        this.load.once(Phaser.Loader.Events.COMPLETE, this.onLoadComplete, this);
        var background_url = "bg_f2.png";
        if (!MainGame.isDesktop)
            background_url = "bg_f1.png";
        if (MainGame.EVENT_NUM == 2) {
            background_url = "bg_f2_c.png";
            if (!MainGame.isDesktop)
                background_url = "bg_f1_c.png"
        }
        var resources = {
            image: [["bg_game", "assets/background/" + background_url]],
            atlas: [["ss_cars", "assets/spritesheets/ss_cars.png?r=1", "assets/spritesheets/ss_cars.json?r=" + MyMath.getRandomInt(0, 99)], ["ss_main", "assets/spritesheets/ss_main.png?r=1", "assets/spritesheets/ss_main.json?r=" + MyMath.getRandomInt(0, 99)]],
            audio: [["music-main", ["assets/audio/game.mp3"]], ["music-turbo", ["assets/audio/turbo.mp3"]], ["click", ["assets/audio/click.mp3"]], ["merge_unlocked3", ["assets/audio/merge_unlocked3.mp3"]], ["show_box2", ["assets/audio/show_box2.mp3"]], ["merge_cars3", ["assets/audio/merge_cars3.mp3"]], ["open_box", ["assets/audio/open_box.mp3"]], ["buy_car", ["assets/audio/buy_car.mp3"]], ["remove_car", ["assets/audio/remove_car.mp3"]], ["coin_finish4", ["assets/audio/coin_finish4.mp3"]], ["level_up", ["assets/audio/level_up.mp3"]], ["offline_earning", ["assets/audio/offline_earning.mp3"]], ["boost_activate2", ["assets/audio/boost_activate2.mp3"]], ["place_car", ["assets/audio/place_car.mp3"]]],
            json: [["alltext", "assets/text/text.json?r=" + MyMath.getRandomInt(0, 99)]]
        };
        for (var method in resources) {
            resources[method].forEach((function(args) {
                var loader = this.load[method];
                loader && loader.apply(this.load, args)
            }
            ), this)
        }
        this.updateCamera()
    }
    onLoadProgress() {
        this.updateLogoCrop(this.load.progress)
    }
    updateLogoCrop(loadProgress) {
        var originalWidth = this.preloader_bar.width;
        var width = originalWidth * loadProgress;
        this.tweens.killTweensOf(this.preloader_crop);
        if (loadProgress == 1) {
            this.preloader_bar.isCropped = false
        } else {
            this.tweens.add({
                targets: this.preloader_crop,
                width: width,
                ease: Phaser.Math.Easing.Linear,
                duration: 200,
                onUpdate: ()=>{
                    this.preloader_bar.setCrop(this.preloader_crop)
                }
            })
        }
        if (MainGame.isAPI)
            MainGame.API_POKI.gameLoadingProgress(loadProgress)
    }
    onLoadStart() {
        if (MainGame.isAPI)
            MainGame.API_POKI.gameLoadingStart()
    }
    onLoadComplete() {
        this.tweens.killTweensOf(this.preloader_crop);
        this.load.off(Phaser.Loader.Events.PROGRESS, this.onLoadProgress);
        this.preloader_bar.isCropped = false;
        if (MainGame.isAPI)
            MainGame.API_POKI.gameLoadingFinished()
    }
    initResize() {
        this.GAME_WIDTH = MainGame.Config.DEFAULT_WIDTH;
        this.GAME_HEIGHT = MainGame.Config.DEFAULT_HEIGHT;
        const width = this.scale.gameSize.width;
        const height = this.scale.gameSize.height;
        this.parent = new Phaser.Structs.Size(width,height);
        this.sizer = new Phaser.Structs.Size(this.GAME_WIDTH,this.GAME_HEIGHT,Phaser.Structs.Size.FIT,this.parent);
        this.parent.setSize(width, height);
        this.sizer.setSize(width, height);
        this.scale.on("resize", this.updateResize, this)
    }
    updateResize(gameSize) {
        var gameSize = this.scale.gameSize;
        var width = gameSize.width;
        var height = gameSize.height;
        if (MainGame.isDesktop && window.innerHeight < MainGame.Config.MAX_HEIGHT) {
            height = window.innerHeight
        }
        this.parent.setSize(width, height);
        this.sizer.setSize(width, height);
        this.updateCamera()
    }
    updateCamera() {
        const camera = this.cameras.main;
        var deltaX = Math.ceil(this.parent.width - this.sizer.width) * .5;
        var deltaY = Math.ceil(this.parent.height - this.sizer.height) * .5;
        var sdvigY = 0;
        if (MainGame.isDesktop && window.innerHeight < MainGame.Config.MAX_HEIGHT) {
            deltaY = Math.ceil(window.innerHeight - this.sizer.height) * .5;
            sdvigY = this.scale.gameSize.height - window.innerHeight
        }
        const scaleX = this.sizer.width / this.GAME_WIDTH;
        const scaleY = this.sizer.height / this.GAME_HEIGHT;
        const zoom = Math.max(scaleX, scaleY);
        const offsetX = deltaX / zoom;
        const offsetY = deltaY / zoom;
        camera.setZoom(zoom);
        if (MainGame.isDesktop) {
            camera.centerOn(this.GAME_WIDTH / 2, this.GAME_HEIGHT / 2 + offsetY + sdvigY)
        } else {
            camera.centerOn(this.GAME_WIDTH / 2, this.GAME_HEIGHT / 2);
            this.back.y = -offsetY;
            this.preloader_back.y = this.posY - offsetY;
            this.preloader_bar.y = this.posY - offsetY
        }
    }
    create() {
        MainGame.TEXT_FILE = this.cache.json.get("alltext");
        MainGame.Sfx.manage("music", "init", this);
        MainGame.Sfx.manage("sound", "init", this);
        this.scale.off("resize", this.updateResize, this);
        MainGame.fadeOutScene("Game", this)
    }
}
class Game extends Phaser.Scene {
    constructor() {
        super("Game")
    }
    create() {
        MainGame.state = this;
        MainGame.stateName = "Game";
        MainGame.GAME_TEXT = MainGame.TEXT_FILE[MainGame.languages[MainGame.language]];
        this.initResize();
        this.midX = this.GAME_WIDTH / 2;
        this.midY = this.GAME_HEIGHT / 2;
        var back = this.add.image(this.midX, 0, "bg_game");
        back.setOrigin(.5, 0);
        if (!MainGame.isDesktop)
            back.y = -220;
        this.cameras.main.fadeIn(200);
        if (MainGame.firstGo) {
            this.input.once("pointerdown", this.playOnce, this)
        } else {
            MainGame.Sfx.play("music", "main")
        }
        this.scaleWindow1 = .7;
        this.scaleWindow2 = .85;
        if (!MainGame.isDesktop) {
            this.scaleWindow1 = .7;
            this.scaleWindow2 = 1
        }
        this.initSettingsGame();
        this.layerButtons = this.add.container();
        this.layerButtons.setDepth(this.DEPTH_layerMainButtons);
        this.initEffects();
        this.POS_IND_Y = 150;
        if (MainGame.isDesktop)
            this.POS_IND_Y = 200;
        this.initIndcatorPilots();
        this.initIndcatorCoins();
        this.initIndcatorBoost();
        this.initCoinsPanel();
        this.initTrackPath();
        this.initCoinsText();
        this.initLevelBar();
        this.initProgressBar();
        this.initHelicopter();
        this.initMergeAnimation();
        this.initBoosterWindow();
        this.initSettingsWindow();
        this.initHelipadWindow();
        this.initLevelUpWindow();
        this.initOfflineEarningWindow();
        this.initTurboWindow();
        this.initFortunaWheelWindow();
        if (MainGame.EVENT_NUM == 2) {
            this.initSantaBag();
            this.initDailyGiftWindow()
        }
        this.initRewardWindow();
        this.initSystemMessage();
        this.initInputScrolling();
        this.initShop();
        this.initArmHelp();
        this.arParking = [];
        this.arParking.push({
            id: 0,
            x: 150,
            y: 150,
            busy: false,
            racing: false,
            obj: null,
            lemming: null,
            btn_return: null,
            type: 0
        });
        this.arParking.push({
            id: 1,
            x: 150,
            y: 150,
            busy: false,
            racing: false,
            obj: null,
            lemming: null,
            btn_return: null,
            type: 0
        });
        this.arParking.push({
            id: 2,
            x: 150,
            y: 150,
            busy: false,
            racing: false,
            obj: null,
            lemming: null,
            btn_return: null,
            type: 0
        });
        this.arParking.push({
            id: 3,
            x: 150,
            y: 150,
            busy: false,
            racing: false,
            obj: null,
            lemming: null,
            btn_return: null,
            type: 0
        });
        this.arParking.push({
            id: 4,
            x: 150,
            y: 150,
            busy: false,
            racing: false,
            obj: null,
            lemming: null,
            btn_return: null,
            type: 0
        });
        this.arParking.push({
            id: 5,
            x: 150,
            y: 150,
            busy: false,
            racing: false,
            obj: null,
            lemming: null,
            btn_return: null,
            type: 0
        });
        this.arParking.push({
            id: 6,
            x: 150,
            y: 150,
            busy: false,
            racing: false,
            obj: null,
            lemming: null,
            btn_return: null,
            type: 0
        });
        this.arParking.push({
            id: 7,
            x: 150,
            y: 150,
            busy: false,
            racing: false,
            obj: null,
            lemming: null,
            btn_return: null,
            type: 0
        });
        this.arParking.push({
            id: 8,
            x: 150,
            y: 150,
            busy: false,
            racing: false,
            obj: null,
            lemming: null,
            btn_return: null,
            type: 0
        });
        this.arParking.push({
            id: 9,
            x: 150,
            y: 150,
            busy: false,
            racing: false,
            obj: null,
            lemming: null,
            btn_return: null,
            type: 0
        });
        this.arParking.push({
            id: 10,
            x: 150,
            y: 150,
            busy: false,
            racing: false,
            obj: null,
            lemming: null,
            btn_return: null,
            type: 0
        });
        this.arParking.push({
            id: 11,
            x: 150,
            y: 150,
            busy: false,
            racing: false,
            obj: null,
            lemming: null,
            btn_return: null,
            type: 0
        });
        this.addParking(this.arParking[0]);
        this.addParking(this.arParking[1]);
        this.addParking(this.arParking[2]);
        this.addParking(this.arParking[3]);
        this.addParking(this.arParking[4]);
        this.addParking(this.arParking[5]);
        this.addParking(this.arParking[6]);
        this.addParking(this.arParking[7]);
        this.addParking(this.arParking[8]);
        this.addParking(this.arParking[9]);
        this.addParking(this.arParking[10]);
        this.addParking(this.arParking[11]);
        this.cursor_car = this.add.image(200, 200, "ss_cars", "icon_f2_0000");
        this.cursor_car.depth = this.DEPTH_cursorcar;
        this.cursor_car.visible = false;
        this.cursor_car.setScale(this.getScaleCar(1));
        this.input.on("pointerdown", this.onInputDown, this);
        this.input.on("pointerup", this.onInputUp, this);
        this.input.on("pointermove", this.onInputMove, this);
        this.initMainButtons();
        var effect = this.add.sprite(this.icon_trash.x, this.icon_trash.y, "ss_main");
        effect.play("delete_flash");
        effect.visible = false;
        this.delete_flash = effect;
        this.race_start = this.add.image(this.midX - 260, 480, "ss_cars", "icon_parking_0000");
        this.race_start.visible = false;
        this.buttonSettings.setDepth(this.DEPTH_GUI);
        this.icon_trash.setDepth(this.DEPTH_GUI);
        this.delete_flash.setDepth(this.DEPTH_GUI);
        this.updateParking();
        this.updatePilots();
        var obj = null;
        for (var i = 0; i < this.MAX_PARKING; i++) {
            obj = this.box_have[i];
            if (obj && obj.t > 0) {
                this.addObject({
                    lvl: obj.t,
                    alreadyRacing: obj.r,
                    parkingId: obj.id
                })
            }
        }
        this.updateIndcatorPilots();
        this.gameStarted = true;
        this.updateCamera();
        this.updateFastBuy();
        var earning_sec = this.total_speed;
        if (MainGame.isAPI)
            MainGame.API_POKI.commercialBreak();
        if (MainGame.lastSession) {
            MainGame.freeTimeWheel = MainGame.freeTimeWheel || 0;
            var currentSession = new Date;
            var dif = currentSession.getTime() - MainGame.lastSession;
            var secondsFromLastSession = Math.abs(dif / 1e3);
            var countAddFree = Math.floor(secondsFromLastSession / this.TIME_NEXT_FREE);
            var secondsDiff = Math.floor(secondsFromLastSession) % this.TIME_NEXT_FREE;
            if (countAddFree > 0) {
                this.freeTimeWheel += countAddFree;
                if (this.freeTimeWheel > MainGame.maxTimeWheel) {
                    this.freeTimeWheel = MainGame.maxTimeWheel
                }
            }
            if (this.freeTimeWheel < MainGame.maxTimeWheel) {
                if (MainGame.cdNextFree) {
                    if (MainGame.cdNextFree < 0)
                        MainGame.cdNextFree = 0;
                    this.countDownNextFree = MainGame.cdNextFree - secondsDiff;
                    if (this.countDownNextFree < 0) {
                        this.freeTimeWheel += 1;
                        if (this.freeTimeWheel > MainGame.maxTimeWheel) {
                            this.freeTimeWheel = MainGame.maxTimeWheel
                        }
                        this.countDownNextFree = this.TIME_NEXT_FREE - Math.abs(this.countDownNextFree)
                    }
                } else {
                    this.countDownNextFree = this.TIME_NEXT_FREE
                }
            }
            if (earning_sec > 0) {
                if (secondsFromLastSession > this.MAX_OFFLINE_EARNING_SEC) {
                    secondsFromLastSession = this.MAX_OFFLINE_EARNING_SEC
                }
                var add_money = Math.round(earning_sec * secondsFromLastSession * this.OFFLINE_EARNING);
                this.value_offline_earning = add_money;
                if (MainGame.isDebug) {
                    console.log("skip showing offline earning", add_money)
                } else {
                    this.showOfflineEarningWindow(add_money)
                }
                this.amount_coins += add_money
            }
        } else {
            MainGame.isApiGameplayStop = true;
            if (this.currentLevel == 1 && this.exp == 0) {
                MainGame.freeTimeWheel = MainGame.maxTimeWheel;
                this.freeTimeWheel = MainGame.maxTimeWheel;
                this.initTutorial()
            }
        }
        this.updateValuesFromLoad();
        if (!this.isGoTutorial) {
            if (this.freeTimeWheel > 0) {
                if (this.buttonFortuna.visible)
                    this.icon_free_fortune.visible = true
            } else {
                this.icon_free_fortune.visible = false
            }
            if (this.nextCarLevel > 5)
                this.time.delayedCall(this.TIME_ADD_ADS_CAR, this.goAllowAdsCar, [], this)
        }
    }
    playOnce() {
        MainGame.firstGo = false;
        MainGame.Sfx.play("music", "main")
    }
    updateValuesFromLoad() {
        var text_coins_warm = this.convertNumberFormat(this.amount_coins);
        this.textCoins.setText(text_coins_warm);
        this.updateShop(text_coins_warm);
        this.updateLevel(this.exp / this.exp_max);
        if (this.nextCarLevel > this.MAX_TYPES_CAR) {
            this.layerProgressCar.visible = false
        }
        if (MainGame.cdBonusCoins && MainGame.cdBonusCoins > 0) {
            this.activateBoost(MainGame.cdBonusCoins)
        }
        if (MainGame.cdBonusSpeed && MainGame.cdBonusSpeed > 0) {
            this.activateTurbo(true, MainGame.cdBonusSpeed, true)
        }
        this.updateDailyGiftWindow();
        MainGame.typeHelicopter = MainGame.typeHelicopter || 0;
        this.updateSkinHelicopter();
        if (this.currentLevel < 4) {
            this.icon_free_fortune.visible = false;
            if (MainGame.EVENT_NUM == 2)
                this.icon_free_daily.visible = false;
            this.buttonFortuna.visible = false;
            this.buttonDailyGift.visible = false
        }
        if (this.nextCarLevel >= 5)
            this.showBanner()
    }
    initArmHelp() {
        this.arm_help = this.add.image(this.midX, this.midY, "ss_main", "tutor_cursor_0000");
        this.arm_help.visible = false;
        this.arm_help.setDepth(this.DEPTH_cursorcar);
        this.timerCheckHelp = 0
    }
    getMaxValuePair(ar) {
        var max_value = 0;
        var max_count = 0;
        var indexes_of_max = [];
        ar.sort((function(a, b) {
            return b.type - a.type
        }
        ));
        max_value = ar[0].type;
        max_count = 1;
        indexes_of_max = [ar[0].id];
        for (var i = 1; i < ar.length; i++) {
            if (ar[i].type == max_value) {
                max_count++;
                indexes_of_max.push(ar[i].id);
                if (max_count == 2) {
                    break
                }
            } else {
                max_count = 1;
                max_value = ar[i].type;
                indexes_of_max = [ar[i].id]
            }
        }
        return indexes_of_max
    }
    hideArmHelp() {
        this.tweens.killTweensOf(this.arm_help);
        this.arm_help.visible = false;
        this.timerCheckHelp = 0
    }
    updateArmHelp() {
        if (this.isGoTutorial || this.arm_help.visible)
            return;
        this.hideArmHelp();
        var valuesTypes = [];
        var parking;
        for (var i = 0; i < this.LIMIT_parking; i++) {
            parking = this.arParking[i];
            if (parking.type > 0 && parking.type < this.MAX_TYPES_CAR) {
                if (parking.obj && parking.obj.count_box_tween != null && parking.obj.count_box_tween <= 0) {
                    valuesTypes.push({
                        id: parking.id,
                        type: parking.type
                    })
                }
            }
        }
        if (valuesTypes.length < 1)
            return;
        var pairIds = this.getMaxValuePair(valuesTypes);
        if (pairIds.length > 1) {
            this.arm_help.visible = true;
            var parkingA = this.arParking[pairIds[1]];
            var parkingB = this.arParking[pairIds[0]];
            var offsetY = 15;
            this.arm_help.x = parkingA.x;
            this.arm_help.y = parkingA.y + offsetY;
            this.tweens.add({
                targets: this.arm_help,
                x: parkingB.x,
                y: parkingB.y + offsetY,
                ease: "Cubic.easeOut",
                duration: 700,
                hold: 300
            });
            this.time.delayedCall(1500, this.hideArmHelp, [], this)
        }
    }
    initTutorial() {
        this.buttonTurbo.visible = false;
        this.buttonShop.visible = false;
        this.buttonFortuna.visible = false;
        this.buttonDailyGift.visible = false;
        this.icon_trash.visible = false;
        this.isGoTutorial = true;
        this.tutorialStep = 0;
        var effect = this.add.sprite(this.midX, this.midY, "ss_main");
        effect.play("effect_tutor");
        effect.visible = false;
        this.effect_tutor = effect;
        this.tutor_arm = this.add.image(this.midX, this.midY, "ss_main", "tutor_cursor_0000");
        this.tutor_arm.visible = false;
        this.effect_tutor.setDepth(this.DEPTH_cursorcar);
        this.tutor_arm.setDepth(this.DEPTH_cursorcar);
        this.time.delayedCall(500, this.tutorialScenario, [], this);
        var posY = 505;
        if (!MainGame.isDesktop)
            posY = 590;
        this.textTutorial = this.add.bitmapText(this.midX, posY, "Panton", "");
        if (MainGame.isDesktop) {
            this.textTutorial.setMaxWidth(700)
        } else {
            this.textTutorial.setMaxWidth(500)
        }
        this.textTutorial.setCenterAlign();
        this.textTutorial.setFontSize(34);
        this.textTutorial.setOrigin(.5);
        this.textTutorial.lineSpacing = -8;
        this.textTutorial.visible = false
    }
    tutorialScenario() {
        this.tutorialStep++;
        if (this.tutorialStep == 1) {
            this.tutor_arm.visible = true;
            this.effect_tutor.visible = true;
            this.tutor_arm.x = this.midX + 30;
            this.tutor_arm.y = 450;
            if (!MainGame.isDesktop) {
                this.tutor_arm.x = 340;
                this.tutor_arm.y = 740
            }
            this.effect_tutor.y = this.tutor_arm.y - 24;
            this.effect_tutor.x = this.tutor_arm.x - 2;
            this.tweens.add({
                targets: this.tutor_arm,
                scaleX: .9,
                scaleY: .9,
                ease: "Linear",
                duration: 500,
                yoyo: true,
                repeat: -1
            })
        } else if (this.tutorialStep == 3) {
            this.buttonAddCar.disableInput();
            var obj = this.arParking[1].obj;
            this.tutor_arm.x = obj.x + 5;
            this.tutor_arm.y = obj.y + 40;
            this.effect_tutor.y = this.tutor_arm.y - 24;
            this.effect_tutor.x = this.tutor_arm.x - 2;
            this.textTutorial.visible = true;
            this.textTutorial.setText(MainGame.GAME_TEXT.text_merge);
            this.tweens.killTweensOf(this.tutor_arm);
            this.tutor_arm.setScale(1);
            this.tweens.add({
                targets: this.tutor_arm,
                x: this.tutor_arm.x - 120,
                ease: "Linear",
                duration: 900,
                repeat: -1,
                hold: 400
            })
        } else if (this.tutorialStep == 4) {
            var obj = this.arParking[0].obj;
            this.tutor_arm.x = obj.x + 5;
            this.tutor_arm.y = obj.y + 40;
            this.effect_tutor.y = this.tutor_arm.y - 24;
            this.effect_tutor.x = this.tutor_arm.x - 12;
            this.textTutorial.setText(MainGame.GAME_TEXT.text_drag);
            this.tweens.killTweensOf(this.tutor_arm);
            var posAnim = {
                x: this.tutor_arm.x + 60,
                y: this.tutor_arm.y - 160
            };
            if (!MainGame.isDesktop) {
                posAnim.x = this.tutor_arm.x - 180;
                posAnim.y = this.tutor_arm.y + 30
            }
            this.tweens.add({
                targets: this.tutor_arm,
                x: posAnim.x,
                y: posAnim.y,
                ease: "Linear",
                duration: 900,
                repeat: -1,
                hold: 400
            })
        } else if (this.tutorialStep == 5) {
            this.textTutorial.setText("");
            this.textTutorial.visible = false;
            this.tweens.killTweensOf(this.tutor_arm);
            this.addObject({
                lvl: 1,
                skinBox: true,
                parkingId: 3
            }, true);
            var obj = this.arParking[3].obj;
            this.tutor_arm.x = obj.x + 5;
            this.tutor_arm.y = obj.y + 40;
            this.effect_tutor.y = this.tutor_arm.y - 24;
            this.effect_tutor.x = this.tutor_arm.x - 12;
            this.tutor_arm.setScale(1);
            this.tweens.add({
                targets: this.tutor_arm,
                scaleX: .9,
                scaleY: .9,
                ease: "Linear",
                duration: 500,
                yoyo: true,
                repeat: -1
            })
        } else if (this.tutorialStep == 6) {
            this.tweens.killTweensOf(this.tutor_arm);
            this.tutor_arm.destroy();
            this.effect_tutor.destroy();
            this.textTutorial.destroy();
            this.isGoTutorial = false;
            this.buttonTurbo.visible = true;
            this.buttonShop.visible = true;
            this.icon_trash.visible = true;
            this.buttonAddCar.enableInput()
        }
    }
    initResize() {
        this.GAME_WIDTH = MainGame.Config.DEFAULT_WIDTH;
        this.GAME_HEIGHT = MainGame.Config.DEFAULT_HEIGHT;
        var gameSize = this.scale.gameSize;
        var width = gameSize.width;
        var height = gameSize.height;
        if (window.innerHeight < MainGame.Config.MAX_HEIGHT) {
            height = window.innerHeight
        }
        this.parent = new Phaser.Structs.Size(width,height);
        this.sizer = new Phaser.Structs.Size(this.GAME_WIDTH,this.GAME_HEIGHT,Phaser.Structs.Size.FIT,this.parent);
        this.parent.setSize(width, height);
        this.sizer.setSize(width, height);
        this.scale.on("resize", this.updateResize, this)
    }
    updateResize() {
        var gameSize = this.scale.gameSize;
        var width = gameSize.width;
        var height = gameSize.height;
        if (MainGame.isDesktop && window.innerHeight < MainGame.Config.MAX_HEIGHT) {
            height = window.innerHeight
        }
        this.parent.setSize(width, height);
        this.sizer.setSize(width, height);
        this.updateCamera()
    }
    updateCamera() {
        const camera = this.cameras.main;
        var deltaX = Math.ceil(this.parent.width - this.sizer.width) * .5;
        var deltaY = Math.ceil(this.parent.height - this.sizer.height) * .5;
        var sdvigY = 0;
        if (MainGame.isDesktop && window.innerHeight < MainGame.Config.MAX_HEIGHT) {
            deltaY = Math.ceil(window.innerHeight - this.sizer.height) * .5;
            sdvigY = this.scale.gameSize.height - window.innerHeight
        }
        const scaleX = this.sizer.width / this.GAME_WIDTH;
        const scaleY = this.sizer.height / this.GAME_HEIGHT;
        const zoom = Math.max(scaleX, scaleY);
        const offsetY = deltaY / zoom;
        const offsetX = deltaX / zoom;
        camera.setZoom(zoom);
        if (MainGame.isDesktop) {
            camera.centerOn(this.GAME_WIDTH / 2, this.GAME_HEIGHT / 2 + offsetY + sdvigY)
        } else {
            camera.centerOn(this.GAME_WIDTH / 2, this.GAME_HEIGHT / 2)
        }
        if (!MainGame.isDesktop) {
            this.buttonHelipad.y = 55 - offsetY;
            this.buttonSettings.y = 55 - offsetY;
            this.buttonFortuna.y = 55 - offsetY + 100;
            this.buttonDailyGift.y = 55 - offsetY + 210;
            this.layerPanelLevel.y = -offsetY;
            if (this.buttonHelipad.y < -50)
                this.buttonHelipad.y = -50;
            if (this.buttonSettings.y < -50)
                this.buttonSettings.y = -50;
            if (this.buttonFortuna.y < -50 + 100)
                this.buttonFortuna.y = -50 + 100;
            if (this.buttonDailyGift.y < -50 + 210)
                this.buttonDailyGift.y = -50 + 210;
            if (this.layerPanelLevel.y < -105)
                this.layerPanelLevel.y = -105;
            this.buttonSettings.x = 640 - 55 + offsetX;
            if (this.buttonSettings.x > 700)
                this.buttonSettings.x = 700;
            this.buttonFortuna.x = 640 - 55 + offsetX;
            if (this.buttonFortuna.x > 700)
                this.buttonFortuna.x = 700;
            this.buttonDailyGift.x = 640 - 55 + offsetX;
            if (this.buttonDailyGift.x > 700)
                this.buttonDailyGift.x = 700;
            this.layerIndicatorCoins.x = 50 - offsetX;
            if (this.layerIndicatorCoins.x < -65)
                this.layerIndicatorCoins.x = -65;
            this.layerIndicatorBoost.x = 50 - offsetX;
            if (this.layerIndicatorBoost.x < -65)
                this.layerIndicatorBoost.x = -65;
            this.buttonHelipad.x = 50 - offsetX;
            if (this.buttonHelipad.x < -65)
                this.buttonHelipad.x = -65;
            this.icon_free_fortune.x = this.buttonFortuna.x - 35;
            this.icon_free_fortune.y = this.buttonFortuna.y - 24;
            this.icon_free_daily.x = this.buttonDailyGift.x - 35;
            this.icon_free_daily.y = this.buttonDailyGift.y - 24
        }
    }
    getCarCoins(vNum) {
        var carInfo = this.getCarInfo(vNum);
        var speed = carInfo.speed;
        var coins = carInfo.coins;
        var timeLoop = 1 / (60 * speed);
        return Math.round(coins / timeLoop)
    }
    initMainButtons() {
        var posX = 970;
        var posY = 415;
        var posXmin = 50;
        var posYhelipad = 500;
        var posTrash = {
            x: 970,
            y: 500
        };
        if (!MainGame.isDesktop) {
            posX = 640 - 55;
            posY = 700;
            posXmin = 0;
            posYhelipad = 55;
            posTrash.x = this.midX;
            posTrash.y = 970
        }
        this.icon_trash = this.add.image(posTrash.x, posTrash.y, "ss_main", "btn_delete_0000");
        this.icon_trash.setScale(.9);
        this.buttonSettings = new Button(posX,55,"ss_main","btn_settings_0000",this.openSettings,this);
        this.buttonSettings.setDepth(this.DEPTH_GUI);
        this.buttonHelipad = new Button(posXmin,posYhelipad,"ss_main","btn_helipad_0000",this.openHelipadWindow,this);
        this.buttonHelipad.setDepth(this.DEPTH_GUI);
        if (MainGame.prizeWinter) {
            this.buttonHelipad.visible = true
        } else {
            this.buttonHelipad.visible = false
        }
        this.buttonFortuna = new Button(posX,55 + 100,"ss_main","btn_fortune_0000",this.openFortunaWheelWindow,this);
        this.buttonFortuna.setDepth(this.DEPTH_GUI);
        this.buttonDailyGift = new Button(posX,55 + 210,"ss_main","present_0000",this.openDailyGiftWindow,this);
        this.buttonDailyGift.setDepth(this.DEPTH_GUI);
        this.buttonDailyGift.visible = false;
        if (MainGame.EVENT_NUM == 2) {
            this.buttonDailyGift.visible = true
        }
        var buttonAddCar = new ButtonText(this.midX,posY + 9,"ss_main","btn_big_0000",this.buyFastCar,this,"");
        this.layerButtons.add(buttonAddCar);
        this.buttonAddCar = buttonAddCar;
        var icon_fast_car = this.add.image(0, -32, "ss_cars", "icon_f1_0000");
        icon_fast_car.setScale(this.getScaleCar(.8));
        buttonAddCar.add(icon_fast_car);
        var icon_fast_coin = this.add.image(-35, 17, "ss_main", "money_0000");
        icon_fast_coin.setScale(.5);
        buttonAddCar.add(icon_fast_coin);
        buttonAddCar.text.setFontSize(26);
        buttonAddCar.text.y = icon_fast_coin.y;
        this.buttonAddCar = buttonAddCar;
        this.icon_fast_car = icon_fast_car;
        this.icon_fast_coin = icon_fast_coin;
        var buttonTurbo = new ButtonText(this.midX - 165,posY,"ss_main","btn_turbo_0000",this.clickTurbo,this,MainGame.GAME_TEXT.turbo);
        buttonTurbo.text.setFontSize(18);
        buttonTurbo.text.y = 30;
        MainGame.updateTextWidth(buttonTurbo.text, 85);
        this.layerButtons.add(buttonTurbo);
        this.buttonTurbo = buttonTurbo;
        var txt = this.addText(this.layerButtons, this.midX - 130 - 5, 752, "", 20);
        txt.setText(this.secToHHMMSS(125));
        txt.visible = false;
        this.textFieldIndicatorTurboCooldown = txt;
        var buttonShop = new ButtonText(this.midX + 165,posY,"ss_main","btn_shop_0000",this.clickShop,this,MainGame.GAME_TEXT.shop);
        buttonShop.text.setFontSize(18);
        buttonShop.text.y = 30;
        MainGame.updateTextWidth(buttonShop.text, 85);
        this.layerButtons.add(buttonShop);
        this.buttonShop = buttonShop;
        var icon_adv = this.add.image(45, -30, "ss_main", "icon_adv_0000");
        buttonShop.add(icon_adv);
        this.icon_adv = icon_adv;
        icon_adv.angle = -5;
        this.tweens.add({
            targets: icon_adv,
            scaleX: 1.15,
            scaleY: 1.15,
            ease: "Linear",
            duration: 400,
            yoyo: true,
            repeat: -1
        });
        this.tweens.add({
            targets: icon_adv,
            angle: 5,
            ease: "Linear",
            duration: 400,
            yoyo: true,
            repeat: -1
        });
        this.icon_adv.visible = false;
        var icon_free_fortune = this.add.image(this.buttonFortuna.x - 35, this.buttonFortuna.y - 24, "ss_main", "icon_adv_0000");
        icon_free_fortune.setDepth(this.DEPTH_GUI);
        this.icon_free_fortune = icon_free_fortune;
        icon_free_fortune.angle = -5;
        this.tweens.add({
            targets: icon_free_fortune,
            scaleX: 1.15,
            scaleY: 1.15,
            ease: "Linear",
            duration: 400,
            yoyo: true,
            repeat: -1
        });
        this.tweens.add({
            targets: icon_free_fortune,
            angle: 5,
            ease: "Linear",
            duration: 400,
            yoyo: true,
            repeat: -1
        });
        this.icon_free_fortune.visible = false;
        var icon_free_daily = this.add.image(this.buttonDailyGift.x - 35, this.buttonDailyGift.y - 24, "ss_main", "icon_adv2_0000");
        icon_free_daily.setDepth(this.DEPTH_GUI);
        this.icon_free_daily = icon_free_daily;
        icon_free_daily.angle = -5;
        this.tweens.add({
            targets: icon_free_daily,
            scaleX: 1.15,
            scaleY: 1.15,
            ease: "Linear",
            duration: 400,
            yoyo: true,
            repeat: -1
        });
        this.tweens.add({
            targets: icon_free_daily,
            angle: 5,
            ease: "Linear",
            duration: 400,
            yoyo: true,
            repeat: -1
        });
        this.icon_free_daily.visible = false
    }
    clickBuyShopItem(value) {
        if (this.ALLOW_ADS_CAR && this.num_ads_car == value) {
            if (this.getFreeParking() < 0) {
                this.showSystemMessage(MainGame.GAME_TEXT.no_parking);
                return
            }
            this.showAdsForCar()
        } else {
            this.buyCar(value, true)
        }
    }
    buyFastCar() {
        var typeFastCar = this.getTypeBetterPrice();
        this.buyCar(typeFastCar, false);
        if (this.isGoTutorial && this.tutorialStep < 3) {
            this.tutorialScenario()
        }
    }
    buyCar(vNum, vFromShop) {
        if (this.getFreeParking() < 0) {
            this.showSystemMessage(MainGame.GAME_TEXT.no_parking);
            return
        }
        var priceCar = this.getPriceCar(vNum);
        if (this.amount_coins < priceCar) {
            this.showSystemMessage(MainGame.GAME_TEXT.no_money);
            return
        }
        this.addObject({
            lvl: vNum,
            fromShop: vFromShop
        }, true);
        this.amount_coins -= priceCar;
        var text_coins_warm = this.convertNumberFormat(this.amount_coins);
        this.textCoins.setText(text_coins_warm);
        this.updateShop(text_coins_warm);
        this.updatePriceCar(vNum);
        this.updateFastBuy();
        this.updateShopItem();
        this.updateBoxHave();
        this.saveDeltaCarLevel();
        MainGame.Sfx.play("sound", "buy_car")
    }
    updateFastBuy() {
        var typeFastCar = this.getTypeBetterPrice();
        var price = this.getPriceCar(typeFastCar);
        var text_coins_warm = this.convertNumberFormat(price);
        this.buttonAddCar.text.setText(text_coins_warm);
        this.buttonAddCar.text.x = 10;
        this.buttonAddCar.text.y = 15;
        this.icon_fast_coin.x = this.buttonAddCar.text.x - this.buttonAddCar.text.width * .5 - 17;
        this.icon_fast_car.setFrame("icon_f" + typeFastCar + "_0000")
    }
    testGetPrices(vValue) {
        var info;
        var price;
        var price2;
        var needPriceAr = [0, 100, 1500, 4800, 14880, 46130, 143e3, 443300, 1418560, 4539392, 14526054, 46483372, 148746792, 475989737, 1523167159, 4874134911, 15597231715, 49911141488, 159715652763, 511090088843, 1635488284299, 5233562509759, 0xf3b4ed46bfd, 53591680099934, 0x9bf8e9c6e12e, 548778804223328];
        for (var i = 1; i <= vValue; i++) {
            info = this.getCarInfo(i);
            price = this.convertNumberFormat(info.price);
            price2 = this.convertNumberFormat(needPriceAr[i]);
            console.log(i + "\t : " + price + "\t | " + price2)
        }
    }
    getCarInfo(type) {
        var _price = 100;
        if (type > 1) {
            _price = Math.floor(1e3 * Math.pow(2.25, type - 2))
        }
        var _speed = .002 + 15e-5 * type;
        var _coins = Math.pow(2, type) * 19;
        return {
            speed: _speed,
            coins: _coins,
            price: _price
        }
    }
    getPriceCar(vType) {
        return this.arCurrentPricesCar[vType - 1]
    }
    updatePriceCar(vType) {
        var type_car = vType;
        this.arDeltaCarLevel[type_car - 1]++;
        var new_value = this.arCurrentPricesCar[type_car - 1] * this.DELTA_PRICE;
        this.arCurrentPricesCar[type_car - 1] = Math.round(new_value)
    }
    convertNumberFormat(number) {
        var temp = number;
        var tabUnits = ["K", "M", "B", "T", "aa", "bb", "cc", "dd", "ee", "ff", "gg", "hh", "ii", "jj", "kk", "ll", "mm", "nn", "oo", "pp", "qq", "rr", "ss", "tt", "uu", "vv", "ww", "xx", "yy", "zz"];
        var highnumber = false;
        var bignumber = 1e3;
        var tabposition = -1;
        var p_atomepersecond = true;
        var unit;
        if (number >= bignumber) {
            highnumber = true;
            while (number >= bignumber) {
                bignumber *= 1e3;
                tabposition++
            }
            number /= bignumber / 1e3;
            unit = tabUnits[tabposition]
        } else
            unit = "";
        if (unit == undefined)
            return temp.toExponential(2);
        var toround = highnumber == true ? p_atomepersecond == true ? 100 : 100 : 10;
        var res = Math.round(number * toround) / toround;
        return [res.toLocaleString().replace(",", ".") + "" + unit]
    }
    initSettingsGame() {
        this.isShopAdded = false;
        this.isTweeningWheel = false;
        this.MAX_TYPES_CAR = 50;
        this.DISTANCE_DRAG = 2e3;
        this.value_offline_earning = 0;
        this.isGoTutorial = false;
        this.buttonEnabled = true;
        this.tutorialStep = 0;
        this.gameStarted = false;
        this.isDoubleSpeed = false;
        this.isBoostTimer = false;
        this.total_speed = 0;
        this.showAfterMerge = false;
        this.isShowHelicopter = false;
        this.countHelicopterFly = 0;
        this.flagHelicopter = true;
        this.isDownOnParking = false;
        this.isDrag = false;
        this.selectedCar = null;
        this.linkToOldParking = null;
        this.DEPTH_text_pilots = .015;
        this.DEPTH_icon_pilots = .016;
        this.DEPTH_racing_car = .017;
        this.DEPTH_platform = .018;
        this.DEPTH_hightlight = .019;
        this.DEPTH_cars = .02;
        this.DEPTH_iconreturn = .021;
        this.DEPTH_effect_unboxing = .022;
        this.DEPTH_GUI = .1;
        this.DEPTH_text_coins = .2;
        this.DEPTH_text_field = .21;
        this.DEPTH_helicopter = .22;
        this.DEPTH_layerMainButtons = .24;
        this.DEPTH_layerLevelBar = .25;
        this.DEPTH_cursorcar = .26;
        this.DEPTH_layerMerge = .3;
        this.DEPTH_layerUnlock = .31;
        this.DEPTH_layerShop = .5;
        this.DEPTH_systemtext = .6;
        this.countDownRebootBonusSpeed = 0;
        this.countDownBonusSpeed = 0;
        this.countDownBonusCoins = 0;
        this.countDownNextFree = 0;
        this.turboCount = 0;
        this.VALUE_SELL = .25;
        this.DELTA_PRICE = 1.15;
        this.OFFLINE_EARNING = .2;
        this.MAX_OFFLINE_EARNING_SEC = 60 * 60 * 48;
        this.MAX_PARKING = 12;
        this.MAX_PILOTS = 10;
        this.value_boost = 5;
        this.FACTOR_TURBO = 2;
        this.ALLOW_ADS_CAR = false;
        this.num_ads_car = 0;
        this.TIME_BOOST = 150;
        this.TIME_COOLDOWN_BOOST = 60 * 5;
        this.TIME_COINS = 60;
        this.TIME_ADD_FREE_BOX = 20 * 1e3;
        this.TIME_ADD_SANTA_BAG = 60 * 1e3;
        this.TIME_ADD_HELICOPTER = 1.5 * 60 * 1e3;
        this.TIME_ADD_ADS_CAR = 2 * 60 * 1e3;
        this.TIME_HELP_ARM = 2 * 60;
        this.TIME_CHECK_BUFFER = 200;
        this.TIME_NEXT_FREE = 30 * 60;
        this.TIME_NEXT_GIFT = 60 * 60 * 20;
        this.ICON_RETURN_OFFSET = {
            x: 45,
            y: -27
        };
        this.PANEL_NUMBER_OFFSET = {
            x: 27,
            y: 12
        };
        this.HIGHLIGHTER_OFFSET = {
            x: 0,
            y: 0
        };
        this.CARS_OFFSET = {
            x: 0,
            y: -20
        };
        this.amount_coins = MainGame.amount_coins || 1e3;
        this.exp = MainGame.exp || 0;
        this.nextCarLevel = MainGame.nextCarLevel || 2;
        this.currentLevel = MainGame.currentLevel || 1;
        this.LIMIT_parking = MainGame.LIMIT_parking || 4;
        this.LIMIT_pilots = MainGame.LIMIT_pilots || 2;
        this.freeTimeWheel = MainGame.freeTimeWheel || 0;
        this.box_have = [];
        this.arDeltaCarLevel = [];
        this.buffer_boxes = [];
        if (MainGame.box_have) {
            for (var i = 0; i < this.MAX_PARKING; i++) {
                this.box_have[i] = MainGame.box_have[i]
            }
        } else {
            for (var i = 0; i < this.MAX_PARKING; i++) {
                this.box_have[i] = null
            }
        }
        if (MainGame.buffer_boxes) {
            for (var i = 0; i < MainGame.buffer_boxes.length; i++) {
                this.buffer_boxes[i] = MainGame.buffer_boxes[i]
            }
        }
        if (MainGame.arDeltaCarLevel) {
            for (var i = 0; i < this.MAX_TYPES_CAR; i++) {
                this.arDeltaCarLevel[i] = MainGame.arDeltaCarLevel[i]
            }
        } else {
            for (var i = 0; i < this.MAX_TYPES_CAR; i++) {
                this.arDeltaCarLevel[i] = 0
            }
        }
        this.exp_max = this.getExpMax(this.currentLevel);
        this.arCurrentPricesCar = [];
        var price = 0;
        for (var i = 0; i < this.MAX_TYPES_CAR; i++) {
            price = this.getCarInfo(i + 1).price;
            for (var j = 0; j < this.arDeltaCarLevel[i]; j++) {
                price = Math.round(price * this.DELTA_PRICE)
            }
            this.arCurrentPricesCar[i] = price
        }
        this.time.addEvent({
            delay: 1e3,
            callback: this.updateTimerEverySec,
            callbackScope: this,
            loop: true
        });
        this.time.addEvent({
            delay: this.TIME_CHECK_BUFFER,
            callback: this.checkBuffer,
            callbackScope: this,
            loop: true
        });
        this.time.addEvent({
            delay: this.TIME_ADD_FREE_BOX,
            callback: this.timeToAddFreeBox,
            callbackScope: this,
            loop: true
        });
        if (MainGame.EVENT_NUM == 2) {
            this.time.addEvent({
                delay: this.TIME_ADD_SANTA_BAG,
                callback: this.showSantaBag,
                callbackScope: this,
                loop: true
            })
        }
        this.time.addEvent({
            delay: this.TIME_ADD_HELICOPTER,
            callback: this.timeToHelicopter,
            callbackScope: this,
            loop: true
        })
    }
    updateTimerEverySec() {
        if (this.freeTimeWheel < MainGame.maxTimeWheel) {
            if (this.countDownNextFree > 0) {
                this.countDownNextFree--;
                MainGame.cdNextFree = this.countDownNextFree;
                if (this.countDownNextFree == 0) {
                    this.freeTimeWheel++;
                    MainGame.freeTimeWheel = this.freeTimeWheel;
                    if (this.freeTimeWheel < MainGame.maxTimeWheel) {
                        this.countDownNextFree = this.TIME_NEXT_FREE
                    }
                    MainGame.saveSaves()
                }
                this.updateFortunaWheelWindow(this.countDownNextFree)
            }
        }
    }
    getCoinsLevelUp(vPlayerLevel) {
        return 1e3 * Math.pow(2, vPlayerLevel)
    }
    getExpMerge(vCarLevel) {
        return 15 * Math.pow(2, vCarLevel)
    }
    getExpMax(vPlayerLevel) {
        return 100 * Math.pow(2, vPlayerLevel)
    }
    saveBoxHave() {
        if (this.isGoTutorial)
            return;
        MainGame.box_have = [];
        for (var i = 0; i < this.box_have.length; i++) {
            MainGame.box_have.push(this.box_have[i])
        }
        MainGame.saveSaves()
    }
    saveBoxBuffer() {
        MainGame.buffer_boxes = [];
        for (var i = 0; i < this.buffer_boxes.length; i++) {
            MainGame.buffer_boxes.push(this.buffer_boxes[i])
        }
        MainGame.saveSaves()
    }
    saveDeltaCarLevel() {
        if (this.isGoTutorial)
            return;
        MainGame.arDeltaCarLevel = [];
        for (var i = 0; i < this.arDeltaCarLevel.length; i++) {
            MainGame.arDeltaCarLevel.push(this.arDeltaCarLevel[i])
        }
        MainGame.saveSaves()
    }
    saveGameValues() {
        if (this.isGoTutorial)
            return;
        MainGame.amount_coins = this.amount_coins;
        MainGame.exp = this.exp;
        MainGame.nextCarLevel = this.nextCarLevel;
        MainGame.currentLevel = this.currentLevel;
        MainGame.LIMIT_parking = this.LIMIT_parking;
        MainGame.LIMIT_pilots = this.LIMIT_pilots;
        MainGame.lastSession = (new Date).getTime();
        MainGame.saveSaves()
    }
    updateBoxHave() {
        if (this.isGoTutorial)
            return;
        var parking;
        for (var i = 0; i < this.LIMIT_parking; i++) {
            parking = this.arParking[i];
            if (parking.type > 0) {
                this.box_have[i] = {
                    id: parking.id,
                    t: parking.type,
                    r: parking.racing
                }
            } else {
                this.box_have[i] = null
            }
        }
        this.saveBoxHave();
        this.saveGameValues()
    }
    updateParking() {
        if (MainGame.isDesktop) {
            this.updateParkingLascape()
        } else {
            this.updateParkingPortrait()
        }
    }
    updateParkingPortrait() {
        var countParking = this.LIMIT_parking;
        var parking = null;
        var arPos = null;
        var posParking = {
            x: this.midX,
            y: 340
        };
        var offsetX = 65;
        var offsetY = 90;
        var arPos4 = [{
            x: posParking.x - offsetX,
            y: posParking.y + 0 * offsetY + 80
        }, {
            x: posParking.x + offsetX,
            y: posParking.y + 0 * offsetY + 80
        }, {
            x: posParking.x - offsetX,
            y: posParking.y + 1 * offsetY + 80
        }, {
            x: posParking.x + offsetX,
            y: posParking.y + 1 * offsetY + 80
        }];
        var arPos5 = [{
            x: posParking.x - offsetX,
            y: posParking.y + 0 * offsetY + 40
        }, {
            x: posParking.x + offsetX,
            y: posParking.y + 0 * offsetY + 40
        }, {
            x: posParking.x - offsetX,
            y: posParking.y + 1 * offsetY + 40
        }, {
            x: posParking.x + offsetX,
            y: posParking.y + 1 * offsetY + 40
        }, {
            x: posParking.x,
            y: posParking.y + 2 * offsetY + 40
        }];
        var arPos6 = [{
            x: posParking.x - offsetX,
            y: posParking.y + 0 * offsetY + 40
        }, {
            x: posParking.x + offsetX,
            y: posParking.y + 0 * offsetY + 40
        }, {
            x: posParking.x - offsetX,
            y: posParking.y + 1 * offsetY + 40
        }, {
            x: posParking.x + offsetX,
            y: posParking.y + 1 * offsetY + 40
        }, {
            x: posParking.x - offsetX,
            y: posParking.y + 2 * offsetY + 40
        }, {
            x: posParking.x + offsetX,
            y: posParking.y + 2 * offsetY + 40
        }];
        var arPos7 = [{
            x: posParking.x - offsetX,
            y: posParking.y + 0 * offsetY
        }, {
            x: posParking.x + offsetX,
            y: posParking.y + 0 * offsetY
        }, {
            x: posParking.x - offsetX,
            y: posParking.y + 1 * offsetY
        }, {
            x: posParking.x + offsetX,
            y: posParking.y + 1 * offsetY
        }, {
            x: posParking.x - offsetX,
            y: posParking.y + 2 * offsetY
        }, {
            x: posParking.x + offsetX,
            y: posParking.y + 2 * offsetY
        }, {
            x: posParking.x,
            y: posParking.y + 3 * offsetY
        }];
        var arPos8 = [{
            x: posParking.x - offsetX,
            y: posParking.y + 0 * offsetY
        }, {
            x: posParking.x + offsetX,
            y: posParking.y + 0 * offsetY
        }, {
            x: posParking.x - offsetX,
            y: posParking.y + 1 * offsetY
        }, {
            x: posParking.x + offsetX,
            y: posParking.y + 1 * offsetY
        }, {
            x: posParking.x - offsetX,
            y: posParking.y + 2 * offsetY
        }, {
            x: posParking.x + offsetX,
            y: posParking.y + 2 * offsetY
        }, {
            x: posParking.x - offsetX,
            y: posParking.y + 3 * offsetY
        }, {
            x: posParking.x + offsetX,
            y: posParking.y + 3 * offsetY
        }];
        var arPos9 = [{
            x: posParking.x - offsetX * 2,
            y: posParking.y + 0 * offsetY
        }, {
            x: posParking.x,
            y: posParking.y + 0 * offsetY
        }, {
            x: posParking.x + offsetX * 2,
            y: posParking.y + 0 * offsetY
        }, {
            x: posParking.x - offsetX,
            y: posParking.y + 1 * offsetY
        }, {
            x: posParking.x + offsetX,
            y: posParking.y + 1 * offsetY
        }, {
            x: posParking.x - offsetX,
            y: posParking.y + 2 * offsetY
        }, {
            x: posParking.x + offsetX,
            y: posParking.y + 2 * offsetY
        }, {
            x: posParking.x - offsetX,
            y: posParking.y + 3 * offsetY
        }, {
            x: posParking.x + offsetX,
            y: posParking.y + 3 * offsetY
        }];
        var arPos10 = [{
            x: posParking.x - offsetX * 2,
            y: posParking.y + 0 * offsetY
        }, {
            x: posParking.x,
            y: posParking.y + 0 * offsetY
        }, {
            x: posParking.x + offsetX * 2,
            y: posParking.y + 0 * offsetY
        }, {
            x: posParking.x - offsetX * 2,
            y: posParking.y + 1 * offsetY
        }, {
            x: posParking.x,
            y: posParking.y + 1 * offsetY
        }, {
            x: posParking.x + offsetX * 2,
            y: posParking.y + 1 * offsetY
        }, {
            x: posParking.x - offsetX,
            y: posParking.y + 2 * offsetY
        }, {
            x: posParking.x + offsetX,
            y: posParking.y + 2 * offsetY
        }, {
            x: posParking.x - offsetX,
            y: posParking.y + 3 * offsetY
        }, {
            x: posParking.x + offsetX,
            y: posParking.y + 3 * offsetY
        }];
        var arPos11 = [{
            x: posParking.x - offsetX * 2,
            y: posParking.y + 0 * offsetY
        }, {
            x: posParking.x,
            y: posParking.y + 0 * offsetY
        }, {
            x: posParking.x + offsetX * 2,
            y: posParking.y + 0 * offsetY
        }, {
            x: posParking.x - offsetX * 2,
            y: posParking.y + 1 * offsetY
        }, {
            x: posParking.x,
            y: posParking.y + 1 * offsetY
        }, {
            x: posParking.x + offsetX * 2,
            y: posParking.y + 1 * offsetY
        }, {
            x: posParking.x - offsetX * 2,
            y: posParking.y + 2 * offsetY
        }, {
            x: posParking.x,
            y: posParking.y + 2 * offsetY
        }, {
            x: posParking.x + offsetX * 2,
            y: posParking.y + 2 * offsetY
        }, {
            x: posParking.x - offsetX,
            y: posParking.y + 3 * offsetY
        }, {
            x: posParking.x + offsetX,
            y: posParking.y + 3 * offsetY
        }];
        var arPos12 = [{
            x: posParking.x - offsetX * 2,
            y: posParking.y + 0 * offsetY
        }, {
            x: posParking.x,
            y: posParking.y + 0 * offsetY
        }, {
            x: posParking.x + offsetX * 2,
            y: posParking.y + 0 * offsetY
        }, {
            x: posParking.x - offsetX * 2,
            y: posParking.y + 1 * offsetY
        }, {
            x: posParking.x,
            y: posParking.y + 1 * offsetY
        }, {
            x: posParking.x + offsetX * 2,
            y: posParking.y + 1 * offsetY
        }, {
            x: posParking.x - offsetX * 2,
            y: posParking.y + 2 * offsetY
        }, {
            x: posParking.x,
            y: posParking.y + 2 * offsetY
        }, {
            x: posParking.x + offsetX * 2,
            y: posParking.y + 2 * offsetY
        }, {
            x: posParking.x - offsetX * 2,
            y: posParking.y + 3 * offsetY
        }, {
            x: posParking.x,
            y: posParking.y + 3 * offsetY
        }, {
            x: posParking.x + offsetX * 2,
            y: posParking.y + 3 * offsetY
        }];
        switch (countParking) {
        case 4:
            arPos = arPos4;
            break;
        case 5:
            arPos = arPos5;
            break;
        case 6:
            arPos = arPos6;
            break;
        case 7:
            arPos = arPos7;
            break;
        case 8:
            arPos = arPos8;
            break;
        case 9:
            arPos = arPos9;
            break;
        case 10:
            arPos = arPos10;
            break;
        case 11:
            arPos = arPos11;
            break;
        default:
            arPos = arPos12;
            break
        }
        for (var i = 0; i < countParking; i++) {
            parking = this.arParking[i];
            parking.x = arPos[i].x;
            parking.y = arPos[i].y;
            parking.icon_parking.visible = true;
            parking.icon_parking.x = parking.x;
            parking.icon_parking.y = parking.y;
            parking.highlighter.x = parking.x + this.HIGHLIGHTER_OFFSET.x;
            parking.highlighter.y = parking.y + this.HIGHLIGHTER_OFFSET.y;
            parking.btn_return.x = parking.x + this.ICON_RETURN_OFFSET.x;
            parking.btn_return.y = parking.y + this.ICON_RETURN_OFFSET.y;
            parking.icon_panel_number.x = parking.x + this.PANEL_NUMBER_OFFSET.x;
            parking.icon_panel_number.y = parking.y + this.PANEL_NUMBER_OFFSET.y;
            parking.textNumberType.x = parking.x + this.PANEL_NUMBER_OFFSET.x - 3;
            parking.textNumberType.y = parking.y + this.PANEL_NUMBER_OFFSET.y - 5;
            if (parking.obj) {
                parking.obj.x = parking.x + this.CARS_OFFSET.x;
                parking.obj.y = parking.y + this.CARS_OFFSET.y
            }
        }
        this.hideArmHelp()
    }
    updateParkingLascape() {
        var countParking = this.LIMIT_parking;
        var parking = null;
        var arPos = null;
        var posParking = {
            x: this.midX,
            y: 180
        };
        var offsetX = 68;
        var offsetY = 80;
        var arPos4 = [{
            x: posParking.x - offsetX,
            y: posParking.y + 0 * offsetY + 40
        }, {
            x: posParking.x + offsetX,
            y: posParking.y + 0 * offsetY + 40
        }, {
            x: posParking.x - offsetX,
            y: posParking.y + 1 * offsetY + 40
        }, {
            x: posParking.x + offsetX,
            y: posParking.y + 1 * offsetY + 40
        }];
        var arPos5 = [{
            x: posParking.x - offsetX * 2,
            y: posParking.y + 0 * offsetY + 40
        }, {
            x: posParking.x,
            y: posParking.y + 0 * offsetY + 40
        }, {
            x: posParking.x + offsetX * 2,
            y: posParking.y + 0 * offsetY + 40
        }, {
            x: posParking.x - offsetX,
            y: posParking.y + 1 * offsetY + 40
        }, {
            x: posParking.x + offsetX,
            y: posParking.y + 1 * offsetY + 40
        }];
        var arPos6 = [{
            x: posParking.x - offsetX * 2,
            y: posParking.y + 0 * offsetY
        }, {
            x: posParking.x,
            y: posParking.y + 0 * offsetY
        }, {
            x: posParking.x + offsetX * 2,
            y: posParking.y + 0 * offsetY
        }, {
            x: posParking.x - offsetX,
            y: posParking.y + 1 * offsetY
        }, {
            x: posParking.x + offsetX,
            y: posParking.y + 1 * offsetY
        }, {
            x: posParking.x,
            y: posParking.y + 2 * offsetY
        }];
        var arPos7 = [{
            x: posParking.x - offsetX * 2,
            y: posParking.y + 0 * offsetY
        }, {
            x: posParking.x,
            y: posParking.y + 0 * offsetY
        }, {
            x: posParking.x + offsetX * 2,
            y: posParking.y + 0 * offsetY
        }, {
            x: posParking.x - offsetX,
            y: posParking.y + 1 * offsetY
        }, {
            x: posParking.x + offsetX,
            y: posParking.y + 1 * offsetY
        }, {
            x: posParking.x - offsetX,
            y: posParking.y + 2 * offsetY
        }, {
            x: posParking.x + offsetX,
            y: posParking.y + 2 * offsetY
        }];
        var arPos8 = [{
            x: posParking.x - offsetX * 2,
            y: posParking.y + 0 * offsetY
        }, {
            x: posParking.x,
            y: posParking.y + 0 * offsetY
        }, {
            x: posParking.x + offsetX * 2,
            y: posParking.y + 0 * offsetY
        }, {
            x: posParking.x - offsetX * 2,
            y: posParking.y + 1 * offsetY
        }, {
            x: posParking.x,
            y: posParking.y + 1 * offsetY
        }, {
            x: posParking.x + offsetX * 2,
            y: posParking.y + 1 * offsetY
        }, {
            x: posParking.x - offsetX,
            y: posParking.y + 2 * offsetY
        }, {
            x: posParking.x + offsetX,
            y: posParking.y + 2 * offsetY
        }];
        var arPos9 = [{
            x: posParking.x - offsetX * 2,
            y: posParking.y + 0 * offsetY
        }, {
            x: posParking.x,
            y: posParking.y + 0 * offsetY
        }, {
            x: posParking.x + offsetX * 2,
            y: posParking.y + 0 * offsetY
        }, {
            x: posParking.x - offsetX * 2,
            y: posParking.y + 1 * offsetY
        }, {
            x: posParking.x,
            y: posParking.y + 1 * offsetY
        }, {
            x: posParking.x + offsetX * 2,
            y: posParking.y + 1 * offsetY
        }, {
            x: posParking.x - offsetX * 2,
            y: posParking.y + 2 * offsetY
        }, {
            x: posParking.x,
            y: posParking.y + 2 * offsetY
        }, {
            x: posParking.x + offsetX * 2,
            y: posParking.y + 2 * offsetY
        }];
        var arPos10 = [{
            x: posParking.x - offsetX * 3,
            y: posParking.y + 0 * offsetY
        }, {
            x: posParking.x - offsetX,
            y: posParking.y + 0 * offsetY
        }, {
            x: posParking.x + offsetX,
            y: posParking.y + 0 * offsetY
        }, {
            x: posParking.x + offsetX * 3,
            y: posParking.y + 0 * offsetY
        }, {
            x: posParking.x - offsetX * 2,
            y: posParking.y + 1 * offsetY
        }, {
            x: posParking.x,
            y: posParking.y + 1 * offsetY
        }, {
            x: posParking.x + offsetX * 2,
            y: posParking.y + 1 * offsetY
        }, {
            x: posParking.x - offsetX * 2,
            y: posParking.y + 2 * offsetY
        }, {
            x: posParking.x,
            y: posParking.y + 2 * offsetY
        }, {
            x: posParking.x + offsetX * 2,
            y: posParking.y + 2 * offsetY
        }];
        var arPos11 = [{
            x: posParking.x - offsetX * 3,
            y: posParking.y + 0 * offsetY
        }, {
            x: posParking.x - offsetX,
            y: posParking.y + 0 * offsetY
        }, {
            x: posParking.x + offsetX,
            y: posParking.y + 0 * offsetY
        }, {
            x: posParking.x + offsetX * 3,
            y: posParking.y + 0 * offsetY
        }, {
            x: posParking.x - offsetX * 3,
            y: posParking.y + 1 * offsetY
        }, {
            x: posParking.x - offsetX,
            y: posParking.y + 1 * offsetY
        }, {
            x: posParking.x + offsetX,
            y: posParking.y + 1 * offsetY
        }, {
            x: posParking.x + offsetX * 3,
            y: posParking.y + 1 * offsetY
        }, {
            x: posParking.x - offsetX * 2,
            y: posParking.y + 2 * offsetY
        }, {
            x: posParking.x,
            y: posParking.y + 2 * offsetY
        }, {
            x: posParking.x + offsetX * 2,
            y: posParking.y + 2 * offsetY
        }];
        var arPos12 = [{
            x: posParking.x - offsetX * 3,
            y: posParking.y + 0 * offsetY
        }, {
            x: posParking.x - offsetX,
            y: posParking.y + 0 * offsetY
        }, {
            x: posParking.x + offsetX,
            y: posParking.y + 0 * offsetY
        }, {
            x: posParking.x + offsetX * 3,
            y: posParking.y + 0 * offsetY
        }, {
            x: posParking.x - offsetX * 3,
            y: posParking.y + 1 * offsetY
        }, {
            x: posParking.x - offsetX,
            y: posParking.y + 1 * offsetY
        }, {
            x: posParking.x + offsetX,
            y: posParking.y + 1 * offsetY
        }, {
            x: posParking.x + offsetX * 3,
            y: posParking.y + 1 * offsetY
        }, {
            x: posParking.x - offsetX * 3,
            y: posParking.y + 2 * offsetY
        }, {
            x: posParking.x - offsetX,
            y: posParking.y + 2 * offsetY
        }, {
            x: posParking.x + offsetX,
            y: posParking.y + 2 * offsetY
        }, {
            x: posParking.x + offsetX * 3,
            y: posParking.y + 2 * offsetY
        }];
        switch (countParking) {
        case 4:
            arPos = arPos4;
            break;
        case 5:
            arPos = arPos5;
            break;
        case 6:
            arPos = arPos6;
            break;
        case 7:
            arPos = arPos7;
            break;
        case 8:
            arPos = arPos8;
            break;
        case 9:
            arPos = arPos9;
            break;
        case 10:
            arPos = arPos10;
            break;
        case 11:
            arPos = arPos11;
            break;
        default:
            arPos = arPos12;
            break
        }
        for (var i = 0; i < countParking; i++) {
            parking = this.arParking[i];
            parking.x = arPos[i].x;
            parking.y = arPos[i].y;
            parking.icon_parking.visible = true;
            parking.icon_parking.x = parking.x;
            parking.icon_parking.y = parking.y;
            parking.highlighter.x = parking.x + this.HIGHLIGHTER_OFFSET.x;
            parking.highlighter.y = parking.y + this.HIGHLIGHTER_OFFSET.y;
            parking.btn_return.x = parking.x + this.ICON_RETURN_OFFSET.x;
            parking.btn_return.y = parking.y + this.ICON_RETURN_OFFSET.y;
            parking.icon_panel_number.x = parking.x + this.PANEL_NUMBER_OFFSET.x;
            parking.icon_panel_number.y = parking.y + this.PANEL_NUMBER_OFFSET.y;
            parking.textNumberType.x = parking.x + this.PANEL_NUMBER_OFFSET.x - 3;
            parking.textNumberType.y = parking.y + this.PANEL_NUMBER_OFFSET.y - 5;
            if (parking.obj) {
                parking.obj.x = parking.x + this.CARS_OFFSET.x;
                parking.obj.y = parking.y + this.CARS_OFFSET.y
            }
        }
        this.hideArmHelp()
    }
    updatePilots() {
        var countPilots = this.LIMIT_pilots;
        var obj;
        var posX;
        var posY;
        if (MainGame.isDesktop) {
            posX = this.midX + countPilots * 15;
            posY = 48;
            for (var i = 0; i < countPilots; i++) {
                obj = this.list_iconPilots[i];
                obj.visible = true;
                obj.x = posX - 27 - i * 30;
                obj.y = posY;
                obj.angle = 90
            }
            this.updateIndcatorPilots();
            this.textPilots.x = posX + 30;
            this.textPilots.y = 50
        } else {
            posX = this.midX - 267;
            posY = 330 - countPilots * 10;
            for (var i = 0; i < countPilots; i++) {
                obj = this.list_iconPilots[i];
                obj.visible = true;
                obj.x = posX;
                obj.y = posY + 120 + i * 32;
                obj.angle = 0
            }
            this.updateIndcatorPilots();
            this.textPilots.x = posX;
            this.textPilots.y = posY + 75
        }
    }
    timeToAddFreeBox() {
        if (this.isGoTutorial)
            return;
        if (MainGame.isApiBreakTime)
            return;
        var free_park_num = this.getFreeParking();
        if (free_park_num >= 0) {
            this.addObject({
                skinBox: true
            }, true);
            this.updateBoxHave()
        }
    }
    timeToHelicopter() {
        if (this.currentLevel < 4)
            return;
        if (!this.isShowHelicopter && !this.layerBoosterWindow.visible && !this.isBoostTimer) {
            this.showHelicopter()
        }
    }
    addText(vLayer, vX, vY, vText, vSize, vIsUpperCase) {
        vX -= 1;
        vY -= 1;
        if (vIsUpperCase)
            vText = vText.toUpperCase();
        var txt = this.add.bitmapText(vX, vY, "Panton", vText);
        txt.setFontSize(vSize);
        txt.setOrigin(.5);
        if (vLayer)
            vLayer.add(txt);
        return txt
    }
    initMergeAnimation() {
        this.layerMerge = this.add.container();
        this.layerUnlocked = this.add.container();
        this.layerMerge.setDepth(this.DEPTH_layerMerge);
        this.layerUnlocked.setDepth(this.DEPTH_layerUnlock);
        this.layerUnlocked.x = this.midX;
        this.layerUnlocked.y = this.midY;
        var fon_merge = this.add.image(this.midX, this.midY, "ss_main", "bg_connect_0000");
        fon_merge.setScale(2);
        this.layerMerge.add(fon_merge);
        var fon_unlock = this.add.image(0, 0, "ss_main", "popup_unlocked_0000");
        fon_unlock.setScale(2);
        this.layerUnlocked.add(fon_unlock);
        var effect = this.add.sprite(0, 0 - 20, "ss_main");
        effect.play("magic_1");
        effect.setScale(2);
        this.layerUnlocked.add(effect);
        var unlocked_car = this.add.image(0, 0 - 20, "ss_cars", "icon_f1_b_0000");
        unlocked_car.setScale(this.getScaleCar(2, true));
        this.layerUnlocked.add(unlocked_car);
        this.unlocked_car = unlocked_car;
        var star_flash1 = this.add.image(0, 0, "ss_main", "star_flash_0000");
        this.layerUnlocked.add(star_flash1);
        this.star_flash1 = star_flash1;
        var star_flash2 = this.add.image(0, 0, "ss_main", "star_flash_0000");
        this.layerUnlocked.add(star_flash2);
        this.star_flash2 = star_flash2;
        var star_flash3 = this.add.image(0, 0, "ss_main", "star_flash_0000");
        this.layerUnlocked.add(star_flash3);
        this.star_flash3 = star_flash3;
        this.tweens.add({
            targets: star_flash1,
            scaleX: .1,
            scaleY: .1,
            ease: "Linear",
            duration: 500,
            yoyo: true,
            repeat: -1
        });
        this.tweens.add({
            targets: star_flash2,
            scaleX: .1,
            scaleY: .1,
            ease: "Linear",
            duration: 500,
            yoyo: true,
            repeat: -1
        });
        this.tweens.add({
            targets: star_flash3,
            scaleX: .1,
            scaleY: .1,
            ease: "Linear",
            duration: 500,
            yoyo: true,
            repeat: -1
        });
        var coin = this.add.image(-70, 130, "ss_main", "money_0000");
        coin.setScale(.5);
        this.layerUnlocked.add(coin);
        this.coin_merge_window = coin;
        var back_car = this.add.image(170, 50, "ss_cars", "icon_f2_0000");
        this.layerUnlocked.add(back_car);
        back_car.setScale(this.getScaleCar(1));
        back_car.setTint(0);
        this.back_car = back_car;
        var buttonContinue = new ButtonText(0,220,"ss_main","btn_buy_0000",this.clickContinueUnlocked,this,MainGame.GAME_TEXT.continue);
        buttonContinue.text.setFontSize(26);
        this.layerUnlocked.add(buttonContinue);
        MainGame.updateTextWidth(buttonContinue.text, 200);
        buttonContinue.text.y = -4;
        var text_unlocked = this.addText(this.layerUnlocked, 0, 0 - 265, MainGame.GAME_TEXT.unlocked, 34, true);
        MainGame.updateTextWidth(text_unlocked, 400);
        var text_next = this.mergeCars_textNext = this.addText(this.layerUnlocked, back_car.x, back_car.y - 50, MainGame.GAME_TEXT.next, 24, true);
        MainGame.updateTextWidth(text_next, 120);
        this.mergeCars_textQuestion = this.addText(this.layerUnlocked, back_car.x, back_car.y, "?", 32);
        var text_earning = this.addText(this.layerUnlocked, 0, 0 + 100, MainGame.GAME_TEXT.earning, 24, true);
        MainGame.updateTextWidth(text_earning, 300);
        this.textEarning = this.addText(this.layerUnlocked, 0, 0 + 130, "4/" + MainGame.GAME_TEXT.sec, 26);
        text_earning.setTint(16769280);
        this.textEarning.setTint(16769280);
        var car1_merge = this.add.image(this.midX - 160, this.midY - 40, "ss_cars", "icon_f1_0000");
        car1_merge.setScale(this.getScaleCar(1.5, true));
        this.car1_merge = car1_merge;
        var car2_merge = this.add.image(this.midX + 160, this.midY - 40, "ss_cars", "icon_f1_0000");
        car2_merge.setScale(this.getScaleCar(1.5, true));
        this.car2_merge = car2_merge;
        this.layerMerge.add(car1_merge);
        this.layerMerge.add(car2_merge);
        this.layerUnlocked.visible = false;
        this.layerMerge.visible = false
    }
    showMergeAnimation(vType) {
        this.layerMerge.visible = true;
        this.tweens.killTweensOf(this.car1_merge);
        this.tweens.killTweensOf(this.car2_merge);
        this.car1_merge.visible = true;
        this.car2_merge.visible = true;
        this.car1_merge.x = this.midX - 160;
        this.car2_merge.x = this.midX + 160;
        this.car1_merge.angle = -5;
        this.car2_merge.angle = -5;
        var prevType = vType - 1;
        var nextType = vType + 1;
        if (nextType > this.MAX_TYPES_CAR) {
            this.back_car.visible = false;
            this.mergeCars_textNext.visible = false;
            this.mergeCars_textQuestion.visible = false
        } else {
            this.back_car.setFrame("icon_f" + nextType + "_0000")
        }
        this.car1_merge.setFrame("icon_f" + prevType + "_b_0000");
        this.car2_merge.setFrame("icon_f" + prevType + "_b_0000");
        this.unlocked_car.setFrame("icon_f" + vType + "_b_0000");
        var value_speed_coins = this.getCarCoins(vType);
        var number_warm = this.convertNumberFormat(value_speed_coins);
        this.textEarning.setText(number_warm + "/" + MainGame.GAME_TEXT.sec);
        this.coin_merge_window.x = this.textEarning.x - this.textEarning.width * .5 - 15;
        this.star_flash1.x = -180 + Phaser.Math.Between(-5, 5) * 2;
        this.star_flash1.y = -190;
        this.star_flash2.x = 180 + Phaser.Math.Between(-5, 5) * 2;
        this.star_flash2.y = -190;
        this.star_flash3.x = Phaser.Math.Between(-10, 10) * 10;
        this.star_flash3.y = 165;
        this.tweens.add({
            targets: this.car1_merge,
            angle: 5,
            ease: "Linear",
            duration: 100,
            yoyo: true,
            repeat: 1
        });
        this.tweens.add({
            targets: this.car1_merge,
            x: this.midX,
            ease: Phaser.Math.Easing.Back.In,
            duration: 500,
            delay: 200
        });
        this.tweens.add({
            targets: this.car2_merge,
            angle: 5,
            ease: "Linear",
            duration: 100,
            yoyo: true,
            repeat: 1
        });
        this.tweens.add({
            targets: this.car2_merge,
            x: this.midX,
            ease: Phaser.Math.Easing.Back.In,
            duration: 500,
            delay: 200
        });
        this.time.delayedCall(700, this.addEffectMerge, [], this);
        this.time.delayedCall(1700, this.showUnlockContent, [], this);
        MainGame.Sfx.play("sound", "merge_unlocked");
        this.disableMainButtons()
    }
    addEffectMerge() {
        var effect = this.add.sprite(this.midX - 10, this.midY - 35, "ss_main");
        effect.play("effect_connect2");
        effect.setScale(2);
        this.layerMerge.add(effect);
        this.car1_merge.visible = false;
        this.car2_merge.visible = false
    }
    showUnlockContent() {
        this.layerUnlocked.visible = true;
        this.layerUnlocked.setScale(this.scaleWindow1);
        this.tweens.add({
            targets: this.layerUnlocked,
            scaleX: this.scaleWindow2,
            scaleY: this.scaleWindow2,
            ease: Phaser.Math.Easing.Back.Out,
            duration: 400
        });
        this.showBanner()
    }
    initLevelUpWindow() {
        this.layerLevelUpWindowMain = this.add.container();
        this.layerLevelUpWindow = this.add.container();
        this.layerLevelUpWindowMain.setDepth(this.DEPTH_layerMerge);
        this.layerLevelUpWindow.setDepth(this.DEPTH_layerUnlock);
        this.layerLevelUpWindow.x = this.midX;
        this.layerLevelUpWindow.y = this.midY;
        var fon_merge = this.add.image(this.midX, this.midY, "ss_main", "bg_connect_0000");
        fon_merge.setScale(2);
        this.layerLevelUpWindowMain.add(fon_merge);
        var fon_unlock = this.add.image(0, 0, "ss_main", "popup_unlocked_0000");
        fon_unlock.setScale(2);
        this.layerLevelUpWindow.add(fon_unlock);
        var posX = 0;
        var posY = -95;
        var effect = this.add.sprite(posX + 10, posY + 10, "ss_main");
        effect.play("magic_1");
        effect.setScale(2);
        this.layerLevelUpWindow.add(effect);
        var lvlup_icon = this.add.image(posX, posY, "ss_main", "lvlup_0000");
        this.layerLevelUpWindow.add(lvlup_icon);
        var icon_newparking = this.add.image(-130, 105, "ss_main", "icon_newparking_0000");
        this.layerLevelUpWindow.add(icon_newparking);
        var icon_newpilot = this.add.image(0, 105, "ss_main", "icon_newpilot_0000");
        this.layerLevelUpWindow.add(icon_newpilot);
        var icon_newmoney = this.add.image(130, 105, "ss_main", "icon_newmoney_0000");
        this.layerLevelUpWindow.add(icon_newmoney);
        var buttonContinue = new ButtonText(0,210,"ss_main","btn_buy_0000",this.closeLevelUpWindow,this,MainGame.GAME_TEXT.continue);
        buttonContinue.text.setFontSize(26);
        this.layerLevelUpWindow.add(buttonContinue);
        MainGame.updateTextWidth(buttonContinue.text, 200);
        buttonContinue.text.y = -4;
        var text_levelup = this.addText(this.layerLevelUpWindow, 0, -265, MainGame.GAME_TEXT.level_up, 34, true);
        MainGame.updateTextWidth(text_levelup, 400);
        var text_getnew = this.addText(this.layerLevelUpWindow, 0, 20, MainGame.GAME_TEXT.get_new, 32, true);
        MainGame.updateTextWidth(text_getnew, 400);
        this.levelup_text_level = this.addText(this.layerLevelUpWindow, posX - 1, posY, "", 48, true);
        var levelup_text_parking = this.addText(this.layerLevelUpWindow, icon_newparking.x, icon_newparking.y, "+1", 32, true);
        var levelup_text_pilot = this.addText(this.layerLevelUpWindow, icon_newpilot.x, icon_newpilot.y, "+1", 32, true);
        var levelup_text_money = this.addText(this.layerLevelUpWindow, icon_newmoney.x, icon_newmoney.y + 20, "", 22, true);
        this.icon_newparking = icon_newparking;
        this.icon_newpilot = icon_newpilot;
        this.icon_newmoney = icon_newmoney;
        this.levelup_text_parking = levelup_text_parking;
        this.levelup_text_pilot = levelup_text_pilot;
        this.levelup_text_money = levelup_text_money;
        this.layerLevelUpWindow.visible = false;
        this.layerLevelUpWindowMain.visible = false;
        fon_unlock.setInteractive();
        fon_merge.setInteractive();
        fon_merge.on("pointerup", this.closeLevelUpWindow, this)
    }
    enableMainButtons() {
        this.buttonEnabled = true;
        this.buttonShop.enableInput();
        this.buttonTurbo.enableInput();
        this.buttonSettings.enableInput();
        this.buttonFortuna.enableInput();
        this.buttonDailyGift.enableInput();
        this.buttonHelipad.enableInput();
        if (this.isGoTutorial && (this.tutorialStep >= 3 && this.tutorialStep <= 5))
            return;
        this.buttonAddCar.enableInput()
    }
    disableMainButtons(vSkipApiEvent) {
        this.buttonEnabled = false;
        this.buttonAddCar.disableInput();
        this.buttonTurbo.disableInput();
        this.buttonShop.disableInput();
        this.buttonSettings.disableInput();
        this.buttonFortuna.disableInput();
        this.buttonDailyGift.disableInput();
        this.buttonHelipad.disableInput();
        if (MainGame.isAPI && !vSkipApiEvent) {
            MainGame.isApiGameplayStop = true;
            MainGame.API_POKI.gameplayStop()
        }
    }
    showBanner() {
        if (MainGame.lastDataBanner == null) {
            MainGame.lastDataBanner = (new Date).getTime();
            if (MainGame.isAPI) {
                MainGame.API_POKI.displayAd()
            }
        } else {
            var currentDate = new Date;
            var dif = currentDate.getTime() - MainGame.lastDataBanner;
            var secondsFromLastCalling = Math.abs(dif / 1e3);
            if (secondsFromLastCalling > MainGame.TIME_BANNER) {
                if (MainGame.isAPI) {
                    MainGame.API_POKI.destroyAd();
                    MainGame.API_POKI.displayAd()
                }
                MainGame.lastDataBanner = (new Date).getTime()
            } else {}
        }
    }
    showLevelUpRewards1() {
        this.icon_newparking.x = -65;
        this.icon_newpilot.x = 65;
        this.levelup_text_parking.x = this.icon_newparking.x + 22;
        this.levelup_text_pilot.x = this.icon_newpilot.x + 19;
        this.icon_newparking.visible = true;
        this.icon_newpilot.visible = true;
        this.levelup_text_parking.visible = true;
        this.levelup_text_pilot.visible = true
    }
    showLevelUpRewards2() {
        this.levelup_text_money.visible = true;
        this.icon_newmoney.visible = true;
        this.icon_newmoney.x = 0;
        this.levelup_text_money.x = 0;
        var coins = this.getCoinsLevelUp(this.currentLevel);
        var text_coins_warm = this.convertNumberFormat(coins);
        this.levelup_text_money.setText(text_coins_warm);
        this.amount_coins += coins;
        text_coins_warm = this.convertNumberFormat(this.amount_coins);
        this.textCoins.setText(text_coins_warm);
        this.updateShop(text_coins_warm)
    }
    showLevelUpWindow() {
        this.updateParking();
        this.updatePilots();
        this.layerLevelUpWindow.visible = true;
        this.layerLevelUpWindowMain.visible = true;
        this.layerLevelUpWindow.setScale(this.scaleWindow1);
        this.tweens.add({
            targets: this.layerLevelUpWindow,
            scaleX: this.scaleWindow2,
            scaleY: this.scaleWindow2,
            ease: Phaser.Math.Easing.Back.Out,
            duration: 400
        });
        this.disableMainButtons();
        this.icon_newparking.visible = false;
        this.icon_newpilot.visible = false;
        this.icon_newmoney.visible = false;
        this.levelup_text_parking.visible = false;
        this.levelup_text_pilot.visible = false;
        this.levelup_text_money.visible = false;
        if (this.currentLevel < 10) {
            this.showLevelUpRewards1()
        } else {
            this.showLevelUpRewards2()
        }
        this.levelup_text_level.setText(" " + this.currentLevel + " ");
        MainGame.Sfx.play("sound", "level_up");
        this.showBanner()
    }
    closeLevelUpWindow() {
        if (MainGame.isAPI)
            MainGame.API_POKI.commercialBreak();
        this.layerLevelUpWindow.visible = false;
        this.layerLevelUpWindowMain.visible = false;
        this.enableMainButtons()
    }
    initOfflineEarningWindow() {
        this.layerOfflineEarningWindowMain = this.add.container();
        this.layerOfflineEarningWindow = this.add.container();
        this.layerOfflineEarningWindowMain.setDepth(this.DEPTH_layerMerge);
        this.layerOfflineEarningWindow.setDepth(this.DEPTH_layerUnlock);
        this.layerOfflineEarningWindow.x = this.midX;
        this.layerOfflineEarningWindow.y = this.midY;
        var fon_merge = this.add.image(this.midX, this.midY, "ss_main", "bg_connect_0000");
        fon_merge.setScale(2);
        this.layerOfflineEarningWindowMain.add(fon_merge);
        var fon_unlock = this.add.image(0, 0, "ss_main", "popup_unlocked_0000");
        fon_unlock.setScale(2);
        this.layerOfflineEarningWindow.add(fon_unlock);
        var posX = 0;
        var posY = -45;
        var effect = this.add.sprite(posX + 10, posY + 10, "ss_main");
        effect.play("magic_1");
        effect.setScale(2);
        this.layerOfflineEarningWindow.add(effect);
        var lvlup_icon = this.add.image(posX + 0, posY + 0, "ss_main", "offline_coins_0000");
        this.layerOfflineEarningWindow.add(lvlup_icon);
        var text_offline_earn = this.addText(this.layerOfflineEarningWindow, 0, -265, MainGame.GAME_TEXT.offline_earn, 34, true);
        MainGame.updateTextWidth(text_offline_earn, 400);
        var offline_earning_text = this.addText(this.layerOfflineEarningWindow, 0, 90, "", 40, true);
        this.offline_earning_text = offline_earning_text;
        var buttonClose = new ButtonText(0,240,"ss_main","btn_buy2_0000",this.closeOfflineEarningWindow,this,MainGame.GAME_TEXT.tap_continue);
        buttonClose.text.setFontSize(20);
        this.layerOfflineEarningWindow.add(buttonClose);
        MainGame.updateTextWidth(buttonClose.text, 320);
        buttonClose.text.y = -4;
        buttonClose.back.alpha = .01;
        var buttonContinue = new ButtonText(0,170,"ss_main","btn_buy2_0000",this.showAdsForCoinsX2,this,MainGame.GAME_TEXT.coins_x2);
        buttonContinue.text.setFontSize(26);
        this.layerOfflineEarningWindow.add(buttonContinue);
        MainGame.updateTextWidth(buttonContinue.text, 200);
        buttonContinue.text.x = -20;
        buttonContinue.text.y = -4;
        var icon_reward = this.add.image(80, -5, "ss_main", "icon_reward_0000");
        buttonContinue.add(icon_reward);
        this.offlineEarningBtnAds = buttonContinue;
        this.layerOfflineEarningWindowMain.visible = false;
        this.layerOfflineEarningWindow.visible = false;
        fon_unlock.setInteractive();
        fon_merge.setInteractive();
        fon_merge.on("pointerup", this.closeOfflineEarningWindowOutAir, this)
    }
    showOfflineEarningWindow(vValueCoins) {
        this.layerOfflineEarningWindow.visible = true;
        this.layerOfflineEarningWindowMain.visible = true;
        this.layerOfflineEarningWindow.setScale(this.scaleWindow1);
        this.tweens.add({
            targets: this.layerOfflineEarningWindow,
            scaleX: this.scaleWindow2,
            scaleY: this.scaleWindow2,
            ease: Phaser.Math.Easing.Back.Out,
            duration: 400
        });
        this.disableMainButtons(true);
        var coins = vValueCoins;
        var text_coins_warm = this.convertNumberFormat(coins);
        this.offline_earning_text.setText("+" + text_coins_warm);
        MainGame.Sfx.play("sound", "offline_earning");
        if (MainGame.isAPI) {
            if (MainGame.API_POKI && MainGame.API_POKI.api_isAdblock)
                this.offlineEarningBtnAds.setEnable(false)
        } else {
            if (!MainGame.isDebug)
                this.offlineEarningBtnAds.setEnable(false)
        }
    }
    initTurboWindow() {
        this.layerTurboWindow = this.add.container();
        this.layerTurboWindow.setDepth(this.DEPTH_layerUnlock);
        this.layerTurboWindow.x = this.midX;
        this.layerTurboWindow.y = this.midY;
        var fon_merge = this.add.image(0, 0, "ss_main", "bg_connect_0000");
        fon_merge.setScale(2);
        this.layerTurboWindow.add(fon_merge);
        var fon_unlock = this.add.image(0, 0, "ss_main", "popup_unlocked_0000");
        fon_unlock.setScale(2);
        this.layerTurboWindow.add(fon_unlock);
        var posX = 0;
        var posY = -75;
        var effect = this.add.sprite(posX + 10, posY + 10, "ss_main");
        effect.play("magic_1");
        effect.setScale(2);
        this.layerTurboWindow.add(effect);
        var window_icon = this.add.image(posX, posY, "ss_main", "indicator_boost_big_0000");
        this.layerTurboWindow.add(window_icon);
        this.turboBarB = this.add.image(0, 80, "ss_main", "bar_turbo1_0000");
        this.turboBarT = this.add.image(0, 80, "ss_main", "bar_turbo2_0000");
        this.turboBarT_crop = new Phaser.Geom.Rectangle(0,0,0,this.turboBarT.height);
        this.turboBarT.setCrop(this.turboBarT_crop);
        this.layerTurboWindow.add(this.turboBarB);
        this.layerTurboWindow.add(this.turboBarT);
        var buttonClose = new Button(220,-265,"ss_main","btn_close_0000",this.closeTurbo,this);
        this.layerTurboWindow.add(buttonClose);
        var buttonContinue = new ButtonText(0,200,"ss_main","btn_buy2_0000",this.showAdsForTurbo,this,MainGame.GAME_TEXT.free);
        buttonContinue.text.setFontSize(26);
        buttonContinue.text.x = -20;
        buttonContinue.text.y = -4;
        this.layerTurboWindow.add(buttonContinue);
        MainGame.updateTextWidth(buttonContinue.text, 200);
        this.buttonActivateTurbo = buttonContinue;
        var icon_reward = this.add.image(80, -5, "ss_main", "icon_reward_0000");
        buttonContinue.add(icon_reward);
        this.addText(this.layerTurboWindow, -100, 40, "X2", 30, true);
        this.addText(this.layerTurboWindow, 100, 40, "X3", 30, true);
        var text_add_turbo_seconds = this.addText(this.layerTurboWindow, 0, 140, MainGame.GAME_TEXT.add_turbo_seconds, 20, true);
        MainGame.updateTextWidth(text_add_turbo_seconds, 400);
        var text_title = this.addText(this.layerTurboWindow, 0, -265, MainGame.GAME_TEXT.turbo, 34, true);
        MainGame.updateTextWidth(text_title, 400);
        this.layerTurboWindow.visible = false;
        fon_unlock.setInteractive();
        fon_merge.setInteractive();
        fon_merge.on("pointerup", this.closeTurbo, this)
    }
    updateTurboBar(vForce) {
        var max_value = 12 * this.TIME_BOOST;
        var progress = this.countDownBonusSpeed / max_value;
        var originalWidth = this.turboBarT.width;
        var width = originalWidth * progress;
        this.tweens.killTweensOf(this.turboBarT_crop);
        if (vForce) {
            this.turboBarT_crop.width = width;
            this.turboBarT.setCrop(this.turboBarT_crop);
            return
        }
        this.tweens.add({
            targets: this.turboBarT_crop,
            width: width,
            ease: Phaser.Math.Easing.Linear,
            duration: 200,
            delay: 0,
            onUpdate: ()=>{
                this.turboBarT.setCrop(this.turboBarT_crop)
            }
        })
    }
    closeOfflineEarningWindowOutAir() {
        MainGame.isApiGameplayStop = true;
        if (MainGame.isAPI)
            MainGame.API_POKI.commercialBreak();
        this.layerOfflineEarningWindowMain.visible = false;
        this.layerOfflineEarningWindow.visible = false;
        this.enableMainButtons()
    }
    closeOfflineEarningWindow(isSkipCallAds) {
        MainGame.isApiGameplayStop = true;
        if (!isSkipCallAds && MainGame.isAPI)
            MainGame.API_POKI.commercialBreak();
        this.layerOfflineEarningWindowMain.visible = false;
        this.layerOfflineEarningWindow.visible = false;
        this.enableMainButtons()
    }
    initFortunaWheelWindow() {
        this.layerFortunaWheelWindowMain = this.add.container();
        this.layerFortunaWheelWindow = this.add.container();
        this.layerFortunaWheelWindowMain.setDepth(this.DEPTH_layerMerge);
        this.layerFortunaWheelWindow.setDepth(this.DEPTH_layerUnlock);
        this.layerFortunaWheelWindow.x = this.midX;
        this.layerFortunaWheelWindow.y = this.midY;
        var fon_merge = this.add.image(this.midX, this.midY, "ss_main", "bg_connect_0000");
        fon_merge.setScale(2);
        this.layerFortunaWheelWindowMain.add(fon_merge);
        var fon_unlock = this.add.image(0, 0, "ss_main", "popup_unlocked_0000");
        fon_unlock.setScale(2);
        this.layerFortunaWheelWindow.add(fon_unlock);
        var posX = 0;
        var posY = -25;
        var flash_fortune = this.add.image(posX, posY, "ss_main", "flash_fortune_0000");
        this.layerFortunaWheelWindow.add(flash_fortune);
        var wheel_fortune = this.add.image(posX, posY, "ss_main", "wheel_fortune_0000");
        this.layerFortunaWheelWindow.add(wheel_fortune);
        this.wheel_fortune = wheel_fortune;
        var ramka_fortune = this.add.image(posX, posY, "ss_main", "ramka_fortune_0000");
        this.layerFortunaWheelWindow.add(ramka_fortune);
        var arrow_fortune = this.add.image(posX, posY - 152, "ss_main", "arrow_fortune_0000");
        this.layerFortunaWheelWindow.add(arrow_fortune);
        this.arrow_fortune = arrow_fortune;
        var buttonClose = new Button(220,-265,"ss_main","btn_close_0000",this.closeFortunaWheelWindow,this,this);
        this.layerFortunaWheelWindow.add(buttonClose);
        this.buttonCloseFortunaWheelWindow = buttonClose;
        var buttonContinue = new ButtonText(0,200,"ss_main","btn_buy2_0000",this.showAdsForFortunaWheel,this,MainGame.GAME_TEXT.free);
        buttonContinue.text.setFontSize(26);
        buttonContinue.text.x = -20;
        buttonContinue.text.y = -4;
        this.layerFortunaWheelWindow.add(buttonContinue);
        MainGame.updateTextWidth(buttonContinue.text, 200);
        var icon_reward = this.add.image(75, -5, "ss_main", "icon_reward_0000");
        buttonContinue.add(icon_reward);
        this.buttonFortunaWheel = buttonContinue;
        var text_title = this.addText(this.layerFortunaWheelWindow, 0, -265, MainGame.GAME_TEXT.lucky_wheel, 34, true);
        MainGame.updateTextWidth(text_title, 400);
        var text_free_time = this.addText(this.layerFortunaWheelWindow, -150, 255, "", 20, true);
        MainGame.updateTextWidth(text_free_time, 300);
        var text_nextfreein = this.addText(this.layerFortunaWheelWindow, 150, 255, "", 20, true);
        MainGame.updateTextWidth(text_nextfreein, 300);
        this.text_free_time = text_free_time;
        this.text_nextfreein = text_nextfreein;
        this.layerFortunaWheelWindowMain.visible = false;
        this.layerFortunaWheelWindow.visible = false;
        this.initWheelOptions();
        fon_unlock.setInteractive();
        fon_merge.setInteractive();
        fon_merge.on("pointerup", this.closeFortunaWheelWindow, this)
    }
    checkFortunaWheelWindow() {
        if (this.freeTimeWheel > 0) {
            this.buttonFortunaWheel.setEnable(true)
        } else {
            this.buttonFortunaWheel.setEnable(false)
        }
    }
    updateFortunaWheelWindow(countDownNextFree) {
        var str1 = MainGame.GAME_TEXT.free_time + " " + this.freeTimeWheel + "/" + MainGame.maxTimeWheel;
        this.text_free_time.setText(str1.toUpperCase());
        var timeNextIn = this.secToHHMMSS(countDownNextFree);
        var str2 = MainGame.GAME_TEXT.next_free_in + " " + timeNextIn;
        this.text_nextfreein.setText(str2.toUpperCase());
        if (this.freeTimeWheel == MainGame.maxTimeWheel) {
            this.text_nextfreein.visible = false
        } else {
            this.text_nextfreein.visible = true
        }
        if (!this.isTweeningWheel)
            this.checkFortunaWheelWindow();
        if (this.freeTimeWheel > 0) {
            if (this.buttonFortuna.visible)
                this.icon_free_fortune.visible = true
        } else {
            this.icon_free_fortune.visible = false
        }
    }
    openFortunaWheelWindow() {
        this.layerFortunaWheelWindowMain.visible = true;
        this.layerFortunaWheelWindow.visible = true;
        this.layerFortunaWheelWindow.setScale(this.scaleWindow2);
        this.disableMainButtons();
        this.updateFortunaWheelWindow(this.countDownNextFree);
        this.showBanner()
    }
    closeFortunaWheelWindow() {
        if (this.isTweeningWheel)
            return;
        if (MainGame.isAPI)
            MainGame.API_POKI.commercialBreak();
        this.layerFortunaWheelWindowMain.visible = false;
        this.layerFortunaWheelWindow.visible = false;
        this.enableMainButtons()
    }
    tweenWheelFortune(rounds, degrees, backDegrees, duration1, duration2) {
        this.buttonCloseFortunaWheelWindow.setEnable(false);
        this.isTweeningWheel = true;
        this.tweens.add({
            targets: [this.wheel_fortune],
            angle: 360 * rounds + degrees,
            duration: duration1,
            ease: "Cubic.easeOut",
            callbackScope: this,
            onComplete: function(tween) {
                this.tweens.add({
                    targets: [this.wheel_fortune],
                    angle: this.wheel_fortune.angle - backDegrees,
                    duration: duration2,
                    ease: "Cubic.easeIn",
                    callbackScope: this,
                    onComplete: function(tween) {
                        this.showRewardWindow(MainGame.reward_wheel);
                        this.buttonCloseFortunaWheelWindow.setEnable(true);
                        this.checkFortunaWheelWindow();
                        this.isTweeningWheel = false
                    }
                })
            }
        })
    }
    initRewardWindow() {
        this.layerRewardWindowMain = this.add.container();
        this.layerRewardWindow = this.add.container();
        this.layerRewardWindowMain.setDepth(this.DEPTH_layerUnlock);
        this.layerRewardWindow.setDepth(this.DEPTH_layerUnlock);
        this.layerRewardWindow.x = this.midX;
        this.layerRewardWindow.y = this.midY;
        var fon_merge = this.add.image(this.midX, this.midY, "ss_main", "bg_connect_0000");
        fon_merge.setScale(2);
        this.layerRewardWindowMain.add(fon_merge);
        var popup_drop = this.add.image(0, 0, "ss_main", "popup_drop_0000");
        popup_drop.setScale(2);
        this.layerRewardWindow.add(popup_drop);
        var posX = 0;
        var posY = -5;
        var effect = this.add.sprite(posX, posY, "ss_main");
        effect.play("magic_1");
        effect.setScale(2);
        this.layerRewardWindow.add(effect);
        var iconRewardWindow = this.add.image(posX, posY, "ss_main", "reward_box8_0000");
        this.layerRewardWindow.add(iconRewardWindow);
        this.iconRewardWindow = iconRewardWindow;
        var buttonContinue = new ButtonText(0,150,"ss_main","btn_buy_0000",this.clickGetReward,this,MainGame.GAME_TEXT.get,null,this);
        buttonContinue.text.setFontSize(26);
        this.layerRewardWindow.add(buttonContinue);
        MainGame.updateTextWidth(buttonContinue.text, 200);
        buttonContinue.text.y = -4;
        var buttonClose = new Button(220,-194,"ss_main","btn_close_0000",this.closeRewardWindow,this,this);
        this.layerRewardWindow.add(buttonClose);
        var text_title = this.addText(this.layerRewardWindow, 0, -194, MainGame.GAME_TEXT.reward, 34, true);
        MainGame.updateTextWidth(text_title, 380);
        this.layerRewardWindowMain.visible = false;
        this.layerRewardWindow.visible = false;
        popup_drop.setInteractive();
        fon_merge.setInteractive();
        fon_merge.on("pointerup", this.closeRewardWindow, this)
    }
    showRewardWindow(vTypeReward) {
        this.layerRewardWindow.visible = true;
        this.layerRewardWindowMain.visible = true;
        this.layerRewardWindow.setScale(this.scaleWindow1);
        this.tweens.add({
            targets: this.layerRewardWindow,
            scaleX: this.scaleWindow2,
            scaleY: this.scaleWindow2,
            ease: Phaser.Math.Easing.Back.Out,
            duration: 400
        });
        this.iconRewardWindow.setFrame(vTypeReward + "_0000")
    }
    clickGetReward() {
        this.closeRewardWindow()
    }
    closeRewardWindow() {
        this.layerRewardWindowMain.visible = false;
        this.layerRewardWindow.visible = false;
        this.updateFortunaWheelWindow(this.countDownNextFree);
        if (MainGame.reward_wheel)
            this.getRewards(MainGame.reward_wheel);
        MainGame.reward_wheel = null
    }
    initDailyGiftWindow() {
        this.layerDailyGiftWindowMain = this.add.container();
        this.layerDailyGiftWindow = this.add.container();
        this.layerDailyGiftWindowMain.setDepth(this.DEPTH_layerMerge);
        this.layerDailyGiftWindow.setDepth(this.DEPTH_layerUnlock);
        this.layerDailyGiftWindow.x = this.midX;
        this.layerDailyGiftWindow.y = this.midY;
        var fon_merge = this.add.image(this.midX, this.midY, "ss_main", "bg_connect_0000");
        fon_merge.setScale(2);
        this.layerDailyGiftWindowMain.add(fon_merge);
        var popup_drop = this.add.image(0, 0, "ss_main", "popup_unlocked_0000");
        popup_drop.setScale(2);
        this.layerDailyGiftWindow.add(popup_drop);
        var buttonClose = new ButtonText(220,-265,"ss_main","btn_close_0000",this.closeDailyGiftWindow,this);
        this.layerDailyGiftWindow.add(buttonClose);
        this.arBtnDaily = [];
        var btnDay1 = new ButtonText(-155,-165 - 5,"ss_main","btn_day_0000",this.clickBtnDay1,this);
        this.layerDailyGiftWindow.add(btnDay1);
        var btnDay2 = new ButtonText(0,-165 - 5,"ss_main","btn_day_0000",this.clickBtnDay2,this);
        this.layerDailyGiftWindow.add(btnDay2);
        var btnDay3 = new ButtonText(155,-165 - 5,"ss_main","btn_day_0000",this.clickBtnDay3,this);
        this.layerDailyGiftWindow.add(btnDay3);
        var btnDay4 = new ButtonText(-155,-45 - 5,"ss_main","btn_day_0000",this.clickBtnDay4,this);
        this.layerDailyGiftWindow.add(btnDay4);
        var btnDay5 = new ButtonText(0,-45 - 5,"ss_main","btn_day_0000",this.clickBtnDay5,this);
        this.layerDailyGiftWindow.add(btnDay5);
        var btnDay6 = new ButtonText(155,-45 - 5,"ss_main","btn_day_0000",this.clickBtnDay6,this);
        this.layerDailyGiftWindow.add(btnDay6);
        var btnDay7 = new ButtonText(-155,75 - 5,"ss_main","btn_day_0000",this.clickBtnDay7,this);
        this.layerDailyGiftWindow.add(btnDay7);
        var btnDay8 = new ButtonText(0,75 - 5,"ss_main","btn_day_0000",this.clickBtnDay8,this);
        this.layerDailyGiftWindow.add(btnDay8);
        var btnDay9 = new ButtonText(155,75 - 5,"ss_main","btn_day_0000",this.clickBtnDay9,this);
        this.layerDailyGiftWindow.add(btnDay9);
        var btnDay10 = new ButtonText(-50,75 + 130 - 5,"ss_main","btn_day2_0000",this.clickBtnDay10,this);
        this.layerDailyGiftWindow.add(btnDay10);
        this.arBtnDaily.push(btnDay1);
        this.arBtnDaily.push(btnDay2);
        this.arBtnDaily.push(btnDay3);
        this.arBtnDaily.push(btnDay4);
        this.arBtnDaily.push(btnDay5);
        this.arBtnDaily.push(btnDay6);
        this.arBtnDaily.push(btnDay7);
        this.arBtnDaily.push(btnDay8);
        this.arBtnDaily.push(btnDay9);
        this.arBtnDaily.push(btnDay10);
        var icon_btn1 = this.add.image(0, 10, "ss_main", "reward_box2_c_0000");
        icon_btn1.setScale(.55);
        btnDay1.add(icon_btn1);
        var icon_btn2 = this.add.image(0, 10, "ss_main", "reward_coin1_c_0000");
        icon_btn2.setScale(.55);
        btnDay2.add(icon_btn2);
        var icon_btn3 = this.add.image(0, 10, "ss_main", "reward_box4_c_0000");
        icon_btn3.setScale(.55);
        btnDay3.add(icon_btn3);
        var icon_btn4 = this.add.image(0, 10, "ss_main", "reward_coin2_c_0000");
        icon_btn4.setScale(.55);
        btnDay4.add(icon_btn4);
        var icon_btn5 = this.add.image(0, 10, "ss_main", "reward_box6_c_0000");
        icon_btn5.setScale(.55);
        btnDay5.add(icon_btn5);
        var icon_btn6 = this.add.image(0, 10, "ss_main", "reward_coin3_c_0000");
        icon_btn6.setScale(.55);
        btnDay6.add(icon_btn6);
        var icon_btn7 = this.add.image(0, 10, "ss_main", "reward_box8_c_0000");
        icon_btn7.setScale(.55);
        btnDay7.add(icon_btn7);
        var icon_btn8 = this.add.image(0, 10, "ss_main", "reward_coin4_c_0000");
        icon_btn8.setScale(.55);
        btnDay8.add(icon_btn8);
        var icon_btn9 = this.add.image(0, 5, "ss_main", "reward_turbo_c_0000");
        icon_btn9.setScale(.55);
        btnDay9.add(icon_btn9);
        var icon_btn10 = this.add.image(0, 0, "ss_main", "reward_helicopter_0000");
        icon_btn10.setScale(.55);
        btnDay10.add(icon_btn10);
        for (var id in this.arBtnDaily) {
            var icon_daily_done = this.add.image(0, 0, "ss_main", "icon_daily_done_0000");
            this.layerDailyGiftWindow.add(icon_daily_done);
            this.arBtnDaily[id].icon_daily_done = icon_daily_done;
            icon_daily_done.visible = false
        }
        var select_day = this.add.image(0, 0, "ss_main", "select_day_0000");
        this.layerDailyGiftWindow.add(select_day);
        this.select_day = select_day;
        var santa_icon = this.add.image(140, 208, "ss_main", "santa_icon_0000");
        this.layerDailyGiftWindow.add(santa_icon);
        var effect = this.add.sprite(0, 0, "ss_main");
        effect.play("treasure_flash2");
        effect.visible = false;
        this.layerDailyGiftWindow.add(effect);
        this.treasure_flash = effect;
        var txt = this.add.bitmapText(0, 0, "Panton", MainGame.GAME_TEXT.claim.toUpperCase());
        txt.setTint(16776960);
        txt.setDropShadow(3, 3, 6697728, 1);
        txt.setOrigin(.5);
        txt.setFontSize(30);
        this.layerDailyGiftWindow.add(txt);
        this.text_claim = txt;
        this.addText(this.layerDailyGiftWindow, btnDay1.x - 60, btnDay1.y - 42, MainGame.GAME_TEXT.day + " " + "1", 20, true).setOrigin(0, .5);
        this.addText(this.layerDailyGiftWindow, btnDay2.x - 60, btnDay2.y - 42, MainGame.GAME_TEXT.day + " " + "2", 20, true).setOrigin(0, .5);
        this.addText(this.layerDailyGiftWindow, btnDay3.x - 60, btnDay3.y - 42, MainGame.GAME_TEXT.day + " " + "3", 20, true).setOrigin(0, .5);
        this.addText(this.layerDailyGiftWindow, btnDay4.x - 60, btnDay4.y - 42, MainGame.GAME_TEXT.day + " " + "4", 20, true).setOrigin(0, .5);
        this.addText(this.layerDailyGiftWindow, btnDay5.x - 60, btnDay5.y - 42, MainGame.GAME_TEXT.day + " " + "5", 20, true).setOrigin(0, .5);
        this.addText(this.layerDailyGiftWindow, btnDay6.x - 60, btnDay6.y - 42, MainGame.GAME_TEXT.day + " " + "6", 20, true).setOrigin(0, .5);
        this.addText(this.layerDailyGiftWindow, btnDay7.x - 60, btnDay7.y - 42, MainGame.GAME_TEXT.day + " " + "7", 20, true).setOrigin(0, .5);
        this.addText(this.layerDailyGiftWindow, btnDay8.x - 60, btnDay8.y - 42, MainGame.GAME_TEXT.day + " " + "8", 20, true).setOrigin(0, .5);
        this.addText(this.layerDailyGiftWindow, btnDay9.x - 60, btnDay9.y - 42, MainGame.GAME_TEXT.day + " " + "9", 20, true).setOrigin(0, .5);
        this.addText(this.layerDailyGiftWindow, btnDay10.x - 110, btnDay10.y - 50, MainGame.GAME_TEXT.day + " " + "10", 20, true).setOrigin(0, .5);
        var textTitle = this.addText(this.layerDailyGiftWindow, 0, -265, MainGame.GAME_TEXT.daily_rewards, 30, true);
        MainGame.updateTextWidth(textTitle, 380);
        var textClaimed1 = this.addText(this.layerDailyGiftWindow, 0, 305, MainGame.GAME_TEXT.claimed_already, 24);
        var textClaimed2 = this.addText(this.layerDailyGiftWindow, 0, textClaimed1.y + 32, MainGame.GAME_TEXT.come_back_in, 24);
        MainGame.updateTextWidth(textClaimed1, 500);
        MainGame.updateTextWidth(textClaimed2, 500);
        this.textClaimed1 = textClaimed1;
        this.textClaimed2 = textClaimed2;
        textClaimed2.setText(MainGame.GAME_TEXT.come_back_in + " " + "1H 28M");
        this.layerDailyGiftWindowMain.visible = false;
        this.layerDailyGiftWindow.visible = false;
        popup_drop.setInteractive();
        fon_merge.setInteractive();
        fon_merge.on("pointerup", this.closeDailyGiftWindow, this)
    }
    clickBtnDay1() {
        this.checkDailyGift(1)
    }
    clickBtnDay2() {
        this.checkDailyGift(2)
    }
    clickBtnDay3() {
        this.checkDailyGift(3)
    }
    clickBtnDay4() {
        this.checkDailyGift(4)
    }
    clickBtnDay5() {
        this.checkDailyGift(5)
    }
    clickBtnDay6() {
        this.checkDailyGift(6)
    }
    clickBtnDay7() {
        this.checkDailyGift(7)
    }
    clickBtnDay8() {
        this.checkDailyGift(8)
    }
    clickBtnDay9() {
        this.checkDailyGift(9)
    }
    clickBtnDay10() {
        this.checkDailyGift(10)
    }
    checkDailyGift(vNumDay) {
        var rewardsDailyGift = ["reward_box2", "reward_coin1", "reward_box4", "reward_coin2", "reward_box6", "reward_coin3", "reward_box8", "reward_coin4", "reward_turbo", "reward_helicopter"];
        MainGame.api_google("DailyGift", vNumDay);
        MainGame.reward_wheel = rewardsDailyGift[MainGame.dailyReward];
        if (MainGame.dailyReward == 9) {
            this.showRewardWindow(MainGame.reward_wheel)
        } else {
            this.showRewardWindow(MainGame.reward_wheel + "_c")
        }
        if (MainGame.reward_wheel == "reward_turbo")
            MainGame.reward_wheel = "reward_turbo2";
        MainGame.dailyReward++;
        MainGame.lastDataGift = (new Date).getTime();
        MainGame.saveSaves();
        this.updateDailyGiftWindow()
    }
    updateDailyGiftWindow() {
        if (MainGame.EVENT_NUM != 2)
            return;
        this.select_day.visible = false;
        this.text_claim.visible = false;
        this.textClaimed1.visible = false;
        this.textClaimed2.visible = false;
        this.treasure_flash.visible = false;
        var btn = null;
        for (var i = 0; i < this.arBtnDaily.length; i++) {
            btn = this.arBtnDaily[i];
            btn.disableInput();
            if (i < MainGame.dailyReward) {
                btn.icon_daily_done.visible = true;
                btn.icon_daily_done.x = btn.x;
                btn.icon_daily_done.y = btn.y;
                btn.setAlpha(.8)
            } else {
                btn.icon_daily_done.visible = false
            }
        }
        var secondsFromLastGift = 0;
        if (MainGame.lastDataGift) {
            var currentSession = new Date;
            var dif = MainGame.lastDataGift - currentSession.getTime();
            secondsFromLastGift = Math.abs(dif / 1e3)
        }
        var secondsNextGift = this.TIME_NEXT_GIFT - secondsFromLastGift;
        MainGame.dailyReward = MainGame.dailyReward || 0;
        if (MainGame.dailyReward < 10) {
            if (MainGame.dailyReward == 0 || secondsNextGift < 0) {
                btn = this.arBtnDaily[MainGame.dailyReward];
                btn.enableInput();
                this.select_day.visible = true;
                this.select_day.x = btn.x;
                this.select_day.y = btn.y;
                if (MainGame.dailyReward == 9)
                    this.select_day.setFrame("select_day2_0000");
                this.text_claim.visible = true;
                this.text_claim.x = btn.x;
                this.text_claim.y = btn.y;
                if (MainGame.EVENT_NUM == 2 && this.buttonDailyGift.visible)
                    this.icon_free_daily.visible = true;
                this.treasure_flash.x = btn.x;
                this.treasure_flash.y = btn.y;
                this.treasure_flash.visible = true
            } else {
                if (secondsNextGift > 0) {
                    this.icon_free_daily.visible = false;
                    this.textClaimed1.visible = true;
                    this.textClaimed2.visible = true;
                    this.textClaimed2.setText(MainGame.GAME_TEXT.come_back_in + " " + this.secToHHMMSS(secondsNextGift, true))
                }
            }
        } else {
            this.icon_free_daily.visible = false
        }
    }
    openDailyGiftWindow() {
        if (MainGame.EVENT_NUM != 2)
            return;
        this.updateDailyGiftWindow();
        this.layerDailyGiftWindowMain.visible = true;
        this.layerDailyGiftWindow.visible = true;
        this.layerDailyGiftWindow.setScale(this.scaleWindow2);
        this.disableMainButtons();
        this.showBanner()
    }
    closeDailyGiftWindow() {
        if (MainGame.isAPI)
            MainGame.API_POKI.commercialBreak();
        this.layerDailyGiftWindowMain.visible = false;
        this.layerDailyGiftWindow.visible = false;
        this.enableMainButtons()
    }
    initHelipadWindow() {
        this.layerHelipadWindowMain = this.add.container();
        this.layerHelipadWindow = this.add.container();
        this.layerHelipadWindowMain.setDepth(this.DEPTH_layerMerge);
        this.layerHelipadWindow.setDepth(this.DEPTH_layerUnlock);
        this.layerHelipadWindow.x = this.midX;
        this.layerHelipadWindow.y = this.midY;
        var fon_merge = this.add.image(this.midX, this.midY, "ss_main", "bg_connect_0000");
        fon_merge.setScale(2);
        this.layerHelipadWindowMain.add(fon_merge);
        var popup_drop = this.add.image(0, 0, "ss_main", "popup_unlocked_0000");
        popup_drop.setScale(2);
        this.layerHelipadWindow.add(popup_drop);
        var posY = -10;
        var helik = this.add.image(0, posY, "ss_main", "helicopter_icon_0000");
        helik.setScale(1.2);
        this.layerHelipadWindow.add(helik);
        var icon_lock = this.add.image(0, posY, "ss_main", "lock_0000");
        this.layerHelipadWindow.add(icon_lock);
        var buttonContinue = new ButtonText(0,190,"ss_main","btn_buy_0000",this.clickSelectGun,this,MainGame.GAME_TEXT.select);
        buttonContinue.text.setFontSize(26);
        this.layerHelipadWindow.add(buttonContinue);
        MainGame.updateTextWidth(buttonContinue.text, 200);
        buttonContinue.text.y = -4;
        var buttonContinueGray = new ButtonText(0,190,"ss_main","btn_buy_0000",this.clickSelectGun,this,MainGame.GAME_TEXT.select);
        buttonContinueGray.text.setFontSize(26);
        this.layerHelipadWindow.add(buttonContinueGray);
        MainGame.updateTextWidth(buttonContinueGray.text, 200);
        buttonContinueGray.text.y = -4;
        buttonContinueGray.disableInput();
        var iconDone = new Button(0,190,"ss_main","icon_done_0000",this.closeHelipadWindow,this);
        this.layerHelipadWindow.add(iconDone);
        var buttonSelectP = new Button(-200,posY,"ss_main","btn_prev_0000",this.clickSelectGunPrev,this);
        this.layerHelipadWindow.add(buttonSelectP);
        var buttonSelectN = new Button(200,posY,"ss_main","btn_next_0000",this.clickSelectGunNext,this);
        this.layerHelipadWindow.add(buttonSelectN);
        var buttonClose = new Button(220,-265,"ss_main","btn_close_0000",this.closeHelipadWindow,this);
        this.layerHelipadWindow.add(buttonClose);
        var textTitle = this.addText(this.layerHelipadWindow, 0, -265, MainGame.GAME_TEXT.select_helicopter, 30, true);
        MainGame.updateTextWidth(textTitle, 380);
        var text_complete_event = this.addText(this.layerHelipadWindow, 0, posY + 120, MainGame.GAME_TEXT.complete_event1, 22, true);
        text_complete_event.setCenterAlign();
        MainGame.updateTextWidth(text_complete_event, 400);
        this.selectedGunSprite = helik;
        this.icon_lock = icon_lock;
        this.buttonHelipadDone = iconDone;
        this.buttonHelipadContinueGray = buttonContinueGray;
        this.buttonHelipadContinue = buttonContinue;
        this.text_complete_event = text_complete_event;
        this.layerHelipadWindowMain.visible = false;
        this.layerHelipadWindow.visible = false;
        popup_drop.setInteractive();
        fon_merge.setInteractive();
        fon_merge.on("pointerup", this.closeHelipadWindow, this);
        this.updateSelectHelipad()
    }
    updateSkinHelicopter() {
        if (MainGame.typeHelicopter == 0) {
            this.helicopter_skin.setFrame("booster_0000");
            this.helicopter_skin.y = 0;
            this.helicopter_propeller1.x = -30;
            this.helicopter_propeller1.y = -29;
            this.helicopter_propeller2.x = 71;
            this.helicopter_propeller2.y = -19
        }
        if (MainGame.typeHelicopter == 1) {
            this.helicopter_skin.setFrame("booster2_0000");
            this.helicopter_skin.y = 7;
            this.helicopter_propeller1.x = -25;
            this.helicopter_propeller1.y = -29;
            this.helicopter_propeller2.x = 75;
            this.helicopter_propeller2.y = -19
        }
    }
    clickSelectGun() {
        MainGame.typeHelicopter = this.typeHelicopter;
        MainGame.saveSaves();
        this.updateSkinHelicopter();
        this.closeHelipadWindow()
    }
    clickSelectGunPrev() {
        if (this.typeHelicopter == 0) {
            this.typeHelicopter = 1
        } else {
            this.typeHelicopter = 0
        }
        this.updateSelectHelipad()
    }
    clickSelectGunNext() {
        if (this.typeHelicopter == 0) {
            this.typeHelicopter = 1
        } else {
            this.typeHelicopter = 0
        }
        this.updateSelectHelipad()
    }
    updateSelectHelipad() {
        if (this.typeHelicopter == 0) {
            this.selectedGunSprite.setFrame("helicopter_icon_0000")
        } else {
            this.selectedGunSprite.setFrame("reward_helicopter_0000")
        }
        this.icon_lock.visible = false;
        this.buttonHelipadDone.visible = false;
        this.buttonHelipadContinueGray.visible = false;
        this.buttonHelipadContinue.visible = false;
        this.text_complete_event.visible = false;
        if (this.typeHelicopter == MainGame.typeHelicopter) {
            this.buttonHelipadDone.visible = true
        } else {
            this.buttonHelipadContinue.visible = true
        }
    }
    openHelipadWindow() {
        this.typeHelicopter = MainGame.typeHelicopter;
        this.layerHelipadWindowMain.visible = true;
        this.layerHelipadWindow.visible = true;
        this.layerHelipadWindow.setScale(this.scaleWindow1);
        this.tweens.add({
            targets: this.layerHelipadWindow,
            scaleX: this.scaleWindow2,
            scaleY: this.scaleWindow2,
            ease: Phaser.Math.Easing.Back.Out,
            duration: 400
        });
        this.disableMainButtons();
        this.updateSelectHelipad();
        this.showBanner()
    }
    closeHelipadWindow() {
        if (MainGame.isAPI)
            MainGame.API_POKI.commercialBreak();
        this.layerHelipadWindowMain.visible = false;
        this.layerHelipadWindow.visible = false;
        this.enableMainButtons()
    }
    initSettingsWindow() {
        this.layerSettingsWindowMain = this.add.container();
        this.layerSettingsWindow = this.add.container();
        this.layerSettingsWindowMain.setDepth(this.DEPTH_layerMerge);
        this.layerSettingsWindow.setDepth(this.DEPTH_layerUnlock);
        this.layerSettingsWindow.x = this.midX;
        this.layerSettingsWindow.y = this.midY;
        var fon_merge = this.add.image(this.midX, this.midY, "ss_main", "bg_connect_0000");
        fon_merge.setScale(2);
        this.layerSettingsWindowMain.add(fon_merge);
        var popup_drop = this.add.image(0, 0, "ss_main", "popup_unlocked_0000");
        popup_drop.setScale(2);
        this.layerSettingsWindow.add(popup_drop);
        var logo_tbs = this.add.image(0, 135 - 70, "ss_main", "logo_tbs_0000");
        this.layerSettingsWindow.add(logo_tbs);
        var buttonMuteMusic = new ButtonText(0,-80 - 80,"ss_main","btn_option_0000",this.clickMuteMusic,this,MainGame.GAME_TEXT.music_on);
        buttonMuteMusic.text.setFontSize(24);
        buttonMuteMusic.text.x = 20;
        buttonMuteMusic.text.y = -5;
        this.layerSettingsWindow.add(buttonMuteMusic);
        MainGame.updateTextWidth(buttonMuteMusic.text, 140);
        var icon_music = this.add.image(-78, -5, "ss_main", "btn_music_0000");
        buttonMuteMusic.add(icon_music);
        this.buttonMuteMusic = buttonMuteMusic;
        this.buttonMuteMusic.icon = icon_music;
        var buttonMuteSound = new ButtonText(0,buttonMuteMusic.y + 70,"ss_main","btn_option_0000",this.clickMuteSound,this,MainGame.GAME_TEXT.sound_on);
        buttonMuteSound.text.setFontSize(24);
        buttonMuteSound.text.x = 20;
        buttonMuteSound.text.y = -5;
        this.layerSettingsWindow.add(buttonMuteSound);
        MainGame.updateTextWidth(buttonMuteSound.text, 140);
        var icon_sound = this.add.image(-78, -5, "ss_main", "btn_sound_0000");
        buttonMuteSound.add(icon_sound);
        this.buttonMuteSound = buttonMuteSound;
        this.buttonMuteSound.icon = icon_sound;
        var buttonClose = new Button(220,-265,"ss_main","btn_close_0000",this.closeSettings,this);
        this.layerSettingsWindow.add(buttonClose);
        var textTitle = this.addText(this.layerSettingsWindow, 0, -265, MainGame.GAME_TEXT.settings, 30, true);
        MainGame.updateTextWidth(textTitle, 380);
        var textDevs = this.addText(this.layerSettingsWindow, 0, logo_tbs.y - 70, MainGame.GAME_TEXT.developed_by, 24, true);
        MainGame.updateTextWidth(textDevs, 380);
        var textMusic = this.addText(this.layerSettingsWindow, 0, 170, MainGame.GAME_TEXT.music_by, 24, true);
        this.addText(this.layerSettingsWindow, 0, textMusic.y + 40, "GRIN DANILOV", 24, true);
        this.layerSettingsWindowMain.visible = false;
        this.layerSettingsWindow.visible = false;
        this.addText(this.layerSettingsWindow, 220, 255, MainGame.version, 18);
        popup_drop.setInteractive();
        fon_merge.setInteractive();
        fon_merge.on("pointerup", this.closeSettings, this)
    }
    openSettings() {
        this.layerSettingsWindowMain.visible = true;
        this.layerSettingsWindow.visible = true;
        this.layerSettingsWindow.setScale(this.scaleWindow1);
        this.tweens.add({
            targets: this.layerSettingsWindow,
            scaleX: this.scaleWindow2,
            scaleY: this.scaleWindow2,
            ease: Phaser.Math.Easing.Back.Out,
            duration: 400
        });
        this.disableMainButtons();
        MainGame.Sfx.update("music", this.buttonMuteMusic.icon, this.buttonMuteMusic.text);
        MainGame.Sfx.update("sound", this.buttonMuteSound.icon, this.buttonMuteSound.text);
        this.showBanner()
    }
    closeSettings() {
        if (MainGame.isAPI)
            MainGame.API_POKI.commercialBreak();
        this.layerSettingsWindowMain.visible = false;
        this.layerSettingsWindow.visible = false;
        this.enableMainButtons()
    }
    initBoosterWindow() {
        this.layerBoosterWindowMain = this.add.container();
        this.layerBoosterWindow = this.add.container();
        this.layerBoosterWindowMain.setDepth(this.DEPTH_layerMerge);
        this.layerBoosterWindow.setDepth(this.DEPTH_layerUnlock);
        this.layerBoosterWindow.x = this.midX;
        this.layerBoosterWindow.y = this.midY;
        var fon_merge = this.add.image(this.midX, this.midY, "ss_main", "bg_connect_0000");
        fon_merge.setScale(2);
        this.layerBoosterWindowMain.add(fon_merge);
        var popup_drop = this.add.sprite(0, 0, "ss_main", "popup_drop_0000");
        popup_drop.setScale(2);
        this.layerBoosterWindow.add(popup_drop);
        var effect = this.add.sprite(0, -20, "ss_main");
        effect.play("magic_1");
        effect.setScale(2);
        this.layerBoosterWindow.add(effect);
        var helicopter_icon = this.add.image(-23, -55, "ss_main", "helicopter_icon_0000");
        this.layerBoosterWindow.add(helicopter_icon);
        var few_coins = this.add.image(80, -5, "ss_main", "few_coins_0000");
        this.layerBoosterWindow.add(few_coins);
        var buttonClose = new Button(215,-194,"ss_main","btn_close_0000",this.closeBoost,this);
        this.layerBoosterWindow.add(buttonClose);
        var buttonContinue = new ButtonText(0,145,"ss_main","btn_buy2_0000",this.clickBoost,this,MainGame.GAME_TEXT.activate);
        buttonContinue.text.setFontSize(26);
        buttonContinue.text.x = -20;
        buttonContinue.text.y = -4;
        this.layerBoosterWindow.add(buttonContinue);
        MainGame.updateTextWidth(buttonContinue.text, 200);
        var icon_reward = this.add.image(80, -5, "ss_main", "icon_reward_0000");
        buttonContinue.add(icon_reward);
        this.boostBtnAds = buttonContinue;
        var text1 = this.addText(this.layerBoosterWindow, 0, -194, MainGame.GAME_TEXT.boost_message, 30, true);
        MainGame.updateTextWidth(text1, 380);
        var text2 = this.addText(this.layerBoosterWindow, 0, 75, MainGame.GAME_TEXT.better_drop, 24, true);
        MainGame.updateTextWidth(text2, 480);
        var text3 = this.addText(this.layerBoosterWindow, 132, -30, "X" + this.value_boost, 34);
        text3.setTint(0);
        this.layerBoosterWindowMain.visible = false;
        this.layerBoosterWindow.visible = false;
        popup_drop.setInteractive();
        fon_merge.setInteractive();
        fon_merge.on("pointerup", this.closeBoost, this)
    }
    activateBoost(vTime) {
        if (this.isBoostTimer)
            return;
        vTime = vTime || this.TIME_COINS;
        this.isBoostTimer = true;
        this.updateSpeed();
        this.layerIndicatorCoins.visible = true;
        this.countDownBonusCoins = vTime;
        this.textFieldIndicatorCoins.setText(this.secToHHMMSS(this.countDownBonusCoins));
        this.updateIndicatorsBonus("coins_x5", true);
        this.timerBonusCoins = this.time.addEvent({
            delay: 1e3,
            callback: this.updateTimerBonusCoins,
            callbackScope: this,
            loop: true
        });
        MainGame.Sfx.play("sound", "boost_activate")
    }
    updateTimerBonusCoins() {
        this.countDownBonusCoins--;
        this.textFieldIndicatorCoins.setText(this.secToHHMMSS(this.countDownBonusCoins));
        if (this.countDownBonusCoins == 0) {
            this.deactivateBoost();
            this.timerBonusCoins.remove();
            this.layerIndicatorCoins.visible = false;
            this.updateIndicatorsBonus("coins_x5", false)
        }
        MainGame.cdBonusCoins = this.countDownBonusCoins;
        MainGame.saveSaves()
    }
    deactivateBoost() {
        this.isBoostTimer = false;
        this.updateSpeed()
    }
    clickBoost() {
        this.layerBoosterWindow.visible = false;
        this.layerBoosterWindowMain.visible = false;
        this.showAdsForHelicopter();
        this.enableMainButtons()
    }
    closeBoost() {
        if (MainGame.isAPI && MainGame.isApiGameplayStop) {
            MainGame.API_POKI.gameplayStart();
            MainGame.isApiGameplayStop = false
        }
        this.layerBoosterWindow.visible = false;
        this.layerBoosterWindowMain.visible = false;
        this.enableMainButtons()
    }
    showBoosterWindow() {
        this.isShowHelicopter = false;
        this.helicopter.visible = false;
        this.layerBoosterWindow.visible = true;
        this.layerBoosterWindowMain.visible = true;
        this.layerBoosterWindow.setScale(this.scaleWindow1);
        this.tweens.add({
            targets: this.layerBoosterWindow,
            scaleX: this.scaleWindow2,
            scaleY: this.scaleWindow2,
            ease: Phaser.Math.Easing.Back.Out,
            duration: 400
        });
        this.disableMainButtons();
        this.boostBtnAds.setEnable(true);
        if (MainGame.isAPI) {
            if (MainGame.API_POKI && MainGame.API_POKI.api_isAdblock)
                this.boostBtnAds.setEnable(false)
        } else {
            if (!MainGame.isDebug)
                this.boostBtnAds.setEnable(false)
        }
        this.showBanner()
    }
    initSantaBag() {
        this.santa_bag = this.add.container();
        var bag = this.add.image(0, 0, "ss_main", "bag_0000");
        this.santa_bag.add(bag);
        this.santa_bag.setDepth(this.DEPTH_helicopter);
        this.santa_bag.setInteractive(new Phaser.Geom.Circle(0,0,60), Phaser.Geom.Circle.Contains);
        this.santa_bag.on("pointerup", this.onClickSantaBag, this);
        this.tweens.add({
            targets: this.santa_bag,
            angle: -10,
            ease: Phaser.Math.Easing.Sine.InOut,
            duration: 300,
            repeat: -1,
            yoyo: true
        });
        this.santa_bag.visible = false
    }
    showSantaBag() {
        if (this.isGoTutorial || this.santa_bag.visible)
            return;
        this.santa_bag.visible = true;
        var pos = this.path.getPoint(Math.random());
        this.santa_bag.x = pos.x;
        this.santa_bag.y = pos.y;
        this.updateDailyGiftWindow()
    }
    onClickSantaBag() {
        this.addCoins(100, 100);
        this.santa_bag.visible = false
    }
    initHelicopter() {
        this.helicopter = this.add.container();
        this.heli_shadow = this.add.container();
        this.heli_body = this.add.container();
        this.helicopter.add(this.heli_shadow);
        this.helicopter.add(this.heli_body);
        this.heli_body.setInteractive(new Phaser.Geom.Circle(0,0,50), Phaser.Geom.Circle.Contains);
        this.heli_body.on("pointerup", this.onClickBooster, this);
        this.helicopter.setDepth(this.DEPTH_helicopter);
        this.helicopter.x = this.midX + 280;
        this.helicopter.y = 300;
        var shadow = this.add.image(-15, 100, "ss_main", "booster_shadow_0000");
        var propeller1 = this.add.sprite(-30, -29, "ss_main");
        propeller1.play("propeller1");
        var body = this.add.image(0, 0, "ss_main", "booster_0000");
        var propeller2 = this.add.sprite(71, -19, "ss_main");
        propeller2.play("propeller2");
        if (MainGame.EVENT_NUM == 2) {
            var santa_arm = this.add.image(-15, 50, "ss_main", "santa_arm_0000");
            var santa = this.add.image(-11, 55, "ss_main", "santa_0000");
            santa.setOrigin(.3, .2);
            this.santa = santa
        }
        this.heli_shadow.add(shadow);
        this.heli_body.add(body);
        this.heli_body.add(propeller1);
        this.heli_body.add(propeller2);
        if (MainGame.EVENT_NUM == 2) {
            this.heli_body.add(santa_arm);
            this.heli_body.add(santa)
        }
        this.helicopter.visible = false;
        this.helicopter_skin = body;
        this.helicopter_propeller1 = propeller1;
        this.helicopter_propeller2 = propeller2
    }
    showHelicopter() {
        this.isShowHelicopter = true;
        this.helicopter.visible = true;
        this.countHelicopterFly = 3;
        this.flagHelicopter = Math.random() >= .5;
        if (this.flagHelicopter) {
            this.helicopter.x = this.midX + 400;
            this.helicopter.scaleX = 1
        } else {
            this.helicopter.x = this.midX - 400;
            this.helicopter.scaleX = -1
        }
        this.waveCount = 0;
        this.waveStart = 2 * Math.random();
        this.POS_HELICOPTER_Y = 150;
        this.HELIC_DIST_X = 400;
        if (MainGame.isDesktop) {
            this.POS_HELICOPTER_Y = 70;
            this.HELIC_DIST_X = 520
        }
    }
    updateHelicopter() {
        this.waveCount += .02;
        this.helicopter.y = this.POS_HELICOPTER_Y + Math.sin(this.waveStart + this.waveCount) * 30;
        if (this.flagHelicopter) {
            this.heli_body.angle = Phaser.Math.RadToDeg(Math.sin(this.waveCount) * .15);
            if (MainGame.EVENT_NUM == 2) {
                this.santa.angle = Phaser.Math.RadToDeg(Math.sin(this.waveCount) * .3) - 10
            }
        } else {
            this.heli_body.angle = Phaser.Math.RadToDeg(Math.sin(this.waveCount) * .15);
            if (MainGame.EVENT_NUM == 2) {
                this.santa.angle = Phaser.Math.RadToDeg(Math.sin(this.waveCount) * .3) + 10
            }
        }
        if (this.flagHelicopter) {
            this.helicopter.x -= 1;
            if (this.helicopter.x < this.midX - this.HELIC_DIST_X) {
                this.flagHelicopter = false;
                this.helicopter.scaleX = -1;
                this.countHelicopterFly--;
                if (this.countHelicopterFly == 0) {
                    this.isShowHelicopter = false;
                    this.helicopter.visible = false
                }
            }
        } else {
            this.helicopter.x += 1;
            if (this.helicopter.x > this.midX + this.HELIC_DIST_X) {
                this.flagHelicopter = true;
                this.helicopter.scaleX = 1;
                this.countHelicopterFly--;
                if (this.countHelicopterFly == 0) {
                    this.isShowHelicopter = false;
                    this.helicopter.visible = false
                }
            }
        }
    }
    onClickBooster() {
        if (!this.buttonEnabled)
            return;
        this.showBoosterWindow()
    }
    initSystemMessage() {
        this.textSystemContainer = this.add.container();
        this.textSystemContainer.x = this.midX;
        this.textSystemContainer.y = MainGame.world.centerY - 100;
        var txt = this.add.bitmapText(0, 0, "Panton", "");
        txt.setDropShadow(3, 3, 0, 1);
        txt.setOrigin(.5);
        txt.setMaxWidth(550);
        txt.setCenterAlign();
        txt.setFontSize(34);
        this.textSystemContainer.add(txt);
        this.textSystemContainer.setDepth(this.DEPTH_systemtext);
        this.textSystemContainer.visible = false;
        this.textSystem = txt
    }
    addTextCoin(vX, vY) {
        var txt = this.add.bitmapText(vX, vY, "Panton", "");
        txt.setFontSize(26);
        txt.setOrigin(.5, 1);
        txt.setDepth(this.DEPTH_text_coins);
        txt.visible = false;
        return txt
    }
    initLevelBar() {
        this.layerPanelLevel = this.add.container();
        var posX = this.midX + 20;
        var posY = 45;
        var frame_sf = "";
        var offsetX = 0;
        if (MainGame.isDesktop) {
            posX = 205;
            posY = 120;
            frame_sf = "_d";
            offsetX = -80
        }
        this.levelBarB = this.add.image(posX + offsetX, posY, "ss_main", "exp1" + frame_sf + "_0000");
        this.levelBarT = this.add.image(posX + offsetX, posY, "ss_main", "exp2" + frame_sf + "_0000");
        this.iconCircleLevel = this.add.image(posX - 160, posY, "ss_main", "lvl_icon_0000");
        this.levelBarT_crop = new Phaser.Geom.Rectangle(0,0,0,this.levelBarT.height);
        this.levelBarT.setCrop(this.levelBarT_crop);
        this.textLevel = this.add.bitmapText(this.iconCircleLevel.x - 1, this.iconCircleLevel.y - 1, "Panton", this.currentLevel, 26);
        this.textLevel.setOrigin(.5, .5);
        this.layerPanelLevel.add(this.levelBarB);
        this.layerPanelLevel.add(this.levelBarT);
        this.layerPanelLevel.add(this.iconCircleLevel);
        this.layerPanelLevel.add(this.textLevel);
        this.layerPanelLevel.setDepth(this.DEPTH_layerLevelBar)
    }
    increaseLevel(vValue, vShowLater) {
        this.exp += vValue;
        var delta = this.exp_max - this.exp;
        if (this.exp >= this.exp_max) {
            this.exp = -delta;
            this.currentLevel++;
            this.exp_max = this.getExpMax(this.currentLevel);
            this.textLevel.setText(this.currentLevel);
            this.updateLevel(1);
            this.updateLevel(this.exp / this.exp_max, 250);
            if (vShowLater) {
                this.showAfterMerge = true
            } else {
                this.time.delayedCall(500, this.showLevelUpWindow, [], this)
            }
            if (this.LIMIT_parking < 12)
                this.LIMIT_parking++;
            if (this.LIMIT_pilots < 10)
                this.LIMIT_pilots++;
            if (this.currentLevel >= 5) {
                this.icon_free_fortune.visible = true;
                if (MainGame.EVENT_NUM == 2)
                    this.icon_free_daily.visible = true;
                this.buttonFortuna.visible = true;
                if (MainGame.EVENT_NUM == 2) {
                    this.buttonDailyGift.visible = true
                }
            }
        } else {
            this.updateLevel(this.exp / this.exp_max)
        }
    }
    updateLevel(progress, delay) {
        var originalWidth = this.levelBarT.width;
        var width = originalWidth * progress;
        delay = delay || 0;
        this.tweens.killTweensOf(this.levelBarT_crop);
        this.tweens.add({
            targets: this.levelBarT_crop,
            width: width,
            ease: Phaser.Math.Easing.Linear,
            duration: 200,
            delay: delay,
            onUpdate: ()=>{
                this.levelBarT.setCrop(this.levelBarT_crop)
            }
        })
    }
    initProgressBar() {
        var midX = this.midX;
        var offsetX = -25;
        var posY = 255;
        this.layerProgressCar = this.add.container();
        this.nextcarBarB = this.add.image(midX + offsetX, posY, "ss_main", "nextcar1_0000");
        this.nextcarBarT = this.add.image(midX + offsetX, posY, "ss_main", "nextcar2_0000");
        this.iconCircleNextCar = this.add.image(midX + offsetX + 115, posY - 3, "ss_main", "icon_nextcar_0000");
        this.nextcarBarT_crop = new Phaser.Geom.Rectangle(0,0,0,this.nextcarBarT.height);
        this.nextcarBarT.setCrop(this.nextcarBarT_crop);
        this.textProgressNextCar = this.add.bitmapText(midX - 10, posY - 1, "Panton", "0%", 12);
        this.textProgressNextCar.setOrigin(.5, .5);
        this.textProgressNextCar.setTint(0);
        this.textLevelNextCar = this.add.bitmapText(this.iconCircleNextCar.x + 19, this.iconCircleNextCar.y - 18, "Panton", this.nextCarLevel, 16);
        this.textLevelNextCar.setOrigin(.5, .5);
        this.textLevelNextCar.setTint(0);
        this.layerProgressCar.add(this.nextcarBarB);
        this.layerProgressCar.add(this.nextcarBarT);
        this.layerProgressCar.add(this.iconCircleNextCar);
        this.layerProgressCar.add(this.textProgressNextCar);
        this.layerProgressCar.add(this.textLevelNextCar);
        this.layerProgressCar.setDepth(this.DEPTH_text_field);
        if (MainGame.isDesktop) {
            this.layerProgressCar.y = -158
        }
    }
    checkNextCar() {
        var countParking = this.LIMIT_parking;
        var parking;
        var progress = 0;
        var type = 0;
        var cost_current = 0;
        var cost_need = Math.pow(2, this.nextCarLevel - 1);
        for (var i = 0; i < countParking; i++) {
            parking = this.arParking[i];
            type = parking.type;
            if (type > 0) {
                cost_current += Math.pow(2, type - 1)
            }
        }
        progress = cost_current / cost_need;
        if (progress > 1) {
            progress = 1
        }
        this.updateNextCar(progress)
    }
    updateNextCar(progress) {
        var originalWidth = this.nextcarBarT.width;
        var width = originalWidth * progress;
        this.nextcarBarT_crop.width = width;
        this.nextcarBarT.setCrop(this.nextcarBarT_crop);
        this.textProgressNextCar.setText(Math.floor(progress * 100) + "%")
    }
    initIndcatorPilots() {
        this.textPilots = this.add.bitmapText(this.midX - 265, 375, "Panton", "", 32);
        this.textPilots.setOrigin(.5, .5);
        this.textPilots.setDepth(this.DEPTH_text_pilots);
        this.list_iconPilots = [];
        const midX = this.midX;
        for (var i = 0; i < this.MAX_PILOTS; i++) {
            var obj = this.add.image(midX - 267, 420 + i * 32, "ss_cars", "icon_pilot2_0000");
            obj.setDepth(this.DEPTH_icon_pilots);
            obj.visible = false;
            this.list_iconPilots.push(obj)
        }
    }
    secToHHMMSS(vSec, vIsHoursAlso) {
        var seconds = parseInt(vSec, 10);
        var hours = Math.floor(seconds / 3600);
        var minutes = Math.floor((seconds - hours * 3600) / 60);
        var seconds = seconds - hours * 3600 - minutes * 60;
        if (vIsHoursAlso) {
            if (hours == 0) {
                return minutes + "m" + " " + seconds + "s"
            } else {
                return hours + "h" + " " + minutes + "m"
            }
        }
        if (hours < 10)
            hours = "0" + hours;
        if (minutes < 10)
            minutes = "0" + minutes;
        if (seconds < 10)
            seconds = "0" + seconds;
        var time = minutes + ":" + seconds;
        return time
    }
    initIndcatorCoins() {
        this.layerIndicatorCoins = this.add.container();
        this.layerIndicatorCoins.setDepth(this.DEPTH_text_field);
        this.layerIndicatorCoins.x = 50;
        this.layerIndicatorCoins.y = this.POS_IND_Y;
        var icon = this.add.image(0, 0, "ss_main", "indicator_money_0000");
        var star_bonus = this.add.image(27, 19, "ss_main", "star_bonus_0000");
        this.layerIndicatorCoins.add(icon);
        this.layerIndicatorCoins.add(star_bonus);
        var txt_x = this.addText(this.layerIndicatorCoins, star_bonus.x - 2, star_bonus.y - 5, "X5", 17);
        txt_x.setTint(0);
        var txt = this.addText(this.layerIndicatorCoins, 0, 44, "", 18);
        txt.setText(this.secToHHMMSS(105));
        this.layerIndicatorCoins.visible = false;
        this.textFieldIndicatorCoins = txt
    }
    initIndcatorBoost() {
        this.layerIndicatorBoost = this.add.container();
        this.layerIndicatorBoost.setDepth(this.DEPTH_text_field);
        this.layerIndicatorBoost.x = 50;
        this.layerIndicatorBoost.y = this.POS_IND_Y + 100;
        var icon = this.add.image(0, 0, "ss_main", "indicator_boost_0000");
        var star_bonus = this.add.image(27, 19, "ss_main", "star_bonus_0000");
        this.layerIndicatorBoost.add(icon);
        this.layerIndicatorBoost.add(star_bonus);
        var txt_x = this.addText(this.layerIndicatorBoost, star_bonus.x - 2, star_bonus.y - 5, "X2", 17);
        txt_x.setTint(0);
        this.textTurboFactor = txt_x;
        var txt = this.addText(this.layerIndicatorBoost, 0, 44, "", 18);
        txt.setText(this.secToHHMMSS(59));
        this.layerIndicatorBoost.visible = false;
        this.textFieldIndicatorBoost = txt
    }
    updateIndicatorsBonus(type, bool) {
        if (type == "speed_x2") {
            if (bool) {
                if (this.countDownBonusCoins == 0) {
                    this.layerIndicatorBoost.y = this.POS_IND_Y
                } else {
                    this.layerIndicatorBoost.y = this.POS_IND_Y + 100
                }
            } else {
                if (this.countDownBonusSpeed == 0) {
                    this.layerIndicatorCoins.y = this.POS_IND_Y
                }
            }
        } else if (type == "coins_x5") {
            if (bool) {
                if (this.countDownBonusSpeed == 0) {
                    this.layerIndicatorCoins.y = this.POS_IND_Y
                } else {
                    this.layerIndicatorCoins.y = this.POS_IND_Y + 100
                }
            } else {
                if (this.countDownBonusCoins == 0) {
                    this.layerIndicatorBoost.y = this.POS_IND_Y
                }
            }
        }
    }
    initCoinsText() {
        this.list_textCoins = [];
        for (var i = 0; i < this.MAX_PARKING; i++) {
            var obj = this.addTextCoin(0, 0);
            this.list_textCoins.push(obj)
        }
        this.santa_bag_textCoins = this.addTextCoin(0, 0)
    }
    showCoinText(vNum, vValue) {
        var rightPoint = {
            x: this.midX + 270,
            y: 480
        };
        var obj = null;
        if (vNum == 100) {
            rightPoint.x = this.santa_bag.x;
            rightPoint.y = this.santa_bag.y;
            obj = this.santa_bag_textCoins
        } else {
            obj = this.list_textCoins[vNum]
        }
        if (MainGame.isDesktop) {
            rightPoint.x = this.finishPoint.x;
            rightPoint.y = this.finishPoint.y + 25
        }
        obj.x = rightPoint.x;
        obj.y = rightPoint.y;
        var text_coins_warm = this.convertNumberFormat(vValue);
        obj.setText("+" + text_coins_warm);
        obj.visible = true;
        obj.setAlpha(.2);
        obj.setScale(.8);
        this.tweens.killTweensOf(obj);
        this.tweens.add({
            targets: obj,
            alpha: 1,
            ease: "Linear",
            duration: 150
        });
        this.tweens.add({
            targets: obj,
            scaleX: 1,
            scaleY: 1,
            ease: "Linear",
            duration: 150
        });
        this.tweens.add({
            targets: obj,
            alpha: 0,
            ease: "Linear",
            delay: 300,
            duration: 300,
            onComplete: function() {
                obj.visible = false
            }
        });
        this.tweens.add({
            targets: obj,
            y: obj.y - 40,
            ease: "Linear",
            duration: 600
        })
    }
    initCoinsPanel() {
        var posX = this.midX;
        var posY = 190;
        if (MainGame.isDesktop) {
            posX = 140;
            posY = 50
        }
        var coin = this.add.sprite(posX - 90, posY, "ss_main");
        coin.play("money_animation");
        this.icons_coin = coin;
        this.textCoins = this.add.bitmapText(posX + 30, posY - 10, "Panton", 0, 42);
        this.textCoins.setOrigin(.5, .5);
        this.textCoins.setTint(16777215);
        this.textSpeed = this.add.bitmapText(posX + 25, posY + 27, "Panton", "", 24);
        this.textSpeed.setOrigin(.5, .5);
        this.textSpeed.setTint(16439050);
        this.icons_coin.setDepth(this.DEPTH_GUI);
        this.textCoins.setDepth(this.DEPTH_text_field);
        this.textSpeed.setDepth(this.DEPTH_text_field)
    }
    getRacingCars() {
        var countRacers = 0;
        var countParking = this.LIMIT_parking;
        for (var i = 0; i < countParking; i++) {
            var parking = this.arParking[i];
            if (parking.racing) {
                countRacers++
            }
        }
        return countRacers
    }
    updateIndcatorPilots() {
        var countRacers = this.getRacingCars();
        for (var i = 0; i < this.LIMIT_pilots; i++) {
            var icon_pilot = this.list_iconPilots[i];
            if (i < countRacers) {
                icon_pilot.setFrame("icon_pilot1_0000")
            } else {
                icon_pilot.setFrame("icon_pilot2_0000")
            }
        }
        var text = countRacers + "/" + this.LIMIT_pilots;
        this.textPilots.setText(text);
        this.updateSpeed()
    }
    showSystemMessage(vText) {
        this.textSystemContainer.visible = true;
        this.textSystem.setText(vText);
        this.textSystemContainer.alpha = .2;
        this.textSystemContainer.y = this.midY - 100;
        this.textSystemContainer.setScale(.8);
        this.tweens.killTweensOf(this.textSystemContainer);
        this.tweens.add({
            targets: this.textSystemContainer,
            alpha: 1,
            ease: "Linear",
            duration: 150
        });
        this.tweens.add({
            targets: this.textSystemContainer,
            scaleX: 1,
            scaleY: 1,
            ease: "Linear",
            duration: 150
        });
        this.tweens.add({
            targets: this.textSystemContainer,
            alpha: 0,
            ease: "Linear",
            delay: 1500,
            duration: 200,
            onComplete: this.finishSystemTextTween
        });
        this.tweens.add({
            targets: this.textSystemContainer,
            y: this.midY - 120,
            ease: "Linear",
            delay: 150,
            duration: 1200
        })
    }
    finishSystemTextTween() {
        MainGame.state.textSystemContainer.visible = false
    }
    initParticleCoins() {
        var particles = this.add.particles("ss_main");
        var cherries = particles.createEmitter({
            frame: "money_0000",
            speed: {
                min: 100,
                max: 150
            },
            quantity: 15,
            lifespan: 500,
            alpha: {
                start: 1,
                end: .15
            },
            scale: {
                start: .1,
                end: .4
            },
            rotate: {
                min: -50,
                max: 50
            },
            on: false
        });
        this.particlesCoins = particles
    }
    emitParticeCoins(vX, vY) {
        this.particlesCoins.emitParticleAt(vX, vY)
    }
    addCoins(vType, vNumCar) {
        var coins = 0;
        var rightPoint = {
            x: this.midX + 270,
            y: 480
        };
        if (vType == 100) {
            coins = this.getCoinsTime(.01);
            rightPoint.x = this.santa_bag.x;
            rightPoint.y = this.santa_bag.y
        } else {
            coins = this.getCarInfo(vType).coins;
            if (this.isBoostTimer)
                coins *= this.value_boost
        }
        this.amount_coins += coins;
        var text_coins_warm = this.convertNumberFormat(this.amount_coins);
        this.textCoins.setText(text_coins_warm);
        this.updateShop(text_coins_warm);
        var effect = this.add.sprite(this.icons_coin.x - 6, this.icons_coin.y - 1, "ss_main");
        effect.play("money_collect");
        effect.setDepth(this.DEPTH_effect_unboxing);
        var posX = this.finishPoint.x;
        var posY = this.finishPoint.y;
        if (MainGame.isDesktop) {
            posX += 15
        } else {
            posY -= 5
        }
        var effect = this.add.sprite(posX, posY, "ss_main");
        effect.play("effect_finishcoin");
        effect.setDepth(this.DEPTH_effect_unboxing);
        effect.angle = MyMath.getRandomInt(-20, 20);
        this.showCoinText(vNumCar, coins);
        this.saveGameValues();
        MainGame.Sfx.play("sound", "coin_finish")
    }
    updateSpeed(isForRewardCoins) {
        var total_speed = 0;
        var countParking = this.LIMIT_parking;
        var speed = 0;
        var coins = 0;
        var carInfo = null;
        for (var i = 0; i < countParking; i++) {
            var parking = this.arParking[i];
            if (parking.racing) {
                carInfo = this.getCarInfo(parking.type);
                speed = carInfo.speed;
                coins = carInfo.coins;
                var timeLoop = 1 / (60 * speed);
                total_speed += Math.round(coins / timeLoop)
            }
        }
        if (isForRewardCoins)
            return total_speed;
        this.total_speed = total_speed;
        if (this.isBoostTimer)
            total_speed *= this.value_boost;
        if (this.isDoubleSpeed)
            total_speed *= 2;
        var converted_value = this.convertNumberFormat(total_speed);
        this.textSpeed.setText(converted_value + "/" + MainGame.GAME_TEXT.sec);
        return total_speed
    }
    getTime() {
        let d = new Date;
        return d.getTime()
    }
    midPoint(p1, p2) {
        var pointX = (p1.x + p2.x) * .5;
        var pointY = (p1.y + p2.y) * .5;
        return {
            x: pointX,
            y: pointY
        }
    }
    initTrackPath() {
        var centerX = this.midX;
        var centerY = 275;
        var leftPoint = {
            x: centerX - 378,
            y: centerY
        };
        var rightPoint = {
            x: centerX + 378,
            y: centerY
        };
        var upPoint = {
            x: centerX,
            y: centerY - 226
        };
        var downPoint = {
            x: centerX,
            y: centerY + 226
        };
        var offset = {
            x: 160,
            y: 160
        };
        var delta = 2;
        if (!MainGame.isDesktop) {
            centerX = this.midX;
            centerY = MainGame.world.centerY;
            leftPoint = {
                x: centerX - 265,
                y: 480
            };
            rightPoint = {
                x: centerX + 265,
                y: 480
            };
            upPoint = {
                x: centerX,
                y: 100 + 5
            };
            downPoint = {
                x: centerX,
                y: 860 - 5
            };
            offset = {
                x: 145,
                y: 145
            };
            delta = 3
        }
        var pointA = {
            x: leftPoint.x,
            y: upPoint.y
        };
        var pointB = {
            x: rightPoint.x,
            y: upPoint.y
        };
        var pointC = {
            x: rightPoint.x,
            y: downPoint.y
        };
        var pointD = {
            x: leftPoint.x,
            y: downPoint.y
        };
        var pointAb = {
            x: pointA.x + offset.x,
            y: pointA.y
        };
        var pointAd = {
            x: pointA.x,
            y: pointA.y + offset.y
        };
        var pointBa = {
            x: pointB.x - offset.x,
            y: pointB.y
        };
        var pointBc = {
            x: pointB.x,
            y: pointB.y + offset.y
        };
        var pointCb = {
            x: pointC.x,
            y: pointC.y - offset.y
        };
        var pointCd = {
            x: pointC.x - offset.x,
            y: pointC.y
        };
        var pointDc = {
            x: pointD.x + offset.x,
            y: pointD.y
        };
        var pointDa = {
            x: pointD.x,
            y: pointD.y - offset.y
        };
        var pointAmb = this.midPoint(pointA, pointAb);
        var pointAmd = this.midPoint(pointA, pointAd);
        var pointBma = this.midPoint(pointB, pointBa);
        var pointBmc = this.midPoint(pointB, pointBc);
        var pointCmb = this.midPoint(pointC, pointCb);
        var pointCmd = this.midPoint(pointC, pointCd);
        var pointDmc = this.midPoint(pointD, pointDc);
        var pointDma = this.midPoint(pointD, pointDa);
        var path;
        if (MainGame.isDesktop) {
            path = new Phaser.Curves.Path(upPoint.x,upPoint.y);
            path.lineTo(pointBa.x, pointBa.y);
            path.cubicBezierTo(pointBc.x, pointBc.y, pointBma.x, pointBma.y + delta, pointBmc.x - delta, pointBmc.y);
            path.lineTo(pointCb.x, pointCb.y);
            path.cubicBezierTo(pointCd.x, pointCd.y, pointCmb.x - delta, pointCmb.y, pointCmd.x, pointCmd.y - delta);
            path.lineTo(pointDc.x, pointDc.y);
            path.cubicBezierTo(pointDa.x, pointDa.y, pointDmc.x, pointDmc.y - delta, pointDma.x + delta, pointDma.y);
            path.lineTo(pointAd.x, pointAd.y);
            path.cubicBezierTo(pointAb.x, pointAb.y, pointAmd.x + delta, pointAmd.y, pointAmb.x, pointAmb.y + delta);
            path.lineTo(upPoint.x, upPoint.y);
            this.startPoint = upPoint;
            this.finishPoint = downPoint
        } else {
            path = new Phaser.Curves.Path(leftPoint.x,leftPoint.y);
            path.lineTo(pointAd.x, pointAd.y);
            path.cubicBezierTo(pointAb.x, pointAb.y, pointAmd.x + delta, pointAmd.y, pointAmb.x, pointAmb.y + delta);
            path.lineTo(pointBa.x, pointBa.y);
            path.cubicBezierTo(pointBc.x, pointBc.y, pointBma.x, pointBma.y + delta, pointBmc.x - delta, pointBmc.y);
            path.lineTo(pointCb.x, pointCb.y);
            path.cubicBezierTo(pointCd.x, pointCd.y, pointCmb.x - delta, pointCmb.y, pointCmd.x, pointCmd.y - delta);
            path.lineTo(pointDc.x, pointDc.y);
            path.cubicBezierTo(pointDa.x, pointDa.y, pointDmc.x, pointDmc.y - delta, pointDma.x + delta, pointDma.y);
            path.lineTo(leftPoint.x, leftPoint.y);
            this.startPoint = leftPoint;
            this.finishPoint = rightPoint
        }
        this.path = path
    }
    initEffects() {
        this.anims.create({
            key: "effect_connect",
            frames: this.anims.generateFrameNames("ss_main", {
                prefix: "effect_connect1_",
                end: 12,
                zeroPad: 4
            }),
            hideOnComplete: true
        });
        this.anims.create({
            key: "delete_dust",
            frames: this.anims.generateFrameNames("ss_main", {
                prefix: "delete_dust_",
                end: 21,
                zeroPad: 4
            }),
            hideOnComplete: true
        });
        this.anims.create({
            key: "money_collect",
            frames: this.anims.generateFrameNames("ss_main", {
                prefix: "money_collect_",
                end: 11,
                zeroPad: 4
            }),
            hideOnComplete: true
        });
        this.anims.create({
            key: "effect_finishcoin",
            frames: this.anims.generateFrameNames("ss_main", {
                prefix: "effect_finishcoin_",
                end: 17,
                zeroPad: 4
            }),
            hideOnComplete: true,
            frameRate: 30
        });
        this.anims.create({
            key: "effect_connect2",
            frames: this.anims.generateFrameNames("ss_main", {
                prefix: "effect_connect2_",
                end: 28,
                zeroPad: 4
            }),
            hideOnComplete: true
        });
        this.anims.create({
            key: "magic_1",
            frames: this.anims.generateFrameNames("ss_main", {
                prefix: "magic_1_",
                end: 14,
                zeroPad: 4
            }),
            hideOnComplete: false,
            repeat: -1
        });
        this.anims.create({
            key: "propeller1",
            frames: this.anims.generateFrameNames("ss_main", {
                prefix: "propeller1_",
                end: 7,
                zeroPad: 4
            }),
            hideOnComplete: false,
            repeat: -1
        });
        this.anims.create({
            key: "propeller2",
            frames: this.anims.generateFrameNames("ss_main", {
                prefix: "propeller2_",
                end: 7,
                zeroPad: 4
            }),
            hideOnComplete: false,
            repeat: -1
        });
        this.anims.create({
            key: "effect_unboxing",
            frames: this.anims.generateFrameNames("ss_main", {
                prefix: "effect_unboxing_",
                end: 8,
                zeroPad: 4
            }),
            hideOnComplete: true
        });
        this.anims.create({
            key: "effect_tutor",
            frames: this.anims.generateFrameNames("ss_main", {
                prefix: "effect_tutor_",
                end: 19,
                zeroPad: 4
            }),
            hideOnComplete: false,
            repeat: -1
        });
        this.anims.create({
            key: "delete_flash",
            frames: this.anims.generateFrameNames("ss_main", {
                prefix: "delete_flash_",
                end: 24,
                zeroPad: 4
            }),
            hideOnComplete: false,
            repeat: -1
        });
        this.anims.create({
            key: "money_animation",
            frames: this.anims.generateFrameNames("ss_main", {
                prefix: "money_animation_",
                end: 60,
                zeroPad: 4
            }),
            hideOnComplete: false,
            repeat: -1
        });
        this.anims.create({
            key: "treasure_flash2",
            frames: this.anims.generateFrameNames("ss_main", {
                prefix: "treasure_flash2_",
                end: 29,
                zeroPad: 4
            }),
            hideOnComplete: false,
            repeat: -1
        })
    }
    update() {
        var pointer = this.input.activePointer;
        var pos = this.getInputPosition(pointer);
        if (this.gameStarted) {
            if (this.isDrag) {
                this.cursor_car.x = pos.x;
                this.cursor_car.y = pos.y
            }
            for (var i = 0; i < this.LIMIT_parking; i++) {
                this.updateLemming(this.arParking[i])
            }
            if (this.isShowHelicopter) {
                this.updateHelicopter()
            }
            if (!this.arm_help.visible) {
                this.timerCheckHelp++;
                if (this.timerCheckHelp > 120) {
                    this.updateArmHelp();
                    this.timerCheckHelp = 0
                }
            }
        }
        if (this.isShopAdded)
            this.updateScrollMap()
    }
    updateLemming(vCar) {
        if (vCar.type <= 0 || !vCar.racing)
            return;
        var lemming = vCar.lemming;
        var type = vCar.type;
        lemming.prevPos.set(lemming.x, lemming.y);
        var pos = this.path.getPoint(lemming.pathDelta);
        var speedX = pos.x - lemming.prevPos.x;
        var speedY = pos.y - lemming.prevPos.y;
        lemming.setPosition(pos.x, pos.y);
        lemming.angle = 90 + Phaser.Math.RadToDeg(Math.atan2(speedY, speedX));
        lemming.pathDelta = Phaser.Math.Wrap(lemming.pathDelta + lemming.speed, 0, 1);
        var progress = lemming.pathDelta;
        if (!lemming.canEarn && progress < .25) {
            lemming.canEarn = true
        }
        if (lemming.canEarn && progress > .5) {
            this.addCoins(type, vCar.id);
            lemming.canEarn = false
        }
    }
    actionChangeParking(toParking, fromParking) {
        if (fromParking.obj == null)
            return;
        fromParking.obj.x = toParking.x + this.CARS_OFFSET.x;
        fromParking.obj.y = toParking.y + this.CARS_OFFSET.y;
        fromParking.obj.alpha = 1;
        if (fromParking.racing) {
            fromParking.obj.alpha = .5;
            toParking.btn_return.visible = true
        }
        toParking.busy = true;
        toParking.obj = fromParking.obj;
        toParking.type = fromParking.type;
        toParking.racing = fromParking.racing;
        toParking.icon_panel_number.visible = true;
        toParking.textNumberType.visible = true;
        this.setSpriteText(toParking.textNumberType, fromParking.type);
        var save_lemming = toParking.lemming;
        toParking.lemming = fromParking.lemming;
        fromParking.lemming = save_lemming;
        if (toParking.id != fromParking.id) {
            fromParking.type = 0;
            fromParking.busy = false;
            fromParking.racing = false;
            fromParking.obj = null;
            fromParking.btn_return.visible = false;
            fromParking.icon_panel_number.visible = false;
            fromParking.textNumberType.visible = false
        }
        this.updateIndcatorPilots()
    }
    actionMerge(toParking, fromParking, vType) {
        var currentType = toParking.type;
        var nextType = currentType + 1;
        var exp = this.getExpMerge(currentType);
        this.increaseLevel(exp, this.nextCarLevel == nextType);
        if (this.nextCarLevel == nextType) {
            if (MainGame.isAPI)
                MainGame.API_POKI.happyTime(.5);
            MainGame.api_google("MaxLevelCar", this.nextCarLevel);
            this.showMergeAnimation(this.nextCarLevel);
            this.nextCarLevel++;
            this.textLevelNextCar.setText(this.nextCarLevel);
            if (this.nextCarLevel > this.MAX_TYPES_CAR) {
                this.layerProgressCar.visible = false
            }
            this.updateFastBuy();
            if (this.nextCarLevel > 5)
                this.goAllowAdsCar();
            if (this.nextCarLevel >= 5)
                this.showBanner();
            this.updateAdsCar()
        }
        toParking.obj.setFrame("icon_f" + nextType + "_0000");
        toParking.type = nextType;
        if (fromParking.obj)
            fromParking.obj.destroy();
        fromParking.busy = false;
        fromParking.obj = null;
        fromParking.type = 0;
        fromParking.icon_panel_number.visible = false;
        fromParking.textNumberType.visible = false;
        if (fromParking.racing) {
            fromParking.lemming.visible = false;
            fromParking.racing = false;
            fromParking.btn_return.visible = false
        }
        if (toParking.racing) {
            toParking.lemming.visible = false;
            toParking.racing = false;
            toParking.btn_return.visible = false;
            toParking.obj.alpha = 1
        }
        this.setSpriteText(toParking.textNumberType, nextType);
        this.showAnimationMerge(toParking.obj, nextType);
        this.updateIndcatorPilots();
        this.checkNextCar();
        MainGame.Sfx.play("sound", "merge_cars")
    }
    actionSwap(toParking, fromParking, vX, vY) {
        var swapType = toParking.type;
        var swapRacing = toParking.racing;
        this.setSpriteText(toParking.textNumberType, fromParking.type);
        this.setSpriteText(fromParking.textNumberType, toParking.type);
        var save_type = toParking.type;
        toParking.type = fromParking.type;
        fromParking.type = save_type;
        var save_lemming = toParking.lemming;
        toParking.lemming = fromParking.lemming;
        fromParking.lemming = save_lemming;
        var save_racing = toParking.racing;
        toParking.racing = fromParking.racing;
        fromParking.racing = save_racing;
        fromParking.busy = true;
        toParking.busy = true;
        fromParking.obj.alpha = 1;
        toParking.obj.setFrame("icon_f" + toParking.type + "_0000");
        fromParking.obj.setFrame("icon_f" + fromParking.type + "_0000");
        if (fromParking.racing) {
            fromParking.obj.alpha = .5;
            fromParking.btn_return.visible = true
        } else {
            fromParking.obj.alpha = 1;
            fromParking.btn_return.visible = false
        }
        if (toParking.racing) {
            toParking.obj.alpha = .5;
            toParking.btn_return.visible = true
        } else {
            toParking.obj.alpha = 1;
            toParking.btn_return.visible = false
        }
        this.showAnimationSwap(toParking.obj, fromParking.obj, {
            x: vX,
            y: vY
        });
        this.updateIndcatorPilots()
    }
    actionPlaceOnTrack(selectedParking, vDelta, vPlaySound) {
        selectedParking.busy = true;
        selectedParking.racing = true;
        selectedParking.obj.alpha = .5;
        selectedParking.btn_return.visible = true;
        selectedParking.lemming.visible = true;
        selectedParking.lemming.setFrame("f" + selectedParking.type + "_0000");
        var speed = this.getCarInfo(selectedParking.type).speed;
        if (this.isDoubleSpeed)
            speed *= 2;
        selectedParking.lemming.speed = speed;
        selectedParking.lemming.x = this.startPoint.x;
        selectedParking.lemming.y = this.startPoint.y;
        selectedParking.lemming.pathDelta = 0;
        if (vDelta) {
            selectedParking.lemming.pathDelta = vDelta * .05
        }
        this.updateIndcatorPilots();
        if (vPlaySound)
            MainGame.Sfx.play("sound", "place_car")
    }
    actionBackFromRace(parking) {
        parking.btn_return.visible = false;
        parking.racing = false;
        parking.lemming.visible = false;
        this.showAnimationBackFromTrack(parking.obj, {
            x: parking.lemming.x,
            y: parking.lemming.y
        });
        this.updateIndcatorPilots()
    }
    actionTrash(selectedParking) {
        var priceCar = this.getPriceCar(selectedParking.type);
        this.amount_coins += Math.round(priceCar * this.VALUE_SELL);
        var text_coins_warm = this.convertNumberFormat(this.amount_coins);
        this.textCoins.setText(text_coins_warm);
        this.updateShop(text_coins_warm);
        selectedParking.obj.destroy();
        selectedParking.busy = false;
        selectedParking.racing = false;
        selectedParking.obj = null;
        selectedParking.type = 0;
        selectedParking.btn_return.visible = false;
        selectedParking.lemming.visible = false;
        selectedParking.icon_panel_number.visible = false;
        selectedParking.textNumberType.visible = false;
        this.updateIndcatorPilots();
        this.checkNextCar();
        MainGame.Sfx.play("sound", "remove_car")
    }
    onInputUp(pointer) {
        this.onInputUpShop(pointer);
        if (!this.buttonEnabled)
            return;
        this.hideArmHelp();
        var action_detected = false;
        var pos = this.getInputPosition(pointer);
        var parking = null;
        var dist = 0;
        if (this.isDrag) {
            this.cursor_car.visible = false;
            var isPlacedToParking = false;
            var isPlacedToTrack = false;
            var isTrashTime = false;
            for (var i = 0; i < this.LIMIT_parking; i++) {
                parking = this.arParking[i];
                dist = MyMath.distanceTwoPoints(pos.x, parking.x, pos.y, parking.y - 20);
                if (dist < this.DISTANCE_DRAG) {
                    if (parking.busy && this.selectedCar.id != parking.id) {
                        if (this.selectedCar.type == parking.type && parking.type < this.MAX_TYPES_CAR) {
                            this.actionMerge(parking, this.arParking[this.selectedCar.id]);
                            this.openBox(parking, false);
                            action_detected = true;
                            if (this.isGoTutorial && this.tutorialStep == 3) {
                                this.tutorialScenario()
                            }
                        } else {
                            this.openBox(parking, false);
                            this.actionSwap(parking, this.arParking[this.selectedCar.id], pos.x, pos.y);
                            action_detected = true
                        }
                        isPlacedToParking = true
                    } else {
                        var isAllowChange = true;
                        if (this.isGoTutorial) {
                            isAllowChange = false
                        }
                        if (isAllowChange) {
                            this.actionChangeParking(parking, this.arParking[this.selectedCar.id]);
                            isPlacedToParking = true;
                            action_detected = true
                        }
                    }
                }
                if (action_detected)
                    break
            }
            if (!isPlacedToParking) {
                dist = MyMath.distanceTwoPoints(pos.x, this.icon_trash.x, pos.y, this.icon_trash.y);
                if (dist < 2e3 && !this.isGoTutorial) {
                    isTrashTime = true;
                    this.actionTrash(this.arParking[this.selectedCar.id]);
                    var effect = this.add.sprite(this.icon_trash.x, this.icon_trash.y, "ss_main");
                    effect.play("delete_dust");
                    action_detected = true
                }
                var oldParking = this.arParking[this.selectedCar.id];
                if (!oldParking.racing) {
                    dist = MyMath.distanceTwoPoints(pos.x, this.race_start.x, pos.y, this.race_start.y);
                    var midX = this.midX;
                    var midY = this.midY;
                    if (this.isOnTrackPosition(pos, midX, midY)) {
                        var count_racing = this.getRacingCars();
                        if (count_racing >= this.LIMIT_pilots) {
                            this.showSystemMessage(MainGame.GAME_TEXT.no_racing)
                        } else {
                            var isAllowPlace = true;
                            if (this.isGoTutorial && this.tutorialStep == 3) {
                                isAllowPlace = false
                            }
                            if (isAllowPlace) {
                                isPlacedToTrack = true;
                                this.actionPlaceOnTrack(oldParking, null, true);
                                action_detected = true;
                                if (this.isGoTutorial && this.tutorialStep == 4) {
                                    this.tutorialScenario()
                                }
                            }
                        }
                    }
                }
                if (!isTrashTime && !isPlacedToTrack) {
                    oldParking.busy = true;
                    oldParking.obj = this.selectedCar.obj;
                    oldParking.type = this.selectedCar.type;
                    if (oldParking.racing) {
                        this.cursor_car.visible = false;
                        this.linkToOldParking = null
                    } else {
                        this.cursor_car.visible = true;
                        this.linkToOldParking = oldParking;
                        var posX = oldParking.obj.x;
                        var posY = oldParking.obj.y;
                        this.tweens.add({
                            targets: this.cursor_car,
                            x: posX,
                            y: posY,
                            ease: Phaser.Math.Easing.Cubic.Out,
                            duration: 100,
                            onComplete: this.finishCursorTween
                        })
                    }
                }
            }
            this.selectedCar = null;
            this.isDrag = false;
            this.hideHighlight()
        } else {
            for (var i = 0; i < this.LIMIT_parking; i++) {
                parking = this.arParking[i];
                dist = MyMath.distanceTwoPoints(pos.x, parking.x, pos.y, parking.y - 20);
                if (dist < this.DISTANCE_DRAG && parking.racing) {
                    this.actionBackFromRace(parking);
                    action_detected = true
                }
            }
        }
        this.isDownOnParking = false;
        this.delete_flash.visible = false;
        if (action_detected) {
            this.updateBoxHave()
        }
    }
    isOnTrackPosition(pos, midX, midY) {
        if (MainGame.isDesktop) {
            return pos.x > midX - 200 && pos.x < midX + 220 && pos.y < 90
        } else {
            return pos.x < midX - 190 && pos.y > midY - 220 && pos.y < midY + 220
        }
    }
    finishCursorTween() {
        MainGame.state.cursor_car.visible = false;
        if (MainGame.state.linkToOldParking && MainGame.state.linkToOldParking.obj)
            MainGame.state.linkToOldParking.obj.alpha = 1;
        MainGame.state.linkToOldParking = null
    }
    showAnimationMerge(vObj, vType) {
        var oldType = vType - 1;
        var posX = vObj.x;
        var posY = vObj.y;
        this.cursor_car.visible = true;
        this.cursor_car.setFrame("icon_f" + oldType + "_0000");
        vObj.setFrame("icon_f" + oldType + "_0000");
        this.cursor_car.x = posX;
        this.cursor_car.y = posY;
        vObj.x = posX;
        vObj.y = posY;
        this.tweens.add({
            targets: this.cursor_car,
            x: posX + 50,
            ease: Phaser.Math.Easing.Cubic.Out,
            duration: 100,
            yoyo: true
        });
        this.tweens.add({
            targets: vObj,
            x: posX - 50,
            ease: Phaser.Math.Easing.Cubic.Out,
            duration: 100,
            yoyo: true
        });
        this.time.delayedCall(200, this.onMergePart, [vObj, vType], this);
        var effect = this.add.sprite(vObj.x + 15, vObj.y - 10, "ss_main");
        effect.setDepth(this.DEPTH_effect_unboxing);
        effect.play("effect_connect")
    }
    onMergePart(vObj, vType) {
        vObj.setFrame("icon_f" + vType + "_0000");
        this.cursor_car.setFrame("icon_f" + vType + "_0000");
        if (this.isDrag)
            return;
        this.cursor_car.visible = false;
        vObj.setScale(this.getScaleCar(1));
        this.tweens.add({
            targets: vObj,
            scale: this.getScaleCar(1.4),
            ease: Phaser.Math.Easing.Linear,
            duration: 100,
            yoyo: true
        })
    }
    showAnimationSwap(obj1, obj2, vPosition) {
        var to_x1 = obj1.x;
        var to_y1 = obj1.y;
        var to_x2 = obj2.x;
        var to_y2 = obj2.y;
        obj2.x = obj1.x;
        obj2.y = obj1.y;
        obj1.x = vPosition.x;
        obj1.y = vPosition.y;
        this.tweens.add({
            targets: obj1,
            x: to_x1,
            y: to_y1,
            ease: Phaser.Math.Easing.Linear,
            duration: 200
        });
        this.tweens.add({
            targets: obj2,
            x: to_x2,
            y: to_y2,
            ease: Phaser.Math.Easing.Linear,
            duration: 200
        });
        obj1.setScale(this.getScaleCar(1));
        obj2.setScale(this.getScaleCar(1));
        this.tweens.add({
            targets: obj1,
            scale: this.getScaleCar(1.4),
            ease: Phaser.Math.Easing.Linear,
            duration: 100,
            yoyo: true
        });
        this.tweens.add({
            targets: obj2,
            scale: this.getScaleCar(1.4),
            ease: Phaser.Math.Easing.Linear,
            duration: 100,
            yoyo: true
        })
    }
    showAnimationBackFromTrack(vObj, vPosition) {
        if (vObj == null)
            return;
        var to_x = vObj.x;
        var to_y = vObj.y;
        this.cursor_car.setFrame(vObj.frame.name);
        this.cursor_car.visible = true;
        this.cursor_car.x = vPosition.x;
        this.cursor_car.y = vPosition.y;
        this.tweens.add({
            targets: this.cursor_car,
            x: to_x,
            y: to_y,
            ease: Phaser.Math.Easing.Linear,
            duration: 150
        });
        this.time.delayedCall(150, this.onBackPart, [vObj], this)
    }
    onBackPart(vObj) {
        vObj.alpha = 1;
        this.cursor_car.visible = false
    }
    showHighlight() {
        var parking = null;
        var typeSelected = this.selectedCar.type;
        var idSelected = this.selectedCar.id;
        for (var i = 0; i < this.LIMIT_parking; i++) {
            parking = this.arParking[i];
            if (parking.id != idSelected) {
                if (typeSelected == parking.type && parking.type < this.MAX_TYPES_CAR) {
                    parking.highlighter.visible = true
                }
            }
        }
    }
    hideHighlight() {
        var parking = null;
        for (var i = 0; i < this.LIMIT_parking; i++) {
            parking = this.arParking[i];
            parking.highlighter.visible = false
        }
    }
    getInputPosition(pointer) {
        const deltaX = Math.ceil(this.parent.width - this.sizer.width) * .5;
        const deltaY = Math.ceil(this.parent.height - this.sizer.height) * .5;
        const scaleX = this.sizer.width / this.GAME_WIDTH;
        const scaleY = this.sizer.height / this.GAME_HEIGHT;
        const zoom = Math.max(scaleX, scaleY);
        const offset = deltaY / zoom;
        var pX = (pointer.x - deltaX) / zoom;
        var pY = (pointer.y - deltaY) / zoom + offset;
        if (!MainGame.isDesktop)
            pY = pointer.y / zoom - offset;
        return {
            x: pX,
            y: pY
        }
    }
    onInputMove(pointer) {
        this.onInputMoveShop(pointer);
        if (!this.buttonEnabled)
            return;
        if (this.isDownOnParking) {
            this.isDrag = true;
            var parking = this.arParking[this.selectedCar.id];
            if (pointer.distance > 3) {
                this.cursor_car.setFrame(parking.obj.frame.name);
                this.cursor_car.visible = true;
                if (!this.isGoTutorial) {
                    this.delete_flash.visible = true
                }
                parking.obj.alpha = .5;
                parking.busy = false;
                this.isDownOnParking = false;
                this.showHighlight();
                parking.obj.setScale(this.getScaleCar(1));
                this.tweens.killTweensOf(parking.obj);
                parking.obj.x = parking.x + this.CARS_OFFSET.x;
                parking.obj.y = parking.y + this.CARS_OFFSET.y
            }
        }
    }
    onInputDown(pointer) {
        this.onInputDownShop(pointer);
        if (!this.buttonEnabled)
            return;
        if (this.isGoTutorial && this.tutorialStep < 3)
            return;
        this.hideArmHelp();
        var pos = this.getInputPosition(pointer);
        var parking = null;
        var dist = 0;
        for (var i = 0; i < this.LIMIT_parking; i++) {
            parking = this.arParking[i];
            dist = MyMath.distanceTwoPoints(pos.x, parking.x, pos.y, parking.y - 20);
            if (this.isGoTutorial && this.tutorialStep == 3 && parking.id == 0) {
                continue
            }
            if (dist < this.DISTANCE_DRAG && parking.busy) {
                this.isDownOnParking = true;
                this.selectedCar = {
                    id: parking.id,
                    obj: parking.obj,
                    type: parking.type,
                    racing: parking.racing
                };
                if (parking.obj && parking.obj.count_box_tween > 0) {
                    this.openBox(parking, true)
                }
                break
            }
        }
    }
    openBox(vParking, vIsAnimScale) {
        var vObj = vParking.obj;
        if (vObj == null)
            return;
        if (this.isGoTutorial && this.tutorialStep == 5) {
            this.tutorialScenario()
        }
        if (vObj.timedEvent)
            vObj.timedEvent.remove();
        vObj.count_box_tween = 0;
        vObj.setFrame(vObj.car_frame);
        this.tweens.killTweensOf(vObj);
        vObj.angle = 0;
        vObj.x = vParking.x + this.CARS_OFFSET.x;
        vObj.y = vParking.y + this.CARS_OFFSET.y;
        vParking.icon_panel_number.visible = true;
        vParking.textNumberType.visible = true;
        if (vIsAnimScale) {
            var effect = this.add.sprite(vObj.x, vObj.y, "ss_main");
            effect.play("effect_unboxing");
            effect.setDepth(this.DEPTH_effect_unboxing);
            vObj.setScale(this.getScaleCar(.3));
            vObj.setAlpha(.5);
            this.tweens.add({
                targets: vObj,
                scale: this.getScaleCar(1),
                ease: Phaser.Math.Easing.Back.Out,
                duration: 200
            });
            this.tweens.add({
                targets: vObj,
                alpha: 1,
                ease: Phaser.Math.Easing.Linear,
                duration: 150
            });
            MainGame.Sfx.play("sound", "open_box")
        }
    }
    goShake(vParking) {
        var vObj = vParking.obj;
        if (vObj) {
            vObj.count_box_tween--;
            if (vObj.count_box_tween <= 0) {
                this.openBox(vParking, true)
            } else {
                this.tweens.add({
                    targets: vObj,
                    angle: -10,
                    ease: Phaser.Math.Easing.Sine.InOut,
                    duration: 150,
                    repeat: 1,
                    yoyo: true
                })
            }
        }
    }
    shakeBox(vParking) {
        var vObj = vParking.obj;
        vObj.count_box_tween = 5;
        if (this.isGoTutorial)
            return;
        vObj.timedEvent = this.time.addEvent({
            args: [vParking],
            delay: 1500,
            callback: this.goShake,
            callbackScope: this,
            repeat: vObj.count_box_tween
        })
    }
    getScaleCar(value, bool) {
        if (bool) {
            var atlas_scale = 2;
            var scale = value / atlas_scale;
            return Math.round(scale * 100) / 100
        } else {
            return value
        }
    }
    addBoxToBuffer(vTypeCar) {
        this.buffer_boxes.push({
            type: vTypeCar
        })
    }
    checkBuffer() {
        if (this.buffer_boxes.length > 0) {
            var free_park_num = this.getFreeParking();
            if (free_park_num >= 0) {
                var obj = this.buffer_boxes.shift();
                this.addObject({
                    lvl: obj.type,
                    skinBox: true
                });
                this.updateBoxHave();
                this.saveBoxBuffer()
            }
        }
    }
    addObject(data, vIsSound) {
        data = data || {};
        var num = data.lvl || this.getTypeRandomBox();
        var free_park_num = data.parkingId || this.getFreeParking();
        data.alreadyRacing = false || data.alreadyRacing;
        if (free_park_num >= 0) {
            var park_place = this.arParking[free_park_num];
            park_place.busy = true;
            var car = this.add.image(park_place.x + this.CARS_OFFSET.x, park_place.y + this.CARS_OFFSET.y, "ss_cars", "icon_f" + num + "_0000");
            car.setDepth(this.DEPTH_cars);
            car.car_frame = "icon_f" + num + "_0000";
            park_place.icon_panel_number.visible = true;
            park_place.textNumberType.visible = true;
            this.setSpriteText(park_place.textNumberType, num);
            car.count_box_tween = 0;
            park_place.obj = car;
            park_place.type = num;
            if (!data.alreadyRacing && (data.parkingId == null || data.skinBox)) {
                if (data.skinBox || data.fromShop) {
                    if (data.fromShop) {
                        car.setFrame("box2_0000")
                    } else {
                        car.setFrame("box1_0000")
                    }
                    car.x -= 7;
                    car.y -= 6;
                    this.shakeBox(park_place);
                    park_place.icon_panel_number.visible = false;
                    park_place.textNumberType.visible = false;
                    if (!data.fromShop)
                        MainGame.Sfx.play("sound", "show_box")
                }
                car.setScale(this.getScaleCar(.3));
                car.setAlpha(.5);
                this.tweens.add({
                    targets: car,
                    scale: this.getScaleCar(1),
                    ease: Phaser.Math.Easing.Back.Out,
                    duration: 200
                });
                this.tweens.add({
                    targets: car,
                    alpha: 1,
                    ease: Phaser.Math.Easing.Linear,
                    duration: 150
                })
            }
            if (data.alreadyRacing) {
                this.actionPlaceOnTrack(park_place, data.parkingId, false)
            }
        } else {
            this.showSystemMessage(MainGame.GAME_TEXT.no_parking)
        }
        this.checkNextCar()
    }
    getTypeFastCar() {
        var vLvl = this.nextCarLevel - 1;
        switch (vLvl) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
            return 1;
            break;
        case 6:
            return 2;
            break;
        case 7:
            return 3;
            break;
        case 8:
            return 3;
            break;
        case 9:
            return 4;
            break;
        case 10:
            return 4;
            break;
        case 11:
            return 5;
            break;
        default:
            return vLvl - 7;
            break
        }
    }
    getTypeBetterPrice() {
        var vLvl = this.nextCarLevel - 1;
        switch (vLvl) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
            return 1;
            break;
        case 6:
        case 7:
        case 8:
            var price1 = this.getPriceCar(vLvl - 5);
            var price2 = this.getPriceCar(vLvl - 4);
            var type = vLvl - 5;
            if (price1 > price2 * .5)
                type = vLvl - 4;
            return type;
            break;
        default:
            var price1 = this.getPriceCar(vLvl - 6);
            var price2 = this.getPriceCar(vLvl - 5);
            var price3 = this.getPriceCar(vLvl - 4);
            var type = vLvl - 6;
            if (price1 > price2 * .5)
                type = vLvl - 5;
            if (price2 > price3 * .5)
                type = vLvl - 4;
            return type;
            break
        }
    }
    getTypeRandomBox() {
        var vLvl = this.getTypeFastCar() - 1;
        if (vLvl < 1)
            vLvl = 1;
        return vLvl
    }
    getFreeParking() {
        var placeNum = -1;
        for (var i = 0; i < this.LIMIT_parking; i++) {
            if (this.selectedCar) {
                if (this.selectedCar.id == i) {
                    continue
                }
            }
            if (!this.arParking[i].busy) {
                placeNum = i;
                break
            }
        }
        return placeNum
    }
    setSpriteText(vLayer, vNum) {
        vLayer.removeAll();
        var stringNum = vNum.toString();
        var arrayOfNum = stringNum.split("");
        var length = 0;
        var symb = null;
        var symsAr = [];
        for (var n in arrayOfNum) {
            symb = this.add.image(length, 0, "ss_cars", "num_" + arrayOfNum[n] + "_0000");
            symb.setScale(.65);
            symb.setOrigin(0, .5);
            vLayer.add(symb);
            symsAr.push(symb);
            length += symb.displayWidth - 2
        }
        var offsetX = 0;
        var totalLength = Math.floor(length * .5);
        for (var s in symsAr) {
            symsAr[s].x -= totalLength
        }
    }
    addParking(vData) {
        var icon_parking = this.add.image(vData.x, vData.y, "ss_cars", "icon_parking_0000");
        var highlighter = this.add.image(vData.x + this.HIGHLIGHTER_OFFSET.x, vData.y + this.HIGHLIGHTER_OFFSET.y, "ss_cars", "highlighted_car_0000");
        var icon_return = this.add.image(vData.x + this.ICON_RETURN_OFFSET.x, vData.y + this.ICON_RETURN_OFFSET.y, "ss_cars", "btn_return_0000");
        var lemming = this.add.image(this.startPoint.x, this.startPoint.y, "ss_cars", "f1_0000");
        var icon_panel_number = this.add.image(vData.x, vData.y, "ss_cars", "panel_number_0000");
        icon_panel_number.setScale(1.3);
        lemming.setDepth(this.DEPTH_racing_car);
        icon_parking.setDepth(this.DEPTH_platform);
        highlighter.setDepth(this.DEPTH_hightlight);
        icon_return.setDepth(this.DEPTH_iconreturn);
        icon_panel_number.setDepth(this.DEPTH_iconreturn);
        var textNumberType = this.add.container();
        textNumberType.setDepth(this.DEPTH_iconreturn);
        icon_parking.visible = false;
        icon_return.visible = false;
        lemming.visible = false;
        highlighter.visible = false;
        icon_panel_number.visible = false;
        textNumberType.visible = false;
        lemming.canEarn = true;
        lemming.speed = 0;
        lemming.pathDelta = 0;
        lemming.prevPos = new Phaser.Math.Vector2;
        vData.btn_return = icon_return;
        vData.icon_parking = icon_parking;
        vData.lemming = lemming;
        vData.highlighter = highlighter;
        vData.icon_panel_number = icon_panel_number;
        vData.textNumberType = textNumberType
    }
    clickTurbo() {
        this.layerTurboWindow.visible = true;
        this.layerTurboWindow.setScale(this.scaleWindow2);
        this.disableMainButtons();
        if (MainGame.isAPI) {
            if (MainGame.API_POKI && MainGame.API_POKI.api_isAdblock)
                this.buttonActivateTurbo.setEnable(false)
        } else {
            if (!MainGame.isDebug)
                this.buttonActivateTurbo.setEnable(false)
        }
        this.showBanner()
    }
    closeTurbo() {
        MainGame.isApiGameplayStop = true;
        if (MainGame.isAPI && MainGame.isApiGameplayStop) {
            MainGame.API_POKI.gameplayStart();
            MainGame.isApiGameplayStop = false
        }
        this.layerTurboWindow.visible = false;
        this.enableMainButtons()
    }
    updateTimerBonusSpeed() {
        this.countDownBonusSpeed--;
        this.textFieldIndicatorBoost.setText(this.secToHHMMSS(this.countDownBonusSpeed));
        if (this.countDownBonusSpeed == 0) {
            this.activateTurbo(false)
        } else {
            this.updateIconFactorTurbo()
        }
        MainGame.cdBonusSpeed = this.countDownBonusSpeed;
        MainGame.saveSaves();
        this.updateTurboBar(true)
    }
    updateIconFactorTurbo() {
        var update_factor = 2;
        if (this.countDownBonusSpeed > this.TIME_BOOST * 6) {
            update_factor = 3
        }
        if (this.FACTOR_TURBO != update_factor) {
            this.FACTOR_TURBO = update_factor;
            this.updateSpeedCars(true);
            this.textTurboFactor.setText("X" + this.FACTOR_TURBO)
        }
        if (this.countDownBonusSpeed > this.TIME_BOOST * 11) {
            this.buttonActivateTurbo.setEnable(false)
        } else {
            this.buttonActivateTurbo.setEnable(true)
        }
    }
    isTurboMax() {
        return this.countDownBonusSpeed > this.TIME_BOOST * 11
    }
    updateSpeedCars(bool) {
        this.isDoubleSpeed = bool;
        var countParking = this.LIMIT_parking;
        var parking;
        var speed;
        var prev_progress;
        for (var i = 0; i < countParking; i++) {
            parking = this.arParking[i];
            if (parking.racing) {
                var speed = this.getCarInfo(parking.type).speed;
                if (this.isDoubleSpeed) {
                    parking.lemming.speed = speed * this.FACTOR_TURBO
                } else {
                    parking.lemming.speed = speed
                }
            }
        }
        this.updateSpeed()
    }
    activateTurbo(bool, vTime, fromLoad) {
        vTime = vTime || this.TIME_BOOST;
        if (!fromLoad && bool && this.countDownBonusSpeed > 0) {
            this.countDownBonusSpeed += vTime;
            if (this.countDownBonusSpeed > this.TIME_BOOST * 12) {
                this.countDownBonusSpeed = this.TIME_BOOST * 12
            }
            this.textFieldIndicatorBoost.setText(this.secToHHMMSS(this.countDownBonusSpeed));
            this.updateTurboBar();
            return
        }
        if (bool) {
            this.layerIndicatorBoost.visible = true;
            this.countDownBonusSpeed = vTime;
            this.textFieldIndicatorBoost.setText(this.secToHHMMSS(this.countDownBonusSpeed));
            this.updateTurboBar();
            this.updateIndicatorsBonus("speed_x2", true);
            this.timerBonusSpeed = this.time.addEvent({
                delay: 1e3,
                callback: this.updateTimerBonusSpeed,
                callbackScope: this,
                loop: true
            });
            this.updateIconFactorTurbo();
            MainGame.Sfx.play("music", "turbo")
        } else {
            this.layerIndicatorBoost.visible = false;
            this.timerBonusSpeed.remove();
            this.updateIndicatorsBonus("speed_x2", false);
            MainGame.Sfx.play("music", "main")
        }
        this.updateSpeedCars(bool)
    }
    initInputScrolling() {
        this.dragging = false;
        this.fling_enabled = true;
        this.isReadingMode = false;
        this.readingNode = -1;
        this.current_pos = {
            x: 0,
            y: 0
        };
        this.pressed_pos = {
            x: 0,
            y: 0
        };
        this.released_pos = {
            x: 0,
            y: 0
        };
        this.fling = {
            x: 0,
            y: 0
        };
        this.contentMaxY = this.contentHeight;
        this.timeConstant = 325
    }
    onInputDownShop(pointer) {
        if (!this.isShopAdded)
            return;
        if (!this.layerShop.visible)
            return;
        var pos = this.getInputPosition(pointer);
        if (MainGame.isDesktop) {
            if (pos.y < 80)
                return;
            if (pos.x > 700 || pos.x < 280)
                return
        } else {
            if (pos.y < 240 || pos.y > 700)
                return;
            if (pos.x > 500 || pos.x < 95)
                return
        }
        this.dragging = true;
        this.pressed_pos.y = pos.y;
        this.pressed_time = Date.now();
        this.fling.y = 0
    }
    onInputUpShop(pointer) {
        if (!this.isShopAdded)
            return;
        if (!this.layerShop.visible)
            return;
        var pos = this.getInputPosition(pointer);
        if (!this.dragging)
            return;
        this.dragging = false;
        this.current_pos.y = this.limit(this.current_pos.y + this.pressed_pos.y - pos.y);
        if (this.fling_enabled) {
            this.released_pos.y = pos.y;
            var delta_time = Date.now() - this.pressed_time;
            var distance = this.released_pos.y - this.pressed_pos.y;
            var delta = distance * Math.exp(-delta_time / this.timeConstant) * .2;
            if (Math.abs(delta) >= 30)
                this.fling.y = delta
        }
    }
    limit(posY) {
        posY = Math.min(posY, this.contentMaxY);
        posY = Math.max(posY, 0);
        return posY
    }
    onInputMoveShop(pointer) {
        if (!this.isShopAdded)
            return;
        if (!this.layerShop.visible)
            return;
        var pos = this.getInputPosition(pointer);
        if (this.dragging) {
            var posY = this.current_pos.y + this.pressed_pos.y - pos.y;
            this.updatePositions(this.limit(posY))
        }
    }
    updatePositions(posY, isSkipUpdateSlider) {
        if (!isSkipUpdateSlider) {
            var percent = posY / this.contentMaxY * 100;
            this.slider.setSliderByValueForce(percent, 0)
        }
        this.layerShopContent.y = -posY;
        var itemIndex = Math.floor(posY / this.itemShop_WIDTH);
        var item;
        for (var i = 0; i < this.MAX_TYPES_CAR; i++) {
            item = this.arShopCars[i].item;
            if (i < itemIndex || i > itemIndex + 6) {
                item.visible = false
            } else {
                item.visible = true
            }
        }
    }
    getBarPosition(vPositionContent) {
        return Math.abs(vPositionContent / this.contentMaxY * 100)
    }
    updateScrollMap() {
        if (!this.dragging && this.fling_enabled && Math.abs(this.fling.y) > 0) {
            var posY = this.current_pos.y - this.fling.y;
            this.current_pos.y = this.limit(posY);
            this.updatePositions(this.current_pos.y);
            this.fling.y = MyMath.lerp(this.fling.y, 0, .04);
            if (Math.abs(this.fling.y) < .5) {
                this.fling.y = 0
            }
        }
    }
    initShop() {
        this.layerShop = this.add.container();
        this.layerShopContent = this.add.container();
        this.layerShop.setDepth(this.DEPTH_layerShop);
        this.layerShop.x = this.midX;
        this.layerShop.y = this.midY - 35;
        var posHeader = -253;
        var fon_merge = this.add.image(0, 0, "ss_main", "bg_connect_0000");
        fon_merge.setScale(2);
        this.layerShop.add(fon_merge);
        var fon_shop = this.add.image(0, 0, "ss_cars", "popup_shop_0000");
        fon_shop.setScale(2);
        this.layerShop.add(fon_shop);
        var coin = this.add.image(-130, posHeader, "ss_cars", "money_0000");
        this.layerShop.add(coin);
        this.iconCoinShop = coin;
        coin.setScale(.8);
        var buttonClose = new Button(215,posHeader,"ss_cars","btn_close_0000",this.closeShop,this);
        this.layerShop.add(buttonClose);
        fon_shop.setInteractive();
        fon_merge.setInteractive();
        fon_merge.on("pointerdown", this.inputOverShopDown, this);
        fon_merge.on("pointerup", this.inputOverShopUp, this);
        this.isInputOverShopDown = false;
        this.layerShop.add(this.layerShopContent);
        this.contentHeight = 0;
        this.itemShop_WIDTH = 120;
        this.arShopCars = [];
        var car;
        for (var i = 1; i <= this.MAX_TYPES_CAR; i++) {
            car = this.addShopItemMain(-20, this.itemShop_WIDTH * i - 280, i);
            this.arShopCars.push(car)
        }
        for (var i = 1; i <= this.MAX_TYPES_CAR; i++) {
            car = this.addShopItemText(0, this.itemShop_WIDTH * i - 280, i)
        }
        this.contentHeight -= this.itemShop_WIDTH * 4 - 10;
        var text_shop = this.addText(this.layerShop, -200, posHeader, MainGame.GAME_TEXT.shop, 30, true);
        MainGame.updateTextWidth(text_shop, 380);
        this.textCoinsShop = this.addText(this.layerShop, 20, posHeader, "0", 30, true);
        var posMaskY = 65;
        if (!MainGame.isDesktop)
            posMaskY = 225;
        var graphicsMask = this.make.graphics();
        var color = 65535;
        graphicsMask.fillStyle(color);
        graphicsMask.fillRect(80, posMaskY, 700, 480);
        this.layerShopContent.mask = new Phaser.Display.Masks.BitmapMask(this,graphicsMask);
        this.layerShop.visible = false;
        this.contentMaxY = this.contentHeight;
        this.isShopAdded = true;
        const slider = new HorizontalSlider({
            scene: this,
            x: 225,
            y: 20,
            current: 0,
            texture: "ss_cars",
            track: {
                frame: "scroll_bar1_0000",
                y: 4.5
            },
            slider: "scroll_bar2_0000"
        });
        slider.setAngle(90);
        this.layerShop.add(slider);
        slider.on("update", (slider,value,percent)=>{
            var scrollPercent = Math.round(percent * 100);
            var newContentY = (slider.height - this.contentHeight) / 100 * scrollPercent;
            this.current_pos.y = -newContentY;
            this.updatePositions(-newContentY, true)
        }
        , this);
        this.slider = slider;
        this.input.on("wheel", (function(pointer, gameObjects, deltaX, deltaY, deltaZ) {
            MainGame.state.current_pos.y = MainGame.state.limit(MainGame.state.current_pos.y + deltaY * .5);
            var posY = MainGame.state.current_pos.y;
            MainGame.state.updatePositions(posY)
        }
        ));
        this.updatePositions(0)
    }
    inputOverShopDown() {
        this.isInputOverShopDown = true
    }
    inputOverShopUp() {
        if (!this.isInputOverShopDown)
            return;
        this.closeShop();
        this.isInputOverShopDown = false
    }
    addShopItemMain(vX, vY, vNum) {
        var item = this.add.container();
        this.layerShopContent.add(item);
        var plaha = this.add.image(vX, vY, "ss_cars", "window_car_0000");
        item.add(plaha);
        var car = this.add.image(vX - 100, vY, "ss_cars", "icon_f" + vNum + "_b_0000");
        car.setScale(this.getScaleCar(1.2, true));
        item.add(car);
        var icon_coin = this.add.image(vX + 5, vY - 17, "ss_cars", "money_0000");
        icon_coin.setScale(.4);
        item.add(icon_coin);
        var buttonBuy = new ButtonText(vX + 95,vY + 25,"ss_cars","btn_buy_shop_0000",this.clickBuyShopItem,this,"",vNum);
        item.add(buttonBuy);
        buttonBuy.text.setFontSize(24);
        buttonBuy.text.y = -6;
        buttonBuy.text.x = 20;
        buttonBuy.text.setOrigin(.5, .5);
        this.contentHeight += this.itemShop_WIDTH;
        this.addText(item, vX - 195, vY - 25, vNum, 25);
        return {
            item: item,
            car: car,
            btn: buttonBuy,
            btn_back: buttonBuy.back,
            btn_text: buttonBuy.text,
            icon_coin_earning: icon_coin
        }
    }
    addShopItemText(vX, vY, vNum) {
        var car = this.arShopCars[vNum - 1];
        var item = car.item;
        var textField_earning = this.addText(item, vX + 35, vY - 42, MainGame.GAME_TEXT.earning, 18, true);
        MainGame.updateTextWidth(textField_earning, 180);
        var value_speed_coins = this.getCarCoins(vNum);
        var number_warm = this.convertNumberFormat(value_speed_coins);
        var value_earning = number_warm + "/" + MainGame.GAME_TEXT.sec + " ";
        var text_earning = this.addText(item, vX + 18, vY - 18, value_earning, 18);
        MainGame.updateTextWidth(text_earning, 180);
        text_earning.setOrigin(0, .5);
        textField_earning.setTint(16769280);
        text_earning.setTint(16769280);
        car.textField_earning1 = textField_earning;
        car.textField_earning2 = text_earning
    }
    closeShop() {
        if (MainGame.isAPI)
            MainGame.API_POKI.commercialBreak();
        this.layerShop.visible = false;
        this.enableMainButtons()
    }
    updateShop(value) {
        if (!this.isShopAdded)
            return;
        this.textCoinsShop.setText(value);
        this.iconCoinShop.x = this.textCoinsShop.x - this.textCoinsShop.width * .5 - 35
    }
    updateShopItem() {
        if (!this.isShopAdded)
            return;
        var item;
        for (var i = 0; i < this.MAX_TYPES_CAR; i++) {
            item = this.arShopCars[i];
            if (i + 2 > this.nextCarLevel) {
                item.car.setTint(0);
                item.btn_back.setFrame("btn_buy_gray_0000");
                item.btn_text.setText("???");
                item.btn_text.setTint(0);
                MainGame.updateTextWidth(item.btn_text, 140);
                item.btn.disableInput();
                item.icon_coin_earning.visible = false;
                item.textField_earning1.visible = false;
                item.textField_earning2.visible = false
            } else {
                item.car.setTint(16777215);
                item.icon_coin_earning.visible = true;
                item.textField_earning1.visible = true;
                item.textField_earning2.visible = true;
                if (i > 0 && this.nextCarLevel < i + 6) {
                    if (i == this.nextCarLevel - 5) {
                        if (this.ALLOW_ADS_CAR) {
                            item.btn_back.setFrame("btn_buy2_shop_0000");
                            item.btn_text.setText(" " + MainGame.GAME_TEXT.free.toUpperCase() + " ");
                            item.btn_text.setTint(16777215);
                            MainGame.updateTextWidth(item.btn_text, 140);
                            item.btn.enableInput();
                            if (MainGame.isAPI) {
                                if (MainGame.API_POKI && MainGame.API_POKI.api_isAdblock)
                                    item.btn.setEnable(false)
                            } else {
                                if (!MainGame.isDebug)
                                    item.btn.setEnable(false)
                            }
                        } else {
                            item.btn_back.setFrame("btn_buy_gray_0000");
                            item.btn_text.setText(MainGame.GAME_TEXT.unlock_car + " " + (i + 5));
                            item.btn_text.setTint(0);
                            MainGame.updateTextWidth(item.btn_text, 125);
                            item.btn.disableInput()
                        }
                    } else {
                        item.btn_back.setFrame("btn_buy_gray_0000");
                        item.btn_text.setText(MainGame.GAME_TEXT.unlock_car + " " + (i + 5));
                        item.btn_text.setTint(0);
                        MainGame.updateTextWidth(item.btn_text, 125);
                        item.btn.disableInput()
                    }
                } else {
                    item.btn_back.setFrame("btn_buy_shop_0000");
                    var number_warm = this.convertNumberFormat(this.arCurrentPricesCar[i]);
                    item.btn_text.setText(number_warm);
                    item.btn_text.setTint(16777215);
                    MainGame.updateTextWidth(item.btn_text, 140);
                    item.btn.enableInput()
                }
            }
        }
    }
    getWheelPrize(slices, degrees, backDegrees) {
        return slices - 1 - Math.floor((degrees - backDegrees) / (360 / slices))
    }
    initWheelOptions() {
        this.wheelOptions = {
            slices: 8,
            slicePrizes: ["reward_box8", "reward_box4", "reward_turbo", "reward_coin1", "reward_boost", "reward_coin3", "reward_box6", "reward_coin2"],
            sliceProbability: [.12, .18, .18, .09, .18, .03, .15, .07],
            rotationTime: 3e3,
            rotationTimeRange: {
                min: 3e3,
                max: 4500
            },
            wheelRounds: {
                min: 2,
                max: 6
            },
            backSpin: {
                min: 2,
                max: 8
            }
        }
    }
    checkProbability(probs) {
        var summ = 0;
        for (var v in probs) {
            summ += probs[v]
        }
        return summ == 1
    }
    getTypeRewardBox() {
        var boxRandom = this.getTypeRandomBox();
        if (this.nextCarLevel < 6) {
            boxRandom = 1
        } else {
            boxRandom++
        }
        return boxRandom
    }
    getCoinsTime(vCount) {
        var total_speed = this.updateSpeed(true);
        var coins = Math.round(vCount * 3600 * total_speed);
        if (coins == 0)
            coins = Math.round(vCount * 3600 * this.getCarCoins(this.nextCarLevel - 1));
        return coins
    }
    getRewardCoinsHours(vCount) {
        var total_speed = this.updateSpeed(true);
        var coins = Math.round(vCount * 3600 * total_speed);
        if (coins == 0)
            coins = Math.round(vCount * 3600 * this.getCarCoins(this.nextCarLevel - 1));
        this.amount_coins += coins;
        var text_coins_warm = this.convertNumberFormat(this.amount_coins);
        this.textCoins.setText(text_coins_warm)
    }
    getRewards(vReward) {
        switch (vReward) {
        case "reward_coin1":
            this.getRewardCoinsHours(1);
            break;
        case "reward_coin2":
            this.getRewardCoinsHours(2);
            break;
        case "reward_coin3":
            this.getRewardCoinsHours(3);
            break;
        case "reward_coin4":
            this.getRewardCoinsHours(4);
            break;
        case "reward_boost":
        case "helicopter_coins":
            this.countDownBonusCoins += this.TIME_COINS;
            this.activateBoost(this.countDownBonusCoins);
            break;
        case "helicopter_boxes":
        case "reward_box2":
            var boxType = this.getTypeRewardBox();
            this.addBoxToBuffer(boxType);
            this.addBoxToBuffer(boxType);
            this.saveBoxBuffer();
            break;
        case "reward_box4":
            var boxType = this.getTypeRewardBox();
            this.addBoxToBuffer(boxType);
            this.addBoxToBuffer(boxType);
            this.addBoxToBuffer(boxType);
            this.addBoxToBuffer(boxType);
            this.saveBoxBuffer();
            break;
        case "reward_box6":
            var boxType = this.getTypeRewardBox();
            this.addBoxToBuffer(boxType);
            this.addBoxToBuffer(boxType);
            this.addBoxToBuffer(boxType);
            this.addBoxToBuffer(boxType);
            this.addBoxToBuffer(boxType);
            this.addBoxToBuffer(boxType);
            this.saveBoxBuffer();
            break;
        case "reward_box8":
            var boxType = this.getTypeRewardBox();
            this.addBoxToBuffer(boxType);
            this.addBoxToBuffer(boxType);
            this.addBoxToBuffer(boxType);
            this.addBoxToBuffer(boxType);
            this.addBoxToBuffer(boxType);
            this.addBoxToBuffer(boxType);
            this.addBoxToBuffer(boxType);
            this.addBoxToBuffer(boxType);
            this.saveBoxBuffer();
            break;
        case "reward_wheel":
            var item = MyMath.weightedRandom(this.wheelOptions.sliceProbability);
            if (item == 2 && this.isTurboMax())
                item = 1;
            MainGame.reward_wheel = this.wheelOptions.slicePrizes[item];
            var rounds = Phaser.Math.Between(this.wheelOptions.wheelRounds.min, this.wheelOptions.wheelRounds.max);
            var backDegrees = Phaser.Math.Between(this.wheelOptions.backSpin.min, this.wheelOptions.backSpin.max);
            var degrees = 360 / this.wheelOptions.slices * item + Phaser.Math.Between(0, 29) + backDegrees;
            var duration1 = this.wheelOptions.rotationTime;
            var duration2 = 1500;
            this.tweenWheelFortune(rounds, degrees, backDegrees, duration1, duration2);
            if (this.freeTimeWheel > 0) {
                this.freeTimeWheel--;
                MainGame.freeTimeWheel = this.freeTimeWheel;
                MainGame.saveSaves()
            }
            if (this.freeTimeWheel < MainGame.maxTimeWheel && this.countDownNextFree <= 0) {
                this.countDownNextFree = this.TIME_NEXT_FREE
            }
            this.updateFortunaWheelWindow(this.countDownNextFree);
            break;
        case "reward_turbo2":
            this.activateTurbo(true);
            this.activateTurbo(true);
            break;
        case "turbo":
        case "reward_turbo":
            this.activateTurbo(true);
            break;
        case "coinsX2":
            this.amount_coins += this.value_offline_earning;
            var text_coins_warm = this.convertNumberFormat(this.amount_coins);
            this.textCoins.setText(text_coins_warm);
            this.updateShop(text_coins_warm);
            this.closeOfflineEarningWindow(true);
            break;
        case "freeCar":
            this.ALLOW_ADS_CAR = false;
            this.icon_adv.visible = false;
            if (this.num_ads_car > 0) {
                this.addBoxToBuffer(this.num_ads_car);
                this.updateShopItem();
                MainGame.Sfx.play("sound", "buy_car")
            }
            this.num_ads_car = 0;
            this.time.delayedCall(this.TIME_ADD_ADS_CAR, this.goAllowAdsCar, [], this);
            break;
        case "reward_helicopter":
            MainGame.prizeWinter = true;
            this.buttonHelipad.visible = true;
            MainGame.typeHelicopter = 1;
            this.updateSkinHelicopter();
            MainGame.saveSaves();
            break
        }
    }
    showAdsForFortunaWheel() {
        MainGame.isApiGameplayStop = true;
        MainGame.clickReward("reward_wheel");
        this.buttonFortunaWheel.setEnable(false)
    }
    showAdsForHelicopter() {
        MainGame.isApiGameplayStop = true;
        MainGame.clickReward("helicopter_coins");
        this.boostBtnAds.setEnable(false)
    }
    showAdsForTurbo() {
        MainGame.isApiGameplayStop = false;
        MainGame.clickReward("turbo");
        this.buttonActivateTurbo.setEnable(false)
    }
    showAdsForCoinsX2() {
        MainGame.isApiGameplayStop = true;
        MainGame.clickReward("coinsX2");
        this.offlineEarningBtnAds.setEnable(false)
    }
    showAdsForCar() {
        MainGame.clickReward("freeCar")
    }
    goAllowAdsCar() {
        if (this.nextCarLevel < 6)
            return;
        if (this.ALLOW_ADS_CAR)
            return;
        this.ALLOW_ADS_CAR = true;
        this.num_ads_car = this.nextCarLevel - 4;
        this.updateShopItem();
        this.icon_adv.visible = true
    }
    updateAdsCar() {
        if (this.ALLOW_ADS_CAR) {
            this.num_ads_car = this.nextCarLevel - 4;
            this.updateShopItem()
        }
    }
    clickShop() {
        this.isInputOverShopDown = false;
        this.layerShop.visible = true;
        this.disableMainButtons();
        this.updateShopItem();
        this.showBanner()
    }
    clickContinueUnlocked() {
        if (this.nextCarLevel > 3) {
            if (MainGame.isAPI)
                MainGame.API_POKI.commercialBreak()
        } else {
            if (MainGame.isApiGameplayStop) {
                if (MainGame.isAPI)
                    MainGame.API_POKI.gameplayStart();
                MainGame.isApiGameplayStop = false
            }
        }
        this.layerUnlocked.visible = false;
        this.layerMerge.visible = false;
        if (this.showAfterMerge) {
            this.time.delayedCall(150, this.showLevelUpWindow, [], this);
            this.showAfterMerge = false
        }
        this.enableMainButtons()
    }
    testAddBoxes() {
        this.addBoxToBuffer(2);
        this.addBoxToBuffer(2);
        this.addBoxToBuffer(2);
        this.addBoxToBuffer(2);
        this.saveBoxBuffer()
    }
    testCoinsHours(vCount) {
        if (!MainGame.isDebug)
            return;
        var total_speed = this.updateSpeed();
        var coins = vCount * 3600 * total_speed;
        var converted_value = this.convertNumberFormat(total_speed);
        this.amount_coins += coins;
        var text_coins_warm = this.convertNumberFormat(this.amount_coins);
        this.textCoins.setText(text_coins_warm);
        return "coins for " + vCount + "h : " + this.convertNumberFormat(coins)
    }
    testCarAds() {
        if (!MainGame.isDebug)
            return;
        var typeCar = this.nextCarLevel - 4;
        this.addObject({
            lvl: typeCar,
            fromShop: true
        }, true)
    }
    clickMuteSound() {
        MainGame.Sfx.play("sound", "click");
        MainGame.Sfx.manage("sound", "switch", this, this.buttonMuteSound.icon, this.buttonMuteSound.text)
    }
    clickMuteMusic() {
        MainGame.Sfx.play("sound", "click");
        MainGame.Sfx.manage("music", "switch", this, this.buttonMuteMusic.icon, this.buttonMuteMusic.text)
    }
}
var MyMath = {
    getRandomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min
    },
    getRandomBool: function() {
        return Math.random() < .5 ? true : false
    },
    randomChance: function(vValue) {
        return Math.random() < vValue
    },
    shuffleArr: function(o) {
        for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i),
        x = o[--i],
        o[i] = o[j],
        o[j] = x)
            ;
        return o
    },
    distanceTwoPoints: function(x1, x2, y1, y2) {
        var dx = x1 - x2;
        var dy = y1 - y2;
        return dx * dx + dy * dy
    },
    weightedRandom: function(prob) {
        let i, sum = 0, r = Math.random();
        for (i in prob) {
            sum += prob[i];
            if (r <= sum)
                return i
        }
    },
    parseQuery: function(qstr) {
        var query = {};
        var a = qstr.substr(1).split("&");
        for (var i = 0; i < a.length; i++) {
            var b = a[i].split("=");
            query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || "")
        }
        return query
    },
    lerp: function(in_Src, in_Dst, in_Ratio) {
        return in_Src * (1 - in_Ratio) + in_Dst * in_Ratio
    }
};
var config = {
    type: Phaser.AUTO,
    backgroundColor: 1317160,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
        parent: "game-container",
        width: 1024,
        height: 640,
        max: {
            width: 1400,
            height: 1024
        }
    },
    scene: [Boot, Preloader, Game]
};
const game = new Phaser.Game(config);
window.focus();
