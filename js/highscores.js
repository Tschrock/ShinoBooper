'use strict';

var hsHighlightId = -1;

function getHighscores() {
    $.get("getHighscores.php", function (data) {
        if (data.length > 0) {
//            $('#HighscoresContainer td').parent().remove();
            $('#HighscoresContainer').html("");
            var hsCont = $('#HighscoresContainer').get(0);
            
            data.splice(0,0, {Id: -2, Rank: "<h3>Rank</h3>", Name: "<h3>Name</h3>", Boops: "<h3>Boops</h3>", Bps: "<h3>Bps</h3>", Date: "<h3>Date</h3>"})
            
            for (var i = 0; i < data.length; ++i) {
//                var row = hsCont.insertRow(-1);
//                row.insertCell(-1).textContent = data[i].Rank;
//                row.insertCell(-1).textContent = data[i].Name;
//                row.insertCell(-1).textContent = data[i].Boops;
//                row.insertCell(-1).textContent = data[i].Bps;
//                row.insertCell(-1).textContent = data[i].Date;
                hsCont.appendChild(buildHsBox(data[i]));
            }
            $("#hsBox_" + hsHighlightId).addClass("success");
        }
    }, "json");
}

function buildHsBox(hsData) {
    var hsBox = document.createElement('div');
    hsBox.className = "hsBox row";
    hsBox.id = "hsBox_" + hsData.Id;
    
    var hsRank = document.createElement('div');
    hsRank.className = "col-xs-2";
    hsRank.innerHTML = hsData.Rank;
    
    var hsName = document.createElement('div');
    hsName.className = "col-xs-3";
    hsName.innerHTML = hsData.Name;
    
    var hsBoops = document.createElement('div');
    hsBoops.className = "col-xs-2";
    hsBoops.innerHTML = hsData.Boops;
    
    var hsBps = document.createElement('div');
    hsBps.className = "col-xs-2";
    hsBps.innerHTML = hsData.Bps;
    
    var hsDate = document.createElement('div');
    hsDate.className = "col-xs-3";
    hsDate.innerHTML = hsData.Date;
    
    hsBox.appendChild(hsRank);
    hsBox.appendChild(hsName);
    hsBox.appendChild(hsBoops);
    hsBox.appendChild(hsBps);
    hsBox.appendChild(hsDate);
    
    return hsBox;
}

function submitHighscores() {

    var form = $("#hsAddForm form");
    var btn = $("#hsAddForm button[type=submit]");
    btn.prop("disabled", true);
    btn.html("<span class='glyphicon glyphicon-refresh spinning'></span>Submit");
    $('#hsIncompleteErr').hide();

    var fData = form.serialize();
    fData += "&Boops=" + Math.floor(boops);
    fData += "&HBoops=" + Math.floor(hboops);
    fData += "&Bps=" + factoryBPS;

    $.ajax({
        type: "POST",
        url: "postHighscore.php",
        data: fData,
        dataType: "json",
        success: function (data) {
            if (typeof data.status !== 'undefined') {
                if (data.status == "OK") {
                    btn.prop("disabled", false);
                    btn.html("Submit");
                    $("#hsAddForm").collapse("hide");
                    getHighscores();
                    $(".hsBox").removeClass("success");
                    hsHighlightId = data.newId;
                } else if (data.status == "ERROR" && data.error == "incomplete") {
                    btn.prop("disabled", false);
                    btn.html("Submit");
                    $('#hsIncompleteErr').show();
                } else {
                    btn.html("<span class='glyphicon glyphicon-warning-sign'></span>Submit");
                }
            } else {
                btn.html("<span class='glyphicon glyphicon-warning-sign'></span>Submit");
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            btn.html("<span class='glyphicon glyphicon-warning-sign'></span>Submit");
        }
    });

}