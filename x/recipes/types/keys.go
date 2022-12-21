package types

const (
	// ModuleName defines the module name
	ModuleName = "recipes"

	// StoreKey defines the primary module store key
	StoreKey = ModuleName

	// RouterKey defines the module's message routing key
	RouterKey = ModuleName

	// MemStoreKey defines the in-memory store key
	MemStoreKey = "mem_recipes"

	RecipeKey      = "Recipe-value-"
	RecipeCountKey = "Recipe-count-"
)

func KeyPrefix(p string) []byte {
	return []byte(p)
}
