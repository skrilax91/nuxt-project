// Store servant à gérer le pannier
import { defineStore } from 'pinia'

interface Order {
	dishes: any[]
	menus: Menu[]
}

interface Menu {
	id: number
	declination_id: number
	basket: any[]
}

interface State {
	lastId: number
	dishes: any[]
	menus: any[]
	total: number
}

export const useBasketStore = defineStore('basket', {
	state: (): State => ({
		lastId: 0,
		dishes: [],
		menus: [],
		total: 0,
	}),

	getters: {
		getProductCount(state) {
			return (productId: number) => {
				const products = state.dishes.filter(product => product.id === productId)
				if (products.length === 1 && products[0].Count) {
					return products[0].Count
				}
				return products.length
			}
		},

		getProductsCount(state): number {
			return state.menus.length + state.dishes.length
		},

		getOrder(state): Order {
			let order: Order = { dishes: [], menus: [] };
	
			order.dishes = this.getOrderedBasket(state.dishes);
	
			state.menus.forEach(el => {
				let menu: Menu = { 
					id: el.menu_id, 
					declination_id: el.id,
					basket: []
				};
				menu.basket = this.getOrderedBasket(el.basket);
				order.menus.push(menu);
			});
			
			return order;
		},

		getOrderedBasket(state) {
			return (basket: any[]) => {
				let dishes: any[] = [];
		
				basket.forEach(el => {
					let dish: { id: number, ingredients: any[], options: any[] } = { id: el.id, ingredients: [], options: [] };
		
					el.ingredients.forEach((cat: any) => {
						let ingredient: { id: number, ingredient_category_id: number, rulesIngredient: any[] } = {
							id: cat.id, 
							ingredient_category_id: cat.ingredient_category_id,
							rulesIngredient: []
						};
						let catIngredients = cat.rulesIngredient.filter((rl: any) => rl.state);
						
		
						if (catIngredients.length) {
							catIngredients.forEach((rl: any) => {
								let rule = {
									id: rl.id,
									isComposed: rl.isComposed,
									isExtra: rl.isExtra,
									isOptionnal: rl.isOptionnal
								};
								ingredient.rulesIngredient.push(rule);
							});
							dish.ingredients.push(ingredient);
						}
					});
		
					el.options.forEach((opt: any) => {
						let results = opt.option.results.filter((res:any) => res.state);
						let finalRes: any[] = []
						results.forEach((res: any) => finalRes.push(res.id));
						
						let option = {
							id: opt.id,
							dish_option_id: opt.dish_option_id,
							results: finalRes
						}
						dish.options.push(option);
					});
					
					dishes.push(dish);
				});
		
				return dishes;
			}
		}
	},

	actions: {
		updateTotal() {
			this.total = 0
			for (const product of this.dishes) {
				this.total += product.price
			}
			for (const product of this.menus) {
				this.total += product.price
			}
		},

		removeById(productId: number) {
			for (let i = 0; i < this.menus.length; i++) {
				if (this.menus[i].id == productId) {
					if (this.menus[i].Count) {
						this.menus[i].Count = this.menus[i].Count - 1
						this.menus[i].price = this.menus[i].InitialPrice * this.menus[i].Count
						if (this.menus[i].Count === 1) {
							delete this.menus[i].Count
						}
					} else {
						this.menus.splice(i, 1)
					}
					break
				}
			}
	
			for (let i = 0; i < this.dishes.length; i++) {
				if (this.dishes[i].id == productId) {
					if (this.dishes[i].Count) {
						this.dishes[i].Count = this.dishes[i].Count - 1
						this.dishes[i].price = this.dishes[i].InitialPrice * this.dishes[i].Count
						if (this.dishes[i].Count === 1) {
							delete this.dishes[i].Count
						}
					} else {
						this.dishes.splice(i, 1)
					}
					break
				}
			}
		},

		removeByBasketId(basketId: number) {
			for (let i = 0; i < this.dishes.length; i++) {
				if (this.dishes[i].basketId == basketId) {
					if (this.dishes[i].Count) {
						this.dishes[i].Count = this.dishes[i].Count - 1
						this.dishes[i].price = this.dishes[i].InitialPrice * this.dishes[i].Count
						if (this.dishes[i].Count === 1) {
							delete this.dishes[i].Count
						}
					} else {
						this.dishes.splice(i, 1)
					}
					break
				}
			}
	
			for (let i = 0; i < this.menus.length; i++) {
				if (this.menus[i].basketId == basketId) {
					if (this.menus[i].Count) {
						this.menus[i].Count = this.menus[i].Count - 1
						this.menus[i].price = this.menus[i].InitialPrice * this.menus[i].Count
						if (this.menus[i].Count === 1) {
							delete this.menus[i].Count
						}
					} else {
						this.menus.splice(i, 1)
					}
					break
				}
			}
		},

		removeAllByBasketId(basketId: number) {
			for (let i = 0; i < this.menus.length; i++) {
				if (this.menus[i].basketId == basketId) {
					this.menus.splice(i, 1)
					break
				}
			}
			for (let i = 0; i < this.dishes.length; i++) {
				if (this.dishes[i].basketId == basketId) {
					this.dishes.splice(i, 1)
					break
				}
			}
		},

		addProduct(dish: any, menu?: boolean) {
			dish.basketId = this.lastId
			this.lastId++;
			if (menu)
				this.menus.push({...dish})
			else 
				this.dishes.push({...dish})
		},

		//Sert à ajouter un produit au pannier
		selectProduct( dish: any, menu?: boolean) {
			const newDish = {...dish}
			
			if (!(newDish.ingredients && newDish.ingredients.length) && !(newDish.options && newDish.options.length) && !menu) {
				let oldProduct = this.dishes.filter(product => !product.ingredients && !product.options && product.id === newDish.id)
				
				if (oldProduct.length) {
					this.removeAllByBasketId(oldProduct[0].basketId)
					newDish.Count = oldProduct[0].Count ? oldProduct[0].Count + 1 : 2
					newDish.InitialPrice = newDish.price
					newDish.price = newDish.price * newDish.Count
				}
			}
			this.addProduct(newDish, menu);
			this.updateTotal();
		},

		//Sert à supprimer un produit en cliquant depuis le pannier
		unselectProductByBasket(basketId: number) {
			this.removeByBasketId(basketId)
			this.updateTotal()
		},
		//Sert à supprimer un plat en cliquant sur l'icone
		unselectProductById(productId: number) {
			this.removeById(productId)
			this.updateTotal()
		},
	},

})