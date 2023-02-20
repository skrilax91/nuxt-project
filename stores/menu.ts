import { defineStore } from 'pinia'
import { useBasketStore } from './basket'
import { useSettingsStore } from './settings'
import dbClient from '@/utils/prismaClient'

interface Menu {
    dishes: any[]
    declinaisons: any[]
    locales: any[]
    background: any
}

interface State {
    menu: Menu
    basket: any[]
    activeFormula: number
    locked: boolean
}

export const useMenuStore = defineStore('menu', {
    state: (): State => ({
        menu: {
            dishes: [],
            declinaisons: [],
            locales: [],
            background: {}
        },
        basket: [],
        activeFormula: 0,
        locked: false
    }),

    getters: {
        getDishesByCategory(state) {
            return (id: number) => {
                if (!state.menu.dishes)
                    return [];
                return state.menu.dishes.filter(dish => dish.category && dish.category.id == id)
            }
		},

        getDeclinaisonMax(state) {
            return (id: number): number => {
                let declinaison = state.menu.declinaisons[state.activeFormula].rulesDishcatDeclinaisons.find((rule: any) => rule.dish_category.id == id)
                return (declinaison) ? declinaison.max : 0;
            }
		},

        getProductCount: (state) => (productId: number): number => {
			return state.basket.filter(product => product.id === productId).length
		},

		categoryUsedCount(state): (categoryId: number) => number {
			return (categoryId: number): number => state.basket.filter(product => product.category_id === categoryId).length
		},

		canAddMore(state): (categoryId: number) => boolean {
			return (categoryId: number): boolean => this.categoryUsedCount(categoryId) < state.menu.declinaisons[state.activeFormula].rulesDishcatDeclinaisons.find((r: any) => r.dish_category.id == categoryId).max
		},

        getListToRemove(state): any[] {
			let result = []
			for (const rule of state.menu.declinaisons[state.activeFormula].rulesDishcatDeclinaisons) {
				console.log("rule: %i | max: %i | used: %i | to delete: %i", rule.id, rule.max, this.categoryUsedCount(rule.dish_category.id), rule.max - this.categoryUsedCount(rule.dish_category.id))
				result.push({ id: rule.dish_category.id, count: rule.max - this.categoryUsedCount(rule.dish_category.id) })
			}
			return result
		},
        isSelected: state => (productId: number) => {
			return state.basket.some(product => product.id === productId)
		},

        getBestFormula(state) {
			return (product: any, canAddMore = false) => {
				let bestFormula = { id: -1, price: 10000 }

				if (state.locked) return null

				for (const [i, formula] of state.menu.declinaisons.entries()) {
					let canContain = true
					for (const rule of formula.rulesDishcatDeclinaisons) {
						const used = this.categoryUsedCount(rule.dish_category.id) + (canAddMore && product.category_id === rule.dish_category.id ? 1 : 0)
						if (rule.max < used) {
							canContain = false
							break
						}
					}
					if (canContain && formula.price < bestFormula.price) {
						bestFormula.price = formula.Price
						bestFormula.id = i
					}
				}
				return bestFormula.id
			}
		},
    },

    actions: {
		populateStore() {

		},

        setActiveformula(id: number) {
			this.activeFormula = id
		},

        selectFormula(formulaId: number, force = false) {
			if (this.activeFormula == formulaId && !force)
				this.setLocked(!this.locked)

			if (this.locked && !force)
				return

			this.setActiveformula(formulaId)
			this.deleteExcessProducts(this.getListToRemove)
		},

        deleteExcessProducts(listToRemove: any[]) {
			for (let toRemove of listToRemove) {
				while (toRemove.count < 0) { // avoid arror on two concecutive dish of the same category after a slice
					for (const [i, product] of this.basket.entries()) {
						if (product.category_id != toRemove.id)
							continue;

						this.basket.splice(i, 1);
						toRemove.count += 1;
						break;
					}
				}
			}
		},

        setMenu(menu: Menu) {
            this.$reset()
			this.menu = menu
			this.setLocked(false)
		},

        setLocked(locked: boolean) {
            this.locked = locked
        },

        validateMenu() {
            let menu = this.menu.declinaisons[this.activeFormula]

			// Renvoi le menu que l'utilisateur a choisi
			console.log('ValidateMenu : ', menu)

			// Renvoie ce que l'utilisateur a choisi
            const basket = useBasketStore()
            basket.selectProduct(menu, true)
            this.$reset()
        },

        addProduct(product: any) {
			this.basket.push(product)
		},

		unselectProduct(oldProduct: any) {
			for (const [i, product] of this.basket.entries())
				if (product.id == oldProduct.id)
					this.basket.splice(i, 1)
		},

		selectProduct(product: any) {
			if (!this.canAddMore(product.category_id)) {

				const bestDeclinationId = this.getBestFormula(product, true)
				if (!bestDeclinationId) {
					if (!this.categoryUsedCount(product.category_id))
						return
					this.deleteExcessProducts([{ id: product.category_id, count: -1 }])
				} else {
					this.setActiveformula(bestDeclinationId)
				}
			}
			this.addProduct(product)
		},
    }
})