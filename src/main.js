var pako = require('pako');
import * as Three from 'three-full';
import {
  LoaderUtils
}
from 'three-full';


var extension;
var container, scriptsdiv;
var camera, scene, renderer, controls, object3d;
var vol_and_area;
var dimensions;
var scale;
var inputupload;
var returnVal;
var returnDim;
var ModelToReturn;
var CameraToReturn;
var gltfobject = null;
var reader = new FileReader();

var mainuploadcomtainer = document.getElementById('scriptmain');

export function initupload() {
  if (localStorage.getItem('file') != undefined) {
    if (localStorage.getItem('file') != null) {
      // localStorage.removeItem('file');
    }
  }
  var formupload = document.createElement('form');
  formupload.setAttribute('id', 'formupload');

  mainuploadcomtainer.appendChild(formupload);
  var x = document.createElement('div');
  x.setAttribute('class', "form-group");
  formupload.appendChild(x);
/*   inputupload = document.createElement('input');
  inputupload.setAttribute('id', 'fileinput');
  inputupload.setAttribute('type', 'file');

  inputupload.setAttribute('class', "form-control");
  x.appendChild(inputupload); */
  if (document.getElementById("fileinput") != null) {
    document.getElementById("fileinput").addEventListener("change", function () {
      initViewerandScripts();
      prepareuploadfile();
    });
  }
  var x = document.createElement('div');
  x.setAttribute('class', "form-group");
  formupload.appendChild(x);
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
  localStorage.setItem('filename', file.name);
  loadfile(getextension(file), file);
}

function getextension(file) {
  var filename = file.name;
  var res = filename.split(".");
  var fext = res[res.length - 1];
  extension = fext;
  return extension;
}

function initViewerandScripts() {
  mainuploadcomtainer = document.getElementById('scriptmain');
  var initviewer = document.getElementById("viewerbox");
  if (initviewer == null || initviewer == undefined) {
    container = document.createElement('div');
    container.setAttribute('id', 'viewerbox');
    mainuploadcomtainer.appendChild(container);
  }
  var viewer = document.getElementById("viewerbox");

  viewer.style.width = "95%";
  viewer.style.height = "500px";
  viewer.style.background = '#f8f9fa'
  viewer.style.position = "relative";
  viewer.style.left = "1%";
  viewer.style.boxShadow = "3px 3px 3px 3px #7776ac";
  viewer.style.border = "1px solid #6f42c1";
  viewer.style.borderradius = "25rem";
  viewer.style.float = "left";

  scriptsdiv = document.createElement('div');
  scriptsdiv.setAttribute('id', 'scriptsdiv');
  mainuploadcomtainer.appendChild(scriptsdiv);

  var x = document.createElement("script");
  x.setAttribute('src', '../node_modules/three/build/three.js');
  x.setAttribute('id', 'three');
  x.setAttribute('type', 'js');
  scriptsdiv.appendChild(x);
}

