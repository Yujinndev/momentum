export const getErrorMessage = (error: string) => {
  switch (error) {
    case 'OAuthAccountNotLinked':
      return 'Email already in use with different provider!'
    case 'OAuthCallbackError':
      return 'Error signing in with Google. Please try again.'
    case 'AccessDenied':
      return 'Access denied. You may not have permission.'
    default:
      return 'An error occurred during sign in.'
  }
}
