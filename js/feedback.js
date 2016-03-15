'use strict';

function getFeedback() {
    $.get("getFeedback.php", function (data) {
        if (data.length > 0) {
            var fbCont = document.getElementById('FeedbackContainer');
            fbCont.innerHTML = "";
            for (var i = 0; i < data.length; ++i) {
                fbCont.appendChild(buildFbBox(data[i]));
            }
        }
    }, "json");
}

function toggleStar(fbId) {
    var action = hasLiked(fbId) ? "removeLike" : "addLike";
    $('#fbBox_' + fbId + ' .fbLike').prop("disabled", true);
    $('#fbBox_' + fbId + ' .fbLike .glyphicon').removeClass().addClass('glyphicon glyphicon-refresh spinning');
    $.post("updateFeedback.php", {action: action, id: fbId}, function (data) {
        if (data.status && data.status == "OK") {
            if (action === "addLike") {
                setCookie("likedFB_" + fbId, 1);
                $('#fbBox_' + fbId + ' .fbLike .glyphicon').removeClass().addClass('glyphicon glyphicon-star');
                $('#fbBox_' + fbId + ' .fbLike').prop("disabled", false);
            } else {
                setCookie("likedFB_" + fbId, -1);
                $('#fbBox_' + fbId + ' .fbLike .glyphicon').removeClass().addClass('glyphicon glyphicon-star-empty');
                $('#fbBox_' + fbId + ' .fbLike').prop("disabled", false);
            }
            $('#fbBox_' + fbId + ' .fbLikeCount').text(data.newCount);
        } else {
            $('#fbBox_' + fbId + ' .fbLike .glyphicon').removeClass().addClass('glyphicon glyphicon-warning-sign');
        }
    }, "json");
}

function hasLiked(fbId) {
    return getCookie("likedFB_" + fbId, 0) > 0;
}

function buildFbBox(fbData) {
    var fbBox = document.createElement('div');
    fbBox.className = "fbBox panel panel-default";
    fbBox.id = "fbBox_" + fbData.Id;
    //$(fbBox).data("fbId", fbData.Id);

    var fbBoxHead = document.createElement('div');
    fbBoxHead.className = "panel-heading";

    var fbFrom = document.createElement('span');
    fbFrom.textContent = fbData.From;

    var fbTagContainer = document.createElement('span');
    fbTagContainer.className = "pull-right";

    var fbType = document.createElement('span');
    fbType.className = "label label-default";
    fbType.textContent = fbData.Type;

    var fbTags = document.createElement('span');
    fbTags.innerHTML = fbData.Tags;

    var fbBoxBody = document.createElement('div');
    fbBoxBody.className = "panel-body";

    var fbMessage = document.createElement('span');
    fbMessage.textContent = fbData.Message;

    var fbLikesBtn = document.createElement('button');
    fbLikesBtn.className = "fbLike btn btn-default pull-right";
    fbLikesBtn.addEventListener("click", function () {
        toggleStar(fbData.Id);
    });

    var fbLikesCount = document.createElement('span');
    fbLikesCount.className = "fbLikeCount";
    fbLikesCount.textContent = fbData.Likes;

    var fbLikesIcon = document.createElement('span');
    fbLikesIcon.className = "glyphicon " + (hasLiked(fbData.Id) ? "glyphicon-star" : "glyphicon-star-empty");

    fbLikesBtn.appendChild(fbLikesCount);
    fbLikesBtn.appendChild(fbLikesIcon);

    fbBoxBody.appendChild(fbMessage);
    fbBoxBody.appendChild(fbLikesBtn);

    fbTagContainer.appendChild(fbType);
    fbTagContainer.appendChild(fbTags);

    fbBoxHead.appendChild(fbFrom);
    fbBoxHead.appendChild(fbTagContainer);

    fbBox.appendChild(fbBoxHead);
    fbBox.appendChild(fbBoxBody);

    return fbBox;
}

function submitFeedback() {

    var form = $("#fbAddForm form");
    var btn = $("#fbAddForm button[type=submit]");
    btn.prop("disabled", true);
    btn.html("<span class='glyphicon glyphicon-refresh spinning'></span>Submit");
    $('#fbIncompleteErr').hide();

    $.ajax({
        type: "POST",
        url: "postFeedback.php",
        data: form.serialize(),
        dataType: "json",
        success: function (data) {
            if (typeof data.status !== 'undefined') {
                if (data.status == "OK") {
                    btn.prop("disabled", false);
                    btn.html("Submit");
                    $("#fbAddForm").collapse("hide");
                    getFeedback();
                } else if (data.status == "ERROR" && data.error == "incomplete") {
                    btn.prop("disabled", false);
                    btn.html("Submit");
                    $('#fbIncompleteErr').show();
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