export function init() {
  if (mainuploadcomtainer == null || mainuploadcomtainer == undefined)
    mainuploadcomtainer = document.getElementById('scriptmain');
  initViewerandScripts();
  initupload();
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

export function displayinfos(returnVal, returnDim) {
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
  table.style.marginTop = '20px';
  table.style.marginLeft = '10%';
  table.style.width = '600px';
  table.classList.add('table');
  table.classList.add('table-striped');

  mainuploadcomtainer.appendChild(table);
}

function loadfile(extension, file) {
  var filecontent;
  localStorage.setItem('fileastext', file);
  switch (extension.trim()) {
    case '3ds':
      reader.onload = function (event) {

        filecontent = event.target.result;
        if (localStorage.getItem('file') != undefined) {
          if (localStorage.getItem('file') != null) {
            localStorage.setItem('file', "");
          }
        }
        localStorage.setItem('file', filecontent);
        ModelToReturn = inittds(filecontent);

      };
      reader.readAsArrayBuffer(file);
      break;

    case "3mf":
      reader.onload = function (event) {

        filecontent = event.target.result;
        if (localStorage.getItem('file') != undefined) {
          if (localStorage.getItem('file') != null) {
            localStorage.setItem('file', "");
          }
        }
        localStorage.setItem('file', filecontent);
        ModelToReturn = initthreemf(filecontent);
      };
      reader.readAsArrayBuffer(file);
      break;
    case "amf":
      reader.onload = function (event) {

        filecontent = event.target.result;
        if (localStorage.getItem('file') != undefined) {
          if (localStorage.getItem('file') != null) {
            localStorage.setItem('file', "");
          }
        }
        localStorage.setItem('file', filecontent);
        ModelToReturn = initamf(filecontent);
      };
      reader.readAsArrayBuffer(file);
      break;

    case "assimp":
      // ASSIMP TOUT COURT
      reader.onload = function (event) {

        filecontent = event.target.result;
        if (localStorage.getItem('file') != undefined) {
          if (localStorage.getItem('file') != null) {
            localStorage.setItem('file', "");
          }
        }
        localStorage.setItem('file', filecontent);
        ModelToReturn = initassimp(filecontent);
      };
      reader.readAsArrayBuffer(file);
      break;
    case "json":
      // assimp json
      reader.onload = function (event) {

        filecontent = event.target.result;
        if (localStorage.getItem('file') != undefined) {
          if (localStorage.getItem('file') != null) {
            localStorage.setItem('file', "");
          }
        }
        localStorage.setItem('file', filecontent);
        ModelToReturn = initassimpjson(filecontent);
      };
      reader.readAsText(file);
      break;

    case "awd":
      reader.onload = function (event) {

        filecontent = event.target.result;
        if (localStorage.getItem('file') != undefined) {
          if (localStorage.getItem('file') != null) {
            localStorage.setItem('file', "");
          }
        }
        localStorage.setItem('file', filecontent);
        ModelToReturn = initAWD(filecontent);
      };

      reader.readAsArrayBuffer(file);
      break;
    case "babylon":
      reader.onload = function (event) {

        filecontent = event.target.result;
        if (localStorage.getItem('file') != undefined) {
          if (localStorage.getItem('file') != null) {
            localStorage.setItem('file', "");
          }
        }
        localStorage.setItem('file', filecontent);
        ModelToReturn = initBABYLON(filecontent);
      };

      reader.readAsText(file);
      break;
    case "dae":
      reader.onload = function (event) {

        filecontent = event.target.result;
        if (localStorage.getItem('file') != undefined) {
          if (localStorage.getItem('file') != null) {
            localStorage.setItem('file', "");
          }
        }
        localStorage.setItem('file', filecontent);
        ModelToReturn = initCOLLADA(filecontent);
      };

      reader.readAsText(file);
      break;

    case "fbx":
      reader.onload = function (event) {
        // The file's text will be printed here
        filecontent = event.target.result;
        if (localStorage.getItem('file') != null) {
          localStorage.setItem('file', "");
        }
        localStorage.setItem('file', filecontent);
        ModelToReturn = initfbx(filecontent);
      };
      reader.readAsArrayBuffer(file);
      break;

    case "glb":
      // problem
      reader.onload = function (event) {
        // The file's text will be printed here
        filecontent = event.target.result;
        if (localStorage.getItem('file') != undefined) {
          if (localStorage.getItem('file') != null) {
            localStorage.setItem('file', "");
          }
        }
        localStorage.setItem('file', filecontent);
        initgltf(filecontent);

      };
      reader.readAsArrayBuffer(file);
      break;

    case "js":
      reader.onload = function (event) {
        // The file's text will be printed here
        filecontent = event.target.result;
        if (localStorage.getItem('file') != null) {
          localStorage.setItem('file', "");
        }
        localStorage.setItem('file', filecontent);
        ModelToReturn = initJS(filecontent);
      };
      reader.readAsText(file);
      break;
    case "kmz":
      reader.onload = function (event) {

        filecontent = event.target.result;
        if (localStorage.getItem('file') != undefined) {
          if (localStorage.getItem('file') != null) {
            localStorage.setItem('file', "");
          }
        }
        localStorage.setItem('file', filecontent);
        ModelToReturn = initKMZ(filecontent);
      };
      reader.readAsArrayBuffer(file);
      break;
    case "pmd":
      // there is a problem of parsing
      reader.onload = function (event) {
        filecontent = event.target.result;
        if (localStorage.getItem('file') != undefined) {
          if (localStorage.getItem('file') != null) {

            localStorage.setItem('file', "");
          }
        }
        localStorage.setItem('file', filecontent);
        consoleModelToReturn = initPMD(filecontent);
      };
      reader.readAsArrayBuffer(file);
      break;

    case "obj":
      reader.onload = function (event) {

        filecontent = event.target.result;
        if (localStorage.getItem('file') != undefined) {
          if (localStorage.getItem('file') != null) {
            localStorage.setItem('file', "");
          }
        }
        localStorage.setItem('file', filecontent);
        ModelToReturn = initOBJ(filecontent);
      };
      reader.readAsText(file);
      break;
    case "ply":
      reader.onload = function (event) {

        filecontent = event.target.result;
        if (localStorage.getItem('file') != undefined) {
          if (localStorage.getItem('file') != null) {
            localStorage.setItem('file', "");
          }
        }
        localStorage.setItem('file', filecontent);
        ModelToReturn = initPLY(filecontent);
      };
      reader.readAsArrayBuffer(file);
      break;
    case "prwm":
      reader.onload = function (event) {

        filecontent = event.target.result;
        if (localStorage.getItem('file') != undefined) {
          if (localStorage.getItem('file') != null) {
            localStorage.setItem('file', "");
          }
        }
        localStorage.setItem('file', filecontent);
        ModelToReturn = initprwm(filecontent);
      };
      reader.readAsArrayBuffer(file);
      break;
    case "STL":
      reader.onload = function (event) {

        filecontent = event.target.result;
        if (localStorage.getItem('file') != undefined) {
          if (localStorage.getItem('file') != null) {
            localStorage.setItem('file', "");
          }
        }
        localStorage.setItem('file', filecontent);
        ModelToReturn = initstl(filecontent);
      };
      reader.readAsArrayBuffer(file);
      break;
    case "stl":
      reader.onload = function (event) {

        filecontent = event.target.result;
        if (localStorage.getItem('file') != undefined) {
          if (localStorage.getItem('file') != null) {
            localStorage.setItem('file', "");
          }
        }
        localStorage.setItem('file', filecontent);
        ModelToReturn = initstl(filecontent);
      };
      reader.readAsArrayBuffer(file);
      break;
    case "wrl":
      reader.onload = function (event) {
        filecontent = event.target.result;
        if (localStorage.getItem('file') != undefined) {
          if (localStorage.getItem('file') != null) {
            localStorage.setItem('file', "");
          }
        }
        localStorage.setItem('file', filecontent);
        ModelToReturn = initvrml(filecontent);
      };
      reader.readAsText(file);
      break;
    default:

  }
}

export function GetInfos() {
  return [ModelToReturn, returnVal, returnDim, reader];
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


function setcamera(fov, near, far, posX, posY, posZ) {

  camera = new Three.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, near, far);
  camera.position.set(posX, posY, posZ);
  localStorage.setItem('fov', fov);
  localStorage.setItem('near', near);
  localStorage.setItem('far', far);
  localStorage.setItem('posX', posX);
  localStorage.setItem('posY', posY);
  localStorage.setItem('posZ', posZ);
}

function initassimpjson(filecontent) {
  var fov = 45;
  var near = 0.1;
  var far = 1000;
  var posX = 0;
  var posY = 0;
  var posZ = 100;
  setcamera(fov, near, far, posX, posY, posZ);
  

  camera = new Three.PerspectiveCamera(45, 1, 0.1, 1000);
  scene = new Three.Scene();
  var loader = new Three.AssimpJSONLoader();
  var json = JSON.parse(filecontent);
  var result = loader.parse(json, null);
  result.traverse(function (child) {
    if (child instanceof Three.Mesh) {
      child.material = new Three.MeshStandardMaterial({
        color: 0x0055ff,
        flatShading: true
      });
      child.scale.set(1, 1, 1);
      child.position.set(0, 0, 0);
      var geo = new Three.Geometry().fromBufferGeometry(child.geometry);
      var volume = calc_vol_and_area(geo);
      returnVal = volume;
      var dim = calc_dimensions(geo);

      returnDim = dim;
    }
  });
  scene.add(result);
  //displayinfos(returnVal, returnDim);
  renderer = new Three.WebGLRenderer({
    antialias: true
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  return result;


}
// problem of conversion
function initPMD(filecontent) {

  var fov = 45;
  var near = 0.1;
  var far = 1000;
  var posX = 0;
  var posY = 0;
  var posZ = 100;
  setcamera(fov, near, far, posX, posY, posZ);
  camera = new Three.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 15);
  scene = new Three.Scene();

  var loader = new Three.MMDLoader();
  var parser = loader._getParser();
  var geo = parser.parsePmd(filecontent, true);


  var material = new Three.MeshStandardMaterial({
    color: 0x0055ff,
    flatShading: true
  });



  var mesh = new Three.Mesh(geo, material);
  scene.add(mesh);
  renderer = new Three.WebGLRenderer({
    antialias: true
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);
  //displayinfos(returnVal, returnDim);
  return mesh;

}

function initassimp(filecontent) {

  var fov = 45;
  var near = 0.1;
  var far = 1000;
  var posX = 0;
  var posY = 0;
  var posZ = 100;
  setcamera(fov, near, far, posX, posY, posZ);
  camera = new Three.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 15);
  scene = new Three.Scene();
  scene.background = new Three.Color(0x72645b);
  var assimploader = new Three.AssimpLoader();

  var result = assimploader.parse(filecontent);

  var object = result.object;
  object.traverse(function (child) {
    if (child instanceof Three.Mesh) {
      child.material = new Three.MeshStandardMaterial({
        color: 0x0055ff,
        flatShading: true
      });
      var geo = new Three.Geometry().fromBufferGeometry(child.geometry);
      var volume = calc_vol_and_area(geo);
      returnVal = volume;
      var dim = calc_dimensions(geo);
      returnDim = dim;
    }
  });

  scene.add(object);
  renderer = new Three.WebGLRenderer({
    antialias: true
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);
  return object;


}

function initgltf(filecontent) {
  var objecttoreturn;
  var fov = 45;
  var near = 1;
  var far = 2000;
  var posX = 0;
  var posY = 0;
  var posZ = 100;
  setcamera(fov, near, far, posX, posY, posZ);
  camera = new Three.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 15);
  scene = new Three.Scene();
  scene.background = new Three.Color(0x72645b);
  var gltfloader = new Three.GLTFLoader();
  gltfloader.parse(filecontent, null, function callback(gltf) {

    gltf.scene.traverse(function (child) {
      if (child instanceof Three.Mesh) {
        child.material = new Three.MeshStandardMaterial({
          color: 0x0055ff,
          flatShading: true
        });
        scene.add(child);
        objecttoreturn = child;
        var geo = new Three.Geometry().fromBufferGeometry(child.geometry);
        var volume = calc_vol_and_area(geo);
        returnVal = volume;
        var dim = calc_dimensions(geo);
        returnDim = dim;
      }
    });
    renderer = new Three.WebGLRenderer({
      antialias: true
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    ModelToReturn = objecttoreturn;


  });

}

function initAWD(filecontent) {
  var fov = 45;
  var near = 0.1;
  var far = 1000;
  var posX = 0;
  var posY = 0;
  var posZ = 100;
  setcamera(fov, near, far, posX, posY, posZ);
  camera = new Three.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 15);
  scene = new Three.Scene();
  scene.background = new Three.Color(0x72645b);
  var awdloader = new Three.AWDLoader();

  var trunk = awdloader.parse(filecontent);
  scene.add(trunk);
  var volume = 0;
  var surface = 0;

  trunk.traverse(function (child) {
    if (child instanceof Three.Mesh) {
      child.material = new Three.MeshStandardMaterial({
        color: 0x6c757d,
        flatShading: true
      });
      var geo = new Three.Geometry().fromBufferGeometry(child.geometry);
      var volumesurface = calc_vol_and_area(geo);
      volume = volume + volumesurface[0];
      surface = surface + volumesurface[1];
      returnVal = [volume, surface];
      var dim = calc_dimensions(geo);
      returnDim = dim;

      if ((returnDim[0] > returnDim[1]) && (returnDim[0] > returnDim[2])) {
        child.scale.set(15 / returnDim[0], 15 / returnDim[0], 15 / returnDim[0]);
      }

      if ((returnDim[1] > returnDim[0]) && (returnDim[1] > returnDim[2])) {
        child.scale.set(15 / returnDim[1], 15 / returnDim[1], 15 / returnDim[1]);
      }

      if ((returnDim[2] > returnDim[0]) && (returnDim[2] > returnDim[1])) {
        child.scale.set(15 / returnDim[2], 15 / returnDim[2], 15 / returnDim[2]);
      }

    }
  });
  // displayinfos(returnVal, returnDim);
  renderer = new Three.WebGLRenderer({
    antialias: true
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  return trunk;



}

function initKMZ(filecontent) {
  var fov = 45;
  var near = 0.1;
  var far = 1000;
  var posX = 0;
  var posY = 0;
  var posZ = 100;
  setcamera(fov, near, far, posX, posY, posZ);
  camera = new Three.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 15);
  scene = new Three.Scene();
  scene.background = new Three.Color(0x72645b);

  var kmzloader = new Three.KMZLoader();
  var kmzdata = kmzloader.parse(filecontent);
  var kmzobj = kmzdata.scene;
  scene.add(kmzobj);

  kmzobj.traverse(function (object) {

    if (object instanceof Three.Mesh) {
      object.material = new Three.MeshStandardMaterial({
        color: 0x0055ff,
        flatShading: true
      });

      object.scale.set(10, 10, 10);
      object.rotation.set(Math.PI / 3, Math.PI / 3, Math.PI / 3);
      var geo = new Three.Geometry().fromBufferGeometry(object.geometry);
      var volume = calc_vol_and_area(geo);
      returnVal = volume;
      var dim = calc_dimensions(geo);
      returnDim = dim;

    };

  });


  renderer = new Three.WebGLRenderer({
    antialias: true
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);
  return kmzobj;
}

function initJS(filecontent) {
  var fov = 45;
  var near = 0.1;
  var far = 1000;
  var posX = 0;
  var posY = 0;
  var posZ = 100;
  setcamera(fov, near, far, posX, posY, posZ);
  camera = new Three.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 15);
  scene = new Three.Scene();
  scene.background = new Three.Color(0x72645b);
  scene.fog = new Three.Fog(0x72645b, 2, 15);
  var json = JSON.parse(filecontent);
  var jsonloader = new Three.JSONLoader();
  var object = jsonloader.parse(json, null);
  var material = new Three.MeshStandardMaterial({
    color: 0x0055ff,
    flatShading: true
  });
  var volume = 0;
  var surface = 0;
  var geometry = object.geometry;
  var volume3d = calc_vol_and_area(geometry);
  volume = volume + volume3d[0];
  surface = surface + volume3d[1];
  returnVal = [volume, surface];
  var dim = calc_dimensions(geometry);
  returnDim = dim;
  var mesh = new Three.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);
  renderer = new Three.WebGLRenderer({
    antialias: true
  });
  var i = 5;
  mesh.position.set(0, 0, 0);
  mesh.scale.set(0.1, 0.1, 0.1);
  mesh.rotation.set(0, -Math.PI / 6, Math.PI / 6);
  mesh.matrixAutoUpdate = false;
  mesh.updateMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);
  return mesh;

}

function initDRACO(filecontent) {
  var loader = new Three.DRACOLoader();
  loader.decodeDracoFile(filecontent,
    function (geometry) {
      console.log(geometry);
    });
}

function initBABYLON(filecontent) {
  var fov = 45;
  var near = 1;
  var far = 2000;
  var posX = 0;
  var posY = 0;
  var posZ = 100;
  setcamera(fov, near, far, posX, posY, posZ);
  camera = new Three.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 15);
  camera.position.set(3, 0.15, 3);
  scene = new Three.Scene();
  scene.background = new Three.Color(0x72645b);
  scene.fog = new Three.Fog(0x72645b, 2, 15);
  var loader = new Three.BabylonLoader();
  var scenebabylon = loader.parse(JSON.parse(filecontent));
  scenebabylon.traverse(function (object) {

    if (object instanceof Three.Mesh) {

      object.material = new Three.MeshStandardMaterial({
        color: 0x6c757d,
        flatShading: true
      });
      var geo = new Three.Geometry().fromBufferGeometry(object.geometry);
      var volume = calc_vol_and_area(geo);
      returnVal = volume;
      var dim = calc_dimensions(geo);
      returnDim = dim;

      object.position.set(0, 0, 0);
      object.rotation.set(0, 0, 0);
      if ((returnDim[0] > returnDim[1]) && (returnDim[0] > returnDim[2])) {
        object.scale.set(30 / returnDim[0], 30 / returnDim[0], 30 / returnDim[0]);
      }

      if ((returnDim[1] > returnDim[0]) && (returnDim[1] > returnDim[2])) {
        object.scale.set(30 / returnDim[1], 30 / returnDim[1], 30 / returnDim[1]);
      }

      if ((returnDim[2] > returnDim[0]) && (returnDim[2] > returnDim[1])) {
        object.scale.set(30 / returnDim[2], 30 / returnDim[2], 30 / returnDim[2]);
      }

    }

  });

  scene.add(scenebabylon);
  renderer = new Three.WebGLRenderer({
    antialias: true
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);
  //displayinfos(returnVal, returnDim);
  return scenebabylon;


}

function initstl(filecontent) {
  var fov = 45;
  var near = 0.01;
  var far = 100;
  var posX = 0;
  var posY = 0;
  var posZ = 10;
  setcamera(fov, near, far, posX, posY, posZ);

  camera = new Three.PerspectiveCamera(45, 1, 0.1, 10);
  scene = new Three.Scene();
  scene.background = new Three.Color(0xf8f9fa);
  scene.fog = new Three.Fog(0xf8f9fa, 2, 15);
  var plane = new Three.Mesh(
    new Three.PlaneBufferGeometry(40, 40),
    new Three.MeshPhongMaterial({
      color: 0x999999,
      specular: 0x101010
    })
  );
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = -0.5;
  scene.add(plane);

  plane.receiveShadow = true;

  var loader = new Three.STLLoader();
  var material = new Three.MeshStandardMaterial({
    color: 0x6c757d,
    flatShading: true
  });
  var geometry = loader.parse(filecontent);
  var geo = new Three.Geometry().fromBufferGeometry(geometry);
  var volume = calc_vol_and_area(geo);
  returnVal = volume;
  var dim = calc_dimensions(geo);
  returnDim = dim;
  var mesh = new Three.Mesh(geometry, material);
  mesh.position.set(0, 0, 0);
  mesh.rotation.set(0, 0, 0);
 
  if ((returnDim[0] > returnDim[1]) && (returnDim[0] > returnDim[2]))
  {mesh.scale.set(5 / returnDim[0], 5 / returnDim[0], 5 / returnDim[0]);}

  if ((returnDim[1] > returnDim[0]) && (returnDim[1] > returnDim[2])) 
  { mesh.scale.set(5 / returnDim[1], 5 / returnDim[1], 5 / returnDim[1]); }

  if ((returnDim[2] > returnDim[0]) && (returnDim[2] > returnDim[1])) 
  { mesh.scale.set(5 / returnDim[2], 5 / returnDim[2], 5 / returnDim[2]); }

  mesh.castShadow = true;
  mesh.receiveShadow = true;

  scene.add(mesh);
  renderer = new Three.WebGLRenderer({
    antialias: true
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);
  // displayinfos(returnVal, returnDim);
  return mesh;
}

function initfbx(path) {
  var fov = 45;
  var near = 1;
  var far = 2000;
  var posX = 0;
  var posY = 100;
  var posZ = 200;

  setcamera(fov, near, far, posX, posY, posZ);
  camera = new Three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
  camera.position.set(100, 200, 300);

  CameraToReturn = camera;
  /*  controls = new Three.OrbitControls(camera);
   //controls.target.set(0, 100, 0);
   controls.update(); */

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
  object3d = loader.parse(path);
  scene.add(object3d);
  //traversing the object
  object3d.traverse(function (child) {
    if (child.isSkinnedMesh) {
      child.material = new Three.MeshStandardMaterial({
        color: 0x6c757d,
        flatShading: true
      });
      child.castShadow = true;
      child.receiveShadow = true;

      var geo = new Three.Geometry().fromBufferGeometry(child.geometry);
      var volumeg = calc_vol_and_area(geo);
      volume = volume + volumeg[0];
      surface = surface + volumeg[1];
      returnVal = [volume, surface];
      var dim = calc_dimensions(geo);
      returnDim = dim;

      child.rotation.set(0, 0,0);
      child.position.set(0, 0, 0);
 
      if ((returnDim[0] > returnDim[1]) && (returnDim[0] > returnDim[2])) {
        child.scale.set(100 / returnDim[0], 100 / returnDim[0], 100 / returnDim[0]);
      }

      if ((returnDim[1] > returnDim[0]) && (returnDim[1] > returnDim[2])) {
        child.scale.set(100 / returnDim[1], 100 / returnDim[1], 100 / returnDim[1]);
      }

      if ((returnDim[2] > returnDim[0]) && (returnDim[2] > returnDim[1])) {
        child.scale.set(100 / returnDim[2], 100 / returnDim[2], 100 / returnDim[2]);
      }
    }
  });
  renderer = new Three.WebGLRenderer({
    antialias: true
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);
  return object3d;
}



function initamf(path) {

  var fov = 45;
  var near = 1;
  var far = 500;
  var posX = 0;
  var posY = 0;
  var posZ = 6;
  setcamera(fov, near, far, posX, posY, posZ);
  camera = new Three.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 10);

  // Z is up for objects intended to be 3D printed.

  camera.up.set(0, 0, 1);
  camera.position.set(0, -9, 6);

  camera.add(new Three.PointLight(0xffffff, 0.8));
  CameraToReturn = camera;
  /*   controls = new Three.OrbitControls(camera);
    controls.target.set(0, 100, 0);
    controls.update(); */

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
  const loader = new Three.AMFLoader();
  object3d = loader.parse(path);
  object3d.traverse(function (child) {
    if (child instanceof Three.Mesh) {
      child.material = new Three.MeshStandardMaterial({
        color: 0x6c757d,
        flatShading: true
      });
      var geo = new Three.Geometry().fromBufferGeometry(child.geometry);
      var volume = calc_vol_and_area(geo);
      returnVal = volume;
      var dim = calc_dimensions(geo);
      returnDim = dim;
      child.position.set(0, 0, 0);
      child.rotation.set(- Math.PI / 2, 0, 0);
      if ((returnDim[0] > returnDim[1]) && (returnDim[0] > returnDim[2])) {
        child.scale.set(5 / returnDim[0], 5 / returnDim[0], 5 / returnDim[0]);
      }

      if ((returnDim[1] > returnDim[0]) && (returnDim[1] > returnDim[2])) {
        child.scale.set(5 / returnDim[1], 5 / returnDim[1], 5 / returnDim[1]);
      }

      if ((returnDim[2] > returnDim[0]) && (returnDim[2] > returnDim[1])) {
        child.scale.set(5 / returnDim[2], 5 / returnDim[2], 5 / returnDim[2]);
      }
    }
  });
  scene.add(object3d);
  renderer = new Three.WebGLRenderer({
    antialias: true
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);
  object3d.scale.set(0.5,0.5,0.5);
  object3d.position.set(0, 0, 0);
  
  return object3d;
}

function initthreemf(path) {
  var fov = 45;
  var near = 0.1;
  var far = 1000;
  var posX = 0;
  var posY = 0;
  var posZ = 100;
  setcamera(fov, near, far, posX, posY, posZ);
  camera = new Three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
  camera.position.set(100, 200, 300);

  scene = new Three.Scene();
  scene.background = new Three.Color(0xa0a0a0);
  scene.fog = new Three.Fog(0xa0a0a0, 200, 1000);

  var light = new Three.HemisphereLight(0xffffff, 0x444444);
  light.position.set(0, 200, 0);
  scene.add(light);
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
  var volume = 0;
  var surface = 0;
  const loader = new Three.ThreeMFLoader();
  object3d = loader.parse(path);
  object3d.traverse(function (child) {
    if (child instanceof Three.Mesh) {
      child.material = new Three.MeshStandardMaterial({
        color: 0x0055ff,
        flatShading: true
      });
      var geo = new Three.Geometry().fromBufferGeometry(child.geometry);
      var volumegeo = calc_vol_and_area(geo);
      volume = volume + volumegeo[0];
      surface = surface + volumegeo[1];
      returnVal = [volume, surface];
      var dim = calc_dimensions(child.geometry);
      returnDim = dim;
    }
  });
  scene.add(object3d);
  renderer = new Three.WebGLRenderer({
    antialias: true
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);
  object3d.scale.set(0.5,0.5,0.5);
  object3d.position.set(-5, 0, 0);
  object3d.rotation.set(-Math.PI / 2, 0, 0);
  return object3d;

}

function inittds(path) {
  var fov = 60;
  var near = 0.1;
  var far = 1000;
  var posX = 0;
  var posY = 0;
  var posZ = 2;

  setcamera(fov, near, far, posX, posY, posZ);
  camera = new Three.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 10);
  camera.position.z = 2;
  CameraToReturn = camera;
  scene = new Three.Scene();
  scene.background = new Three.Color(0xa0a0a0);
  scene.fog = new Three.Fog(0xa0a0a0, 200, 1000);

  var light = new Three.HemisphereLight(0xffffff, 0x444444);
  light.position.set(0, 200, 0);
  scene.add(light);
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
  const loader = new Three.TDSLoader();
  object3d = loader.parse(path);
  object3d.traverse(function (child) {
    if (child instanceof Three.Mesh) {
      child.material = new Three.MeshStandardMaterial({
        color: 0x6c757d,
        flatShading: true
      });
      var volume = calc_vol_and_area(child.geometry);
      returnVal = volume;
      var dim = calc_dimensions(child.geometry);
      returnDim = dim;

      child.position.set(0, 0, 0);
      child.rotation.set(0, 0, 0);
      if ((returnDim[0] > returnDim[1]) && (returnDim[0] > returnDim[2])) 
      {
        child.scale.set(3/ returnDim[0], 3 / returnDim[0], 3 / returnDim[0]);
      }

      if ((returnDim[1] > returnDim[0]) && (returnDim[1] > returnDim[2])) 
      {
        child.scale.set(3 / returnDim[1], 3 / returnDim[1], 3 / returnDim[1]);
      }

      if ((returnDim[2] > returnDim[0]) && (returnDim[2] > returnDim[1])) 
      {
        child.scale.set(3 / returnDim[2], 3 / returnDim[2], 3 / returnDim[2]);
      }

    }
  });
  scene.add(object3d);
  renderer = new Three.WebGLRenderer({
    antialias: true
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);
  object3d.scale.set(0.5, 0.5, 0.5);
  object3d.position.set(0, 0, 0);
  return object3d;


}

// END FBX
// region COLLADA
function initCOLLADA(group3d) {
  var fov = 45;
  var near = 1;
  var far = 50;
  var posX = 0;
  var posY = 0;
  var posZ = 8;
  setcamera(fov, near, far, posX, posY, posZ);
  camera = new Three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
  camera.position.set(8, 10, 8);
  camera.lookAt(new Three.Vector3(0, 3, 0));

  CameraToReturn = camera;

  scene = new Three.Scene();

  var clock = new Three.Clock();
  // loading manager

  var loadingManager = new Three.LoadingManager(function () {});
  var loader = new Three.ColladaLoader(loadingManager);
  var object3d = loader.parse(group3d);
  var groupscene = object3d.scene;
  groupscene.traverse(function (object) {
    if (object instanceof Three.Mesh) {
      object.material = new Three.MeshStandardMaterial({
        color: 0x6c757d,
        flatShading: true
      });
      var geo = new Three.Geometry().fromBufferGeometry(object.geometry);
      var volume = calc_vol_and_area(geo);
      returnVal = volume;
      var dim = calc_dimensions(geo);
      returnDim = dim;

      object.position.set(0, 0, 0);
      if ((returnDim[0] > returnDim[1]) && (returnDim[0] > returnDim[2])) {
        object.scale.set(3 / returnDim[0], 3 / returnDim[0], 3 / returnDim[0]);
      }

      if ((returnDim[1] > returnDim[0]) && (returnDim[1] > returnDim[2])) {
        object.scale.set(3 / returnDim[1], 3 / returnDim[1], 3 / returnDim[1]);
      }

      if ((returnDim[2] > returnDim[0]) && (returnDim[2] > returnDim[1])) {
        object.scale.set(3 / returnDim[2], 3 / returnDim[2], 3 / returnDim[2]);
      }

    };
  });
  var ambientLight = new Three.AmbientLight(0xcccccc, 0.4);
  scene.add(ambientLight);

  var directionalLight = new Three.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(1, 1, 0).normalize();
  scene.add(directionalLight);
  renderer = new Three.WebGLRenderer({
    antialias: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);
  groupscene.scale.set(1, 1, 1);
  groupscene.position.set(0, 0, 0);
  return groupscene;
}

function initCTM(text3d) {
  var loader = new Three.CTMLoader();
  camera = new Three.PerspectiveCamera(20, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 2000);
  camera.position.z = 800;

  scene = new Three.Scene();
  scene.background = new Three.Color(0xf8f9fa);
  scene.fog = new Three.Fog(0x050505, 800, 2000);
  var ambient = new Three.AmbientLight(0x040404);
  scene.add(ambient);

  var light = new Three.SpotLight(0xffeedd, 1.2, 650, Math.PI / 6);
  light.position.set(0, -100, 500);

  light.castShadow = true;
  light.shadow.mapWidth = 1024;
  light.shadow.mapHeight = 1024;
  scene.add(light);
  var group3d = JSON.parse(text3d);

}

function initOBJ(text3d) {

  var fov = 45;
  var near = 0.1;
  var far = 100;
  var posX = 0;
  var posY = 0;
  var posZ = 100;
  setcamera(fov, near, far, posX, posY, posZ);

  camera = new Three.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.z = 100;
  CameraToReturn = camera;
  scene = new Three.Scene();
  scene.background = new Three.Color(0xa0a0a0);
  scene.fog = new Three.Fog(0xa0a0a0, 200, 1000);

  var light = new Three.HemisphereLight(0xffffff, 0x444444);
  light.position.set(0, 200, 0);
  scene.add(light);
  var mesh = new Three.MeshStandardMaterial({
    color: 0x0055ff,
    flatShading: true
  });

  scene.add(mesh);

  var grid = new Three.GridHelper(2000, 20, 0x000000, 0x000000);
  grid.material.opacity = 0.2;
  grid.material.transparent = true;
  scene.add(grid);

  var loader = new Three.OBJLoader();
  var groupobj = loader.parse(text3d);
  var data = parse_obj(text3d);
 
  var geo = new Three.Geometry;
  var data = parse_obj(text3d);
  scene.add(data);
  geo.faces = data.faces;
  geo.vertices = data.vertices;

  var volume = calc_vol_and_area(geo);
  returnVal = volume;
  var dim = calc_dimensions(geo);
  returnDim = dim;
  groupobj.traverse(function (object) {
        if (object instanceof Three.Mesh) {
          object.material = new Three.MeshStandardMaterial({
            color: 0x6c757d,
            flatShading: true
          });

          object.position.set(0, 0, 0);
          if ((returnDim[0] > returnDim[1]) && (returnDim[0] > returnDim[2])) {
            object.scale.set(75 / returnDim[0], 75 / returnDim[0], 75 / returnDim[0]);
          }

          if ((returnDim[1] > returnDim[0]) && (returnDim[1] > returnDim[2])) {
            object.scale.set(75 / returnDim[1], 75 / returnDim[1], 75 / returnDim[1]);
          }

          if ((returnDim[2] > returnDim[0]) && (returnDim[2] > returnDim[1])) {
            object.scale.set(75 / returnDim[2], 75 / returnDim[2], 75 / returnDim[2]);
          }
        }
    });
  scene.add(groupobj);

  renderer = new Three.WebGLRenderer({
    antialias: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);
  return groupobj;
}

function initPLY(text3d) {
  var fov = 60;
  var near = 0.1;
  var far = 10;
  var posX = 0;
  var posY = 0;
  var posZ = 2;

  var fov = 45;
  var near = 0.1;
  var far = 1000;
  var posX = 0;
  var posY = 0;
  var posZ = 100;
  setcamera(fov, near, far, posX, posY, posZ);
  camera = new Three.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 1, 2000);
  camera.position.z = 250;
  CameraToReturn = camera;
  scene = new Three.Scene();
  scene.background = new Three.Color(0x72645b);
  scene.fog = new Three.Fog(0x72645b, 2, 15);

  var plane = new Three.Mesh(
    new Three.PlaneBufferGeometry(40, 40),
    new Three.MeshPhongMaterial({
      color: 0x999999,
      specular: 0x101010
    })
  );
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = -0.5;
  scene.add(plane);

  plane.receiveShadow = true;
  var loader = new Three.PLYLoader();
  var plybuffergeometry = loader.parse(text3d);
  var material = new Three.MeshStandardMaterial({
    color: 0x6c757d,
    flatShading: true
  });
  var mesh = new Three.Mesh(plybuffergeometry, material);

  mesh.position.x = -0.2;
  mesh.position.y = -0.02;
  mesh.position.z = -0.2;
  mesh.scale.multiplyScalar(0.002);

  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);
  var geo = new Three.Geometry().fromBufferGeometry(plybuffergeometry);
  var volume = calc_vol_and_area(geo);
  returnVal = volume;
  var dim = calc_dimensions(geo);
  returnDim = dim;

  mesh.position.set(0, 0, 0);
  mesh.rotation.set(0, 0, 0);

  if ((returnDim[0] > returnDim[1]) && (returnDim[0] > returnDim[2]))
   { mesh.scale.set(50 / returnDim[0], 50 / returnDim[0], 50 / returnDim[0]); }

 else  if ((returnDim[1] > returnDim[0]) && (returnDim[1] > returnDim[2])) 
  { mesh.scale.set(50 / returnDim[1], 50 / returnDim[1], 50 / returnDim[1]); }

  else if ((returnDim[2] > returnDim[0]) && (returnDim[2] > returnDim[1])) 
  { mesh.scale.set(50 / returnDim[2], 50 / returnDim[2], 50 / returnDim[2]); }


  renderer = new Three.WebGLRenderer({
    antialias: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);
  return mesh;
}

function initprwm(filecontent) {
  var fov = 60;
  var near = 0.1;
  var far = 10;
  var posX = 0;
  var posY = 0;
  var posZ = 2;
  setcamera(fov, near, far, posX, posY, posZ);
  camera = new Three.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 1, 2000);
  camera.position.z = 250;
  CameraToReturn = camera;
  scene = new Three.Scene();
  scene.background = new Three.Color(0x72645b);
  scene.fog = new Three.Fog(0x72645b, 2, 15);
  var loader = new Three.PRWMLoader();
  var geometry = loader.parse(filecontent);
  var material = new Three.MeshStandardMaterial({
    color: 0x0055ff,
    flatShading: true
  });
  var mesh = new Three.Mesh(geometry, material);
  var geo = new Three.Geometry().fromBufferGeometry(geometry);
  var volume = calc_vol_and_area(geo);
  returnVal = volume;
  var dim = calc_dimensions(geo);
  returnDim = dim;
  renderer = new Three.WebGLRenderer({
    antialias: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);
  return mesh;

}

function initvrml(filecontent) {
  var fov = 60;
  var near = 0.1;
  var far = 10;
  var posX = 0;
  var posY = 0;
  var posZ = 2;
  setcamera(fov, near, far, posX, posY, posZ);
  camera = new Three.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 1, 2000);
  camera.position.z = 250;
  CameraToReturn = camera;
  scene = new Three.Scene();
  scene.background = new Three.Color(0x72645b);
  scene.fog = new Three.Fog(0x72645b, 2, 15);

  const loader = new Three.VRMLLoader();
  object3d = loader.parse(filecontent);
  object3d.traverse(function (child) {
    if (child instanceof Three.Mesh) {
      var material = new Three.MeshPhongMaterial({
        color: 0xff5533,
        specular: 0x111111,
        shininess: 200
      });
      child.material = material;
      var geometry = new Three.Geometry().fromBufferGeometry(child.geometry);
      var volume = calc_vol_and_area(geometry);
      returnVal = volume;
      var dim = calc_dimensions(child.geometry);
      returnDim = dim;
    }
  });
  scene.add(object3d);
  renderer = new Three.WebGLRenderer({
    antialias: true
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);
  object3d.scale.set(1, 1, 1);
  object3d.position.set(0, 0, 0);
  return object3d;
}

function parse_obj(s) {
  var obj_string = s;

  function vector(x, y, z) {

    return new Three.Vector3(parseFloat(x), parseFloat(y), parseFloat(z));
  }

  function uv(u, v) {
    return new Three.Vector2(parseFloat(u), parseFloat(v));
  }

  function face3(a, b, c, normals) {
    return new Three.Face3(a, b, c, normals);
  }

  var object = new Three.Object3D();
  var geometry, material, mesh;

  function parseVertexIndex(index) {
    index = parseInt(index);
    return index >= 0 ? index - 1 : index + vertices.length;
  }

  function parseNormalIndex(index) {
    index = parseInt(index);
    return index >= 0 ? index - 1 : index + normals.length;
  }

  function parseUVIndex(index) {
    index = parseInt(index);
    return index >= 0 ? index - 1 : index + uvs.length;
  }

  function add_face(a, b, c, normals_inds) {
    if (1 == 1) {

      geometry.faces.push(face3(
        vertices[parseVertexIndex(a)] - 1,
        vertices[parseVertexIndex(b)] - 1,
        vertices[parseVertexIndex(c)] - 1
      ));

    } else {

      geometry.faces.push(face3(
        vertices[parseVertexIndex(a)] - 1,
        vertices[parseVertexIndex(b)] - 1,
        vertices[parseVertexIndex(c)] - 1, [
          normals[parseNormalIndex(normals_inds[0])].clone(),
          normals[parseNormalIndex(normals_inds[1])].clone(),
          normals[parseNormalIndex(normals_inds[2])].clone()
        ]
      ));

    }
  }

  function add_uvs(a, b, c) {

    geometry.faceVertexUvs[0].push([
      uvs[parseUVIndex(a)].clone(),
      uvs[parseUVIndex(b)].clone(),
      uvs[parseUVIndex(c)].clone()
    ]);

  }

  function handle_face_line(faces, uvs, normals_inds) {

    if (faces[3] === undefined) {

      add_face(faces[0], faces[1], faces[2], normals_inds);

      if (uvs !== undefined && uvs.length > 0) {

        add_uvs(uvs[0], uvs[1], uvs[2]);

      }


    } else {

      if (normals_inds !== undefined && normals_inds.length > 0) {

        add_face(faces[0], faces[1], faces[3], [normals_inds[0], normals_inds[1], normals_inds[3]]);
        add_face(faces[1], faces[2], faces[3], [normals_inds[1], normals_inds[2], normals_inds[3]]);

      } else {

        add_face(faces[0], faces[1], faces[3]);
        add_face(faces[1], faces[2], faces[3]);

      }

      if (uvs !== undefined && uvs.length > 0) {

        add_uvs(uvs[0], uvs[1], uvs[3]);
        add_uvs(uvs[1], uvs[2], uvs[3]);

      }

    }

  }
  if (/^o /gm.test(obj_string) === false) {
    geometry = new Three.Geometry();

  }

  var vertices = [];
  var normals = [];
  var uvs = [];
  var vertex_pattern = /v( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)/;
  var normal_pattern = /vn( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)/;
  var uv_pattern = /vt( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)/;
  var face_pattern1 = /f( +-?\d+)( +-?\d+)( +-?\d+)( +-?\d+)?/;

  // f vertex/uv vertex/uv vertex/uv ...

  var face_pattern2 = /f( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))?/;

  // f vertex/uv/normal vertex/uv/normal vertex/uv/normal ...

  var face_pattern3 = /f( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))?/;

  // f vertex//normal vertex//normal vertex//normal ...

  var face_pattern4 = /f( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))?/

  //

  var lines = obj_string.split('\n');

  for (var i = 0; i < lines.length; i++) {

    var line = lines[i];
    line = line.trim();

    var result;

    if (line.length === 0 || line.charAt(0) === '#') {

      continue;

    } else if ((result = vertex_pattern.exec(line)) !== null) {

      // ["v 1.0 2.0 3.0", "1.0", "2.0", "3.0"]

      vertices.push(
        geometry.vertices.push(
          vector(
            result[1], result[2], result[3]
          )
        )
      );

    } else if ((result = normal_pattern.exec(line)) !== null) {

      // ["vn 1.0 2.0 3.0", "1.0", "2.0", "3.0"]

      normals.push(
        vector(
          result[1], result[2], result[3]
        )
      );

    } else if ((result = uv_pattern.exec(line)) !== null) {

      // ["vt 0.1 0.2", "0.1", "0.2"]

      uvs.push(
        uv(
          result[1], result[2]
        )
      );

    } else if ((result = face_pattern1.exec(line)) !== null) {

      // ["f 1 2 3", "1", "2", "3", undefined]

      handle_face_line(
        [result[1], result[2], result[3], result[4]]
      );

    } else if ((result = face_pattern2.exec(line)) !== null) {

      // ["f 1/1 2/2 3/3", " 1/1", "1", "1", " 2/2", "2", "2", " 3/3", "3", "3", undefined, undefined, undefined]

      handle_face_line(
        [result[2], result[5], result[8], result[11]], //faces
        [result[3], result[6], result[9], result[12]] //uv
      );

    } else if ((result = face_pattern3.exec(line)) !== null) {

      // ["f 1/1/1 2/2/2 3/3/3", " 1/1/1", "1", "1", "1", " 2/2/2", "2", "2", "2", " 3/3/3", "3", "3", "3", undefined, undefined, undefined, undefined]

      handle_face_line(
        [result[2], result[6], result[10], result[14]], //faces
        [result[3], result[7], result[11], result[15]], //uv
        [result[4], result[8], result[12], result[16]] //normal
      );

    } else if ((result = face_pattern4.exec(line)) !== null) {

      // ["f 1//1 2//2 3//3", " 1//1", "1", "1", " 2//2", "2", "2", " 3//3", "3", "3", undefined, undefined, undefined]

      handle_face_line(
        [result[2], result[5], result[8], result[11]], //faces
        [], //uv
        [result[3], result[6], result[9], result[12]] //normal
      );

    } else if (/^o /.test(line)) {

      geometry = new Three.Geometry();


    } else if (/^g /.test(line)) {

      // group

    } else if (/^usemtl /.test(line)) {



    } else if (/^mtllib /.test(line)) {



    } else if (/^s /.test(line)) {


    } else {



    }

  }

  var children = object.children;

  for (var i = 0, l = children.length; i < l; i++) {

    var geometry = children[i].geometry;



  }


  return ({
    vertices: geometry.vertices,
    faces: geometry.faces,
    colors: false
  });
}
