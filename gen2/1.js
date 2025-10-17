/*@__NO_SIDE_EFFECTS__*/
const set_ = (func, obj) => {
		func.x = obj
		return func
	},
	func = () => {}
export const bytes = set_((buf) => buf, func()),
	test = () => 1
