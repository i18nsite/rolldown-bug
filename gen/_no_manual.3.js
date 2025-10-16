const metaSet = (e, n) => ((e._ = n), e),
	getNum = (e, n) => (
		(n = `get` + n),
		(r, i = 0) => [new DataView(r.buffer, r.byteOffset + i, e)[n](0, !0), i + e]
	),
	TEXT = new TextDecoder(),
	utf8d = TEXT.decode.bind(TEXT),
	varintLen = (e, n) => {
		let r = e.length
		for (; n < r; ) if (!(e[n++] & 128)) return n
		return n
	},
	readTag = (e, n) => {
		let r = e.length,
			i = 0,
			a = 0,
			o
		for (; n < r; ) {
			if (((o = e[n]), (i |= (o & 127) << a), n++, !(o & 128)))
				return [i & 7, i >>> 3, n]
			if (((a += 7), a > 28)) return
		}
	},
	unpack = (e) => {
		let n = [],
			r = e.length,
			i = 0,
			s
		for (; i < r && ((s = readTag(e, i)), s); ) {
			let [r, o, c] = s
			i = c
			let l,
				u = i
			switch (r) {
				case 0:
					l = varintLen(e, i)
					break
				case 1:
					l = i + 8
					break
				case 2: {
					let [n, r] = decodeVarint32(e, i)
					;(u = r), (l = r + n)
					break
				}
				case 5:
					l = i + 4
					break
				default:
					return n
			}
			n.push([o - 1, e.subarray(u, l)]), (i = l)
		}
		return n
	},
	decodeVarint32 = (e, n = 0) => {
		let r = 0,
			i = 0,
			a
		do (a = e[n++]), (r |= (a & 127) << i), (i += 7)
		while (a & 128)
		return [r >>> 0, n]
	}
getNum(4, `Uint32`),
	getNum(4, `Float32`),
	getNum(4, `Int32`),
	getNum(8, `Float64`),
	getNum(8, `BigUint64`),
	getNum(8, `BigInt64`)
var _no_manual_default = ((e) => {
	let n = [],
		r = [],
		i = new Set()
	e.forEach((e, a) => {
		Array.isArray(e)
			? ((n[a] = []), (r[a] = e[0]), i.add(a))
			: ((n[a] = e._), (r[a] = e))
	})
	let a = (e) => {
		let a = structuredClone(n)
		for (let [n, o] of unpack(e)) {
			let e = r[n]
			if (e) {
				let r = e(o)
				i.has(n) ? a[n].push(r) : (a[n] = r)
			}
		}
		return a
	}
	return (a._ = n), a
})([metaSet(utf8d, ``)])
export { _no_manual_default as default }
