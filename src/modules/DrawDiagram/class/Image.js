export class ImageDiagram {
	/**
	 * @param {Object} params - Parámetros para inicializar la instancia.
	 * @param {number} params.id - Identificador de la imagen.
	 * @param {string} params.name - Nombre de la imagen.
	 * @param {string} params.src - URL de la imagen.
	 * @param {number} params.left - Posición horizontal de la imagen.
	 * @param {number} params.top - Posición vertical de la imagen.
	 * @param {number} params.width - Ancho de la imagen.
	 * @param {number} params.height - Alto de la imagen.
	 * @param {string|number} params.value - Valor asociado al diagrama (puede ser string o número).
	 * @param {number} params.status - Estado de la imagen (1 para activo, 0 para inactivo).
	 * @param {number} params.zIndex - Índice de apilamiento (z-index) de la imagen.
	 * @param {number} params.statusTitle - Estado del texto (1 para activo, 0 para inactivo).
	 * @param {string} params.title - Título de la imagen.
	 * @param {string} params.backgroundText - Color o texto de fondo.
	 * @param {string} params.textPosition - Ubicación del titulo/texto que querramos en la imagen
	 * @author Jose Romani <jose.romani@hotmail.com>
	 */
	constructor({
		id,
		name,
		src,
		left,
		top,
		width,
		height,
		value = 0,
		status = 1,
		zIndex = 1,
		statusTitle = 0,
		title = '',
		backgroundText = '#ffffff',
		textPosition = 'Top',
	}) {
		if (!id || !name || !src || !left || !top || !width || !height)
			throw new Error('Debes pasar todo los parametros necesarios')
		Object.assign(this, {
			id,
			name,
			src,
			left,
			top,
			width,
			height,
			value,
			status,
			zIndex,
			statusTitle,
			title,
			backgroundText,
			textPosition,
		})
	}

	/**
	 * Cambia el estado de la imagen a inactivo.
	 */
	delete() {
		this.status = 0
	}

	/**
	 * Mueve  la imagen a una nueva posición.
	 * @param {number} top - Nueva posición vertical.
	 * @param {number} left - Nueva posición horizontal.
	 * @author Jose Romani <jose.romani@hotmail.com>
	 */
	move(top, left) {
		this.top = top
		this.left = left
	}

	/**
	 * Cambia el tamaño de la imagen.
	 * @param {number} width - Nuevo ancho de la imagen.
	 * @param {number} height - Nuevo alto de la imagen.
	 * @throws {Error} Si el ancho o el alto son menores o iguales a cero.
	 * @author Jose Romani <jose.romani@hotmail.com>
	 */
	resize(width, height) {
		if (width <= 0 || height <= 0) {
			throw new Error('El ancho y alto deben ser mayores que cero.')
		}
		this.width = width
		this.height = height
	}

	/**
	 * Cambia el nombre de la imagen.
	 * @param {string} name - Nuevo nombre de la imagen.
	 * @author Jose Romani <jose.romani@hotmail.com>
	 */
	setName(name) {
		this.name = name
	}

	/**
	 * Cambia el estado del texto.
	 * @param {number} status - Nuevo estado del texto.
	 * @author Jose Romani <jose.romani@hotmail.com>
	 */
	setStatusTitle(status) {
		this.statusTitle = status
	}

	/**
	 * Establece el título de la imagen.
	 * @param {string} title - Nuevo título.
	 * @author Jose Romani <jose.romani@hotmail.com>
	 */
	setTitle(title) {
		this.title = title
	}

	/**
	 * Cambia el color del texto de fondo.
	 * @param {string} color - Nuevo color de fondo.
	 * @author Jose Romani <jose.romani@hotmail.com>
	 */
	setBackgroundTextColor(color) {
		this.backgroundText = color
	}

	/**
	 * Cambia la ubicación del texto.
	 * @param {string} ubi - Nueva ubicación.
	 * @author Jose Romani <jose.romani@hotmail.com>
	 */
	setTextPosition(ubi) {
		this.textPosition = ubi
	}

	/**
	 * Devuelve la posición actual de la imagen.
	 * @returns {{top: number, left: number}} Objeto con la posición actual.
	 * @author Jose Romani <jose.romani@hotmail.com>
	 */
	getUbication() {
		return { top: this.top, left: this.left }
	}

	/**
	 * Devuelve el tamaño actual de la imagen.
	 * @returns {{width: number, height: number}} Objeto con el tamaño actual.
	 * @author Jose Romani <jose.romani@hotmail.com>
	 */
	getSize() {
		return { width: this.width, height: this.height }
	}

	/**
	 * Devuelve el título de la imagen.
	 * @returns {string} El título de la imagen.
	 * @author Jose Romani <jose.romani@hotmail.com>
	 */
	getTitle() {
		return this.title
	}

	/**
	 * Convierte una instancia de ImageDiagram en una instancia de ImageTopic.
	 * @param {ImageDiagram} image - Instancia de ImageDiagram.
	 * @param {Object} params - Parámetros adicionales para ImageTopic.
	 * @param {string} params.topic - Tema de la imagen.
	 * @param {Array} params.field - Campo asociado.
	 * @param {number} params.startRange - Rango inicial.
	 * @param {number} params.finishRange - Rango final.
	 * @returns {ImageTopic} Nueva instancia de ImageTopic.
	 * @author Jose Romani <jose.romani@hotmail.com>
	 */
	static convertToImageTopic(image, { statusTopic = 1, topic = '', field = [], startRange = '', finishRange = '' }) {
		return new ImageTopic({
			...image,
			statusTopic,
			topic,
			field,
			startRange,
			finishRange,
		})
	}
}

