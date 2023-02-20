// Store servant à gérer la composition d'un plat
import { defineStore } from 'pinia'

interface State {
	options: any[]
	informations: any
}

export const useOptionsStore = defineStore('options', {
	state: (): State => ({
		options: [],
		informations: {}
	}),

	getters: {
		getOptionCount(state) {
			return (currentPage: number): number => {
				return state.options[currentPage].option.results.filter((res: any) => res.state).length
			}
		},
		getState(state) {
			return (page: number, index: number): boolean => {
				return state.options[page].option.results[index].state
			}
		}
	},

	actions: {
		setInformations(informations: any) {
			this.informations = informations
		},

		disableAllOptions(page: number) {
			for (const result in this.options[page].option.results)
				this.options[page].option.results[result].state = false;
		},

		chageOptionState(page: number, index: number) {
			this.options[page].option.results[index].state = !this.options[page].option.results[index].state
		},

		setOptions(informations: any) {
			informations.options.forEach(function(el: any) {
				el.option.results.forEach(function(res: any) {
					res.state = false
				});
			});

			this.options = informations.options
			this.informations = informations
		},

		selectOtpion(page: number, index: number) {
			if (!this.options[page].option.results[index].state) {
				if (!this.options[page].multiple && this.getOptionCount(page)) {
					this.disableAllOptions(page)
				}
			}
			this.chageOptionState(page, index)
		}
	},
})