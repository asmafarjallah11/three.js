  var returnVal;
  var returnDim; 

	if ( ! Detector.webgl ) {Detector.addGetWebGLMessage();	}
                        setElementsWithInfos(init());
                        animate();
			function init() {
                               camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 2000 );

				scene = new THREE.Scene();
                                clock = new THREE.Clock();
                               var  geometry =  new THREE.Geometry();
                               var volume=0;
				var loader2 = new THREE.AssimpJSONLoader();
				loader2.load(filepath, function ( object ) {
                                  console.log(object.object);
                                  console.log(object.scale);
                                    object.traverse( function ( child ) {

						if ( child instanceof THREE.Mesh ) {
                                                      var material = new THREE.MeshPhongMaterial( { color: 0x28a745, specular: 0x111111, shininess: 200 } );
		                                       child.material= material;
                                                       console.log(child.geometry);
                                                       geometry = new THREE.Geometry().fromBufferGeometry(child.geometry);
                                                       console.log (geometry);
                                                       var volume = calc_vol_and_area(geometry);
                                                        returnVal = volume;
                                                       var dim =  calc_dimensions(geometry);
                                                        returnDim = dim;
                                                        console.log(returnVal);
                                                        console.log(returnDim);
						}

					} );
                                        object.scale.multiplyScalar(2);
					scene.add( object );
                                        

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

				var directionalLight = new THREE.DirectionalLight( 0xeeeeee );
				directionalLight.position.set( 1, 1, - 1 );
				directionalLight.position.normalize();
				scene.add( directionalLight );
                                scene.background = new THREE.Color( 0x999999 );
				//

				
                              
				renderer = new THREE.WebGLRenderer( { antialias: true } );
                                renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( container.clientWidth, container.clientHeight );
				container.appendChild( renderer.domElement );
				//


				//

				window.addEventListener( 'resize', onWindowResize, false );
                                return loader2.manager;

			}

			//
                        function onWindowResize() 
                        {
                                var container = document.getElementById('viewerbox');
				renderer.setSize( container.clientWidth, container.clientHeight );

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

			}

			//

			function animate() 
                        {

				requestAnimationFrame( animate );
                               
				render();
				//stats.update();
			}
                         function setElementsWithInfos(manager) {

                            manager.onLoad = function ( ) {
                                console.log( 'Loading complete!');
                                console.log(returnVal);
                                console.log(returnDim);
                                displayinfos(returnVal,returnDim);

                            };
                        }

			//

			function render()
                        {

				var elapsedTime = clock.getElapsedTime();

				camera.position.x = Math.cos( elapsedTime * 0.5 ) * 10;
				camera.position.y = 4;
				camera.position.z = Math.sin( elapsedTime * 0.5 ) * 10;

				camera.lookAt( scene.position );
                                  var container = document.getElementById('viewerbox');
                                renderer.setSize( container.clientWidth, container.clientHeight );
				renderer.render( scene, camera );

			}

	