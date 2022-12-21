import { Client, registry, MissingWalletError } from 'recipes-client-ts'

import { Params } from "recipes-client-ts/recipes.recipes/types"
import { Recipe } from "recipes-client-ts/recipes.recipes/types"


export { Params, Recipe };

function initClient(vuexGetters) {
	return new Client(vuexGetters['common/env/getEnv'], vuexGetters['common/wallet/signer'])
}

function mergeResults(value, next_values) {
	for (let prop of Object.keys(next_values)) {
		if (Array.isArray(next_values[prop])) {
			value[prop]=[...value[prop], ...next_values[prop]]
		}else{
			value[prop]=next_values[prop]
		}
	}
	return value
}

type Field = {
	name: string;
	type: unknown;
}
function getStructure(template) {
	let structure: {fields: Field[]} = { fields: [] }
	for (const [key, value] of Object.entries(template)) {
		let field = { name: key, type: typeof value }
		structure.fields.push(field)
	}
	return structure
}
const getDefaultState = () => {
	return {
				Params: {},
				Dishes: {},
				
				_Structure: {
						Params: getStructure(Params.fromPartial({})),
						Recipe: getStructure(Recipe.fromPartial({})),
						
		},
		_Registry: registry,
		_Subscriptions: new Set(),
	}
}

// initial state
const state = getDefaultState()

export default {
	namespaced: true,
	state,
	mutations: {
		RESET_STATE(state) {
			Object.assign(state, getDefaultState())
		},
		QUERY(state, { query, key, value }) {
			state[query][JSON.stringify(key)] = value
		},
		SUBSCRIBE(state, subscription) {
			state._Subscriptions.add(JSON.stringify(subscription))
		},
		UNSUBSCRIBE(state, subscription) {
			state._Subscriptions.delete(JSON.stringify(subscription))
		}
	},
	getters: {
				getParams: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.Params[JSON.stringify(params)] ?? {}
		},
				getDishes: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.Dishes[JSON.stringify(params)] ?? {}
		},
				
		getTypeStructure: (state) => (type) => {
			return state._Structure[type].fields
		},
		getRegistry: (state) => {
			return state._Registry
		}
	},
	actions: {
		init({ dispatch, rootGetters }) {
			console.log('Vuex module: recipes.recipes initialized!')
			if (rootGetters['common/env/client']) {
				rootGetters['common/env/client'].on('newblock', () => {
					dispatch('StoreUpdate')
				})
			}
		},
		resetState({ commit }) {
			commit('RESET_STATE')
		},
		unsubscribe({ commit }, subscription) {
			commit('UNSUBSCRIBE', subscription)
		},
		async StoreUpdate({ state, dispatch }) {
			state._Subscriptions.forEach(async (subscription) => {
				try {
					const sub=JSON.parse(subscription)
					await dispatch(sub.action, sub.payload)
				}catch(e) {
					throw new Error('Subscriptions: ' + e.message)
				}
			})
		},
		
		
		
		 		
		
		
		async QueryParams({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.RecipesRecipes.query.queryParams()).data
				
					
				commit('QUERY', { query: 'Params', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryParams', payload: { options: { all }, params: {...key},query }})
				return getters['getParams']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryParams API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryDishes({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.RecipesRecipes.query.queryDishes(query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.RecipesRecipes.query.queryDishes({...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'Dishes', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryDishes', payload: { options: { all }, params: {...key},query }})
				return getters['getDishes']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryDishes API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		async sendMsgCreateRecipe({ rootGetters }, { value, fee = [], memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const result = await client.RecipesRecipes.tx.sendMsgCreateRecipe({ value, fee: {amount: fee, gas: "200000"}, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgCreateRecipe:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgCreateRecipe:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		
		async MsgCreateRecipe({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.RecipesRecipes.tx.msgCreateRecipe({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgCreateRecipe:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgCreateRecipe:Create Could not create message: ' + e.message)
				}
			}
		},
		
	}
}
