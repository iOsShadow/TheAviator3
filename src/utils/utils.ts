import {
  Color,
  Mesh,
  MeshPhongMaterial,
  Scene,
  TetrahedronGeometry,
} from "three";
import { Power2, gsap } from "gsap";

export function randomOneOf(choices: Array<unknown>) {
  return choices[Math.floor(Math.random() * choices.length)];
}

export function makeTetrahedron(a, b, c, d) {
  return [
    a[0],
    a[1],
    a[2],
    b[0],
    b[1],
    b[2],
    c[0],
    c[1],
    c[2],
    b[0],
    b[1],
    b[2],
    c[0],
    c[1],
    c[2],
    d[0],
    d[1],
    d[2],
  ];
}

export function rotateAroundSea(object, deltaTime, _speed) {
  object.angle +=
    deltaTime *
    object.game.state.speed *
    object.game.world.worldSettings.collectiblesSpeed;
  if (object.angle > Math.PI * 2) {
    object.angle -= Math.PI * 2;
  }
  object.mesh.position.x = Math.cos(object.angle) * object.distance;
  object.mesh.position.y =
    -object.game.world.worldSettings.seaRadius +
    Math.sin(object.angle) * object.distance;
}

export function collide(mesh1, mesh2, tolerance) {
  const diffPos = mesh1.position.clone().sub(mesh2.position.clone());
  const d = diffPos.length();
  return d < tolerance;
}

export function randomFromRange(min, max) {
  return min + Math.random() * (max - min);
}

export function spawnParticles(pos, count, color, scale, scene: Scene) {
  for (let i = 0; i < count; i++) {
    const geom = new TetrahedronGeometry(3, 0);
    const mat = new MeshPhongMaterial({
      color: 0x009999,
      shininess: 0,
      specular: 0xffffff,
      flatShading: true,
    });
    const mesh = new Mesh(geom, mat);
    scene.add(mesh);

    mesh.visible = true;
    mesh.position.copy(pos);
    mesh.material.color = new Color(color);
    mesh.material.needsUpdate = true;
    mesh.scale.set(scale, scale, scale);
    const targetX = pos.x + (-1 + Math.random() * 2) * 50;
    const targetY = pos.y + (-1 + Math.random() * 2) * 50;
    const targetZ = pos.z + (-1 + Math.random() * 2) * 50;
    const speed = 0.6 + Math.random() * 0.2;
    // TweenMax.to(mesh.rotation, speed, {x: Math.random() * 12, y: Math.random() * 12});
    gsap.to(mesh.rotation, {
      duration: speed,
      x: Math.random() * 12,
      y: Math.random() * 12,
    });
    // TweenMax.to(mesh.scale, speed, {x: 0.1, y: 0.1, z: 0.1});
    gsap.to(mesh.scale, { duration: speed, x: 0.1, y: 0.1, z: 0.1 });
    // TweenMax.to(mesh.position, speed, {
    //   x: targetX,
    //   y: targetY,
    //   z: targetZ,
    //   delay: Math.random() * 0.1,
    //   ease: Power2.easeOut,
    //   onComplete: () => {
    //     scene.remove(mesh);
    //   },
    // });
    gsap.to(mesh.position, {
      duration: speed,
      x: targetX,
      y: targetY,
      z: targetZ,
      delay: Math.random() * 0.1,
      ease: Power2.easeOut,
      onComplete: () => {
        scene.remove(mesh);
      },
    });
  }
}
