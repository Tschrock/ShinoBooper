'use strict';

var storageVersion = "v0.6";
var factories;
var boops = 0;
var hboops = 0;
var factoryBPS = 0;
var boopHistory = [[0, 0]];

function onShinoBooped() {
    boops++;
    hboops++;
    updateTotal();
    renderHeart("");
}
function updateTotal() {
    $(".counter-totalBoops").text(Math.floor(boops));
}
function updateBps() {
    boopHistory.push([Date.now(), hboops]);
    if (boopHistory.length > 5) {
        boopHistory.shift();
    }
    $(".counter-bps").text((Math.round((boopHistory[boopHistory.length - 1][1] - boopHistory[0][1]) / ((boopHistory[boopHistory.length - 1][0] - boopHistory[0][0]) / 1000))) + factoryBPS);
}
function renderHeart(txt, extraclass) {
    var hdiv = document.createElement("div");
    var heart = document.createElement("img");
    heart.src = "/img/heartif.png";
    hdiv.className = "heart " + extraclass;
    hdiv.style.top = (150 + (Math.floor(Math.random() * 50) - 100)) + "px";
    hdiv.style.left = (303 + (Math.floor(Math.random() * 100) - 200)) + "px";
    hdiv.addEventListener("animationend", removeHeart);
    hdiv.addEventListener("webkitAnimationEnd", removeHeart);
    hdiv.appendChild(heart);
    hdiv.appendChild(document.createTextNode(txt || ""));
    $("#shino").append(hdiv);
}
function removeHeart() {
    $(this).remove();
}
function init() {
    
    $("#mFeedback").on('show.bs.modal', function () {
        window.location.hash = "#Feedback";
        document.getElementById('FeedbackContainer').innerHTML = '<div class="text-center" style="margin: 75px 0;"><span class="glyphicon glyphicon-refresh loading"></span></div>';
    });
    $("#mFeedback").on('shown.bs.modal', function () {
        getFeedback();
    });
    $("#mFeedback").on('hide.bs.modal', function () {
        window.location.hash = "#";
    });
    
    if(window.location.hash.toLowerCase() == "#feedback") {
        $("#mFeedback").modal();
    }
    
    $("#mHighscores").on('show.bs.modal', function () {
        window.location.hash = "#Highscores";
        document.getElementById('HighscoresContainer').innerHTML = '<div class="text-center" style="margin: 75px 0;"><span class="glyphicon glyphicon-refresh loading"></span></div>';
    });
    $("#mHighscores").on('shown.bs.modal', function () {
        getHighscores();
    });
    $("#mHighscores").on('hide.bs.modal', function () {
        window.location.hash = "#";
    });
    
    if(window.location.hash.toLowerCase() == "#highscores") {
        $("#mHighscores").modal();
    }
    
    factories = [{
            name: "Chiras",
            id: "Chiras",
            iconSrc: "/img/chira.png",
            getBaseBPS: function () {
                return 2;
            },
            getAdjustedBPS: function () {
                return this.getBaseBPS();
            },
            getFinalBPS: function () {
                return this.getAdjustedBPS() * this.quantity;
            },
            getBaseCost: function () {
                return 80;
            },
            getCost: function () {
                return this.getBaseCost() + Math.ceil((this.quantity * this.quantity) / 1);
            },
            isDisabled: function () {
                return false;
            },
            quantity: 0,
            unlocked: true
        },
        {
            name: "Aggies",
            id: "Aggies",
            iconSrc: "/img/aggie.png",
            getBaseBPS: function () {
                return 5;
            },
            getAdjustedBPS: function () {
                return this.getBaseBPS();
            },
            getFinalBPS: function () {
                return this.getAdjustedBPS() * this.quantity;
            },
            getBaseCost: function () {
                return 500;
            },
            getCost: function () {
                return this.getBaseCost() + Math.ceil((this.quantity * this.quantity) * 5);
            },
            isDisabled: function () {
                return false;
            },
            quantity: 0,
            unlocked: false
        },
        {
            name: "Shino Clones",
            id: "Shino_Clones",
            iconSrc: "/img/shino_yes_cookies.png",
            getBaseBPS: function () {
                return 7;
            },
            getAdjustedBPS: function () {
                return this.getBaseBPS();
            },
            getFinalBPS: function () {
                return this.getAdjustedBPS() * this.quantity;
            },
            getBaseCost: function () {
                return 2000;
            },
            getCost: function () {
                return this.getBaseCost() + Math.ceil((this.quantity * this.quantity) * 20);
            },
            isDisabled: function () {
                return false;
            },
            quantity: 0,
            unlocked: false
        }
    ];

    for (var i = 0; i < factories.length; i++) {
        $("#factories").append(generateFactoryBlock(i, factories[i]));
    }

    $(document).on("click", ".factory .add", function () {
        var fid = $(this).parents(".factory").data("factoryid");
        if (fid !== undefined && factories[fid].getCost() <= boops) {
            boops -= factories[fid].getCost();
            factories[fid].quantity++;
            updateFactoryBlocksInfo();
        }
    });
    $(document).on("click", ".factory .del", function () {
        var fid = $(this).parents(".factory").data("factoryid");
        if (fid !== undefined && factories[fid].quantity > 0) {
            boops += factories[fid].getCost() * 0.8;
            factories[fid].quantity--;
            updateFactoryBlocksInfo();
        }
    });

    loadProgress();
    updateFactoryBlocksInfo();
    window.setInterval(updateBps, 200);
    window.setInterval(addBoops, 200);
    window.setInterval(saveProgress, 3 * 60 * 1000); //autosave progress every 3 min.
    
}

