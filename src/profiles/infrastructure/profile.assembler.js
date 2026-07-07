import { Profile } from '../domain/model/profile.entity.js'

export function toProfile(apiModel) {
  if (!apiModel) {
    return Profile.empty()
  }

  return new Profile({
    id: Number(apiModel.id) || null,
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
    id: profile.id ?? 0,
    photoUrl: profile.profilePhotoUrl ?? '',
    firstName: profile.firstName ?? '',
    lastName: profile.lastName ?? '',
    address: profile.address ?? '',
    email: profile.email ?? '',
    phoneNumber: profile.phoneNumber ?? ''
  }
}
