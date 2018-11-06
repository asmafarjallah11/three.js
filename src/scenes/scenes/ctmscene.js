var returnVal;
var returnDim;
                     
                      

	                var SCREEN_WIDTH = window.innerWidth;
			var SCREEN_HEIGHT = window.innerHeight;
                        var mesh, zmesh, geometry;

			var mouseX = 0, mouseY = 0;

			var windowHalfX = window.innerWidth / 2;
			var windowHalfY = window.innerHeight / 2;

			var textureLoader = new THREE.TextureLoader();
			var cubeTextureLoader = new THREE.CubeTextureLoader();
                        var loader = new THREE.CTMLoader();
                       //  setElementsWithInfos(init());
                        function setElementsWithInfos(loader) {
                                loader.onLoadComplete=function(){
                                console.log( 'Loading complete!');
                                console.log(returnVal);
                                console.log(returnDim);
                              displayinfos(returnVal,returnDim);
                              var canvases = document.getElementsByTagName('canvas');
                               canvases[0].remove();
                               };
                               loader.onLoadProgress=function(xhr){
                                if ( xhr.lengthComputable ) {
						var percentComplete = xhr.loaded / xhr.total * 100;
                                                move(percentComplete);
						console.log( Math.round(percentComplete, 2) + '% downloaded' );
					}
                               };
                        }
                        
                        document.addEventListener('mousemove', onDocumentMouseMove, false);

			init();
			animate();


			function init() {
                                camera = new THREE.PerspectiveCamera( 20, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 2000 );
				camera.position.z = 800;

				scene = new THREE.Scene();
				scene.background = new THREE.Color( 0xf8f9fa );
				scene.fog = new THREE.Fog( 0x050505, 800, 2000 );

				var path = "examples/textures/cube/SwedishRoyalCastle/";
				var format = '.jpg';
				var urls = [
					path + 'px' + format, path + 'nx' + format,
					path + 'py' + format, path + 'ny' + format,
					path + 'pz' + format, path + 'nz' + format
				];

				//reflectionCube = cubeTextureLoader.load( urls );

				// LIGHTS

				var ambient = new THREE.AmbientLight( 0x040404 );
				scene.add( ambient );

				var light = new THREE.SpotLight( 0xffeedd, 1.2, 650, Math.PI / 6 );
				light.position.set( 0, -100, 500 );

				light.castShadow = true;
				light.shadow.mapWidth = 1024;
				light.shadow.mapHeight = 1024;
				// scene.add( new THREE.CameraHelper( light.shadow.camera ) );

				scene.add( light );


				//
                                renderer = new THREE.WebGLRenderer( { antialias: true } );
                                renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( container.clientWidth, container.clientHeight );
				container.appendChild( renderer.domElement );
				renderer.gammaInput = true;
				renderer.gammaOutput = true;

				window.addEventListener( 'resize', onWindowResize, false );

				// LOADER

				var c = 0, s = Date.now();

				function checkTime() {

					c ++;

					if ( c === 3 ) {

						var e = Date.now();
						console.log( "Total parse time: " + (e-s) + " ms" );

					}

				}

				

				loader.load( filepath,   function( geometry ) {
                                       console.log(geometry);
                                          var geo = new THREE.Geometry().fromBufferGeometry(geometry);
                                                     var volume = calc_vol_and_area(geo);
                                                       var volume = calc_vol_and_area(geo);
                                                       returnVal = volume;
                                                       var dim =  calc_dimensions(geo);
                                                       console.log(dim);
                                                       returnDim = dim;
                                                        console.log( 'Loading complete!');
                                                        console.log(returnVal);
                                                        console.log(returnDim);
                                                      displayinfos(returnVal,returnDim);
                                             var material = new THREE.MeshLambertMaterial( { color: 0xffffff } );
					//var material = new THREE.MeshLambertMaterial( { color: 0xffaa00, map: textureLoader.load( "textures/UV_Grid_Sm.jpg" ), envMap: reflectionCube, combine: THREE.MixOperation, reflectivity: 0.3 } );
					callbackModel( geometry, 450, material, 0, -200, 0, 0, 0 );
					checkTime();

				}, { useWorker: true } );
                                

				/*loader.load( "models/ctm/WaltHead.ctm",  function( geometry ) {

					var material1 = new THREE.MeshLambertMaterial( { color: 0xffffff } );
					var material2 = new THREE.MeshPhongMaterial( { color: 0xff4400, specular: 0x333333, shininess: 100 } );
					var material3 = new THREE.MeshPhongMaterial( { color: 0x00ff44, specular: 0x333333, shininess: 100 } );

					callbackModel( geometry, 5, material1, -200, 0, -50, 0, 0 );
					callbackModel( geometry, 2, material2,  100, 0, 125, 0, 0 );
					callbackModel( geometry, 2, material3, -100, 0, 125, 0, 0 );

					checkTime();

				}, { useWorker: true } );*/

				/*loader.load( "models/ctm/LeePerry.ctm",  function( geometry ) {

					var material = new THREE.MeshPhongMaterial( {

						specular: 0x303030,
						shininess: 50,
						map: textureLoader.load( "models/json/leeperrysmith/Map-COL.jpg" ),
						specularMap: textureLoader.load( "models/json/leeperrysmith/Map-SPEC.jpg" ),
						normalMap: textureLoader.load( "models/json/leeperrysmith/Infinite-Level_02_Tangent_SmoothUV.jpg" ),
						normalScale: new THREE.Vector2( 0.8, 0.8 )

					} );

					callbackModel( geometry, 1300, material, 200, 50, 0, 0, 0 );
					checkTime();

				}, { useWorker: true } );*/
                            return loader;

			}

			function callbackModel( geometry, s, material, x, y, z, rx, ry ) {

				var mesh = new THREE.Mesh( geometry, material );

				mesh.position.set( x, y, z );
				mesh.scale.set( s, s, s );
				mesh.rotation.x = rx;
				mesh.rotation.z = ry;

				mesh.castShadow = true;
				mesh.receiveShadow = true;

				scene.add( mesh );

			}

			//

			function onWindowResize( event ) {

				SCREEN_WIDTH = window.innerWidth;
				SCREEN_HEIGHT = window.innerHeight;

				renderer.setSize( container.clientWidth, container.clientHeight );

				camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
				camera.updateProjectionMatrix();

			}

			function onDocumentMouseMove( event ) {

				mouseX = ( event.clientX - windowHalfX );
				mouseY = ( event.clientY - windowHalfY );

			}

			//

			function animate() {

				requestAnimationFrame( animate );

				render();
				//stats.update();

			}

			function render() {

				camera.position.x += ( mouseX - camera.position.x ) * .05;
				camera.position.y += ( - mouseY - camera.position.y ) * .05;

				camera.lookAt( scene.position );

				renderer.render( scene, camera );

			}

	