var lastBoopUpdateTime = Date.now();
function addBoops() {
    var fBPS = 0;
    for (var i = 0; i < factories.length; i++) {
        fBPS += factories[i].getFinalBPS();
    }
    var currBoopUpdateTime = Date.now();
    var msecDiff = currBoopUpdateTime - lastBoopUpdateTime;
    var factboops = (fBPS / 1000) * msecDiff;
    boops += factboops;
    lastBoopUpdateTime = currBoopUpdateTime;
    factoryBPS = fBPS;
    updateTotal();
}

function updateFactoryBlocksInfo() {
    for (var i = 0; i < factories.length; i++) {
        $("#factory" + i + " .name").text(factories[i].name + (factories[i].quantity > 0 ? (" (" + factories[i].quantity + ")") : ""));
        $("#factory" + i + " .bps").text("BPS: " + factories[i].getAdjustedBPS());
        $("#factory" + i + " .cost").text("Cost: " + factories[i].getCost());
        $("#factory" + i).toggleClass("locked", !factories[i].unlocked);
        if (factories[i].quantity >= 5 && factories[i + 1] !== undefined) {
            factories[i + 1].unlocked = true;
        }
    }
}

function genUdateableText(id, classes, initText) {
    var txt = document.createElement("span");
    txt.id = id;
    txt.className = classes;
    txt.appendChild(document.createTextNode(initText));
    return txt;
}
function genClassedElement(element, classes) {
    var div = document.createElement(element);
    div.className = classes;
    return div;
}
function genImg(src, alt) {
    var img = document.createElement("img");
    img.src = src;
    img.alt = alt;
    return img;
}

function generateFactoryBlock(id, factory) {
    var fact = genClassedElement("div", "factory" + (factory.isDisabled() ? " dissabled" : (factory.unlocked ? "" : " locked")));
    fact.id = "factory" + id;
    fact.appendChild(genImg(factory.iconSrc, factory.name));
    var head = document.createElement("h3");
    head.appendChild(genUdateableText("", "add pull-left", "+"));
    head.appendChild(genUdateableText("", "name", factory.name));
    head.appendChild(genUdateableText("", "del pull-right", "-"));
    fact.appendChild(head);
    var stats = genClassedElement("div", "stats col-lg-3");
    stats.appendChild(genUdateableText("", "bps", "BPS: " + factory.getAdjustedBPS()));
    stats.appendChild(document.createElement("br"));
    stats.appendChild(genUdateableText("", "cost", "Cost: " + factory.getCost()));
    fact.appendChild(stats);
    fact.appendChild(genClassedElement("div", "overlay"));
    fact.appendChild(genClassedElement("div", "clearfix"));
    $(fact).data("factoryid", id);
    return fact;
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname, cdefault) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ')
            c = c.substring(1);
        if (c.indexOf(name) === 0)
            return c.substring(name.length, c.length);
    }
    return typeof cdefault !== 'undefined' ? cdefault : "";
}

function saveProgress() {
    setCookie("version", storageVersion);
    setCookie("boops", boops);
    setCookie("hboops", hboops);

    var factSave = [];
    for (var i = 0; i < factories.length; i++) {
        factSave.push(factories[i].id + ", " + factories[i].quantity);
    }
    setCookie("factSave", factSave.join("|"));
    toastr.success("Saved progress.");
}

function loadProgress() {
    if (getCookie("version") === "") {

    } else {
        if (getCookie("version") !== storageVersion) {
            if (confirm("Your saved data is from a different version! This might cause problems. Do you want to try loading it anyway?")) {
                setCookie("version", storageVersion);
            } else {
                saveProgress();
                return;
            }
        }
        boops = (getCookie("boops") || 0) * 1;
        hboops = (getCookie("hboops") || 0) * 1;
        var factSave = getCookie("factSave").split("|");
        for (var i = 0; i < factSave.length; i++) {
            var factory, factInfo = factSave[i].split(",");
            if ((factory = getFactoryById(factInfo[0])) !== undefined) {
                factory.quantity = factInfo[1] * 1;
            }
        }
        toastr.success("Loaded progress.");
    }
}

function clearProgress() {
    if (confirm("Are you sure you want to clear your progress?")) {
        for (var i = 0; i < factories.length; i++) {
            factories[i].quantity = 0;
        }
        boops = 0;
        hboops = 0;
        saveProgress();
        setCookie("version", "");
        updateFactoryBlocksInfo();
    }
}

function getFactoryById(id) {
    for (var i = 0; i < factories.length; i++) {
        if (factories[i].id === id) {
            return factories[i];
        }
    }
    return undefined;
}