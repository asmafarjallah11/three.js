var pako = require('pako');
import * as Three from 'three-full';

var filepath;
var extension;
var container, scriptsdiv;
var camera, scene, renderer, controls, object3d;
var vol_and_area;
var dimensions;
var scale;
var inputupload;
var returnVal;
var returnDim;
// mettre l'id du script
// le body contient seulement la div qui contient le script 
var mainuploadcomtainer = document.createElement('div');
mainuploadcomtainer.setAttribute('id', 'scriptmain');
document.body.appendChild(mainuploadcomtainer);
initupload();

function move(width) {
  var elem = document.getElementById("myBar");
  var progress = document.getElementById("myProgress");
  progress.style.display = "block";
  console.log(width);
  // var width = 10;
  var id = setInterval(frame, 10);

  function frame() {
    if (width >= 100) {
      clearInterval(id);
      elem.remove();
      progress.remove();
    } else {
      elem.style.width = width + '%';
      // elem.innerHTML = width * 1 + '%';
    }
  }
}
export function initupload() {
  localStorage.clear('file');
  var formupload = document.createElement('form');
  formupload.setAttribute('id', 'formupload');

  mainuploadcomtainer.appendChild(formupload);
  var x = document.createElement('div');
  x.setAttribute('class', "form-group");
  formupload.appendChild(x);
  inputupload = document.createElement('input');
  inputupload.setAttribute('id', 'fileinput');
  inputupload.setAttribute('type', 'file');
  //   inputupload.setAttribute('onchange', prepareuploadfile());
  inputupload.setAttribute('class', "form-control");
  x.appendChild(inputupload);
  //inputupload.addEventListener("change", prepareuploadfile());
  document.getElementById("fileinput").addEventListener("change", function () {
    prepareuploadfile();
  });

  var x = document.createElement('div');
  x.setAttribute('class', "form-group");
  formupload.appendChild(x);
  var inputreset = document.createElement('input');
  inputreset.setAttribute('id', 'restbtn');
  inputreset.setAttribute('type', 'input');
  inputreset.setAttribute('value', 'voir un autre fichier');
  inputreset.setAttribute('onclick', 'document.location.reload(true)');
  inputreset.setAttribute('class', "btn btn-secondary");

  x.appendChild(inputreset);

  var x = document.createElement('div');
  x.setAttribute('class', "form-group");
  formupload.appendChild(x);
  var myProgress = document.createElement('div');
  myProgress.setAttribute('id', 'myProgress');
  myProgress.style.width = "100%";
  myProgress.style.backgroundColor = "grey";
  myProgress.style.display = "none";
  var myBar = document.createElement('div');
  myBar.setAttribute('id', 'myBar');
  myBar.style.width = "1%";
  myBar.style.height = "15px";
  myBar.style.backgroundColor = "#0288d1";
  myProgress.appendChild(myBar);
  x.appendChild(myProgress);
}
export function prepareuploadfile() {
  var file = document.getElementById('fileinput').files[0];
  console.log("name : " + file.name);
  console.log("size : " + file.size);
  console.log("type : " + file.type);
  console.log("date : " + file.lastModified);
  var reader = new FileReader();
  reader.onload = function (event) {
    // The file's text will be printed here
    var filecontent = event.target.result;
    localStorage.clear('file');
    localStorage.setItem('file', filecontent);
    console.log(filecontent);
    initfbx(filecontent);
  };

  reader.readAsArrayBuffer(file);
}

function getextension(file) {
  console.log(file);
  var filename = file.name;
  var res = filename.split(".");
  var fext = res[res.length - 1];
  extension = fext;
  console.log(extension);
  return extension;
}

