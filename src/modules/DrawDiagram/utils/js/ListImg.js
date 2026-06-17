const urlBase = '/assets/img/Diagram/newDiagram'
const urlBaseView = '/assets/img/Diagram/diagramAction'

export const ListImg = () => [
    {
        id: 1,
        name: 'Rack',
        src: `${urlBase}/rack_arrows.png`,
        srcView: `${urlBaseView}/rack_arrows.png`,
        defaultSize: 140, // ≈ 1 baldosa (con piso en 600px)
        variables: {
            variable1: { id_variable: 0, show: false, require: false },
        },
    },
    {
        id: 2,
        name: 'Aire acondicionado',
        src: `${urlBase}/aire_acondicionado.png`,
        srcView: `${urlBaseView}/aire_acondicionado.png`,
        variables: {
            variable1: { id_variable: 0, show: false, require: false },
        },
    },
    {
        id: 3,
        name: 'Antena',
        src: `${urlBase}/antena.png`,
        srcView: `${urlBaseView}/antena.png`,
        variables: {
            variable1: { id_variable: 0, show: false, require: false },
        },
    },
    {
        id: 4,
        name: 'Termómetro',
        src: `${urlBase}/termometro.png`,
        srcView: `${urlBaseView}/termometro.png`,
        variables: {
            variable1: { id_variable: 0, show: false, require: false },
        },
    },
    {
        id: 5,
        name: 'Refrigerador de laboratorio',
        src: `${urlBase}/Refrigerador_de_laboratorio_abierto-removebg-preview.png`,
        srcView: `${urlBaseView}/Refrigerador_de_laboratorio_abierto-removebg-preview.png`,
        defaultSize: 80, // cuerpo ≈ 1 baldosa (la base mide más por la puerta abierta)
        variables: {
            variable1: { id_variable: 0, show: false, require: false },
        },
    },
    {
        id: 6,
        name: 'Shelter',
        src: `${urlBase}/shelter.png`,
        srcView: `${urlBaseView}/shelter.png`,
        defaultSize: 76, // ≈ 1 baldosa (piso 600px)
        variables: {
            variable1: { id_variable: 0, show: false, require: false },
        },
    },
    {
        id: 7,
        name: 'Puerta',
        src: `${urlBase}/door_green_open.png`,
        srcView: `${urlBaseView}/door_green_open.png`,
        animation: 'boolean',
        // Si la semántica del backend está invertida, intercambiar error/success
        optionsImage: {
            success: `${urlBaseView}/door_green_open.png`,
            error: `${urlBaseView}/door_red.png`,
            default: `${urlBaseView}/door_green_open.png`,
        },
        variables: {
            variable1: { id_variable: 0, show: false, require: false },
        },
    },
    {
        id: 8,
        name: 'Grupo Generador',
        src: `${urlBase}/grupo_generador_default.png`,
        srcView: `${urlBaseView}/grupo_generador_default.png`,
        defaultSize: 135, // ≈ 1 baldosa (piso 600px)
        animation: 'boolean',
        optionsImage: {
            error: `${urlBaseView}/grupo_generador_OFF.png`,
            success: `${urlBaseView}/grupo_generador_ON.png`,
            default: `${urlBaseView}/grupo_generador_default.png`,
        },
        variables: {
            variable1: { id_variable: 0, show: false, require: false },
        },
    },
    {
        id: 9,
        name: 'Piso de sala (3D)',
        src: `${urlBase}/piso_sala.svg`,
        srcView: `${urlBaseView}/piso_sala.svg`,
        defaultSize: 600, // piso grande: ~1 rack por baldosa (tile ≈66px vs base del rack ≈30px)
        variables: {}, // decorativo, sin variable
    },
    {
        id: 10,
        name: 'Led',
        src: `${urlBase}/led_OFF.png`,
        srcView: `${urlBase}/led_OFF.png`,
        animation: 'boolean',
        optionsImage: {
            error: '/assets/img/Diagram/diagramAction/led_FAIL.png',
            success:
                '/assets/img/Diagram/diagramAction/led_ON.png',
            default:
                '/assets/img/Diagram/diagramAction/led_OFF.png',
            warning:
                '/assets/img/Diagram/diagramAction/led_OFFLINE.png',
        },
        defaultSize: 25,
        variables: {
            variable1: { id_variable: 0, show: false, require: false },
        },
    },
    {
        id: 11,
        name: 'Img sin fondo',
        src: `${urlBase}/img_sinfondo.PNG`,
        srcView: `${urlBaseView}/img_sinfondo.PNG`,
        variables: {
            variable1: { id_variable: 0, show: false, require: false },
        },
    },
]
