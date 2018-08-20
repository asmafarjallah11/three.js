
			var camera, controls, scene, renderer;

			init();
			animate();
			function init() {

				scene = new THREE.Scene();
				scene.background = new THREE.Color( 0x000000 );

				camera = new THREE.PerspectiveCamera( 15, window.innerWidth / window.innerHeight, 0.01, 40 );
				camera.position.x = 0.4;
				camera.position.z = -2;
				camera.up.set(0,0,1);

				controls = new THREE.TrackballControls( camera );

				controls.rotateSpeed = 2.0;
				controls.zoomSpeed = 0.3;
				controls.panSpeed = 0.2;

				controls.noZoom = false;
				controls.noPan = false;

				controls.staticMoving = true;
				controls.dynamicDampingFactor = 0.3;

				controls.minDistance = 0.3;
				controls.maxDistance = 0.3 * 100;

				scene.add( camera );

				
				

				var loader = new THREE.PCDLoader();
				loader.load(filepath.trim(), function ( mesh ) {

					scene.add( mesh );
                                        console.log(mesh.geometry);
                                        mesh.geometry.computeVertexNormals ();
                                        //can not be converted to geometry.
                                       var geo = new THREE.Geometry().fromBufferGeometry(mesh.geometry);
                                        console.log(geo);
                                     //   var volume = calc_vol_and_area(geo);
                                        //             console.log(volume);         
					var center = mesh.geometry.boundingSphere.center;
					controls.target.set( center.x, center.y, center.z);
					controls.update();

				} );
                                 
                            
                            renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( container.clientWidth, container.clientHeight );
                            container.appendChild( renderer.domElement );
				


				window.addEventListener( 'resize', onWindowResize, false );

				window.addEventListener('keypress', keyboard);

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( container.innerWidth, container.innerHeight );
				controls.handleResize();

			}

			function keyboard ( ev ) {

				var ZaghettoMesh = scene.getObjectByName( 'Zaghetto.pcd' );

				switch ( ev.key || String.fromCharCode( ev.keyCode || ev.charCode ) ) {

					case '+':
						ZaghettoMesh.material.size*=1.2;
						ZaghettoMesh.material.needsUpdate = true;
						break;

					case '-':
						ZaghettoMesh.material.size/=1.2;
						ZaghettoMesh.material.needsUpdate = true;
						break;

					case 'c':
						ZaghettoMesh.material.color.setHex(Math.random()*0xffffff);
						ZaghettoMesh.material.needsUpdate = true;
						break;

				}

			}

			function animate() {

				requestAnimationFrame( animate );
				controls.update();
				renderer.render( scene, camera );
			

			}
