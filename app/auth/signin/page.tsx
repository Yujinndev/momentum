'use client'

import { signinWithGoogle } from '@/actions/account/auth.action'
import { useSearchParams } from 'next/navigation'
import { Brand } from '@/components/brand'
import { Button } from '@/components/ui/button'
import { getErrorMessage } from '@/utils/error-handler'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function SignIn() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="space-y-3">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>
              <span>{getErrorMessage(error)}</span>
            </AlertDescription>
          </Alert>
        )}
        <Card className="space-y-1 px-4 py-6 shadow-none">
          <Brand showThemeToggle={true} />

          <CardHeader className="text-center">
            <CardTitle className="text-xl">Welcome back</CardTitle>
            <CardDescription>Login with your Google account</CardDescription>
          </CardHeader>

          <form action={signinWithGoogle} className="px-8">
            <Button variant="secondary" className="w-full">
              <div className="flex w-full items-center justify-center gap-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                <span>Login with Google</span>
              </div>
            </Button>
          </form>

          <p className="mx-auto w-4/5 text-center text-sm/6">
            <span>By clicking continue, you agree to our </span>
            <a href="#" className="underline underline-offset-8">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="underline underline-offset-8">
              Privacy Policy
            </a>
            .
          </p>
        </Card>
      </div>
    </div>
  )
}
