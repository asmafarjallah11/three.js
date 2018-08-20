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

				camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
				camera.position.z = 100;

				controls = new THREE.TrackballControls( camera );

				// scene

				scene = new THREE.Scene();

				// texture

				var manager = new THREE.LoadingManager();
				manager.onProgress = function ( item, loaded, total ) {

					console.log( item, loaded, total );

				};

				var texture = new THREE.Texture();

				var material = new THREE.MeshBasicMaterial( { color: 'red' } );

				var onProgress = function ( xhr ) {
					if ( xhr.lengthComputable ) {
						var percentComplete = xhr.loaded / xhr.total * 100;
                                                 move(percentComplete);
						console.log( Math.round(percentComplete, 2) + '% downloaded' );
					}
				};

				var onError = function ( xhr ) {
				};

				// model

				var loader = new THREE.BabylonLoader( manager );
				loader.load(filepath, function ( babylonScene ) {

					babylonScene.traverse( function ( object ) {

						if ( object instanceof THREE.Mesh ) {
                                                    console.log(object)

							object.material = new THREE.MeshPhongMaterial( {
								color: Math.random() * 0xffffff
							} );
                                                        
                                                    console.log(object.geometry);  
                                                     var geo = new THREE.Geometry().fromBufferGeometry(object.geometry);
                                                     var volume = calc_vol_and_area(geo);
                                                     returnVal = volume;
                                                      
                                                        var dim =  calc_dimensions(geo);
                                                        console.log(dim);
                                                        returnDim = dim;

						}

					} );

					scene = babylonScene;

					animate();

				}, onProgress, onError );

				//

				
				renderer = new THREE.WebGLRenderer( { antialias: true } );
                                renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( container.clientWidth, container.clientHeight );
				container.appendChild( renderer.domElement );

				//

				window.addEventListener( 'resize', onWindowResize, false );
                                return loader.manager;

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( container.clientWidth, container.clientHeight );

				controls.handleResize();

			}

			//

			function animate() {

				requestAnimationFrame( animate );
				render();

			}

			function render() {

				controls.update();
				renderer.render( scene, camera );

			}

		