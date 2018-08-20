   	var returnVal;
        var returnDim;
			if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

			var  controls;
			var  light;

			var clock = new THREE.Clock();

			var mixers = [];
                    
			  setElementsWithInfos(init());
                        function setElementsWithInfos(manager) {

                            manager.onLoad = function ( ) {
                                console.log( 'Loading complete!');
                                displayinfos(returnVal,returnDim);
                                console.log(GetInfos());
                          };
                            
                        }
			animate();
                       
			function init() {


				camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
				camera.position.set( 100, 200, 300 );

				controls = new THREE.OrbitControls( camera );
				controls.target.set( 0, 100, 0 );
				controls.update();

				scene = new THREE.Scene();
				scene.background = new THREE.Color( 0xa0a0a0 );
				scene.fog = new THREE.Fog( 0xa0a0a0, 200, 1000 );

				light = new THREE.HemisphereLight( 0xffffff, 0x444444 );
				light.position.set( 0, 200, 0 );
				scene.add( light );

				light = new THREE.DirectionalLight( 0xffffff );
				light.position.set( 0, 200, 100 );
				light.castShadow = true;
				light.shadow.camera.top = 180;
				light.shadow.camera.bottom = -100;
				light.shadow.camera.left = -120;
				light.shadow.camera.right = 120;
				scene.add( light );

				// scene.add( new THREE.CameraHelper( light.shadow.camera ) );

				// ground
				var mesh = new THREE.Mesh( new THREE.PlaneGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
				mesh.rotation.x = - Math.PI / 2;
				mesh.receiveShadow = true;
				scene.add( mesh );

				var grid = new THREE.GridHelper( 2000, 20, 0x000000, 0x000000 );
				grid.material.opacity = 0.2;
				grid.material.transparent = true;
				scene.add( grid );

				// model
				var loader = new THREE.FBXLoader();
                                var volume = 0;var surface = 0;
                                loader.load(filepath, function ( object ) {
				        console.log(object);
                                        object.mixer = new THREE.AnimationMixer( object );
					mixers.push( object.mixer );
                                        var action = object.mixer.clipAction( object.animations[ 0 ] );
					action.play();
                                        console.log(object);
                                        object.traverse( function ( child ) {
                                         if ( child.isSkinnedMesh ) {
                                             console.log(child);
                                             console.log(child.geometry);

						   child.castShadow = true;
						   child.receiveShadow = true;
                                                 
                                                   var geo = new THREE.Geometry().fromBufferGeometry(child.geometry);
                                                   console.log(geo);
                                                    var volumeg = calc_vol_and_area(geo);
                                                   console.log(volumeg);
                                                   volume = volume + volumeg[0];
                                                   console.log(volume);
                                                   surface = surface + volumeg[1];
                                                   console.log(surface);
                                                   returnVal = [volume,surface];
                                                   console.log(volume);
                                                   var dim = calc_dimensions(geo);
                                                    console.log(dim);
                                                    returnDim = dim;
                                                    console.log(returnDim);
                                                    
                                                   
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
                            
                                renderer = new THREE.WebGLRenderer( { antialias: true } );
                                renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( container.clientWidth, container.clientHeight );
				//container.appendChild( renderer.domElement );
			renderer.gammaInput = true;
			renderer.gammaOutput = true;
			renderer.shadowMap.enabled = true;
			container.appendChild( renderer.domElement );

				window.addEventListener( 'resize', onWindowResize, false );
                          console.log(loader.manager) ;
			 return loader.manager;	

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				//renderer.setSize( window.innerWidth, window.innerHeight );
                                renderer.setSize( container.clientWidth, container.clientHeight );

			}

			//

			function animate() {

				requestAnimationFrame( animate );

				if ( mixers.length > 0 ) {

					for ( var i = 0; i < mixers.length; i ++ ) {

						mixers[ i ].update( clock.getDelta() );

					}

				}

				renderer.render( scene, camera );

				

			}

	

