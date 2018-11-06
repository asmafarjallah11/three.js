//var container, stats;
   var returnVal;
    var returnDim; 
               
			var  effect;
			var mesh, helper;

			var vpds = [];

			var clock = new THREE.Clock();

			
			setElementsWithInfos(init());
                        function setElementsWithInfos(manager) {

                            manager.onLoad = function ( ) {
                                console.log( 'Loading complete!');
                                console.log(returnVal);
                                console.log(returnDim);
                                displayinfos(returnVal,returnDim);

                            };
                        }

			animate();

			function init() {

			    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
				camera.position.z = 25;

				// scene

				scene = new THREE.Scene();
				scene.background = new THREE.Color( 0xffffff );

				var ambient = new THREE.AmbientLight( 0x666666 );
				scene.add( ambient );

				var directionalLight = new THREE.DirectionalLight( 0x887766 );
				directionalLight.position.set( -1, 1, 1 ).normalize();
				scene.add( directionalLight );
                renderer = new THREE.WebGLRenderer( { antialias: true } );
                                renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( container.clientWidth, container.clientHeight );
                                container.appendChild( renderer.domElement );

				effect = new THREE.OutlineEffect( renderer );

				// model

				var onProgress = function ( xhr ) {
					if ( xhr.lengthComputable ) {
						var percentComplete = xhr.loaded / xhr.total * 100;
						console.log( Math.round(percentComplete, 2) + '% downloaded' );
					}
				};

				var onError = function ( xhr ) {
				};
                          
				var modelFile = 'uploads/pmd/miku_v2.pmd';
                                modelFile = filepath.trim();
                             
				var vpdFiles = [
					'models/mmd/vpds/01.vpd',
					'models/mmd/vpds/02.vpd',
					'models/mmd/vpds/03.vpd',
					'models/mmd/vpds/04.vpd',
					'models/mmd/vpds/05.vpd',
					'models/mmd/vpds/06.vpd',
					'models/mmd/vpds/07.vpd',
					'models/mmd/vpds/08.vpd',
					//'models/mmd/vpds/09.vpd',
					//'models/mmd/vpds/10.vpd',
					'models/mmd/vpds/11.vpd'
				];

				helper = new THREE.MMDHelper();

				var loader = new THREE.MMDLoader();

				loader.loadModel( modelFile, function ( object ) {

					mesh = object;
                                        console.log(object);
                                        //its skinned mesh not buffergeometry 
                                        
                                         if ( object instanceof THREE.SkinnedMesh ) {
                                                        console.log(object.geometry);
                                                        var geo = new THREE.Geometry().fromBufferGeometry(object.geometry);
                                                        console.log(geo);
                                                        var volume = calc_vol_and_area(geo);
                                                        returnVal=volume;
                                                        var dim =  calc_dimensions(geo);
                                                        returnDim = dim;
                                                        console.log(returnVal);
                                                        console.log(returnDim);
                                                              }
                                       
                                        
					mesh.position.y = -10;

					scene.add( mesh );


				
				}, function ( xhr ) {
                                   
					if ( xhr.lengthComputable ) {
						var percentComplete = xhr.loaded / xhr.total * 100;
                                                move(percentComplete);
						console.log( Math.round(percentComplete, 2) + '% downloaded' );
					}
				}, function ( xhr ) {
				} );
                  

				//

				window.addEventListener( 'resize', onWindowResize, false );
                                return loader.manager                 }

			function onWindowResize() {

				camera.aspect = container.innerWidth / container.innerHeight;
				camera.updateProjectionMatrix();

				effect.setSize(container.clientWidth, container.clientHeight  );

			}

			//

			function animate() {

				requestAnimationFrame( animate );
				render();

			}

			function render() {

				effect.render( scene, camera );

			}

		