var returnVal ;
var returnDim = [0,0,0]; 
			if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
                        var objects, controls;
			var particleLight, pointLight;
			var trunk;
                        
                setElementsWithInfos(initscene());
                function setElementsWithInfos(manager) {

                            manager.onLoad = function ( ) {
                                console.log( 'Loading complete!');
                                console.log(returnVal);
                                console.log(returnDim);
                                displayinfos(returnVal,returnDim);

                            };
                        }

                        function initscene() {
                            var loader = new THREE.AWDLoader();
                     
			loader.materialFactory = createMaterial;
                   
			loader.load(filepath, function ( _trunk ) {

				trunk = _trunk;
                                console.log(trunk);
                                var volume=0;
                                var surface = 0;
                                trunk.traverse(function (child) {
                                        if (child instanceof THREE.Mesh) {
                                             console.log(child.geometry);
                                                  var geo = new THREE.Geometry().fromBufferGeometry(child.geometry);
                                                  var volumesurface = calc_vol_and_area(geo);
                                                  volume = volume + volumesurface[0];
                                                  surface = surface + volumesurface[1];
                                                  returnVal=[volume,surface];
                                                    console.log(returnVal);
                                                   var dim =  calc_dimensions(geo);
                                                        console.log(dim);
                                                        returnDim = [returnDim[0] + dim[0],
                                                                     returnDim[1] + dim[1],
                                                                     returnDim[2] + dim[2]] ;
                                                    
                                                     
                                        }
                                    });

				init();
				render();
                                

			}, function ( xhr ) {
                                   
					if ( xhr.lengthComputable ) {
						var percentComplete = xhr.loaded / xhr.total * 100;
                                                move(percentComplete);
						console.log( Math.round(percentComplete, 2) + '% downloaded' );
					}
				}, function ( xhr ) {
				} );

                         return loader.manager;
                            
                        }

			
			function createMaterial( name ){
			          console.log( name );
			         var mat = new THREE.MeshPhongMaterial({
			  	color: 0x6610f2,
				shininess: 20

			});
			return mat;
				//return null;
			}


			function init() {

				
				camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
				camera.position.set( 70, 50, -100 );

				controls = new THREE.OrbitControls( camera );

				scene = new THREE.Scene();


				// Add the AWD SCENE

				scene.add( trunk );


				// Lights

				scene.add( new THREE.AmbientLight( 0x606060 ) );

				var directionalLight = new THREE.DirectionalLight(/*Math.random() * 0xffffff*/0xeeeeee );
				directionalLight.position.set( .2, -1, .2 );
				directionalLight.position.normalize();
				scene.add( directionalLight );

				pointLight = new THREE.PointLight( 0xffffff, .6 );
				scene.add( pointLight );

				renderer = new THREE.WebGLRenderer( { antialias: true } );
                                renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( container.clientWidth, container.clientHeight );
				container.appendChild( renderer.domElement );

				

				//

				window.addEventListener( 'resize', onWindowResize, false );

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( container.clientWidth, container.clientHeight );

			}



			function render() {

				requestAnimationFrame( render );

				var timer = Date.now() * 0.0005;

				pointLight.position.x = Math.sin( timer * 4 ) * 3000;
				pointLight.position.y = 600;
				pointLight.position.z = Math.cos( timer * 4 ) * 3000;

				renderer.render( scene, camera );

			

			}

		