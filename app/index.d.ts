interface User {
  id: string;
  firstname: string;
  lastname?: string;
  role: 'ADMIN' | 'EATERY' | 'CUSTOMER'
  email: string;
  profilePic?: string;
  mobileNumber?: string;
  isVerified: boolean;
}
