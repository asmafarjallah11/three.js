  	var returnVal;
        var returnDim;


	if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

			

			var  cameraTarget;

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

			
			

				camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 15 );
				camera.position.set( 3, 0.15, 3 );

				cameraTarget = new THREE.Vector3( 0, -0.1, 0 );

				scene = new THREE.Scene();
				scene.background = new THREE.Color( 0x72645b );
				scene.fog = new THREE.Fog( 0x72645b, 2, 15 );


				// Ground

				var plane = new THREE.Mesh(
					new THREE.PlaneBufferGeometry( 40, 40 ),
					new THREE.MeshPhongMaterial( { color: 0x999999, specular: 0x101010 } )
				);
				plane.rotation.x = -Math.PI/2;
				plane.position.y = -0.5;
				scene.add( plane );

				plane.receiveShadow = true;


				// PLY file

				var loader = new THREE.PLYLoader();
				/*loader.load(filepath.trim(), function ( geometry ) {

					geometry.computeVertexNormals();
                                        console.log(geometry);
                                        var geo = new THREE.Geometry().fromBufferGeometry(geometry);
                                                    var volume = calc_vol_and_area(geo);
                                                    console.log(volume);
                                                    document.getElementById('volume').value=volume[0];
                                                    document.getElementById('surface').value=volume[1];

					var material = new THREE.MeshStandardMaterial( { color: 0x0055ff, flatShading: true } );
					var mesh = new THREE.Mesh( geometry, material );

					mesh.position.y = - 0.2;
					mesh.position.z =   0.3;
					mesh.rotation.x = - Math.PI / 2;
					mesh.scale.multiplyScalar( 0.001 );

					mesh.castShadow = true;
					mesh.receiveShadow = true;

					scene.add( mesh );

				} );*/

				loader.load( filepath.trim(), function ( geometry ) {

					 geometry.computeVertexNormals();
                                         console.log(geometry);
                            
                                        var geo = new THREE.Geometry().fromBufferGeometry(geometry);
                                                    var volume = calc_vol_and_area(geo);
                                                    console.log(volume);
                                                    returnVal= volume;
                                                    var dim =  calc_dimensions(geo);
                                                     console.log(dim);
                                                     returnDim = dim;
                                                    
					var material = new THREE.MeshStandardMaterial( { color: 0x0055ff, flatShading: true } );
					var mesh = new THREE.Mesh( geometry, material );

					mesh.position.x = - 0.2;
					mesh.position.y = - 0.02;
					mesh.position.z = - 0.2;
				mesh.scale.multiplyScalar( 0.002 );

					mesh.castShadow = true;
					mesh.receiveShadow = true;

					scene.add( mesh );

				} );

				// Lights

				scene.add( new THREE.HemisphereLight( 0x443333, 0x111122 ) );

				addShadowedLight( 1, 1, 1, 0xffffff, 1.35 );
				addShadowedLight( 0.5, 1, -1, 0xffaa00, 1 );

				// renderer

				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( container.clientWidth, container.clientHeight );

				renderer.gammaInput = true;
				renderer.gammaOutput = true;

				renderer.shadowMap.enabled = true;

				container.appendChild( renderer.domElement );

				// stats

				

				// resize

				window.addEventListener( 'resize', onWindowResize, false );
                                return   loader.manager ;

			}

			function addShadowedLight( x, y, z, color, intensity ) {

				var directionalLight = new THREE.DirectionalLight( color, intensity );
				directionalLight.position.set( x, y, z );
				scene.add( directionalLight );

				directionalLight.castShadow = true;

				var d = 1;
				directionalLight.shadow.camera.left = -d;
				directionalLight.shadow.camera.right = d;
				directionalLight.shadow.camera.top = d;
				directionalLight.shadow.camera.bottom = -d;

				directionalLight.shadow.camera.near = 1;
				directionalLight.shadow.camera.far = 4;

				directionalLight.shadow.mapSize.width = 1024;
				directionalLight.shadow.mapSize.height = 1024;

				directionalLight.shadow.bias = -0.001;

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

				var timer = Date.now() * 0.0005;

				camera.position.x = Math.sin( timer ) * 2.5;
				camera.position.z = Math.cos( timer ) * 2.5;

				camera.lookAt( cameraTarget );

				renderer.render( scene, camera );

			}

	