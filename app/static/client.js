var el = x => document.getElementById(x);

function showPicker() {
  el("file-input").click();
}

function showPicked(input) {
  el("upload-label").innerHTML = input.files[0].name;
  var reader = new FileReader();

  var resize_width = 800;//without px
  var item = input.files[0];

  reader.onload = function(e) {
  	var img = new Image();//create a image
    img.src = e.target.result;//result is base64-encoded Data URI
    img.name = e.target.name;//set name (optional)
    img.size = e.target.size;//set size (optional)
    img.onload = function(elx) {
      var elem = document.createElement('canvas');//create a canvas
      //scale the image to resize_width and keep aspect ratio
      var scaleFactor = resize_width / elx.target.width;
      elem.width = resize_width;
      elem.height = elx.target.height * scaleFactor;
      //draw in canvas
      var ctx = elem.getContext('2d');
      ctx.drawImage(elx.target, 0, 0, elem.width, elem.height);
      //get the base64-encoded Data URI from the resize image
      var srcEncoded = ctx.canvas.toDataURL(elx.target, 'image/jpeg', 0);

      el("image-picked").src = srcEncoded;
      el("image-picked").className = "";

      //assign it to thumb src
      //document.querySelector('#image').src = srcEncoded;

      /*Now you can send "srcEncoded" to the server and
      convert it to a png o jpg. Also can send
      "el.target.name" that is the file's name.*/

    }

    //el("image-picked").src = e.target.result;
    //el("image-picked").src = srcEncoded;
    //el("image-picked").className = "";
  };
  reader.readAsDataURL(input.files[0]);
}

function analyze() {
  //var uploadFiles = el("file-input").files;
  var uploadFiles = el("image-picked").src
  //if (uploadFiles.length !== 1) alert("Please select a file to analyze!");

  el("analyze-button").innerHTML = "Analyzing...";
  var xhr = new XMLHttpRequest();
  var loc = window.location;
  xhr.open("POST", `${loc.protocol}//${loc.hostname}:${loc.port}/analyze`,
    true);
  xhr.onerror = function() {
    alert(xhr.responseText);
  };
  xhr.onload = function(e) {
    if (this.readyState === 4) {
      var response = JSON.parse(e.target.responseText);
      el("result-label").innerHTML = `It's probably a ${response["result"]}!`;
    }
    el("analyze-button").innerHTML = "Analyze";
  };

  var fileData = new FormData();
  //fileData.append("file", uploadFiles[0]);
  fileData.append("file", uploadFiles);
  xhr.send(fileData);
}

