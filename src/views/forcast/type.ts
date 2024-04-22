export interface IRegion {
    id: number
    name: string
}

export interface ISymbol {
    id: number
    name: string
    endTime?: null | string
    startTime?: null | string
}

export interface iFilter {
    region?: number
    symbol?: number
    nextPart?: number
}