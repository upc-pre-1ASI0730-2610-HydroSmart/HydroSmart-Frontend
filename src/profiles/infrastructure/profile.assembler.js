import { Profile } from '../domain/model/profile.entity.js'

export function toProfile(apiModel) {
  if (!apiModel) {
    return Profile.empty()
  }

  return new Profile({
    id: Number(apiModel.id) || null,
    username: apiModel.username ?? '',
    email: apiModel.email ?? '',
    firstName: apiModel.firstName ?? '',
    lastName: apiModel.lastName ?? '',
    address: apiModel.address ?? '',
    phoneNumber: apiModel.phoneNumber ?? '',
    profilePhotoUrl: apiModel.profilePhotoUrl ?? '',
    createdAt: apiModel.createdAt ?? ''
  })
}

