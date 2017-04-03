import { Vector3, Euler, Quaternion, Mesh, SphereGeometry, MeshPhongMaterial } from 'three';
import Dimensions from 'graphics3d/Dimensions';
import { KM, DEG_TO_RAD, RAD_TO_DEG, CIRCLE } from 'constants';
import { getUniverse } from 'JSOrrery';
import Gui from 'gui/Gui';

export default function GeoPos(body3d, target) {
	let lat = 45.5088400;//36.9664;//31
	let lng = -73.5878100;//-87.6709;//-62

	const mat = new MeshPhongMaterial({ color: 0xffffff, emissive: 0xff9911 });
	const radius = body3d.getPlanetSize() * 0.1;
	const segments = 50;
	const rings = 50;
	const sphere = new Mesh(
		new SphereGeometry(radius, segments, rings),
		mat
	);
	body3d.root.add(sphere);

	this.update = () => {
		// console.log(lng, lat);
		const parsedLat = Number(lat) * DEG_TO_RAD;
		const parsedLng = (Number(lng) - 180) * DEG_TO_RAD
			+ ((getUniverse().currentTime / body3d.celestial.sideralDay) * CIRCLE);
		
		//- body3d.celestial.tilt)
		const a = new Euler(
			parsedLat,
			0,
			parsedLng,
			'ZYX'
		);
		const pos = new Vector3(
			0,
			body3d.getPlanetSize(),
			0
		);	
		pos.applyEuler(a);
		pos.applyEuler(new Euler(-body3d.celestial.tilt * DEG_TO_RAD, 0, 0, 'XYZ'));
		sphere.position.copy(pos.clone().multiplyScalar(5));
		target.position.copy(pos);
		if (!getUniverse().isPlaying()) getUniverse().getScene().draw();

	};

	Gui.addSlider('lat', { min: -90, max: 90, initial: lat }, val => {
		lat = val;
		this.update();
	});
	Gui.addSlider('lng', { min: -180, max: 180, initial: lng }, val => {
		lng = val;
		this.update();
	});
	this.update();
}
