 	var returnVal;
        var returnDim;


			var mouseX = 0, mouseY = 0;

			var windowHalfX = window.innerWidth / 2;
			var windowHalfY = window.innerHeight / 2;


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

				//document.getElementById( 'endianness' ).innerHTML = THREE.PRWMLoader.isBigEndianPlatform() ? 'big-endian' : 'little-endian';
			

				camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
				camera.position.z = 250;

				// scene

				scene = new THREE.Scene();

				var ambient = new THREE.AmbientLight( 0x101030 );
				scene.add( ambient );

				var directionalLight = new THREE.DirectionalLight( 0xffeedd );
				directionalLight.position.set( 0, 0, 1 );
				scene.add( directionalLight );

				// model

				var loader = new THREE.PRWMLoader();
				var material = new THREE.MeshPhongMaterial( {} );
				var busy = false;
				var mesh = null;

				var onProgress = function ( xhr ) {

					if ( xhr.lengthComputable ) {

						var percentComplete = xhr.loaded / xhr.total * 100;
						console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
                                                 move(percentComplete);
						if ( xhr.loaded === xhr.total ) {

							console.log( 'File size: ' + ( xhr.total / 1024 ).toFixed( 2 ) + 'kB' );
							console.timeEnd( 'Download' );

						}

					}

				};

				var onError = function ( xhr ) {

					busy = false;

				};

				function loadGeometry( url ) {

					if ( busy ) return;

					busy = true;

					if ( mesh !== null ) {

						scene.remove( mesh );
						mesh.geometry.dispose();
                                                console.log(mesh.geometry);

					}

					console.log( '-- Loading', url );
					console.time( 'Download' );

					loader.load(filepath.trim(), function ( geometry ) {

						mesh = new THREE.Mesh( geometry, material );
						mesh.scale.set( 50, 50, 50 );
						scene.add( mesh );
                                                console.log(geometry);
                                                var geo = new THREE.Geometry().fromBufferGeometry(geometry);
                                                    var volume = calc_vol_and_area(geo);
                                                    console.log(volume);
                                                    returnVal= volume;
                                                    var dim =  calc_dimensions(geo);
                                                    console.log(dim);
                                                    returnDim = dim;
						console.log( geometry.index ? 'indexed geometry' : 'non-indexed geometry' );
						console.log( '# of vertices: ' + geometry.attributes.position.count );
						console.log( '# of polygons: ' + ( geometry.index ? geometry.index.count / 3 : geometry.attributes.position.count / 3 ) );
						busy = false;

					}, onProgress, onError );

				}

				//

				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( 1 );
				renderer.setSize( container.clientWidth, container.clientHeight );
				container.appendChild( renderer.domElement );

				document.addEventListener( 'mousemove', onDocumentMouseMove, false );

				//

				document.querySelectorAll( 'a.model' ).forEach( function ( anchor ) {

					anchor.addEventListener( 'click', function ( e ) {

						e.preventDefault();

						loadGeometry( anchor.href );

					} );

				} );

				//

				// * is automatically replaced by 'le' or 'be' depending on the client platform's endianness
				loadGeometry( './models/prwm/smooth-suzanne.*.prwm' );

				window.addEventListener( 'resize', onWindowResize, false );
                                return loader.manager ;

			}

			function onWindowResize() {

				windowHalfX = window.innerWidth / 2;
				windowHalfY = window.innerHeight / 2;

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( container.clientWidth, container.clientHeight );

			}

			function onDocumentMouseMove( event ) {

				mouseX = ( event.clientX - windowHalfX ) / 2;
				mouseY = ( event.clientY - windowHalfY ) / 2;

			}

			//

			function animate() {

				requestAnimationFrame( animate );
				render();

			}

			function render() {

				camera.position.x += ( mouseX - camera.position.x ) * .05;
				camera.position.y += ( - mouseY - camera.position.y ) * .05;

				camera.lookAt( scene.position );

				renderer.render( scene, camera );

			}

		