export class ImageTopic extends ImageDiagram {
	/**
	 * @param {Object} params - Parámetros para inicializar la instancia.
	 * @param {number} params.id - Identificador de la imagen.
	 * @param {string} params.name - Nombre de la imagen.
	 * @param {string} params.src - URL de la imagen.
	 * @param {number} params.left - Posición horizontal de la imagen.
	 * @param {number} params.top - Posición vertical de la imagen.
	 * @param {number} params.width - Ancho de la imagen.
	 * @param {number} params.height - Alto de la imagen.
	 * @param {string|number} params.value - Valor asociado al diagrama.
	 * @param {number} params.status - Estado de la imagen (1 o 0).
	 * @param {number} params.zIndex - Índice de apilamiento (z-index).
	 * @param {string} params.title - Título de la imagen.
	 * @param {string} params.backgroundText - Color o texto de fondo.
	 * @param {number} params.statusTopic - Tema de la imagen.
	 * @param {string} params.topic - Topico de la imagen.
	 * @param {Array} params.field - Campo asociado.
	 * @param {number} params.startRange - Rango inicial.
	 * @param {number} params.finishRange - Rango final.
	 * @author Jose Romani <jose.romani@hotmail.com>
	 */
	constructor({
		id,
		name,
		src,
		left,
		top,
		width,
		height,
		value = 0,
		status = 1,
		zIndex = 1,
		statusTitle = 0,
		title = '',
		backgroundText = '#ffffff',
		textPosition = 'Top',
		statusTopic = 0,
		topic = '',
		field = [],
		startRange = '',
		finishRange = '',
	}) {
		if (!id || !name || !src || !left || !top || !width || !height)
			throw new Error('Debes pasar todo los parametros necesarios')

		super({
			id,
			name,
			src,
			left,
			top,
			width,
			height,
			value,
			status,
			zIndex,
			statusTitle,
			title,
			backgroundText,
			textPosition,
		})
		Object.assign(this, { statusTopic, topic, field, startRange, finishRange })
	}

	/**
	 * Establece el topico para la consulta a influx.
	 * @param {string} topic - Nuevo topico.
	 * @author Jose Romani <jose.romani@hotmail.com>
	 */
	setStatusTopic(status) {
		this.statusTopic = status
	}

	/**
	 * Establece el topico para la consulta a influx.
	 * @param {string} topic - Nuevo topico.
	 * @author Jose Romani <jose.romani@hotmail.com>
	 */
	setTopic(topic) {
		this.topic = topic
	}

	/**
	 * Establece el rango inicial para la consulta.
	 * @param {string} startRange - Nuevo rango inicial.
	 * @author Jose Romani <jose.romani@hotmail.com>
	 */
	setStartRange(startRange) {
		this.startRange = startRange
	}

	/**
	 * Establece el rango final para la consulta.
	 * @param {string} finishRange - Nuevo rango final.
	 * @author Jose Romani <jose.romani@hotmail.com>
	 */
	setFinishRange(finishRange) {
		this.finishRange = finishRange
	}

	/**
	 * Establece el fields para la consulta.
	 * @param {string} field - Nuevo field.
	 * @author Jose Romani <jose.romani@hotmail.com>
	 */
	setField(field) {
		this.field = field
	}

	/**
	 * Devuelve los datos para completar la query para influx.
	 * @returns {{topic: string, field: Array, finishRange: string, startRange: string}} Objeto con el topico, fields, rando de inicio y de fin.
	 * @author Jose Romani <jose.romani@hotmail.com>
	 */
	getTopicData() {
		return { topic: this.topic, field: this.field, finishRange: this.finishRange, startRange: this.startRange }
	}
}