function calc_vol_and_area(geo) {
  var x1, x2, x3, y1, y2, y3, z1, z2, z3, i;
  var len = geo.faces.length;
  var totalVolume = 0;
  var totalArea = 0;
  var a, b, c, s;

  for (i = 0; i < len; i++) {
    x1 = geo.vertices[geo.faces[i].a].x;
    y1 = geo.vertices[geo.faces[i].a].y;
    z1 = geo.vertices[geo.faces[i].a].z;
    x2 = geo.vertices[geo.faces[i].b].x;
    y2 = geo.vertices[geo.faces[i].b].y;
    z2 = geo.vertices[geo.faces[i].b].z;
    x3 = geo.vertices[geo.faces[i].c].x;
    y3 = geo.vertices[geo.faces[i].c].y;
    z3 = geo.vertices[geo.faces[i].c].z;

    totalVolume +=
      (-x3 * y2 * z1 +
        x2 * y3 * z1 +
        x3 * y1 * z2 -
        x1 * y3 * z2 -
        x2 * y1 * z3 +
        x1 * y2 * z3);

    a = geo.vertices[geo.faces[i].a].distanceTo(geo.vertices[geo.faces[i].b]);
    b = geo.vertices[geo.faces[i].b].distanceTo(geo.vertices[geo.faces[i].c]);
    c = geo.vertices[geo.faces[i].c].distanceTo(geo.vertices[geo.faces[i].a]);
    s = (a + b + c) / 2;
    totalArea += Math.sqrt(s * (s - a) * (s - b) * (s - c));
  }

  return vol_and_area = [Math.abs(totalVolume / 6), totalArea];
}

function calc_dimensions(geo) {
  geo.computeBoundingBox();
  var xsize = geo.boundingBox.max.x - geo.boundingBox.min.x;
  var ysize = geo.boundingBox.max.y - geo.boundingBox.min.y;
  var zsize = geo.boundingBox.max.z - geo.boundingBox.min.z;
  return dimensions = [xsize, ysize, zsize];
}
export function init() {
  container = document.createElement('div');
  container.setAttribute('id', 'viewerbox');
  mainuploadcomtainer.appendChild(container);
  var viewer = document.getElementById("viewerbox");

  viewer.style.width = "800px";
  viewer.style.height = "500px";
  viewer.style.position = "relative";
  viewer.style.left = "15%";
  viewer.style.boxShadow = "3px 3px 3px 3px #bee5eb";
  viewer.style.border = "1px solid #007bff";
  viewer.style.borderradius = "25rem";
  viewer.style.float = "left";

  scriptsdiv = document.createElement('div');
  scriptsdiv.setAttribute('id', 'scriptsdiv');
  mainuploadcomtainer.appendChild(scriptsdiv);

  var x = document.createElement("script");
  console.log(window.location.href);
  x.setAttribute('src', '../node_modules/three/build/three.js');
  x.setAttribute('id', 'three');
  x.setAttribute('type', 'js');
  scriptsdiv.appendChild(x);
}

function displayinfos(returnVal, returnDim) { //console.log(returnVal);
  var table = document.createElement('table');
  table.setAttribute('id', 'tabinfo');
  var tr = table.appendChild(document.createElement('tr'));
  var td = tr.appendChild(document.createElement('td'));
  td.innerHTML = 'Volume';
  var td = tr.appendChild(document.createElement('td'));
  td.innerHTML = returnVal[0];
  var tr = table.appendChild(document.createElement('tr'));
  var td = tr.appendChild(document.createElement('td'));
  td.innerHTML = 'Surface';
  var td = tr.appendChild(document.createElement('td'));
  td.innerHTML = returnVal[1];

  var tr = table.appendChild(document.createElement('tr'));
  var td = tr.appendChild(document.createElement('td'));
  td.innerHTML = 'Xsize';
  var td = tr.appendChild(document.createElement('td'));
  td.innerHTML = returnDim[0];

  var tr = table.appendChild(document.createElement('tr'));
  var td = tr.appendChild(document.createElement('td'));
  td.innerHTML = 'Ysize';
  var td = tr.appendChild(document.createElement('td'));
  td.innerHTML = returnDim[1];

  var tr = table.appendChild(document.createElement('tr'));
  var td = tr.appendChild(document.createElement('td'));
  td.innerHTML = 'Zsize';
  var td = tr.appendChild(document.createElement('td'));
  td.innerHTML = returnDim[2];
  table.style.marginTop = '600px';
  table.style.marginLeft = '20%';
  table.style.width = '600px';
  table.classList.add('table');
  table.classList.add('table-striped');

  mainuploadcomtainer.appendChild(table);
}

