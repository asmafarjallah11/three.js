/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

    var returnVal;
    var returnDim;
    inittds();
    animate();
    function inittds() {
        initscene();
   
        //3ds files dont store normal maps  how  to  add texture
        var loader = new THREE.TextureLoader();
        var normal = loader.load( 'examples/models/3ds/portalgun/textures/normal.jpg' );
        var geo=new THREE.Geometry;
        var loader = new THREE.TDSLoader( );
        loader.setPath( 'examples/models/3ds/portalgun/textures/' );
        loader.load(localStorage.getItem('file'), function (object) {
                console.log(object);
                console.log(object.scale);
                object.traverse( function ( child ) {
                    if ( child instanceof THREE.Mesh ) {
                              var material = new THREE.MeshPhongMaterial( { color: 0xff5533, specular: 0x111111, shininess: 200 } );
                                 child.material= material;
                                 console.log(child.geometry);
                                 var volume = calc_vol_and_area(child.geometry);
                                 returnVal = volume;
                                 console.log(volume);
                                 var dim =  calc_dimensions(child.geometry);
                                 console.log(dim);
                                 returnDim = dim;
                                 //AFFICHAGE
                                 displayinfos(returnVal,returnDim);
                                
                           }
                     } );
                scene.add( object );
                }, function ( xhr ) {
                                   
					if ( xhr.lengthComputable ) {
						var percentComplete = xhr.loaded / xhr.total * 100;
                                                move(percentComplete);
						console.log( Math.round(percentComplete, 2) + '% downloaded' );
					}
				}, function ( xhr ) {
				} );
        finalizerenderer();

      //  return loader.manager;




     }
                             

    function setElementsWithInfos(manager) {
       
        manager.onLoad = function ( ) {
            console.log( 'Loading complete!');
            console.log(returnVal);
            console.log(returnDim);
                         
            ////document.getElementById('volume').value=returnVal[0];
          //  document.getElementById('surface').value=returnVal[1];
        };
    }


    function resize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( container.innerWidth, container.innerHeight );

    }
    
    function animate() {
        controls.update();
        renderer.render( scene, camera );

        requestAnimationFrame( animate );
    }
    
    function initscene()
    {
        camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 10 );
        camera.position.z = 2;

        controls = new THREE.TrackballControls( camera );

        scene = new THREE.Scene();
        scene.add( new THREE.HemisphereLight() );

        var directionalLight = new THREE.DirectionalLight( 0xffeedd );
        directionalLight.position.set( 0, 0, 2 );
        scene.add( directionalLight );

        scene.background = new THREE.Color( 0xececec );
        scene.fog = new THREE.Fog( 0x72645b, 2, 15 ); 
    }
    
    function finalizerenderer()
    {
        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setSize( container.clientWidth, container.clientHeight );
        container.appendChild( renderer.domElement );
        window.addEventListener( 'resize', resize, false );  
    }