type ConvertNullToUndefined<T> = {
  [K in keyof T]: T[K] extends infer U ? (U extends null ? undefined : U) : never
}

export type IPhoto = ConvertNullToUndefined<Photo>

export type IPhotoForm = Partial<IPhoto>
