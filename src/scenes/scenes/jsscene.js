   	var returnVal;
        var returnDim;
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

			var   clock, mixer;
			var  objects;
                   

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

				camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 2000 );
				camera.position.set( 2, 4, 5 );

				clock = new THREE.Clock();

				scene = new THREE.Scene();
				scene.fog = new THREE.FogExp2( 0x000000, 0.035 );

				mixer = new THREE.AnimationMixer( scene );

				var loader = new THREE.JSONLoader();
				loader.load(filepath, function ( geometry, materials ) {

					// adjust color a bit

					var material = materials[ 0 ];
					material.morphTargets = true;
					material.color.setHex( 0xffaaaa );
                                        var volume=0;
                                        var surface=0;
					for ( var i = 0; i < 729; i ++ ) {

						var mesh = new THREE.Mesh( geometry, materials );
                                                console.log (geometry);
                                                var volume3d =   calc_vol_and_area(geometry);
                                                 console.log(volume3d);
                                                 volume = volume+volume3d[0];
                                                 surface = surface+volume3d[1];
                                                 returnVal = [volume,surface];
                                                  var dim =  calc_dimensions(geometry);
                                                    console.log(dim);
                                                    returnDim = dim;

						// random placement in a grid

						var x = ( ( i % 27 )  - 13.5 ) * 2 + THREE.Math.randFloatSpread( 1 );
						var z = ( Math.floor( i / 27 ) - 13.5 ) * 2 + THREE.Math.randFloatSpread( 1 );

						mesh.position.set( x, 0, z );

						//var s = THREE.Math.randFloat( 0.00075, 0.001 );
						mesh.scale.set( 0.005, 0.005, 0.005 );

						mesh.rotation.y = THREE.Math.randFloat( -0.25, 0.25 );

						mesh.matrixAutoUpdate = false;
						mesh.updateMatrix();

						scene.add( mesh );

						mixer.clipAction( geometry.animations[ 0 ], mesh )
								.setDuration( 1 )			// one second
								.startAt( - Math.random() )	// random phase (already running)
								.play();					// let's go

					}

				}, function ( xhr ) {
                                   
					if ( xhr.lengthComputable ) {
						var percentComplete = xhr.loaded / xhr.total * 100;
                                                move(percentComplete);
						console.log( Math.round(percentComplete, 2) + '% downloaded' );
					}
				}, function ( xhr ) {
				} );

				// lights

				var ambientLight = new THREE.AmbientLight( 0xcccccc );
				scene.add( ambientLight );

				var pointLight = new THREE.PointLight( 0xff4400, 5, 30 );
				pointLight.position.set( 5, 0, 0 );
				scene.add( pointLight );

				// renderer
                                renderer = new THREE.WebGLRenderer( { antialias: true } );
                                renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( container.clientWidth, container.clientHeight );
                                container.appendChild( renderer.domElement );
				// events

				window.addEventListener( 'resize', onWindowResize, false );
                                return loader.manager;	

			}

			//

			function onWindowResize( event ) {

				renderer.setSize( container.clientWidth, container.clientHeight );

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

			}

			//

			function animate() {

				requestAnimationFrame( animate );

				render();
				

			}

			function render() {

				var timer = Date.now() * 0.0005;

				camera.position.x = Math.cos( timer ) * 10;
				camera.position.y = 4;
				camera.position.z = Math.sin( timer ) * 10;

				mixer.update( clock.getDelta() );

				camera.lookAt( scene.position );

				renderer.render( scene, camera );

			}