function loadfile(extension, filecontent) {

  switch (extension.trim()) {
    case '3ds':
      var x = document.createElement("script");
      x.setAttribute('src', '../node_modules/three/src/examples/js/controls/TrackballControls.js');
      x.setAttribute('id', 'TrackballControls');
      x.async = true;
      x.charset = 'utf-8';
      document.getElementsByTagName('head')[0].appendChild(x);
      var x = document.createElement("script");
      x.setAttribute('src', '../node_modules/three/src/examples/js/loaders/TDSLoader.js');
      x.setAttribute('id', 'tdsscript');
      x.async = true;
      x.charset = 'utf-8';
      scriptsdiv.appendChild(x);
      setTimeout(function () {
        var x = document.createElement("script");
        x.setAttribute('src', '../node_modules/three/src/scenes/3dsscene.js');
        x.setAttribute('id', '3dsscene');
        x.setAttribute('type', 'js');
        x.async = true;
        x.charset = 'utf-8';
        container.appendChild(x);
        var x = document.createElement("input");
        x.setAttribute('type', 'button');
        x.setAttribute('onclick', 'inittds()');
        container.appendChild(x);
      }, 300);
      break;
    case "3mf":
      var x = document.createElement("script");
      x.setAttribute('src', 'examples/js/loaders/3MFLoader.js');
      x.setAttribute('id', '3mfscript');
      scriptsdiv.appendChild(x);
      var x = document.createElement("script");
      x.setAttribute('src', 'examples/js/Detector.js');
      x.setAttribute('id', 'Detector');
      scriptsdiv.appendChild(x);
      var x = document.createElement("script");
      x.setAttribute('src', 'examples/js/controls/OrbitControls.js');
      x.setAttribute('id', 'OrbitControls');
      scriptsdiv.appendChild(x);
      var x = document.createElement("script");
      x.setAttribute('src', 'examples/js/libs/jszip.min.js');
      x.setAttribute('id', 'jszip');
      scriptsdiv.appendChild(x);

      setTimeout(function () {
        var x = document.createElement("script");
        x.setAttribute('src', 'scenes/3mfscene.js');
        x.setAttribute('id', '3mfscene');
        scriptsdiv.appendChild(x);
      }, 500);


      break;
    case "amf":
      var x = document.createElement("script");
      x.setAttribute('src', 'examples/js/libs/jszip.min.js');
      x.setAttribute('id', 'jszip');
      scriptsdiv.appendChild(x);
      var x = document.createElement("script");
      x.setAttribute('src', 'examples/js/Detector.js');
      x.setAttribute('id', 'Detector');
      scriptsdiv.appendChild(x);
      var x = document.createElement("script");
      x.setAttribute('src', 'examples/js/controls/OrbitControls.js');
      x.setAttribute('id', 'OrbitControls');
      scriptsdiv.appendChild(x);
      var x = document.createElement("script");
      x.setAttribute('src', 'examples/js/loaders/AMFLoader.js');
      x.setAttribute('id', 'amfscript');
      scriptsdiv.appendChild(x);

      setTimeout(function () {
        var x = document.createElement("script");
        x.setAttribute('src', 'scenes/amfscene.js');
        x.setAttribute('id', 'amfscene');
        scriptsdiv.appendChild(x);
      }, 500);

      break;
    case "assimp":
      var x = document.createElement("script");
      x.setAttribute('src', 'examples/js/Detector.js');
      x.setAttribute('id', 'Detector');
      scriptsdiv.appendChild(x);
      var x = document.createElement("script");
      x.setAttribute('src', 'examples/js/controls/OrbitControls.js');
      x.setAttribute('id', 'OrbitControls');
      scriptsdiv.appendChild(x);
      var x = document.createElement("script");
      x.setAttribute('src', 'examples/js/loaders/AssimpLoader.js');
      x.setAttribute('id', 'assimpscript');
      scriptsdiv.appendChild(x);
      setTimeout(function () {
        var x = document.createElement("script");
        x.setAttribute('src', 'scenes/assimpscene.js');
        x.setAttribute('id', 'assimpscene');
        scriptsdiv.appendChild(x);
      }, 500);
      break;

    case "json":
      // assimp json 
      var x = document.createElement("script");
      x.setAttribute('src', 'examples/js/loaders/AssimpJSONLoader.js');
      x.setAttribute('id', 'assimpscript');
      scriptsdiv.appendChild(x);

      var x = document.createElement("script");
      x.setAttribute('src', 'examples/js/Detector.js');
      x.setAttribute('id', 'Detector');
      scriptsdiv.appendChild(x);

      setTimeout(function () {
        var x = document.createElement("script");
        x.setAttribute('src', 'scenes/assimpjsonscene.js');
        x.setAttribute('id', 'assimpjsonscene');
        scriptsdiv.appendChild(x);
      }, 300);
      break;

    case "awd":
      var x = document.createElement("script");
      x.setAttribute('src', 'examples/js/loaders/AWDLoader.js');
      x.setAttribute('id', 'AWDLoader');
      scriptsdiv.appendChild(x);
      var x = document.createElement("script");
      x.setAttribute('src', 'examples/js/controls/OrbitControls.js');
      x.setAttribute('id', 'OrbitControls');
      scriptsdiv.appendChild(x);
      var x = document.createElement("script");
      x.setAttribute('src', 'examples/js/Detector.js');
      x.setAttribute('id', 'Detector');
      scriptsdiv.appendChild(x);

      setTimeout(function () {
        var x = document.createElement("script");
        x.setAttribute('src', 'scenes/awdscene.js');
        x.setAttribute('id', 'awdscene');
        scriptsdiv.appendChild(x);
      }, 300);
      break;
    case "babylon":
      var x = document.createElement("script");
      x.setAttribute('src', 'examples/js/loaders/BabylonLoader.js');
      x.setAttribute('id', 'BabylonLoader');
      scriptsdiv.appendChild(x);
      var x = document.createElement("script");
      x.setAttribute('src', 'examples/js/controls/TrackballControls.js');
      x.setAttribute('id', 'TrackballControls');
      scriptsdiv.appendChild(x);
      setTimeout(function () {
        var x = document.createElement("script");
        x.setAttribute('src', 'scenes/babylonscene.js');
        x.setAttribute('id', 'babylonscene');
        scriptsdiv.appendChild(x);
      }, 300);
      break;
    case "dae":
      var x = document.createElement("script");
      x.setAttribute('src', 'examples/js/Detector.js');
      x.setAttribute('id', 'Detector');
      scriptsdiv.appendChild(x);
      var x = document.createElement("script");
      x.setAttribute('src', 'examples/js/loaders/ColladaLoader.js');
      x.setAttribute('id', 'collada');
      scriptsdiv.appendChild(x);

      setTimeout(function () {
        var x = document.createElement("script");
        x.setAttribute('src', 'scenes/colladascene.js');
        x.setAttribute('id', 'coll11adascene');
        container.appendChild(x);
      }, 300);
      break;
    case "ctm":
      var x = document.createElement("script");
      x.setAttribute('src', 'examples/js/loaders/ctm/lzma.js');
      x.setAttribute('id', 'lzma');
      scriptsdiv.appendChild(x);
      var x = document.createElement("script");
      x.setAttribute('src', 'examples/js/loaders/ctm/ctm.js');
      x.setAttribute('id', 'ctm');
      scriptsdiv.appendChild(x);
      var x = document.createElement("script");
      x.setAttribute('src', 'examples/js/loaders/ctm/CTMLoader.js');
      x.setAttribute('id', 'CTMLoader');
      scriptsdiv.appendChild(x);
      var x = document.createElement("script");
      x.setAttribute('src', 'examples/js/loaders/ctm/CTMLoader.js');
      x.setAttribute('id', 'CTMLoader');
      scriptsdiv.appendChild(x);
      var x = document.createElement("script");
      x.setAttribute('src', 'examples/js/Detector.js');
      x.setAttribute('id', 'Detector');
      scriptsdiv.appendChild(x);

      setTimeout(function () {
        var x = document.createElement("script");
        x.setAttribute('src', 'scenes/ctmscene.js');
        x.setAttribute('id', 'ctmscene');
        container.appendChild(x);
      }, 800);
      break;
    case "drc":
      var x = document.createElement("script");
      x.setAttribute('src', 'examples/js/loaders/DRACOLoader.js');
      x.setAttribute('id', 'DRACOLoader');
      scriptsdiv.appendChild(x);
      setTimeout(function () {
        var x = document.createElement("script");
        x.setAttribute('src', 'scenes/darcoscene.js');
        x.setAttribute('id', 'darcoscene');
        container.appendChild(x);
      }, 200);
      break;
    case "fbx":
      var x = document.createElement("script");
      x.setAttribute('src', 'examples/js/libs/inflate.min.js');
      x.setAttribute('id', 'inflate');
      scriptsdiv.appendChild(x);
      var x = document.createElement("script");
      x.setAttribute('src', 'examples/js/loaders/FBXLoader.js');
      x.setAttribute('id', 'FBXLoader');
      scriptsdiv.appendChild(x);
      var x = document.createElement("script");
      x.setAttribute('src', 'examples/js/controls/OrbitControls.js');
      x.setAttribute('id', 'OrbitControls');
      scriptsdiv.appendChild(x);
      var x = document.createElement("script");
      x.setAttribute('src', 'examples/js/Detector.js');
      x.setAttribute('id', 'Detector');
      scriptsdiv.appendChild(x);
      setTimeout(function () {
        var x = document.createElement("script");
        x.setAttribute('src', 'scenes/fbxscene.js');
        x.setAttribute('id', 'fbxscene');
        container.appendChild(x);
      }, 600);

      break;

    case "gltf":
      var x = document.createElement("script");
      x.setAttribute('src', 'examples/js/controls/OrbitControls.js');
      x.setAttribute('id', 'OrbitControls');
      scriptsdiv.appendChild(x);
      var x = document.createElement("script");
      x.setAttribute('src', 'examples/js/loaders/GLTFLoader.js');
      x.setAttribute('id', 'GLTFLoader');
      scriptsdiv.appendChild(x);
      var x = document.createElement("script");
      x.setAttribute('src', 'examples/js/Detector.js');
      x.setAttribute('id', 'Detector');
      scriptsdiv.appendChild(x);

      setTimeout(function () {
        var x = document.createElement("script");
        x.setAttribute('src', 'scenes/gltfscene.js');
        x.setAttribute('id', 'gltfscene');
        container.appendChild(x);
      }, 300);
      break;
    case "js":
      var x = document.createElement("script");
      x.setAttribute('src', 'examples/js/Detector.js');
      x.setAttribute('id', 'Detector');
      scriptsdiv.appendChild(x);

      setTimeout(function () {
        var x = document.createElement("script");
        x.setAttribute('src', 'scenes/jsscene.js');
        x.setAttribute('id', 'jsscene');
        container.appendChild(x);
      }, 150);

      break;
    case "kmz":
      var x = document.createElement("script");
      x.setAttribute('src', 'examples/js/Detector.js');
      x.setAttribute('id', 'Detector');
      scriptsdiv.appendChild(x);
      var x = document.createElement("script");
      x.setAttribute('src', 'examples/js/controls/OrbitControls.js');
      x.setAttribute('id', 'OrbitControls');
      scriptsdiv.appendChild(x);
      var x = document.createElement("script");
      x.setAttribute('src', 'examples/js/libs/jszip.min.js');
      x.setAttribute('id', 'jszip');
      scriptsdiv.appendChild(x);
      var x = document.createElement("script");
      x.setAttribute('src', 'examples/js/loaders/KMZLoader.js');
      x.setAttribute('id', 'KMZLoader');
      scriptsdiv.appendChild(x);
      var x = document.createElement("script");
      x.setAttribute('src', 'examples/js/loaders/ColladaLoader.js');
      x.setAttribute('id', 'ColladaLoader');
      scriptsdiv.appendChild(x);

      setTimeout(function () {
        var x = document.createElement("script");
        x.setAttribute('src', 'scenes/kmzscene.js');
        x.setAttribute('id', 'kmzscene');
        container.appendChild(x);
      }, 500);
      break;
    case "pmd":
      var x = document.createElement("script");
      x.setAttribute('src', 'examples/js/libs/mmdparser.min.js');
      x.setAttribute('id', 'mmdparser');
      scriptsdiv.appendChild(x);
      var x = document.createElement("script");
      x.setAttribute('src', 'examples/js/libs/ammo.js');
      x.setAttribute('id', 'ammo');
      scriptsdiv.appendChild(x);

      var x = document.createElement("script");
      x.setAttribute('src', 'examples/js/loaders/TGALoader.js');
      x.setAttribute('id', 'TGALoader');
      scriptsdiv.appendChild(x);
      var x = document.createElement("script");
      x.setAttribute('src', 'examples/js/loaders/MMDLoader.js');
      x.setAttribute('id', 'MMDLoader');
      scriptsdiv.appendChild(x);

      var x = document.createElement("script");
      x.setAttribute('src', 'examples/js/effects/OutlineEffect.js');
      x.setAttribute('id', 'OutlineEffect');
      scriptsdiv.appendChild(x);
      var x = document.createElement("script");
      x.setAttribute('src', 'examples/js/animation/CCDIKSolver.js');
      x.setAttribute('id', 'CCDIKSolver');
      scriptsdiv.appendChild(x);
      var x = document.createElement("script");
      x.setAttribute('src', 'examples/js/animation/MMDPhysics.js');
      x.setAttribute('id', 'MMDPhysics');
      scriptsdiv.appendChild(x);

      var x = document.createElement("script");
      x.setAttribute('src', 'examples/js/Detector.js');
      x.setAttribute('id', 'Detector');
      scriptsdiv.appendChild(x);

      setTimeout(function () {
        var x = document.createElement("script");
        x.setAttribute('src', 'scenes/pmdscene.js');
        x.setAttribute('id', 'pmdscene');
        container.appendChild(x);
      }, 900);
      break;

    case "obj":
      var x = document.createElement("script");
      x.setAttribute('src', 'examples/js/loaders/OBJLoader.js');
      x.setAttribute('id', 'OBJLoader');
      scriptsdiv.appendChild(x);

      setTimeout(function () {
        var x = document.createElement("script");
        x.setAttribute('src', 'scenes/objscene.js');
        x.setAttribute('id', 'objscene');
        container.appendChild(x);
      }, 200);
      break;

    case "ply":
      var x = document.createElement("script");
      x.setAttribute('src', 'examples/js/loaders/PLYLoader.js');
      x.setAttribute('id', 'PLYLoader');
      scriptsdiv.appendChild(x);
      var x = document.createElement("script");
      x.setAttribute('src', 'examples/js/Detector.js');
      x.setAttribute('id', 'Detector');
      scriptsdiv.appendChild(x);
      setTimeout(function () {
        var x = document.createElement("script");
        x.setAttribute('src', 'scenes/plyscene.js');
        x.setAttribute('id', 'plyscene');
        container.appendChild(x);
      }, 300);
      break;
    case "prwm":
      var x = document.createElement("script");
      x.setAttribute('src', 'examples/js/loaders/PRWMLoader.js');
      x.setAttribute('id', 'PRWMLoader');
      scriptsdiv.appendChild(x);
      setTimeout(function () {
        var x = document.createElement("script");
        x.setAttribute('src', 'scenes/prwmscene.js');
        x.setAttribute('id', 'prwmscene');
        container.appendChild(x);
      }, 300);
      break;
    case "STL":
      var x = document.createElement("script");
      x.setAttribute('src', 'examples/js/loaders/STLLoader.js');
      x.setAttribute('id', 'STLLoader');
      scriptsdiv.appendChild(x);
      var x = document.createElement("script");
      x.setAttribute('src', 'examples/js/Detector.js');
      x.setAttribute('id', 'Detector');
      scriptsdiv.appendChild(x);
      setTimeout(function () {
        var x = document.createElement("script");
        x.setAttribute('src', 'scenes/stlscene.js');
        x.setAttribute('id', 'stlscene');
        container.appendChild(x);
      }, 300);
      break;
    case "stl":
      var x = document.createElement("script");
      x.setAttribute('src', 'examples/js/loaders/STLLoader.js');
      x.setAttribute('id', 'STLLoader');
      scriptsdiv.appendChild(x);
      var x = document.createElement("script");
      x.setAttribute('src', 'examples/js/Detector.js');
      x.setAttribute('id', 'Detector');
      scriptsdiv.appendChild(x);
      setTimeout(function () {
        var x = document.createElement("script");
        x.setAttribute('src', 'scenes/stlscene.js');
        x.setAttribute('id', 'stlscene');
        container.appendChild(x);
      }, 300);
      break;
    case "wrl":
      var x = document.createElement("script");
      x.setAttribute('src', 'examples/js/controls/OrbitControls.js');
      x.setAttribute('id', 'OrbitControls');
      scriptsdiv.appendChild(x);
      var x = document.createElement("script");
      x.setAttribute('src', 'examples/js/loaders/VRMLLoader.js');
      x.setAttribute('id', 'VRMLLoader');
      scriptsdiv.appendChild(x);
      var x = document.createElement("script");
      x.setAttribute('src', 'examples/js/Detector.js');
      x.setAttribute('id', 'Detector');
      scriptsdiv.appendChild(x);

      setTimeout(function () {
        var x = document.createElement("script");
        x.setAttribute('src', 'scenes/vrmlscene.js');
        x.setAttribute('id', 'vrmlscene');
        container.appendChild(x);
      }, 400);
      break;
    default:
      var text = "I have never heard of that fruit...";
      //   alert(extension);
  }
}

