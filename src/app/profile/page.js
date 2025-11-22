'use client';

import { useEffect, useRef } from 'react';
import styles from '../styles/profile.module.css';

export default function Profile() {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const modelRef = useRef(null);
  const mixerRef = useRef(null);
  const animationsRef = useRef([]);
  const clockRef = useRef(null);
  const isPlayingRef = useRef(false);
  const animationControlsRef = useRef(null);

  useEffect(() => {
    // Dynamically import Three.js
    const loadThreeJS = async () => {
      if (typeof window === 'undefined') return;

      // Load Three.js from CDN
      const threeScript = document.createElement('script');
      threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      threeScript.async = true;

      const loaderScript = document.createElement('script');
      loaderScript.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js';
      loaderScript.async = true;

      const controlsScript = document.createElement('script');
      controlsScript.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js';
      controlsScript.async = true;

      return new Promise((resolve) => {
        if (window.THREE) {
          resolve();
          return;
        }

        threeScript.onload = () => {
          loaderScript.onload = () => {
            controlsScript.onload = () => {
              resolve();
            };
            document.head.appendChild(controlsScript);
          };
          document.head.appendChild(loaderScript);
        };
        document.head.appendChild(threeScript);
      });
    };

    const MODEL_URL = 'https://raw.githubusercontent.com/NicolasFQ/3DPathFindr/c6432aa236aa682fe802904eea8054264324bc2b/xrnoe__human_nature_-_wiener_becken.glb';

    // Saturate image data (for background and textures)
    const saturateImageData = (imageData, saturation) => {
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Convert to grayscale
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        
        // Apply saturation and clamp to valid RGB range (0-255)
        data[i] = Math.max(0, Math.min(255, gray + (r - gray) * saturation));
        data[i + 1] = Math.max(0, Math.min(255, gray + (g - gray) * saturation));
        data[i + 2] = Math.max(0, Math.min(255, gray + (b - gray) * saturation));
      }
      return imageData;
    };

    // Load background image with blur and saturation (exact copy from 3d-viewer.html)
    const loadBackgroundImage = (scene) => {
      const img = new Image();
      img.crossOrigin = 'anonymous'; // Allow loading from different origins if needed
      
      // Try different paths to find the image (from 3d-viewer.html, adapted for Next.js)
      const paths = ['/bg.jpg', 'public/bg.jpg', './bg.jpg', 'bg.jpg', '../public/bg.jpg'];
      let currentPathIndex = 0;
      
      const tryNextPath = () => {
        if (currentPathIndex < paths.length) {
          console.log(`Trying to load background from: ${paths[currentPathIndex]}`);
          img.src = paths[currentPathIndex];
          currentPathIndex++;
        } else {
          console.warn('Failed to load background image from all paths, using default color');
        }
      };
      
      img.onload = function() {
        console.log('Background image loaded successfully');
        // Create a canvas to apply saturation
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        
        // Draw the image first
        ctx.drawImage(img, 0, 0);
        
        // Get image data for saturation
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Apply saturation (1.5 = 50% more saturated, 2.0 = 100% more saturated)
        const saturatedData = saturateImageData(imageData, 1.5);
        
        // Put the saturated data back
        ctx.putImageData(saturatedData, 0, 0);
        
        // Create a second canvas for blur
        const blurCanvas = document.createElement('canvas');
        blurCanvas.width = canvas.width;
        blurCanvas.height = canvas.height;
        const blurCtx = blurCanvas.getContext('2d');
        
        // Apply blur using canvas filter (if supported)
        if (blurCtx.filter !== undefined) {
          blurCtx.filter = 'blur(1px)'; // Adjust blur amount
        }
        
        // Draw the saturated image to the blur canvas
        blurCtx.drawImage(canvas, 0, 0);
        
        // Create texture from blurred canvas
        const texture = new window.THREE.CanvasTexture(blurCanvas);
        texture.needsUpdate = true;
        
        // Set as scene background
        if (scene) {
          scene.background = texture;
          console.log('Background texture applied to scene');
        }
      };
      
      img.onerror = function() {
        // Try next path if available
        if (currentPathIndex < paths.length) {
          tryNextPath();
        } else {
          console.warn('Failed to load background image from all paths, using default color');
        }
      };
      
      // Start trying paths
      tryNextPath();
    };

    // Check WebGL support
    const checkWebGLSupport = () => {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        return !!gl;
      } catch (e) {
        return false;
      }
    };

    // Initialize the scene
    const init = async () => {
      await loadThreeJS();

      if (!window.THREE) {
        console.error('Three.js failed to load');
        return;
      }

      const THREE = window.THREE;
      const container = containerRef.current;
      if (!container) return;

      // Check WebGL support
      if (!checkWebGLSupport()) {
        const errorEl = container.parentElement.querySelector(`.${styles.error}`);
        if (errorEl) {
          errorEl.innerHTML = '<p>WebGL is not supported in your browser.<br><small>Please update your graphics drivers or try a different browser.</small></p>';
          errorEl.style.display = 'block';
        }
        return;
      }

      // Create scene
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x1e293b);
      sceneRef.current = scene;
      
      // Load background image with blur
      loadBackgroundImage(scene);

      // Create camera
      const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
      camera.position.set(0, 0, 5);
      cameraRef.current = camera;

      // Create renderer with better texture support
      const renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: false,
        powerPreference: 'high-performance',
        preserveDrawingBuffer: false
      });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      
      // Enable shadow maps for better texture rendering
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.shadowMap.autoUpdate = true;
      
      // Enable tone mapping for better color/texture rendering
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.5; // Increased exposure for extreme vibrant colors
      
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // Add lights with shadows for better texture visibility (from 3d-viewer.html)
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight1.position.set(5, 5, 5);
      directionalLight1.castShadow = true;
      directionalLight1.shadow.mapSize.width = 2048;
      directionalLight1.shadow.mapSize.height = 2048;
      scene.add(directionalLight1);

      const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
      directionalLight2.position.set(-5, -5, -5);
      scene.add(directionalLight2);

      const pointLight = new THREE.PointLight(0xffffff, 0.5);
      pointLight.position.set(0, 0, 5);
      scene.add(pointLight);
      
      // Add hemisphere light for more natural lighting
      const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.4);
      scene.add(hemisphereLight);

      // Add sun light from above (like sunlight shining down)
      const sunLight = new THREE.DirectionalLight(0xfff8dc, 1.5); // Warm sunlight color
      sunLight.position.set(0, 15, 0); // Position directly above the model
      sunLight.castShadow = true;
      sunLight.shadow.mapSize.width = 2048;
      sunLight.shadow.mapSize.height = 2048;
      sunLight.shadow.camera.near = 0.5;
      sunLight.shadow.camera.far = 50;
      sunLight.shadow.camera.left = -10;
      sunLight.shadow.camera.right = 10;
      sunLight.shadow.camera.top = 10;
      sunLight.shadow.camera.bottom = -10;
      sunLight.shadow.bias = -0.0001;
      sunLight.shadow.radius = 4; // Soft shadow edges
      scene.add(sunLight);
      
      // Add additional fill light for better shadow definition
      const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
      fillLight.position.set(-5, 10, -5);
      fillLight.castShadow = false;
      scene.add(fillLight);

      // Add a ground plane to receive shadows (optional, for better shadow visibility)
      const groundGeometry = new THREE.PlaneGeometry(20, 20);
      const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.3 });
      const ground = new THREE.Mesh(groundGeometry, groundMaterial);
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -5; // Position below the model
      ground.receiveShadow = true;
      scene.add(ground);

      // Create controls (from 3d-viewer.html - same camera move and zoom settings)
      const controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enablePan = true;
      controls.enableZoom = true;
      controls.enableRotate = true;
      controls.minDistance = 2;
      controls.maxDistance = 15;
      controls.target.set(0, 0, 0);
      controlsRef.current = controls;

      // Initialize clock for animations
      clockRef.current = new THREE.Clock();

      // Load the model
      loadModel(scene, container);

      // Handle window resize
      const onWindowResize = () => {
        if (!camera || !renderer || !container) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      };
      window.addEventListener('resize', onWindowResize);

      // Start animation loop
      animate();

      // Cleanup
      return () => {
        window.removeEventListener('resize', onWindowResize);
        if (renderer) {
          container.removeChild(renderer.domElement);
          renderer.dispose();
        }
      };
    };

    // Load the 3D model
    const loadModel = (scene, container) => {
      const THREE = window.THREE;
      const loader = new THREE.GLTFLoader();
      
      // Enable texture loading (from 3d-viewer.html)
      loader.setDRACOLoader(null); // Optional: for compressed models
      
      const loadingEl = container.parentElement.querySelector(`.${styles.loading}`);
      const errorEl = container.parentElement.querySelector(`.${styles.error}`);
      
      loader.load(
        MODEL_URL,
        function(gltf) {
          const model = gltf.scene;
          modelRef.current = model;

          // Enable shadows and saturate colors (from 3d-viewer.html)
          model.traverse(function(child) {
            if (child.isMesh) {
              // Enable shadows
              child.castShadow = true;
              child.receiveShadow = true;
              
              // Ensure materials are properly set up for textures
              if (child.material) {
                // Handle array of materials
                const materials = Array.isArray(child.material) ? child.material : [child.material];
                materials.forEach(material => {
                  // Update textures
                  if (material.map) {
                    material.map.needsUpdate = true;
                  }
                  // Enable texture features
                  if (material.normalMap) {
                    material.normalMap.needsUpdate = true;
                  }
                  if (material.roughnessMap) {
                    material.roughnessMap.needsUpdate = true;
                  }
                  if (material.metalnessMap) {
                    material.metalnessMap.needsUpdate = true;
                  }
                  if (material.emissiveMap) {
                    material.emissiveMap.needsUpdate = true;
                  }
                  
                  // EXTREME saturation for material colors
                  if (material.color) {
                    // Increase saturation to maximum
                    const hsl = {};
                    material.color.getHSL(hsl);
                    // Extreme saturation - push to maximum (1.0)
                    hsl.s = Math.min(1.0, hsl.s * 3.0); // 3x saturation multiplier
                    // Also increase lightness slightly for more vibrant colors
                    hsl.l = Math.min(1.0, hsl.l * 1.1);
                    material.color.setHSL(hsl.h, hsl.s, hsl.l);
                  }
                  
                  // Saturate texture maps if they exist
                  if (material.map && material.map.image) {
                    const texture = material.map;
                    const img = texture.image;
                    
                    // Wait for image to load if needed
                    if (img.complete && img.naturalWidth > 0) {
                      // Create a canvas to saturate the texture
                      const canvas = document.createElement('canvas');
                      canvas.width = img.width;
                      canvas.height = img.height;
                      const ctx = canvas.getContext('2d');
                      
                      // Draw the original texture
                      ctx.drawImage(img, 0, 0);
                      
                      // Get image data and saturate it
                      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                      const saturatedData = saturateImageData(imageData, 2.5); // Extreme saturation
                      ctx.putImageData(saturatedData, 0, 0);
                      
                      // Create new texture from saturated canvas
                      const saturatedTexture = new THREE.CanvasTexture(canvas);
                      saturatedTexture.needsUpdate = true;
                      saturatedTexture.wrapS = texture.wrapS;
                      saturatedTexture.wrapT = texture.wrapT;
                      saturatedTexture.repeat.copy(texture.repeat);
                      saturatedTexture.offset.copy(texture.offset);
                      material.map = saturatedTexture;
                    } else {
                      // If image not loaded yet, wait for it
                      img.onload = function() {
                        const canvas = document.createElement('canvas');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0);
                        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                        const saturatedData = saturateImageData(imageData, 2.5);
                        ctx.putImageData(saturatedData, 0, 0);
                        const saturatedTexture = new THREE.CanvasTexture(canvas);
                        saturatedTexture.needsUpdate = true;
                        saturatedTexture.wrapS = texture.wrapS;
                        saturatedTexture.wrapT = texture.wrapT;
                        saturatedTexture.repeat.copy(texture.repeat);
                        saturatedTexture.offset.copy(texture.offset);
                        material.map = saturatedTexture;
                        material.needsUpdate = true;
                      };
                    }
                  }
                  
                  // Enhance emissive with extreme saturation (no glow effect)
                  if (material.emissive) {
                    const emissiveHsl = {};
                    material.emissive.getHSL(emissiveHsl);
                    emissiveHsl.s = Math.min(1.0, emissiveHsl.s * 3.0); // Extreme saturation
                    material.emissive.setHSL(emissiveHsl.h, emissiveHsl.s, emissiveHsl.l);
                  }
                  
                  // Adjust material properties for better lighting
                  if (material.metalness !== undefined) {
                    material.metalness = Math.min(1.0, material.metalness * 0.9);
                  }
                  if (material.roughness !== undefined) {
                    material.roughness = Math.max(0.1, material.roughness * 0.95);
                  }
                  
                  material.needsUpdate = true;
                });
              }
            }
          });

          // Calculate bounding box
          const box = new THREE.Box3();
          box.setFromObject(model);

          const center = new THREE.Vector3();
          box.getCenter(center);

          const size = new THREE.Vector3();
          box.getSize(size);

          // Calculate scale to fit the model nicely (scale to fit within 4 units)
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = maxDim > 0 ? 4 / maxDim : 1;

          // Apply scale to the model
          model.scale.set(scale, scale, scale);

          // Center the model at origin
          model.position.set(-center.x * scale, -center.y * scale, -center.z * scale);

          // Add model to scene
          scene.add(model);

          // Setup animations if they exist
          if (gltf.animations && gltf.animations.length > 0) {
            setupAnimations(gltf.animations, model);
          }

          // Hide loading
          if (loadingEl) {
            loadingEl.style.display = 'none';
          }
        },
        function(progress) {
          // Progress callback (optional)
          if (loadingEl && progress.total) {
            const percent = (progress.loaded / progress.total * 100);
            loadingEl.textContent = `Loading 3D model... ${Math.round(percent)}%`;
          }
        },
        function(error) {
          console.error('Error loading model:', error);
          if (errorEl) {
            errorEl.innerHTML = '<p>Failed to load 3D model.<br><small>Please check your internet connection.</small></p>';
            errorEl.style.display = 'block';
          }
          if (loadingEl) {
            loadingEl.style.display = 'none';
          }
        }
      );
    };

    // Setup animations
    const setupAnimations = (animationClips, model) => {
      if (!animationClips || animationClips.length === 0) return;

      const THREE = window.THREE;
      
      // Create animation mixer
      mixerRef.current = new THREE.AnimationMixer(model);
      animationsRef.current = [];

      // Create animation actions for all animations
      animationClips.forEach((clip) => {
        const action = mixerRef.current.clipAction(clip);
        action.play();
        animationsRef.current.push(action);
      });

      // Show animation controls
      if (animationControlsRef.current) {
        animationControlsRef.current.style.display = 'flex';
      }

      // Auto-play animations
      isPlayingRef.current = true;
      updateAnimationButtons();
      console.log(`Loaded ${animationClips.length} animation(s)`);
    };

    // Toggle animation play/pause
    const toggleAnimation = () => {
      if (!mixerRef.current) return;

      if (isPlayingRef.current) {
        pauseAnimation();
      } else {
        playAnimation();
      }
    };

    // Play animation
    const playAnimation = () => {
      if (!mixerRef.current) return;

      // Resume all animation actions
      animationsRef.current.forEach(action => {
        if (!action.isRunning()) {
          action.play();
        }
      });
      mixerRef.current.timeScale = 1.0;
      isPlayingRef.current = true;
      updateAnimationButtons();
    };

    // Pause animation
    const pauseAnimation = () => {
      if (!mixerRef.current) return;

      mixerRef.current.timeScale = 0;
      isPlayingRef.current = false;
      updateAnimationButtons();
    };

    // Stop animation
    const stopAnimation = () => {
      if (!mixerRef.current) return;

      mixerRef.current.stopAllAction();
      // Reset all animation actions to the beginning
      animationsRef.current.forEach(action => {
        action.reset();
      });
      mixerRef.current.update(0);
      isPlayingRef.current = false;
      updateAnimationButtons();
    };

    // Update animation button states
    const updateAnimationButtons = () => {
      const playBtn = document.getElementById('play-btn');
      const pauseBtn = document.getElementById('pause-btn');
      
      if (playBtn && pauseBtn) {
        if (isPlayingRef.current) {
          playBtn.disabled = true;
          pauseBtn.disabled = false;
        } else {
          playBtn.disabled = false;
          pauseBtn.disabled = false;
        }
      }
    };

    // Expose animation functions to window
    window.toggleAnimation = toggleAnimation;
    window.pauseAnimation = pauseAnimation;
    window.stopAnimation = stopAnimation;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      const delta = clockRef.current ? clockRef.current.getDelta() : 0;
      
      // Update animation mixer
      if (mixerRef.current) {
        mixerRef.current.update(delta);
      }
      
      // Update controls
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      // Render scene
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    // Control handlers (from 3d-viewer.html - same move and zoom amounts)
    window.handleMove = (direction) => {
      if (!controlsRef.current) return;

      const moveAmount = 0.5;
      const currentTarget = controlsRef.current.target;

      switch(direction) {
        case 'up':
          currentTarget.y += moveAmount;
          break;
        case 'down':
          currentTarget.y -= moveAmount;
          break;
        case 'left':
          currentTarget.x -= moveAmount;
          break;
        case 'right':
          currentTarget.x += moveAmount;
          break;
      }
      controlsRef.current.update();
    };

    window.handleZoom = (direction) => {
      if (!controlsRef.current) return;

      const zoomAmount = 0.2;

      if (direction === 'in') {
        controlsRef.current.dollyIn(zoomAmount);
      } else {
        controlsRef.current.dollyOut(zoomAmount);
      }
      controlsRef.current.update();
    };

    window.handleRotate = (direction) => {
      if (!controlsRef.current) return;

      const rotateAmount = Math.PI / 8; // 22.5 degrees
      const currentAzimuth = controlsRef.current.getAzimuthalAngle();
      const currentPolar = controlsRef.current.getPolarAngle();

      switch(direction) {
        case 'left':
          controlsRef.current.setAzimuthalAngle(currentAzimuth - rotateAmount);
          break;
        case 'right':
          controlsRef.current.setAzimuthalAngle(currentAzimuth + rotateAmount);
          break;
        case 'up':
          controlsRef.current.setPolarAngle(Math.max(currentPolar - rotateAmount, 0.1));
          break;
        case 'down':
          controlsRef.current.setPolarAngle(Math.min(currentPolar + rotateAmount, Math.PI - 0.1));
          break;
      }
      controlsRef.current.update();
    };

    init();

    // Cleanup
    return () => {
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
      delete window.handleMove;
      delete window.handleZoom;
      delete window.handleRotate;
      delete window.toggleAnimation;
      delete window.pauseAnimation;
      delete window.stopAnimation;
    };
  }, []);

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profile3DContainer}>
        <div ref={containerRef} className={styles.canvasContainer}></div>
        <div className={styles.loading}>Loading 3D model...</div>
        <div className={styles.error} style={{ display: 'none' }}></div>

        {/* Animation Controls */}
        <div ref={animationControlsRef} id="animation-controls" className={styles.animationControls} style={{ display: 'none' }}>
          <button id="play-btn" className={styles.animationButton} onClick={() => window.toggleAnimation?.()}>▶ Play</button>
          <button id="pause-btn" className={styles.animationButton} onClick={() => window.pauseAnimation?.()}>⏸ Pause</button>
          <button id="stop-btn" className={styles.animationButton} onClick={() => window.stopAnimation?.()}>⏹ Stop</button>
        </div>

        {/* Movement Controls */}
        <div className={`${styles.controls} ${styles.controlsLeft}`}>
          <div className={styles.controlGroup}>
            <button className={styles.controlButton} onClick={() => window.handleMove?.('up')}>↑</button>
            <div className={styles.controlRow}>
              <button className={styles.controlButton} onClick={() => window.handleMove?.('left')}>←</button>
              <button className={styles.controlButton} onClick={() => window.handleMove?.('right')}>→</button>
            </div>
            <button className={styles.controlButton} onClick={() => window.handleMove?.('down')}>↓</button>
          </div>
        </div>

        {/* Zoom and Rotate Controls */}
        <div className={`${styles.controls} ${styles.controlsRight}`}>
          <div className={styles.controlGroup}>
            <div className={styles.zoomButtons}>
              <button className={`${styles.controlButton} ${styles.zoomButton}`} onClick={() => window.handleZoom?.('in')}>Zoom +</button>
              <button className={`${styles.controlButton} ${styles.zoomButton}`} onClick={() => window.handleZoom?.('out')}>Zoom -</button>
            </div>
            <div className={styles.controlGroup}>
              <button className={`${styles.controlButton} ${styles.rotateButton}`} onClick={() => window.handleRotate?.('up')}>↻ Up</button>
              <div className={styles.controlRow}>
                <button className={`${styles.controlButton} ${styles.rotateButton}`} onClick={() => window.handleRotate?.('left')}>↺ Left</button>
                <button className={`${styles.controlButton} ${styles.rotateButton}`} onClick={() => window.handleRotate?.('right')}>↻ Right</button>
              </div>
              <button className={`${styles.controlButton} ${styles.rotateButton}`} onClick={() => window.handleRotate?.('down')}>↻ Down</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

