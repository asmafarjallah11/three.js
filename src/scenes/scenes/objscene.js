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

				

				camera = new THREE.PerspectiveCamera( 45, container.clientWidth / container.clientHeight, 1, 2000 );
				camera.position.z = 250;

				// scene

				scene = new THREE.Scene();

				var ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
				scene.add( ambientLight );

				var pointLight = new THREE.PointLight( 0xffffff, 0.8 );
				camera.add( pointLight );
				scene.add( camera );

				// texture

				var manager = new THREE.LoadingManager();
				manager.onProgress = function ( item, loaded, total ) {

					//console.log( item, loaded, total );

				};

				var textureLoader = new THREE.TextureLoader( manager );
				var texture = textureLoader.load( 'examples/textures/UV_Grid_Sm.jpg' );

				// model

				/*var onProgress = function ( xhr ) {
					if ( xhr.lengthComputable ) {
						var percentComplete = xhr.loaded / xhr.total * 100;
					//	console.log( Math.round(percentComplete, 2) + '% downloaded' );
					}
				};

				var onError = function ( xhr ) {
				};*/
                                var geo=new THREE.Geometry;
				var loader = new THREE.OBJLoader( manager );
				loader.load(filepath.trim(), function ( object ) {
                                     // console.log(object);
					object.traverse( function ( child ) {

						if ( child instanceof THREE.Mesh ) {

							//child.material.map = texture;
                                                         var material = new THREE.MeshPhongMaterial( { color: 0xff5533, specular: 0x111111, shininess: 200 } );
		                                	child.material= material;
                                                        console.log(child.geometry);
                                                 
                                                      
                                          }
					} );                              
					scene.add( object );

				}, function ( xhr ) {
                                   
					if ( xhr.lengthComputable ) {
						var percentComplete = xhr.loaded / xhr.total * 100;
                                                move(percentComplete);
						console.log( Math.round(percentComplete, 2) + '% downloaded' );
					}
				}, function ( xhr ) {
				} );

				// parsing file data 
                                var vf_data;
                                var fileparser = new THREE.FileLoader(manager );
                             
                                fileparser.load( filepath.trim(), function ( text ) {
                              
				  vf_data= parse_obj(text);
                                  console.log(vf_data);
                                  geo.vertices=vf_data.vertices;
                                  geo.faces=vf_data.faces;
                                  var volume = calc_vol_and_area(geo);
                                   returnVal = volume;
                                   console.log(volume);
                                   var dim =  calc_dimensions(geo);
                                   console.log(dim);
                                   returnDim = dim;

			          } );
                                  console.log(vf_data);
                                  
				renderer = new THREE.WebGLRenderer();
			        renderer.setSize( container.clientWidth, container.clientHeight );
				container.appendChild( renderer.domElement );

				document.addEventListener( 'mousemove', onDocumentMouseMove, false );

				//

				window.addEventListener( 'resize', onWindowResize, false );
                                return   manager;

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
                        
                       // fonction pour le calcul de volume
                   function parse_obj (s)
                        {
                                var obj_string = s;
                                console.log(s);


                                        function vector( x, y, z ) {

                                                return new THREE.Vector3( parseFloat( x ), parseFloat( y ), parseFloat( z ) );

                                        }

                                        function uv( u, v ) {

                                                return new THREE.Vector2( parseFloat( u ), parseFloat( v ) );

                                        }

                                        function face3( a, b, c, normals ) {

                                                return new THREE.Face3( a, b, c, normals );

                                        }

                                        var object = new THREE.Object3D();
                                        var geometry, material, mesh;

                                        function parseVertexIndex( index ) {

                                                index = parseInt( index );

                                                return index >= 0 ? index - 1 : index + vertices.length;

                                        }

                                        function parseNormalIndex( index ) {

                                                index = parseInt( index );

                                                return index >= 0 ? index - 1 : index + normals.length;

                                        }

                                        function parseUVIndex( index ) {

                                                index = parseInt( index );

                                                return index >= 0 ? index - 1 : index + uvs.length;

                                        }

                                        function add_face( a, b, c, normals_inds ) {

                                                //if ( normals_inds === undefined )
                                                if (1==1)
                                                {

                                                        geometry.faces.push( face3(
                                                                vertices[ parseVertexIndex( a ) ] - 1,
                                                                vertices[ parseVertexIndex( b ) ] - 1,
                                                                vertices[ parseVertexIndex( c ) ] - 1
                                                        ) );

                                                } else {

                                                        geometry.faces.push( face3(
                                                                vertices[ parseVertexIndex( a ) ] - 1,
                                                                vertices[ parseVertexIndex( b ) ] - 1,
                                                                vertices[ parseVertexIndex( c ) ] - 1,
                                                                [
                                                                        normals[ parseNormalIndex( normals_inds[ 0 ] ) ].clone(),
                                                                        normals[ parseNormalIndex( normals_inds[ 1 ] ) ].clone(),
                                                                        normals[ parseNormalIndex( normals_inds[ 2 ] ) ].clone()
                                                                ]
                                                        ) );

                                                }

                                        }

                                        function add_uvs( a, b, c ) {

                                                geometry.faceVertexUvs[ 0 ].push( [
                                                        uvs[ parseUVIndex( a ) ].clone(),
                                                        uvs[ parseUVIndex( b ) ].clone(),
                                                        uvs[ parseUVIndex( c ) ].clone()
                                                ] );

                                        }

                                        function handle_face_line(faces, uvs, normals_inds) {

                                                if ( faces[ 3 ] === undefined ) {

                                                        add_face( faces[ 0 ], faces[ 1 ], faces[ 2 ], normals_inds );

                                                        if ( uvs !== undefined && uvs.length > 0 ) {

                                                                add_uvs( uvs[ 0 ], uvs[ 1 ], uvs[ 2 ] );

                                                        }

                                                } else {

                                                        if ( normals_inds !== undefined && normals_inds.length > 0 ) {

                                                                add_face( faces[ 0 ], faces[ 1 ], faces[ 3 ], [ normals_inds[ 0 ], normals_inds[ 1 ], normals_inds[ 3 ] ] );
                                                                add_face( faces[ 1 ], faces[ 2 ], faces[ 3 ], [ normals_inds[ 1 ], normals_inds[ 2 ], normals_inds[ 3 ] ] );

                                                        } else {

                                                                add_face( faces[ 0 ], faces[ 1 ], faces[ 3 ] );
                                                                add_face( faces[ 1 ], faces[ 2 ], faces[ 3 ] );

                                                        }

                                                        if ( uvs !== undefined && uvs.length > 0 ) {

                                                                add_uvs( uvs[ 0 ], uvs[ 1 ], uvs[ 3 ] );
                                                                add_uvs( uvs[ 1 ], uvs[ 2 ], uvs[ 3 ] );

                                                        }

                                                }

                                        }

                                        // create mesh if no objects in text

                                        if ( /^o /gm.test( obj_string ) === false ) {

                                                geometry = new THREE.Geometry();
                                                //material = new THREE.MeshLambertMaterial();
                                                //mesh = new THREE.Mesh( geometry, material );
                                                //object.add( mesh );

                                        }

                                        var vertices = [];
                                        var normals = [];
                                        var uvs = [];

                                        // v float float float

                                        var vertex_pattern = /v( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)/;

                                        // vn float float float

                                        var normal_pattern = /vn( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)/;

                                        // vt float float

                                        var uv_pattern = /vt( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)/;

                                        // f vertex vertex vertex ...

                                        var face_pattern1 = /f( +-?\d+)( +-?\d+)( +-?\d+)( +-?\d+)?/;

                                        // f vertex/uv vertex/uv vertex/uv ...

                                        var face_pattern2 = /f( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))?/;

                                        // f vertex/uv/normal vertex/uv/normal vertex/uv/normal ...

                                        var face_pattern3 = /f( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))?/;

                                        // f vertex//normal vertex//normal vertex//normal ... 

                                        var face_pattern4 = /f( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))?/

                                        //

                                        var lines = obj_string.split( '\n' );

                                        for ( var i = 0; i < lines.length; i ++ ) {

                                                var line = lines[ i ];
                                                line = line.trim();

                                                var result;

                                                if ( line.length === 0 || line.charAt( 0 ) === '#' ) {

                                                        continue;

                                                } else if ( ( result = vertex_pattern.exec( line ) ) !== null ) {

                                                        // ["v 1.0 2.0 3.0", "1.0", "2.0", "3.0"]

                                                        vertices.push( 
                                                                geometry.vertices.push(
                                                                        vector(
                                                                                result[ 1 ], result[ 2 ], result[ 3 ]
                                                                        )
                                                                )
                                                        );

                                                } else if ( ( result = normal_pattern.exec( line ) ) !== null ) {

                                                        // ["vn 1.0 2.0 3.0", "1.0", "2.0", "3.0"]

                                                        normals.push(
                                                                vector(
                                                                        result[ 1 ], result[ 2 ], result[ 3 ]
                                                                )
                                                        );

                                                } else if ( ( result = uv_pattern.exec( line ) ) !== null ) {

                                                        // ["vt 0.1 0.2", "0.1", "0.2"]

                                                        uvs.push(
                                                                uv(
                                                                        result[ 1 ], result[ 2 ]
                                                                )
                                                        );

                                                } else if ( ( result = face_pattern1.exec( line ) ) !== null ) {

                                                        // ["f 1 2 3", "1", "2", "3", undefined]

                                                        handle_face_line(
                                                                [ result[ 1 ], result[ 2 ], result[ 3 ], result[ 4 ] ]
                                                        );

                                                } else if ( ( result = face_pattern2.exec( line ) ) !== null ) {

                                                        // ["f 1/1 2/2 3/3", " 1/1", "1", "1", " 2/2", "2", "2", " 3/3", "3", "3", undefined, undefined, undefined]

                                                        handle_face_line(
                                                                [ result[ 2 ], result[ 5 ], result[ 8 ], result[ 11 ] ], //faces
                                                                [ result[ 3 ], result[ 6 ], result[ 9 ], result[ 12 ] ] //uv
                                                        );

                                                } else if ( ( result = face_pattern3.exec( line ) ) !== null ) {

                                                        // ["f 1/1/1 2/2/2 3/3/3", " 1/1/1", "1", "1", "1", " 2/2/2", "2", "2", "2", " 3/3/3", "3", "3", "3", undefined, undefined, undefined, undefined]

                                                        handle_face_line(
                                                                [ result[ 2 ], result[ 6 ], result[ 10 ], result[ 14 ] ], //faces
                                                                [ result[ 3 ], result[ 7 ], result[ 11 ], result[ 15 ] ], //uv
                                                                [ result[ 4 ], result[ 8 ], result[ 12 ], result[ 16 ] ] //normal
                                                        );

                                                } else if ( ( result = face_pattern4.exec( line ) ) !== null ) {

                                                        // ["f 1//1 2//2 3//3", " 1//1", "1", "1", " 2//2", "2", "2", " 3//3", "3", "3", undefined, undefined, undefined]

                                                        handle_face_line(
                                                                [ result[ 2 ], result[ 5 ], result[ 8 ], result[ 11 ] ], //faces
                                                                [ ], //uv
                                                                [ result[ 3 ], result[ 6 ], result[ 9 ], result[ 12 ] ] //normal
                                                        );

                                                } else if ( /^o /.test( line ) ) {

                                                        geometry = new THREE.Geometry();
                                                        //material = new THREE.MeshLambertMaterial();

                                                        //mesh = new THREE.Mesh( geometry, material );
                                                        //mesh.name = line.substring( 2 ).trim();
                                                        //object.add( mesh );

                                                } else if ( /^g /.test( line ) ) {

                                                        // group

                                                } else if ( /^usemtl /.test( line ) ) {

                                                        // material

                                                        //material.name = line.substring( 7 ).trim();

                                                } else if ( /^mtllib /.test( line ) ) {

                                                        // mtl file

                                                } else if ( /^s /.test( line ) ) {

                                                        // smooth shading

                                                } else {

                                                        // console.log( "THREE.OBJLoader: Unhandled line " + line );

                                                }

                                        }

                                        var children = object.children;

                                        for ( var i = 0, l = children.length; i < l; i ++ ) {

                                                var geometry = children[ i ].geometry;

                                                //geometry.computeCentroids();
                                                //geometry.computeFaceNormals();
                                                //geometry.computeBoundingSphere();

                                        }

                                        //return object;

                                return ({vertices:geometry.vertices, faces:geometry.faces, colors:false});
                        }

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
