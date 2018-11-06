	var returnVal;
        var returnDim;
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
                     var  controls;

			
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

				camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.01, 1e10 );
				camera.position.z = 6;

				controls = new THREE.OrbitControls( camera );

				scene = new THREE.Scene();
				scene.add( camera );

				// light

				var dirLight = new THREE.DirectionalLight( 0xffffff );
				dirLight.position.set( 200, 200, 1000 ).normalize();

				camera.add( dirLight );
				camera.add( dirLight.target );

				var loader = new THREE.VRMLLoader();
				loader.load(filepath.trim(), function ( object ) {

					scene.add( object );
                                        console.log(object);
                                         object.traverse( function ( child ) {
                                                if ( child instanceof THREE.Mesh ) {
                                                    console.log(child.geometry);
                                                     var geometry = new THREE.Geometry().fromBufferGeometry(child.geometry);
                                                       console.log (geometry);
                                                       var volume = calc_vol_and_area(geometry);
                                                        returnVal = volume;
                                                       var dim =  calc_dimensions(geometry);
                                                        returnDim = dim;
                                                        console.log(returnVal);
                                                        console.log(returnDim);
                                                 }
                                         } );

				}, function ( xhr ) {
                                   
					if ( xhr.lengthComputable ) {
						var percentComplete = xhr.loaded / xhr.total * 100;
                                                move(percentComplete);
						console.log( Math.round(percentComplete, 2) + '% downloaded' );
					}
				}, function ( xhr ) {
				} );

				// renderer

				renderer = new THREE.WebGLRenderer();
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( container.clientWidth, container.clientHeight );
                                container.appendChild( renderer.domElement );
                                window.addEventListener( 'resize', onWindowResize, false );
                                  return loader.manager ;

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
                                renderer.setSize( container.clientWidth, container.clientHeight );

			}

			function animate() {

				requestAnimationFrame( animate );

				renderer.render( scene, camera );

				//stats.update();

			}

	