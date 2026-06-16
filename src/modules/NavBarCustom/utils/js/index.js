import { storage } from '../../../../storage/storage'
import { request } from '../../../../utils/js/request'
import { backend } from '../../../../utils/routes/app.routes'
import { list_menu } from '../../../ConfigMenu/components/PermissionMenu/components/data'

/* =========================================================
   API PUBLICA PARA NAVBAR
   ========================================================= */
export const getPermissionDb = async () => {
	const usuario = storage.get('usuario')

	/* =========================
	   1) Traer permisos backend
	   ========================= */
	const permissiondata =
		import.meta.env.VITE_WIFI === 'sin'
			? datapermisos
			: await request(
					`${backend[`${import.meta.env.VITE_APP_NAME}`]}/getPermission?id=${
						usuario.sub
					}&type=id_user&profile=${usuario.profile}`,
					'GET'
			  )

	const permissions = permissiondata?.data || []

	/* =========================
	   2) Traer menú completo
	   ========================= */
	const menusResponse =
		import.meta.env.VITE_WIFI === 'sin'
			? { data: list_menu }
			: await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/getAllMenu`, 'GET')

	const menus = menusResponse?.data || []

	/* =========================
	   3) Motor RBAC + override
	   ========================= */

	// Mapa por id_menu
	const permissionMap = {}

	for (const perm of permissions) {
		const id = perm.id_menu

		// si no existe, lo creo
		if (!permissionMap[id]) {
			permissionMap[id] = { ...perm }
			continue
		}

		// 🔴 prioridad absoluta: permiso por usuario
		if (perm.id_user) {
			permissionMap[id].status = perm.status
			permissionMap[id].id_user = perm.id_user
			continue
		}

		// 🟢 perfil: OR lógico
		permissionMap[id].status = permissionMap[id].status || perm.status
	}

	/* =========================
	   4) Aplicar permisos al menú
	   ========================= */
	const finalMenu = menus
		.map(menu => {
			const perm = permissionMap[menu.id]

			return {
				...menu,
				status: perm ? Boolean(perm.status) : false
			}
		})
		.filter(menu => menu.status === true)

	/* =========================
	   5) Devolver listo para navbar
	   ========================= */
	return finalMenu
}

const datapermisos = {
	data: [
		{
			id: 28,
			id_menu: 1,
			id_profile: 4,
			id_user: null,
			status: true,
			createdAt: '2024-11-28T09:49:15.000Z',
			updatedAt: '2024-11-28T09:49:15.000Z',
		},
		{
			id: 29,
			id_menu: 2,
			id_profile: 4,
			id_user: null,
			status: true,
			createdAt: '2024-11-28T09:49:15.000Z',
			updatedAt: '2024-11-28T09:49:15.000Z',
		},
		{
			id: 30,
			id_menu: 3,
			id_profile: 4,
			id_user: null,
			status: true,
			createdAt: '2024-11-28T09:49:15.000Z',
			updatedAt: '2024-11-28T09:49:15.000Z',
		},
		{
			id: 31,
			id_menu: 4,
			id_profile: 4,
			id_user: null,
			status: true,
			createdAt: '2024-11-28T09:49:15.000Z',
			updatedAt: '2024-11-28T09:49:15.000Z',
		},
		{
			id: 32,
			id_menu: 5,
			id_profile: 4,
			id_user: null,
			status: true,
			createdAt: '2024-11-28T09:49:15.000Z',
			updatedAt: '2024-11-28T09:49:15.000Z',
		},
		{
			id: 33,
			id_menu: 6,
			id_profile: 4,
			id_user: null,
			status: true,
			createdAt: '2024-11-28T09:49:15.000Z',
			updatedAt: '2024-11-28T09:49:15.000Z',
		},
		{
			id: 34,
			id_menu: 7,
			id_profile: 4,
			id_user: null,
			status: true,
			createdAt: '2024-11-28T09:49:15.000Z',
			updatedAt: '2024-11-28T09:49:15.000Z',
		},
		{
			id: 35,
			id_menu: 8,
			id_profile: 4,
			id_user: null,
			status: true,
			createdAt: '2024-11-28T09:49:15.000Z',
			updatedAt: '2024-11-28T09:49:15.000Z',
		},
		{
			id: 36,
			id_menu: 9,
			id_profile: 4,
			id_user: null,
			status: true,
			createdAt: '2024-11-28T09:49:15.000Z',
			updatedAt: '2024-11-28T09:49:15.000Z',
		},
		{
			id: 37,
			id_menu: 10,
			id_profile: 4,
			id_user: null,
			status: true,
			createdAt: '2024-11-29T09:36:20.000Z',
			updatedAt: '2024-11-29T09:36:20.000Z',
		},
	],
}
