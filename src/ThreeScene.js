import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { TimelineMax } from 'gsap';

const ThreeScene = () => {
  const containerRef = useRef();

  useEffect(() => {
    const init = () => {
      const root = new THREERoot({
        createCameraControls: false,
        antialias: (window.devicePixelRatio === 1),
        fov: 80,
      });

      root.renderer.setClearColor(0x000000, 0);
      root.renderer.setPixelRatio(window.devicePixelRatio || 1);
      root.camera.position.set(0, 0, 60);

      const width = 100;
      const height = 60;

      const slide = new Slide(width, height, 'out');
      const l1 = new THREE.ImageLoader();
      l1.setCrossOrigin('Anonymous');
      slide.setImage(l1.load('https://s3-us-west-2.amazonaws.com/s.cdpn.io/175711/winter.jpg'));
      root.scene.add(slide);

      const slide2 = new Slide(width, height, 'in');
      const l2 = new THREE.ImageLoader();
      l2.setCrossOrigin('Anonymous');
      slide2.setImage(l2.load('https://s3-us-west-2.amazonaws.com/s.cdpn.io/175711/spring.jpg'));
      root.scene.add(slide2);

      const tl = new TimelineMax({ repeat: -1, repeatDelay: 1.0, yoyo: true });

      tl.add(slide.transition(), 0);
      tl.add(slide2.transition(), 0);

      window.addEventListener('keyup', function(e) {
        if (e.keyCode === 80) {
          tl.paused(!tl.paused());
        }
      });

      containerRef.current.appendChild(root.renderer.domElement);
    };

    init();

    return () => {
      while (containerRef.current.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild);
      }
    };
  }, []);

  return <div ref={containerRef} id="three-container" />;
};

class Slide extends THREE.Object3D {
  constructor(width, height, direction) {
    super();
    this.direction = direction;

    this.plane = new THREE.Mesh(
      new SlideGeometry(width, height, 50, 30, this.direction),
      new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })
    );
    this.add(this.plane);
  }

  setImage(image) {
    this.plane.material.map = image;
    this.plane.material.needsUpdate = true;
  }

  transition() {
    const tween = new TimelineMax();
    const time = 3.0;
    tween.to(this.plane.material, time, { opacity: 0 });
    return tween;
  }
}

class SlideGeometry extends THREE.PlaneBufferGeometry {
  constructor(width, height, wSeg, hSeg, direction) {
    super(width, height, wSeg, hSeg);
    this.type = 'SlideGeometry';

    const position = this.attributes.position;
    const vector = new THREE.Vector3();
    for (let i = 0; i < position.count; i++) {
      vector.fromBufferAttribute(position, i);
      if (direction === 'in') {
        vector.z = Math.random() * 5 - 2.5;
      }
      position.setXYZ(i, vector.x, vector.y, vector.z);
    }
  }
}

class THREERoot {
  constructor(params) {
    this.renderer = new THREE.WebGLRenderer({
      antialias: params.antialias || false,
      alpha: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio || 1);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      params.fov || 60,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    this.camera.position.z = 400;

    this.updateSize();
    window.addEventListener('resize', () => this.updateSize(), false);

    const animate = () => {
      requestAnimationFrame(animate);
      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }

  updateSize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }
}

export default ThreeScene;
