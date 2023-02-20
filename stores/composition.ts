// Store servant à gérer la composition d'un plat
import { defineStore } from 'pinia'

interface State {
	product: any
	ingredients: any[]
}

export const useCompositionStore = defineStore('composition', {
	state: (): State => ({
		product: null,
		ingredients: []
	}),

	getters: {
		canAddMore(state) {
			return (currentPage: number): boolean => {
				if (!state.ingredients[currentPage])
					return false
				
				return state.ingredients[currentPage].value > state.ingredients[currentPage].used
			}
		},

		getCategoryMax(state) {
			return (currentPage: number): number => {
				if (state.ingredients[currentPage]) {
					return state.ingredients[currentPage].value
				}
				return 0
			}
		},
		
		getCategoryUsed(state) {
			return (currentPage: number): number => {
				if (state.ingredients[currentPage]) {
					return state.ingredients[currentPage].used
				}
				return 0
			}
		},

		getIngredients(state) {
			let ingredients = []
			for (const ingredientsPage of state.ingredients) {
				for (const ingredient of ingredientsPage.Ingredients) {
					if (ingredient.State) {
						ingredients.push(ingredient)
					}
				}
			}
			return ingredients
		}
	},

	actions: {
		setProduct(product: any) {
			this.product = product
		},
		setIngredients(ingredients: any[]) {
			ingredients.forEach(function(el) {
				el.used = 0
				el.rulesIngredient.forEach(function(res: any) {
					res.state = false
				})
			})
			this.ingredients = ingredients
	
		},
		changeIngredientState(currentPage: number, index: number) {
			if (this.ingredients[currentPage].rulesIngredient[index].state)
				this.ingredients[currentPage].used--;
			else
				this.ingredients[currentPage].used++;
	
			this.ingredients[currentPage].rulesIngredient[index].state = !this.ingredients[currentPage].rulesIngredient[index].state
			this.ingredients[currentPage].rulesIngredient[index].isComposed = !this.ingredients[currentPage].rulesIngredient[index].isComposed
		},

		selectProduct(informations: any) {
			this.setIngredients(informations.ingredients)
			this.setProduct(informations)
		},

		selectIngredient(currentPage: number, index: number) {
			if (this.ingredients[currentPage].rulesIngredient[index].state || (this.ingredients[currentPage].used < this.ingredients[currentPage].value)) {
				this.changeIngredientState(currentPage, index)
			}
			console.log("ingredient selected: " + this.ingredients[currentPage].rulesIngredient[index].state)
		}
	}
})