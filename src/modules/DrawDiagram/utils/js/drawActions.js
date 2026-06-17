import Swal from 'sweetalert2'
import { request, } from '../../../../utils/js/request'
import { backend } from '../../../../utils/routes/app.routes'
import { data } from 'autoprefixer';


export const uploadCanvaDb = async (id, {
	setElements,
	setCircles,
	setDiagramMetadata,
	setTool
}) => {
	try {
		const objectDiagram = await request(
			`${backend['Centinela']}/getObjectCanva?id=${id}`,
			'GET'
		).then((res) => res?.data?.[0]);

		if (!objectDiagram) return;

		setDiagramMetadata({
			id: objectDiagram.id,
			title: objectDiagram.title,
			backgroundColor: objectDiagram.backgroundColor,
			backgroundImg: objectDiagram.backgroundImg || '',
		});

		const elements = [];
		const influxVarsToRequest = [];

		// === LÍNEAS ===
		for (const line of objectDiagram?.lines || []) {
			const pts = [
				line.points.start.left,
				line.points.start.top,
				line.points.end.left,
				line.points.end.top,
			];

			let dataInflux = null;
			if (line.variable?.varsInflux) {
				
				dataInflux = {
					id: line.id_influxvars,
					name: line.variable.name,
					unit: line.variable.unit,
					varsInflux: line.variable.varsInflux,
					position: line.variable.position || 'Centro',
					show: line.variable.show_var || true
				};
				influxVarsToRequest.push({ dataInflux: dataInflux });
			}

			elements.push({
				id: `line-${line.id}`,
				type: 'line',
				x: 0,
				y: 0,
				points: pts,
				stroke: line.stroke || '#000',
				strokeWidth: line.strokeWidth || 2,
				draggable: true,
				invertAnimation: line.invertAnimation,
				dataInflux,
			});
		}

		// === POLILÍNEAS ===
		for (const poly of objectDiagram?.polylines || []) {
			const points = poly.points.flatMap(pt => [pt.left, pt.top]);

			let dataInflux = null;
			if (poly.variable?.varsInflux) {
				
				dataInflux = {
					id: poly.id_influxvars,
					name: poly.variable.name,
					unit: poly.variable.unit,
					varsInflux: poly.variable.varsInflux,
					position: poly.variable.position || 'Centro',
					show: poly.variable.show_var || true
				};
				influxVarsToRequest.push({ dataInflux: dataInflux });
			}

			elements.push({
				id: `poly-${poly.id}`,
				type: 'polyline',
				x: 0,
				y: 0,
				points,
				stroke: poly.stroke || '#000',
				strokeWidth: poly.strokeWidth || 2,
				draggable: true,
				invertAnimation: poly.invertAnimation,
				dataInflux,
			});
		}

		// === TEXTOS ===
		for (const text of objectDiagram?.texts || []) {
			let dataInflux = null;
			if (text.variable?.varsInflux) {
				dataInflux = {
					id: text.id_influxvars,
					name: text.variable.name,
					unit: text.variable.unit,
					varsInflux: text.variable.varsInflux,
					position: text.variable.position || 'Centro',
					show: text.variable.show_var || true
				};
				influxVarsToRequest.push({ dataInflux: dataInflux });
			}

			elements.push({
				id: `text-${text.id}`,
				type: 'text',
				x: text.left,
				y: text.top,
				text: text.text || '',
				fontSize: text.sizeText || 16,
				fill: text.colorText || '#000',
				fontStyle: 'normal',
				dataInflux,
			});
		}

		// === IMÁGENES === (varias variables por imagen)
		for (const image of objectDiagram?.images || []) {
			const variables = (image.variables || [])
				.filter((v) => v?.variable?.varsInflux)
				.map((v) => ({
					id: v.id_influxvars,
					id_variable: v.id_influxvars,
					name: v.name_var || Object.keys(v.variable.varsInflux)[0],
					unit: v.variable.unit,
					type: v.variable.type,
					calc: v.variable.calc,
					varsInflux: v.variable.varsInflux,
					equation: v.variable.equation,
					status: v.variable.status,
					show: v.show_var,
					position: v.position_var || 'Centro',
					max_value_var: v.max_value_var,
					calculatePercentage: v.max_value_var ? true : false,
					boolean_colors: v.boolean_colors || {},
					binary_compressed: v.variable.binary_compressed,
					id_bit: v.id_bit,
					bit_name: v.bit?.name || null,
				}));

			variables.forEach((entry) => influxVarsToRequest.push({ dataInflux: entry }));

			elements.push({
				id: `image-${image.id}`,
				type: 'image',
				src: image.src,
				x: image.left,
				y: image.top,
				width: parseFloat(image.width) || 0,
				height: parseFloat(image.height) || 0,
				draggable: true,
				rotation: parseFloat(image.angle) || 0,
				variables,
				dataInflux: variables[0] || null, // primaria (swap de imagen booleana)
			});
		}


		// === VALORES INFLUX ===
		let finalElements = elements;

		if (influxVarsToRequest.length > 0) {
			const response = await request(
				`${backend['Centinela']}/multipleDataInflux`,
				'POST',
				influxVarsToRequest
			);
			const valuesResponse = response.data;

			finalElements = elements.map((el) => {
				if (el.type === 'image' && Array.isArray(el.variables) && el.variables.length) {
					const variables = el.variables.map((v) =>
						valuesResponse?.[v.id] !== undefined ? { ...v, value: valuesResponse[v.id] } : v
					);
					return { ...el, variables, dataInflux: variables[0] || null };
				}
				if (el.dataInflux && valuesResponse?.[el.dataInflux.id] !== undefined) {
					return {
						...el,
						dataInflux: {
							...el.dataInflux,
							value: valuesResponse[el.dataInflux.id],
						},
					};
				}
				return el;
			});
		}

		// CÍRCULOS PARA EDICIÓN
		const circles = finalElements
			.filter((el) => el.type === 'line')
			.flatMap((el) => {
				const [x1, y1, x2, y2] = el.points;
				return [
					{ id: `${el.id}-start`, x: x1, y: y1, lineId: el.id, fill: 'blue', visible: false },
					{ id: `${el.id}-end`, x: x2, y: y2, lineId: el.id, fill: 'red', visible: false },
				];
			});

		setCircles(circles);
		setTool(null);
		return finalElements;
	} catch (err) {
		console.error('Error en uploadCanvaDb:', err);
		return [];
	}
};


