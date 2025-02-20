export const FORM_DETAILS = {
  wallet: {
    create: {
      title: 'Add New Wallet',
      description: 'Create a new wallet to organize your finances.',
      cta: {
        default: 'Submit New Wallet',
        pending: 'Creating new wallet...',
      },
    },
    update: {
      title: 'Update Wallet',
      description: 'Synchronize updated details.',
      cta: {
        default: 'Update Wallet',
        pending: 'Updating wallet...',
      },
    },
    delete: {
      cta: {
        default: 'Remove Wallet',
        pending: 'Removing Wallet...',
      },
    },
  },
  transaction: {
    create: {
      title: 'Add New Transaction',
      description: 'Record your new transactions.',
      cta: {
        default: 'Add transaction',
        pending: 'Adding transaction...',
      },
    },
  },
}
