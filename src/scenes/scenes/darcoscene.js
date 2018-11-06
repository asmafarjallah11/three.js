var returnVal;
var returnDim;
                
		// Configure and create Draco decoder.
		THREE.DRACOLoader.setDecoderPath('examples/js/libs/draco/');
		THREE.DRACOLoader.setDecoderConfig({type: 'js'});
		var dracoLoader = new THREE.DRACOLoader();
         
		//init();
                  setElementsWithInfos(init());
                        function setElementsWithInfos(manager) {

                            manager.onLoad = function ( ) {
                                console.log( 'Loading complete!');
                                console.log(returnVal);
                                console.log(returnDim);
                                 setTimeout(function() {
                                displayinfos(returnVal,returnDim);
                                  },500);

                            };
                        }
     
		animate();

		function init() {

			camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 0.1, 15 );
			camera.position.set( 3, 0.25, 3 );

			scene = new THREE.Scene();
			scene.background = new THREE.Color( 0x443333 );
			scene.fog = new THREE.Fog( 0x443333, 1, 4 );

			// Ground
			var plane = new THREE.Mesh(
				new THREE.PlaneBufferGeometry( 8, 8 ),
				new THREE.MeshPhongMaterial( { color: 0x999999, specular: 0x101010 } )
			);
			plane.rotation.x = - Math.PI / 2;
			plane.position.y = 0.03;
			plane.receiveShadow = true;
			scene.add(plane);

			// Lights
			var light = new THREE.HemisphereLight( 0x443333, 0x111122 );
			scene.add( light );

			var light = new THREE.SpotLight();
			light.angle = Math.PI / 16;
			light.penumbra = 0.5;
			light.castShadow = true;
			light.position.set( - 1, 1, 1 );
			scene.add( light );

			dracoLoader.load(filepath, function ( geometry ) {
                                console.log(geometry);
				geometry.computeVertexNormals();
                                
                                
                               var geo = new THREE.Geometry().fromBufferGeometry(geometry);
                               
                               var volume = calc_vol_and_area(geo);
                               returnVal = volume;
                               console.log(volume);
                               var dim =  calc_dimensions(geo);
                               console.log(dim);
                               returnDim = dim;
                         //     document.getElementById('volume').value=volume[0];
                           //   document.getElementById('surface').value=volume[1];

				//var material = new THREE.MeshStandardMaterial( { vertexColors: THREE.VertexColors } );
                               var material = new THREE.MeshPhongMaterial( { color: 0xdc3545, specular: 0x111111, shininess: 200 } );
		

				var mesh = new THREE.Mesh( geometry, material );
				mesh.castShadow = true;
				mesh.receiveShadow = true;
				scene.add( mesh );

				// Release decoder resources.
				THREE.DRACOLoader.releaseDecoderModule();

			}, function ( xhr ) {
                                   
					if ( xhr.lengthComputable ) {
						var percentComplete = xhr.loaded / xhr.total * 100;
                                                move(percentComplete);
						console.log( Math.round(percentComplete, 2) + '% downloaded' );
					}
				}, function ( xhr ) {
				} );

			// renderer
		                renderer = new THREE.WebGLRenderer( { antialias: true } );
                                renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( container.clientWidth, container.clientHeight );
				//container.appendChild( renderer.domElement );
			renderer.gammaInput = true;
			renderer.gammaOutput = true;
			renderer.shadowMap.enabled = true;
			container.appendChild( renderer.domElement );

			window.addEventListener( 'resize', onWindowResize, false );
                        return dracoLoader.manager;

		}

		function onWindowResize() {

			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();

	                renderer.setSize( container.clientWidth, container.clientHeight );

		}

		function animate() {

			render();
			requestAnimationFrame( animate );

		}

		function render() {

			var timer = Date.now() * 0.0003;

			camera.position.x = Math.sin( timer ) * 0.5;
			camera.position.z = Math.cos( timer ) * 0.5;
			camera.lookAt( new THREE.Vector3( 0, 0.1, 0 ) );

			renderer.render( scene, camera );

		}
	