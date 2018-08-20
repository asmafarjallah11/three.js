    var returnVal;
    var returnDim;
                         if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
                      setElementsWithInfos(init());
			     
                        function initscene()
                        {
                                renderer = new THREE.WebGLRenderer( { antialias: true } );
				scene = new THREE.Scene();
				//scene.background = new THREE.Color( 0x333333 );
                                scene.background = new THREE.Color( 0xececec );
				scene.fog = new THREE.Fog( 0x72645b, 2, 15 ); 

				scene.add( new THREE.AmbientLight( 0xffffff, 0.2 ) );

				camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 500 );

				// Z is up for objects intended to be 3D printed.

				camera.up.set( 0, 0, 1 );
				camera.position.set( - 80, - 90, 150 );
				scene.add( camera );

				var controls = new THREE.OrbitControls( camera, renderer.domElement );
				controls.addEventListener( 'change', render );
				controls.minDistance = 50;
				controls.maxDistance = 300;
				controls.enablePan = false;
				controls.target.set( 80, 65, 20 );
				controls.update();

				var pointLight = new THREE.PointLight( 0xffffff, 0.8 );
				camera.add( pointLight );
                            
                        }
			function  finalizerenderer()
                        {   
		            renderer.setSize( container.clientWidth, container.clientHeight );
		            container.appendChild( renderer.domElement );
                           window.addEventListener( 'resize', onWindowResize, false );
                        }
                        function init() {
                                initscene();
                                var loader = new THREE.ThreeMFLoader();
                                var volume=0;
                                var surface=0;
				loader.load( filepath, function ( object ) {
                                        console.log(object);
                                        	object.traverse( function ( child ) {
                                                      if ( child instanceof THREE.Mesh ) {
                                                        console.log(child.geometry);  
                                                        var geo = new THREE.Geometry().fromBufferGeometry(child.geometry);
                                                       console.log(geo);
                                                       var volumegeo = calc_vol_and_area(geo);
                                                        volume = volume+volumegeo[0];
                                                        surface = surface+volumegeo[1];
                                                        returnVal = [volume,surface];
                                                        var dim =  calc_dimensions(child.geometry);
                                                        console.log(dim);
                                                        returnDim = dim;
                                                        console.log(returnVal);
                                                        console.log(returnDim);
                                                        
                                                      }
                                                     
                                                  } );
                                        scene.add( object );
					render();
                                 }, function ( xhr ) {
                                   
					if ( xhr.lengthComputable ) {
						var percentComplete = xhr.loaded / xhr.total * 100;
                                                move(percentComplete);
						console.log( Math.round(percentComplete, 2) + '% downloaded' );
					}
				}, function ( xhr ) {
				} );
                                 finalizerenderer();
                                 return loader.manager;
                         }
                        
                                                  

                        function setElementsWithInfos(manager) {

                            manager.onLoad = function ( ) {
                                console.log( 'Loading complete!');
                                console.log(returnVal);
                                console.log(returnDim);
                                displayinfos(returnVal,returnDim);

                            };
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
                    
                       