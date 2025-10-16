const metaSet = (e, h) => ((e._ = h), e),
	getNum = (e, h) => (
		(h = `get` + h),
		(g, _ = 0) => [new DataView(g.buffer, g.byteOffset + _, e)[h](0, !0), _ + e]
	),
	TEXT = new TextDecoder(),
	utf8d = TEXT.decode.bind(TEXT),
	varintLen = (e, h) => {
		let g = e.length
		for (; h < g; ) if (!(e[h++] & 128)) return h
		return h
	},
	readTag = (e, h) => {
		let g = e.length,
			_ = 0,
			v = 0,
			y
		for (; h < g; ) {
			if (((y = e[h]), (_ |= (y & 127) << v), h++, !(y & 128)))
				return [_ & 7, _ >>> 3, h]
			if (((v += 7), v > 28)) return
		}
	},
	unpack = (e) => {
		let h = [],
			g = e.length,
			_ = 0,
			b
		for (; _ < g && ((b = readTag(e, _)), b); ) {
			let [g, y, x] = b
			_ = x
			let S,
				C = _
			switch (g) {
				case 0:
					S = varintLen(e, _)
					break
				case 1:
					S = _ + 8
					break
				case 2: {
					let [h, g] = decodeVarint32(e, _)
					;(C = g), (S = g + h)
					break
				}
				case 5:
					S = _ + 4
					break
				default:
					return h
			}
			h.push([y - 1, e.subarray(C, S)]), (_ = S)
		}
		return h
	},
	decodeVarint32 = (e, h = 0) => {
		let g = 0,
			_ = 0,
			v
		do (v = e[h++]), (g |= (v & 127) << _), (_ += 7)
		while (v & 128)
		return [g >>> 0, h]
	},
	decodeFixed32 = getNum(4, `Uint32`),
	decodeFloat = getNum(4, `Float32`),
	decodeSfixed32 = getNum(4, `Int32`),
	decodeDouble = getNum(8, `Float64`),
	decodeFixed64 = getNum(8, `BigUint64`),
	decodeSfixed64 = getNum(8, `BigInt64`),
	decodeVarint64 = (e, h = 0) => {
		let g = 0n,
			_ = 0n,
			v
		do (v = e[h++]), (g |= BigInt(v & 127) << _), (_ += 7n)
		while (v & 128)
		return [g, h]
	},
	decodeUint32 = decodeVarint32,
	decodeSint32 = (e, h) => {
		let [g, _] = decodeVarint32(e, h)
		return [(g >>> 1) ^ -(g & 1), _]
	},
	decodeBool = (e, h) => {
		let [g, _] = decodeVarint32(e, h)
		return [!!g, _]
	},
	decodeInt64Based = (e) => (h, g) => {
		let [_, v] = decodeVarint64(h, g)
		return [Number(e(_)), v]
	},
	decodeInt32 = decodeInt64Based((e) => BigInt.asIntN(32, e)),
	decodeInt64 = decodeInt64Based((e) => BigInt.asIntN(64, e)),
	decodeUint64 = decodeInt64Based((e) => e),
	decodeSint64 = decodeInt64Based((e) => (e >> 1n) ^ -(e & 1n))
var _hasmanual_default = ((e) => {
	let h = [],
		g = [],
		_ = new Set()
	e.forEach((e, v) => {
		Array.isArray(e)
			? ((h[v] = []), (g[v] = e[0]), _.add(v))
			: ((h[v] = e._), (g[v] = e))
	})
	let v = (e) => {
		let v = structuredClone(h)
		for (let [h, y] of unpack(e)) {
			let e = g[h]
			if (e) {
				let g = e(y)
				_.has(h) ? v[h].push(g) : (v[h] = g)
			}
		}
		return v
	}
	return (v._ = h), v
})([metaSet(utf8d, ``)])
export { _hasmanual_default as default }
