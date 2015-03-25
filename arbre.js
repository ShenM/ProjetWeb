

var idOnglet = 0;

function createmenu(node)
{
    var tree = $("#tree").jstree(true);
    return {
        "item1":
                {
                    "label": "Create Directory",
                    "action": function()
                    {
                        node = tree.create_node(node);
                        tree.edit(node);
                    }
                },
        "item2":
                {
                    "label": "Create File",
                    "action": function()
                    {
                        node = tree.create_node(node, {"type": "file"});
                        tree.edit(node);
                    }
                },
        "item3":
                {
                    "label": "Rename",
                    "action": function(obj)
                    {
                        tree.edit(node);
                    }

                },
        "item4":
                {
                    "label": "Remove",
                    "action": function(obj)
                    {
                        tree.delete_node(node);
                        save();
                    }
                }
    };
}



function init()
{
    // initialisation de l'arbre
    $('#tree').jstree({
        'core': {
            "animation": 0,
            "check_callback": true,
            "themes": {"stripes": true},
            'data': {"url": "./root2.json", "dataType": "json"}// needed only if you do not supply JSON headers
        },
        "types": {
            "#": {"max_children": 1, "max_depth": 4, "valid_children": ["root"]},
            "root": {'icon': "./icons/folder.png", "valid_children": ["default"]},
            "default": {'icon': "./icons/folder.png", "valid_children": ["default", "file"]},
            "file": {'icon': "./icons/blog.png", "valid_children": []}
        },
        "plugins": ["contextmenu", "dnd", "state", "types", "wholerow"],
        "contextmenu": {"items": createmenu}
    });

    $("#tree").on('rename_node.jstree', function(e, data) {
        save();
    }).jstree();

    $("#tree").on('move_node.jstree', function(e, data) {
        save();
    }).jstree();/*
    $(".j").click(function(){
        $("#tabs>ul").append('<li><a href="#tabs-1">COUCOU</a></li>');
    }).jstree();*/
    $("#tree").on('select_node.jstree', function(e,data) {
        if (data.node.type==="file"){
            addOnglet(data.node.text);
        }
    });
}

function addOnglet(name){
    idOnglet++;
    $("#tabs>ul").append('<li><a href="#'+idOnglet+'">'+name+'</a></li>');
}



function save() {
    var x = $("#tree").data().jstree.get_json();
    x = "data=" + JSON.stringify(x);
    $("body").append(x);
    $.post("server_save.php", x);
}

$(function() {
    $("#accordion").accordion();
});
$(".selector").accordion({
    heightStyle: "fill"
});

$(function() {
    $("#tabs").tabs();
});

var oDoc, sDefTxt;

function initDoc() {
    oDoc = document.getElementById("textBox");
    sDefTxt = oDoc.innerHTML;
    if (document.compForm.switchMode.checked) {
        setDocMode(true);
    }
}

function formatDoc(sCmd, sValue) {
    if (validateMode()) {
        document.execCommand(sCmd, false, sValue);
        oDoc.focus();
    }
}

function validateMode() {
    if (!document.compForm.switchMode.checked) {
        return true;
    }
    alert("Uncheck \"Show HTML\".");
    oDoc.focus();
    return false;
}

function setDocMode(bToSource) {
    var oContent;
    if (bToSource) {
        oContent = document.createTextNode(oDoc.innerHTML);
        oDoc.innerHTML = "";
        var oPre = document.createElement("pre");
        oDoc.contentEditable = false;
        oPre.id = "sourceText";
        oPre.contentEditable = true;
        oPre.appendChild(oContent);
        oDoc.appendChild(oPre);
    } else {
        if (document.all) {
            oDoc.innerHTML = oDoc.innerText;
        } else {
            oContent = document.createRange();
            oContent.selectNodeContents(oDoc.firstChild);
            oDoc.innerHTML = oContent.toString();
        }
        oDoc.contentEditable = true;
    }
    oDoc.focus();
}

function printDoc() {
    if (!validateMode()) {
        return;
    }
    var oPrntWin = window.open("", "_blank", "width=450,height=470,left=400,top=100,menubar=yes,toolbar=no,location=no,scrollbars=yes");
    oPrntWin.document.open();
    oPrntWin.document.write("<!doctype html><html><head><title>Print<\/title><\/head><body onload=\"print();\">" + oDoc.innerHTML + "<\/body><\/html>");
    oPrntWin.document.close();
}

