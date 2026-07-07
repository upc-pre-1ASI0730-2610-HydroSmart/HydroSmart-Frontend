export class Profile {
  constructor({
    id,
    userId,
    username,
    email,
    firstName,
    lastName,
    address,
    phoneNumber,
    profilePhotoUrl,
    createdAt
  }) {
    this.id = id
    this.userId = userId
    this.username = username
    this.email = email
    this.firstName = firstName
    this.lastName = lastName
    this.address = address
    this.phoneNumber = phoneNumber
    this.profilePhotoUrl = profilePhotoUrl
    this.createdAt = createdAt
  }

  get fullName() {
    return [this.firstName, this.lastName].filter(Boolean).join(' ')
  }

  static empty() {
    return new Profile({
      id: null,
      userId: null,
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      address: '',
      phoneNumber: '',
      profilePhotoUrl: '',
      createdAt: ''
    })
  }
}

