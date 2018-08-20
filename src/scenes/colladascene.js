
			if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

			var  stats, clock;
			var  elf;
                    

			var returnVal;
                        var returnDim;
                        var lmanager=init();
                        console.log(lmanager);
                        setElementsWithInfos(init());
                        function setElementsWithInfos(manager) {

                            manager.onLoad = function ( ) {
                                console.log( 'Loading complete!');
                                console.log(returnVal);
                                console.log(returnDim);
                                displayinfos(returnVal,returnDim);
                               var canvases = document.getElementsByTagName('canvas');
                               canvases[0].remove();
                        
                            };
                        }

			animate();


                      function setMaterial (node, zmaterial) {
                            node.material = material;
                            if (node.children) {
                              for (var i = 0; i < node.children.length; i++) {
                                setMaterial(node.children[i], material);
                              }
                            }
                          }
			function init() {

				

				camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 2000 );
				camera.position.set( 8, 10, 8 );
				camera.lookAt( new THREE.Vector3( 0, 3, 0 ) );

				scene = new THREE.Scene();

				clock = new THREE.Clock();

				// loading manager

				var loadingManager = new THREE.LoadingManager( function() {

					scene.add( elf );

				} );

				// collada

				var loader = new THREE.ColladaLoader( loadingManager );
				loader.load(filepath, function ( collada ) {
                                     //  setMaterial(collada, new THREE.MeshBasicMaterial({color: 0xff0000}));
                                      console.log (collada);
			              elf = collada.scene;
                                      console.log (elf);
                                      elf.traverse( function ( object ) {

						if ( object instanceof THREE.Mesh ) {
                                                    console.log(object.geometry);  
                                                    var geo = new THREE.Geometry().fromBufferGeometry(object.geometry);
                                                    var volume = calc_vol_and_area(geo);
                                                    returnVal = volume;
                                                    console.log(volume);
                                                    var dim =  calc_dimensions(geo);
                                                    console.log(dim);
                                                    returnDim = dim;
                                                  
                                                  } ;
                                                } );

				}, function ( xhr ) {
                                   
					if ( xhr.lengthComputable ) {
						var percentComplete = xhr.loaded / xhr.total * 100;
                                                move(percentComplete);
						console.log( Math.round(percentComplete, 2) + '% downloaded' );
					}
				}, function ( xhr ) {
				} );
                  

				var ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
				scene.add( ambientLight );

				var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
				directionalLight.position.set( 1, 1, 0 ).normalize();
				scene.add( directionalLight );

                                console.log(scene.userData);
				// renderer
				renderer = new THREE.WebGLRenderer( { antialias: true } );
                                renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( container.clientWidth, container.clientHeight );
				container.appendChild( renderer.domElement );

				window.addEventListener( 'resize', onWindowResize, false );
                                return loadingManager;

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( container.clientWidth, container.clientHeight );

			}

			function animate() {

				requestAnimationFrame( animate );

				render();
			

			}

			function render() {

				var delta = clock.getDelta();

				if ( elf !== undefined ) {

					elf.rotation.z += delta * 0.5;

				}

				renderer.render( scene, camera );

			}

	