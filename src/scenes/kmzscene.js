	var returnVal;
        var returnDim;
        if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

		
                      

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

			function init() {

				scene = new THREE.Scene();
				scene.background = new THREE.Color( 0x999999 );

				var light = new THREE.DirectionalLight( 0xffffff );
				light.position.set( 0.5, 1.0, 0.5 ).normalize();

				scene.add( light );

				camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 500 );

				camera.position.y = 5;
				camera.position.z = 10;

				scene.add( camera );

				var grid = new THREE.GridHelper( 50, 50, 0xffffff, 0x555555 );
				scene.add( grid );

				renderer = new THREE.WebGLRenderer( { antialias: true } );
                                renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( container.clientWidth, container.clientHeight );
                                container.appendChild( renderer.domElement );

				var loader = new THREE.KMZLoader();
				loader.load(filepath, function ( kmz ) {

					kmz.scene.position.y = 0.5;
					scene.add( kmz.scene );
                                        console.log(kmz.scene);
                                        var kmzobj=kmz.scene;
                                        kmzobj.traverse( function ( object ) {

						if ( object instanceof THREE.Mesh ) {
                                                    
                                                    console.log(object.geometry);  
                                                      var geo = new THREE.Geometry().fromBufferGeometry(object.geometry);
                                                    console.log(geo);    
                                             
                                                    var volume = calc_vol_and_area(geo);
                                                    returnVal = volume;
                                                    console.log(volume);
                                                    var dim =  calc_dimensions(geo);
                                                    console.log(dim);
                                                    returnDim = dim;
                                                  
                                                 } ;
                                                
                                                } );
					render();

				}, function ( xhr ) {
                                   
					if ( xhr.lengthComputable ) {
						var percentComplete = xhr.loaded / xhr.total * 100;
                                                move(percentComplete);
						console.log( Math.round(percentComplete, 2) + '% downloaded' );
					}
				}, function ( xhr ) {
				} );

				var controls = new THREE.OrbitControls( camera, renderer.domElement );
				controls.addEventListener( 'change', render );
				controls.update();

				window.addEventListener( 'resize', onWindowResize, false );
                              return loader.manager;
			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( container.clientWidth, container.clientHeight );

				render();

			}

			function render() {

				renderer.render( scene, camera );

			}

		


