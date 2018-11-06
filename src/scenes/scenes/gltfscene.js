 	var returnVal;
        var returnDim;

if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

			var  controls;
			var  light;
                       
                        setElementsWithInfos(init());
                        function setElementsWithInfos(manager) {

                            manager.onLoad = function ( ) {
                                console.log( 'Loading complete!');
                                  setTimeout(function() {
                                displayinfos(returnVal,returnDim);
                                console.log(GetInfos());
                                     },600);
                          };
                        }
			animate();

			function init() {

				

				camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.25, 20 );
				camera.position.set( -1.8, 0.9, 2.7 );

				controls = new THREE.OrbitControls( camera );
				controls.target.set( 0, -0.2, -0.2 );
				controls.update();

				// envmap
				/*var path = 'textures/cube/skyboxsun25deg/';
				var format = '.jpg';
				var envMap = new THREE.CubeTextureLoader().load( [
					path + 'px' + format, path + 'nx' + format,
					path + 'py' + format, path + 'ny' + format,
					path + 'pz' + format, path + 'nz' + format
				] );*/

				scene = new THREE.Scene();
				scene.background = new THREE.Color( 0xececec );
				scene.fog = new THREE.Fog( 0x72645b, 2, 15 );

				light = new THREE.HemisphereLight( 0xbbbbff, 0x444422 );
				light.position.set( 0, 1, 0 );
				scene.add( light );

				light = new THREE.DirectionalLight( 0xffffff );
				light.position.set( -10, 6, -10 );
				scene.add( light );

				// model
				var loader = new THREE.GLTFLoader();
				loader.load(filepath, 
                                function ( gltf ) {

					gltf.scene.traverse( function ( child ) {

						if ( child.isMesh ) {
                                                 //   console.log (child.material);

							// child.material.envMap = envMap;
                                                   child.material = new THREE.MeshPhongMaterial( {
								color: Math.random() * 0xffffff
							} );
                                                        
                                                     console.log(child.geometry);
                                                        
                                                     var geo = new THREE.Geometry().fromBufferGeometry(child.geometry);
                                                    var volume = calc_vol_and_area(geo);
                                                    returnVal = volume;
                                                    console.log(volume);
                                                    var dim =  calc_dimensions(geo);
                                                    console.log(dim);
                                                    returnDim = dim;
                                                     // displayinfos(returnVal,returnDim);
                                                     // console.log(GetInfos());
						}

					} );

					scene.add( gltf.scene );

				}, function ( xhr ) {
                                   
					if ( xhr.lengthComputable ) {
						var percentComplete = xhr.loaded / xhr.total * 100;
                                                move(percentComplete);
						console.log( Math.round(percentComplete, 2) + '% downloaded' );
					}
				}, function ( xhr ) {
				} );

				renderer = new THREE.WebGLRenderer( { antialias: true } );
                                renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( container.clientWidth, container.clientHeight );
                                container.appendChild( renderer.domElement );

				window.addEventListener( 'resize', onWindowResize, false );

			 return loader.manager;	

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

		         	renderer.setSize( container.clientWidth, container.clientHeight );

			}

			//

			function animate() {

				requestAnimationFrame( animate );

				renderer.render( scene, camera );

			

			}

		