function GetInfos() {
  return [returnVal, returnDim];
}

function getScaledInfo() {
  return [(returnVal[0]) * Math.pow(scale, 3), returnVal[1] * Math.pow(scale, 2),
    returnDim[0] * scale,
    returnDim[1] * scale,
    returnDim[2] * scale,
  ];
}

function setScale(pScale) {
  scale = pScale;
}

function setElementsWithInfos(manager) {

  manager.onLoad = function () {
    console.log('Loading complete!');
    displayinfos(returnVal, returnDim);
    console.log(GetInfos());
  };
}

function initfbx(path) {
  camera = new Three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
  camera.position.set(100, 200, 300);

  controls = new Three.OrbitControls(camera);
  controls.target.set(0, 100, 0);
  controls.update();

  scene = new Three.Scene();
  scene.background = new Three.Color(0xa0a0a0);
  scene.fog = new Three.Fog(0xa0a0a0, 200, 1000);

  var light = new Three.HemisphereLight(0xffffff, 0x444444);
  light.position.set(0, 200, 0);
  scene.add(light);

  // scene.add( new THREE.CameraHelper( light.shadow.camera ) );
  // ground
  var mesh = new Three.Mesh(new Three.PlaneGeometry(2000, 2000), new Three.MeshPhongMaterial({
    color: 0x999999,
    depthWrite: false
  }));
  mesh.rotation.x = -Math.PI / 2;
  mesh.receiveShadow = true;
  scene.add(mesh);

  var grid = new Three.GridHelper(2000, 20, 0x000000, 0x000000);
  grid.material.opacity = 0.2;
  grid.material.transparent = true;
  scene.add(grid);

  // model
  const loader = new Three.FBXLoader();
  var volume = 0;
  var surface = 0;
  console.log(`im heeeeere fbx`);
  object3d = loader.parse(path);
  console.log(object3d);
  scene.add(object3d);
  //traversing the object
  object3d.traverse(function (child) {
    if (child.isSkinnedMesh) {
      console.log(child);
      console.log(child.geometry);
      child.castShadow = true;
      child.receiveShadow = true;

      var geo = new Three.Geometry().fromBufferGeometry(child.geometry);
      console.log(geo);
      var volumeg = calc_vol_and_area(geo);
      console.log(volumeg);
      volume = volume + volumeg[0];
      console.log(volume);
      surface = surface + volumeg[1];
      console.log(surface);
      returnVal = [volume, surface];
      console.log(volume);
      var dim = calc_dimensions(geo);
      console.log(dim);
      returnDim = dim;
      console.log(returnDim);
      displayinfos(returnVal, returnDim);
    }
  });
  container = document.getElementById("viewerbox");
  renderer = new Three.WebGLRenderer({
    antialias: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.gammaInput = true;
  renderer.gammaOutput = true;
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);
}
