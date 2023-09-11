export const utils = {
  normalize: function (v, vmin, vmax, tmin, tmax) {
    var nv = Math.max(Math.min(v, vmax), vmin);
    var dv = vmax - vmin;
    var pc = (nv - vmin) / dv;
    var dt = tmax - tmin;
    var tv = tmin + pc * dt;
    return tv;
  },

  findWhere: function (list, properties) {
    for (const elem of list) {
      let all = true;
      for (const key in properties) {
        if (elem[key] !== properties[key]) {
          all = false;
          break;
        }
      }
      if (all) {
        return elem;
      }
    }
    return null;
  },

  randomFromRange: function (min, max) {
    return min + Math.random() * (max - min);
  },

  collide: function (mesh1, mesh2, tolerance) {
    const diffPos = mesh1.position.clone().sub(mesh2.position.clone());
    const d = diffPos.length();
    return d < tolerance;
  },

  makeTetrahedron: function (a, b, c, d) {
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
  },
};

function spawnParticles(pos, count, color, scale) {
  for (let i = 0; i < count; i++) {
    const geom = new THREE.TetrahedronGeometry(3, 0);
    const mat = new THREE.MeshPhongMaterial({
      color: 0x009999,
      shininess: 0,
      specular: 0xffffff,
      flatShading: true,
    });
    const mesh = new THREE.Mesh(geom, mat);
    scene.add(mesh);

    mesh.visible = true;
    mesh.position.copy(pos);
    mesh.material.color = new THREE.Color(color);
    mesh.material.needsUpdate = true;
    mesh.scale.set(scale, scale, scale);
    const targetX = pos.x + (-1 + Math.random() * 2) * 50;
    const targetY = pos.y + (-1 + Math.random() * 2) * 50;
    const targetZ = pos.z + (-1 + Math.random() * 2) * 50;
    const speed = 0.6 + Math.random() * 0.2;
    TweenMax.to(mesh.rotation, speed, {x: Math.random() * 12, y: Math.random() * 12});
    TweenMax.to(mesh.scale, speed, {x: 0.1, y: 0.1, z: 0.1});
    TweenMax.to(mesh.position, speed, {
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
