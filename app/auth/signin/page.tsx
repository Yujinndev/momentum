'use client'

import Image from 'next/image'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import consistency from '@/public/images/consistency.png'
import { signinWithGoogle } from '@/actions/account/auth.action'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { getErrorMessage } from '@/utils/error-handler'
import { Button } from '@/components/ui/button'
import { Brand } from '@/components/brand'
import { SectionLayout } from '@/components/layout/section-layout'
import { ThemeToggle } from '@/components/theme/toggle'

const SignInError = () => {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            <span>{getErrorMessage(error)}</span>
          </AlertDescription>
        </Alert>
      )}
    </>
  )
}

export default function SignIn() {
  return (
    <div className="relative flex h-dvh overflow-hidden bg-background p-2">
      <div className="flex min-w-[50%] flex-1 flex-col items-center justify-center gap-12 px-8 py-6 text-foreground">
        <div className="absolute left-8 top-8">
          <ThemeToggle />
        </div>

        <Suspense>
          <SignInError />
        </Suspense>

        <Brand className="w-full justify-center border-0 text-3xl" />

        <SectionLayout className="mx-auto h-max w-5/6 max-w-sm">
          <form action={signinWithGoogle} className="space-y-4">
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Welcome back
              </h1>
              <p>Login with your Google account</p>
            </div>

            <Button
              size="lg"
              className="btn-primary flex w-full items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>

              <span>Login with Google</span>
            </Button>

            <p className="text-center text-sm/6">
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
          </form>
        </SectionLayout>
      </div>

      <Image
        src={consistency}
        alt="logo"
        width={400}
        height={1080}
        className="hidden flex-1 rounded-lg object-cover lg:block"
      />
    </div>
  )
}