export const saveDiagramKonva = async ({
	elements,
	circles,
	diagramMetadata,
	deleted,
	navigate
}) => {
	try {
		Swal.fire({ title: 'Guardando...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

		const saveObjects = {
			images: [],
			texts: [],
			lines: [],
			polylines: [],
			deleted,
		};

		const getNumericId = (compositeId) => {
			const match = compositeId?.toString().match(/-(\d+)$/);
			return match ? parseInt(match[1], 10) : null;
		};

		elements.forEach((el) => {
			switch (el.type) {
				case 'image':
					saveObjects.images.push({
						...(el.id ? { id: getNumericId(el.id) } : {}),
						name: el.name || '',
						src: el.src,
						left: el.x,
						top: el.y,
						angle: el.rotation || 0,
						width: el.width,
						height: el.height,
						status: 1,
						// Una key por variable (el back crea N filas). Nombre = name_var único.
						variables: (el.variables || []).reduce((acc, v) => {
							if (!v?.name) return acc;
							acc[v.name] = {
								id_variable: v.id ?? v.id_variable ?? null,
								show: v.show,
								position: v.position,
								max_value: v.max_value_var,
								boolean_colors: v.boolean_colors,
								id_bit: v.id_bit,
							};
							return acc;
						}, {}),
					});
					break;

				case 'polyline':
					const points = el.points.map((val, i) =>
						i % 2 === 0 ? val + el.x : val + el.y
					);

					const polylinePoints = [];
					for (let i = 0; i < points.length; i += 2) {
						polylinePoints.push({ left: points[i], top: points[i + 1] });
					}

					saveObjects.polylines.push({
						...(el.id ? { id: getNumericId(el.id) } : {}),
						id_influxvars: el.dataInflux?.id || null,
						points: polylinePoints,
						stroke: el.stroke,
						strokeWidth: el.strokeWidth,
						dobleLine: 0,
						colorSecondary: '',
						animation: 1,
						invertAnimation: el.invertAnimation,
						status: 1,
						showText: 0,
						text: '',
						sizeText: 14,
						colorText: '#000',
						backgroundText: '',
						locationText: '',
						variables: el.dataInflux ? {
							[el.dataInflux.name]: {
								id_variable: el.dataInflux.id || null,
								show: el.dataInflux.show,
								position: el.dataInflux.position,
								max_value_var: el.dataInflux.maxValue
							}
						} : {}
					});

					break;

				case 'text':
					saveObjects.texts.push({
						...(el.id ? { id: getNumericId(el.id) } : {}),
						name: '',
						left: el.x,
						top: el.y,
						angle: 0,
						status: 1,
						text: el.text,
						sizeText: el.fontSize,
						colorText: el.fill,
						backgroundText: '',
						id_influxvars: el.dataInflux?.id || null,
					});
					break;

				case 'line':
					const absPoints = {
						start: {
							left: el.points[0] + el.x,
							top: el.points[1] + el.y,
						},
						end: {
							left: el.points[2] + el.x,
							top: el.points[3] + el.y,
						},
					};

					saveObjects.lines.push({
						...(el.id ? { id: getNumericId(el.id) } : {}),
						id_influxvars: el.dataInflux?.id || null,
						points: absPoints,
						stroke: el.stroke,
						strokeWidth: el.strokeWidth,
						dobleLine: 0,
						colorSecondary: '',
						animation: 1,
						invertAnimation: el.invertAnimation,
						status: 1,
						showText: 0,
						text: '',
						sizeText: 14,
						colorText: '#000',
						backgroundText: '',
						locationText: '',
					});
					break;
			}
		});

		saveObjects.diagram = {
			title: diagramMetadata.title,
			status: 1,
			backgroundColor: diagramMetadata.backgroundColor || '',
			backgroundImg: diagramMetadata.backgroundImg || '',
			...(diagramMetadata.id && { id: diagramMetadata.id }),
		};
		
		await request(`${backend[import.meta.env.VITE_APP_NAME]}/saveDiagram`, 'POST', saveObjects);

		Swal.fire({
			title: 'Perfecto!',
			text: 'Se guardó correctamente',
			icon: 'success',
		});
		navigate('/config/diagram');

	} catch (error) {
		console.error(error);
		Swal.fire({
			title: 'Error!',
			text: 'Hubo un problema al guardar el diagrama.',
			icon: 'error',
		});
	}
};