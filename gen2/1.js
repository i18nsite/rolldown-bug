export const xx = {}

/*@__NO_SIDE_EFFECTS__*/
const set_ = (func, obj) => {
		func.x = obj
		return func
	},
	hasSideEffect = () => {
		xx.x = new Date()
	}

export const bytes = set_((buf) => buf, hasSideEffect()),
	test = () => 1
