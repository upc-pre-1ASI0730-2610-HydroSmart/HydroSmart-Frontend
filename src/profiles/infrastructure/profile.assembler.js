import { Profile } from '../domain/model/profile.entity.js'

export function toProfile(apiModel) {
  if (!apiModel) {
    return Profile.empty()
  }

  return new Profile({
    id: Number(apiModel.id) || null,
    userId: Number(apiModel.userId) || null,
    username: apiModel.username ?? `user_${apiModel.id}` ?? '',
    email: apiModel.email ?? '',
    firstName: apiModel.firstName ?? '',
    lastName: apiModel.lastName ?? '',
    address: apiModel.address ?? '',
    phoneNumber: apiModel.phoneNumber ?? '',
    profilePhotoUrl: apiModel.photoUrl ?? '',
    createdAt: apiModel.createdAt ?? ''
  })
}

export function toApiModel(profile) {
  if (!profile) return null

  return {
    id: profile.id ?? null,
    userId: profile.userId ?? null,
    firstName: profile.firstName ?? '',
    lastName: profile.lastName ?? '',
    email: profile.email ?? '',
    address: profile.address ?? '',
    phoneNumber: profile.phoneNumber ?? '',
    photoUrl: profile.profilePhotoUrl ?? ''
  }
}
