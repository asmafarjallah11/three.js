   var returnVal;
    var returnDim; 
                       
                       
			setElementsWithInfos(init());
                        function setElementsWithInfos(manager) {

                            manager.onLoad = function ( ) {
                                console.log( 'Loading complete!');
                                console.log(returnVal);
                                console.log(returnDim);
                                displayinfos(returnVal,returnDim);

                            };
                        }

                         function initscene()
                         {
                             scene = new THREE.Scene();
				scene.background = new THREE.Color( 0x999999 );

				scene.add( new THREE.AmbientLight( 0x999999 ) );

				camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 500 );

				// Z is up for objects intended to be 3D printed.

				camera.up.set( 0, 0, 1 );
				camera.position.set( 0, -9, 6 );

				camera.add( new THREE.PointLight( 0xffffff, 0.8 ) );

				scene.add( camera );
                           }
                         function init() {
                                initscene();
				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setSize( container.clientWidth, container.clientHeight );
				container.appendChild( renderer.domElement );

				var loader = new THREE.AMFLoader();
				loader.load( filepath, function ( amfobject ) {
                                       console.log(amfobject);
                                       	amfobject.traverse( function ( child ) {
                                        if ( child instanceof THREE.Mesh ) {
                                                        console.log(child.geometry);
                                                        var geo = new THREE.Geometry().fromBufferGeometry(child.geometry);
                                                        console.log(geo);
                                                        var volume = calc_vol_and_area(geo);
                                                        returnVal=volume;
                                                        var dim =  calc_dimensions(geo);
                                                        returnDim = dim;
                                                        console.log(returnVal);
                                                        console.log(returnDim);
                                                        
                                                    }
                                        } );
					scene.add( amfobject );
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
				controls.target.set( 0, 1.2, 2 );
				controls.update();

				window.addEventListener( 'resize', onWindowResize, false );
                                return loader.manager;

			}
                       
			 function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				//renderer.setSize( window.innerWidth, window.innerHeight );
                                  var container = document.getElementById('viewerbox');
				
				renderer.setSize( container.clientWidth, container.clientHeight );
				

				render();

			}

			 function render() {

				renderer.render( scene, camera );

			}
  /* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


