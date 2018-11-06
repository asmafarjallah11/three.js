if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
var animation;
var returnVal;
var returnDim; 

		
                setElementsWithInfos(init());
                function setElementsWithInfos(manager) {

                            manager.onLoad = function ( ) {
                                console.log( 'Loading complete!');
                                console.log(returnVal);
                                console.log(returnDim);
                                displayinfos(returnVal,returnDim);

                            };
                        }

		function init() {
                         
			
			camera = new THREE.PerspectiveCamera( 25, window.innerWidth / window.innerHeight, 1, 10000 );
			camera.position.set( 600, 1150, 5 );
			camera.up.set( 0, 0, 1 );
			camera.lookAt( new THREE.Vector3( -100, 0, 0 ) );

			scene = new THREE.Scene();
                        scene.background = new THREE.Color( 0xececec );
			scene.fog = new THREE.Fog( 0x72645b, 2, 15 );
			var ambient = new THREE.HemisphereLight( 0x8888fff, 0xff8888, 0.5 );
			ambient.position.set( 0, 1, 0 );
			scene.add( ambient );

			var light = new THREE.DirectionalLight( 0xffffff, 1 );
			light.position.set( 0, 4, 4 ).normalize();
			scene.add( light );

		        renderer = new THREE.WebGLRenderer( { antialias: true } );
			renderer.setSize( container.clientWidth, container.clientHeight );
		        container.appendChild( renderer.domElement );

			var controls = new THREE.OrbitControls( camera, renderer.domElement );

		
                       
			var loader = new THREE.AssimpLoader();
			loader.load( filepath, function ( result ) {

				var object = result.object;
                               //   var material = new THREE.MeshPhongMaterial( { color: 0xff5533, specular: 0x111111, shininess: 200 } );
		
                                console.log(object);
				object.position.y = - 100;
				object.rotation.x = Math.PI / 2;
                              //  object.material= material;
                                  object.traverse(function (child) {
                                        if (child instanceof THREE.Mesh) {
                                           child.material = new THREE.MeshLambertMaterial({color:0xaaaaaa});
                                          console.log(child.geometry);
                                         var geo = new THREE.Geometry().fromBufferGeometry(child.geometry);
                                                        console.log(geo);
                                                       var volume = calc_vol_and_area(geo);
                                                        returnVal = volume;
                                                        console.log(volume);
                                                        var dim =  calc_dimensions(geo);
                                                        console.log(dim);
                                                        returnDim = dim;
                                        }
                                    });
                                
				scene.add( object );

				animation = result.animation;

		}, function ( xhr ) {
                                   
					if ( xhr.lengthComputable ) {
						var percentComplete = xhr.loaded / xhr.total * 100;
                                                move(percentComplete);
						console.log( Math.round(percentComplete, 2) + '% downloaded' );
					}
				}, function ( xhr ) {
				} );

			window.addEventListener( 'resize', onWindowResize, false );
			animate();
                        return loader.manager;

		}

		function onWindowResize() {
                        
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize( container.clientWidth, container.clientHeight  );

		}

		function animate() {

			requestAnimationFrame( animate, renderer.domElement );
			renderer.render( scene, camera );

			if ( animation ) animation.setTime( performance.now() / 1000 );

			//stats.update();

		}
		