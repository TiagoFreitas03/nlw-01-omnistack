export interface DetailParams {
  point_id: number
}

export interface PointsParams {
  uf: string
  city: string
}

export declare global {
  namespace ReactNavigation {
    interface RootParamList {
      Home: undefined
      Points: PointsParams
      Detail: DetailParams
    }
  }
}
