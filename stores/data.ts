// Store servant à gérer la composition d'un menu

import { defineStore } from 'pinia'
import DishCategory from "~/models/DishCategory";
import Dish from "~/models/Dish";

interface State {
	formulaId: number
	formulas: any[]

	// Stockages des informations complète du menu (menu au sens large)
	dishes: Dish[]
	options: any[]
	categories: DishCategory[]
	pictos: any[]
	menus: any[]

	toUpdate: boolean
	menuDetail: null
	category: null

	productList: any[]
	subCategories: null
	productDetails: null
	diffMenu: any[]
	// lang objects (dictionaries)
	categoriesLang: {}
	subCategoriesLang: {}
	productListLang: {}
	productDetailsLang: {}
	menuLang: {}
	lastMenuId: string
}

export const useDataStore = defineStore('data', {

	state: (): State => ({
		formulaId: 0,
		formulas: [],

		// Stockages des informations complète du menu (menu au sens large)
		dishes: [],
		options: [],
		categories: [],
		pictos: [],
		menus: [],

		toUpdate: true,
		menuDetail: null,
		category: null,


		productList: [],
		subCategories: null,
		productDetails: null,
		diffMenu: [],
		// lang objects (dictionaries)
		categoriesLang: {},
		subCategoriesLang: {},
		productListLang: {},
		productDetailsLang: {},
		menuLang: {},
		lastMenuId: ''
	}),

	getters: {
		getActiveDishesByCategory(state) {
			return (category: number) => state.dishes.filter((dish: any) => (dish.category && dish.category.id === category) && dish.active && dish.visibility === 3)
		},

		getCategoriesByParent(state) {
			return (category: number) => state.categories.filter((cat: any) => cat.parent && cat.parent.id === category)
		},

		getCategoryById(state) {
			return (categoryId: number) => state.categories.find((category: any) => category.id === categoryId)
		},

		getPictoById: state => (pictoId: number) => {
			console.log("pictoId: %o", state.pictos)
			return state.pictos.find(picto => picto.id === pictoId)
		}
	},
})