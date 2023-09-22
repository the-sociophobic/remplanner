// Задача: превратить этот функционал в класс

// IN: roomId: string, wallId: string, contour: Vector2[], is_clockwise: boolean
// OUT: Mesh

// Условия:
//      - код должен быть читабельным, логика очевидной, форматирование однородным
//      - максимально оптимизировать вычисления
//      - максимально использовать приёмы стандарта ES6

// Решаете эту задачу наилучшим, по-вашему мнению, образом




import * as THREE from 'three'

let mlt = 1.0;
let skirtingHeight = 10;
var skirtingNum = 0;

let s = new THREE.Shape();
    s.moveTo(0, 0);
    s.lineTo(0, 12);
    s.lineTo(1.1*mlt, 12);
    s.lineTo(1.1*mlt, 3);
    s.lineTo(1.01*mlt, 3);


function ProfiledContourGeometry( profileShape, contour, contourClosed, openEnded ) {

    contourClosed = contourClosed !== undefined ? contourClosed : true;
    openEnded = openEnded !== undefined ? openEnded : false;
    openEnded = contourClosed === true ? false : openEnded;

    let profileGeometry = new THREE.ShapeGeometry(profileShape);
    let flipProfileGeometry = flipShapeGeometry(profileGeometry);
    profileGeometry.rotateX(Math.PI * 0.5);

    let profile = profileGeometry.attributes.position;

    let addEnds = openEnded === false ? 2 : 0;
    let profilePoints = new Float32Array(profile.count * (contour.length + addEnds) * 3);

    let endProfiles = [];

    for (let i = 0; i < contour.length; i++) {
        let v1 = new THREE.Vector2().subVectors(contour[i - 1 < 0 ? contour.length - 1 : i - 1], contour[i]);
        let v2 = new THREE.Vector2().subVectors(contour[i + 1 === contour.length ? 0 : i + 1], contour[i]);
        let angle = v2.angle() - v1.angle();
        let hA = angle * 0.5;
        let tA = v2.angle() + Math.PI * 0.5;
        if (!contourClosed){
            if (i === 0 || i === contour.length - 1) {hA = Math.PI * 0.5;}
            if (i === contour.length - 1) {tA = v1.angle() - Math.PI * 0.5;}
        }

        let shift = Math.tan(hA - Math.PI * 0.5);

        let shiftMatrix = new THREE.Matrix4().set(
            1, 0, 0, 0,
            -shift, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        );


        let tempAngle = tA;

        let rotationMatrix = new THREE.Matrix4().set(
            Math.cos(tempAngle), -Math.sin(tempAngle), 0, 0,
            Math.sin(tempAngle),  Math.cos(tempAngle), 0, 0,
            0,                    0, 1, 0,
            0,                    0, 0, 1
        );

        let translationMatrix = new THREE.Matrix4().set(
            1, 0, 0, contour[i].x,
            0, 1, 0, contour[i].y,
            0, 0, 1, 0,
            0, 0, 0, 1,
        );

        let cloneProfile = profile.clone();

        cloneProfile.applyMatrix4(shiftMatrix);
        cloneProfile.applyMatrix4(rotationMatrix);
        cloneProfile.applyMatrix4(translationMatrix);

        profilePoints.set(cloneProfile.array, cloneProfile.count * i * 3);
        if (openEnded === false && (i === 0 || i === contour.length - 1)){
            endProfiles.push(cloneProfile);
        }
    }

    endProfiles.forEach((ep, idx) => {
        profilePoints.set(ep.array, ep.count * (contour.length + idx) * 3)
    });

    let fullProfileGeometry = new THREE.BufferGeometry();
    fullProfileGeometry.setAttribute("position", new THREE.BufferAttribute(profilePoints, 3));

    let index = [];

    let lastCorner = contourClosed === false ? contour.length - 1: contour.length;

    for (let i = 0; i < lastCorner; i++) {
        for (let j = 0; j < profile.count; j++) {
            let currCorner = i;
            let nextCorner = i + 1 == contour.length ? 0 : i + 1;
            let currPoint = j;
            let nextPoint = j + 1 == profile.count ? 0 : j + 1;

            let a = nextPoint + profile.count * currCorner;
            let b = currPoint + profile.count * currCorner;
            let c = currPoint + profile.count * nextCorner;
            let d = nextPoint + profile.count * nextCorner;


            index.push(a, b, d);
            index.push(b, c, d);
        }
    }

    if (openEnded === false){

        flipProfileGeometry.index.array.forEach(i => {index.push(i +  profile.count * (contour.length))});
        profileGeometry.index.array.forEach(i =>{index.push(i + profile.count * (contour.length + 1))});

    }

    fullProfileGeometry.setIndex(index);
    fullProfileGeometry.computeVertexNormals();

    return fullProfileGeometry;
}

function flipShapeGeometry(shapeGeometry) {
    let flipGeom = shapeGeometry.clone();
    for (let i = 0; i < flipGeom.attributes.position.count; i++) {
        flipGeom.attributes.position.array[i * 3] *= -1;
    }
    flipGeom.attributes.position.needsUpdate = true;

    var b = flipGeom.index.array;
    for (let i = 0; i < b.length; i += 3) {
        let v2 = b[i + 1];
        let tmp = v2;
        let v3 = b[i + 2];
        b[i + 1] = b[i + 2];
        b[i + 2] = tmp;
    }
    flipGeom.computeVertexNormals();
    return flipGeom;
}


export var addSkirting = async function( roomId, wallId, contour, is_clockwise ){
    let contourClosed = false;

    if ( !is_clockwise ) contour.reverse();


    if (contour.length > 2) contourClosed = true;

    let geom = await ProfiledContourGeometry( s, contour, contourClosed, false);
    geom.rotateX(Math.PI * 0.5);
    geom.translate(0, skirtingHeight, 0);


    var object = new THREE.Mesh(geom, new THREE.MeshStandardMaterial({side: THREE.FrontSide}));

    skirtingNum++;
    object.name = "skirting|" + roomId + "|" + wallId + "|" + skirtingNum;



    return object;
};
