import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Form, useNavigate } from "react-router-dom"
import { useState } from "react"
import { useAuth } from "@/context/AuthContext"

const SignUp = (className, ...props) => {

  const [errorMessage, setErrorMessage] = useState("")
  const [formData, setFormData] = useState({
      name: "",
      email: "",
      password: "",
      confirmpassword: ""
  })

  const auth = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {    
      setFormData({...formData, [e.target.name]: e.target.value})
  }

  const handleSubmit = async (e) => {
      e.preventDefault();
      setErrorMessage("")

      console.log("froooontendd")
      //Validación básica cliente
      if (formData.password !== formData.confirmpassword) {
          setErrorMessage("Las contraseñas no coinciden")
          toast.error("Passwords do not match")
          return 
      }

      try {
          await auth?.signup(formData.name, formData.email, formData.password);

          const waitPromise = new Promise((resolve) => 
            setTimeout(() => resolve({name: formData.name}), 2000)
          )
          
          toast.promise(() => waitPromise,
            {
              loading: "Loading...",
              success: (data) => `${data.name} has been created`,
              error: "Error"
          })

          await waitPromise
          navigate('/login')
          
      } catch (error) {
          console.log(error.status)
          if (error && error.status == 409) {
            setErrorMessage('Este email ya está registrado')
            toast.error("This email is already registered")
          } else{
            console.log("Ha habido un error al registrarte: ", error)
          }
      }
  }

  return (
    <div className=" flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">      
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card className="overflow-hidden p-0">
            <CardContent className="grid p-0 md:grid-cols-2">
              <form onSubmit={handleSubmit} className="p-6 md:p-8">
                <FieldGroup>
                  <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">Create your account</h1>
                    <p className="text-muted-foreground text-sm text-balance">
                      Enter your email below to create your account
                    </p>
                  </div>
                  <Field>
                    <FieldLabel htmlFor="name">Name</FieldLabel>
                    <Input
                      id="name"
                      type="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Juan Navarro"
                      required
                    />
                    
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="m@example.com"
                      required
                    />
                    <FieldDescription>
                      We&apos;ll use this to contact you. We will not share your
                      email with anyone else.
                    </FieldDescription>
                  </Field>
                  <Field>
                    <Field className="grid grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <Input
                          id="password"
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          required />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="confirm-password">
                          Confirm Password
                        </FieldLabel>
                        <Input 
                          id="confirm-password" 
                          type="password" 
                          name="confirmpassword"
                          value={formData.confirmpassword}
                          onChange={handleChange}
                          required />
                      </Field>
                    </Field>
                    <FieldDescription>
                      Must be at least 4 characters long.
                    </FieldDescription>
                  </Field>
                  <Field>
                    <Button type="submit">Create Account</Button>
                  </Field>
                  <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                    Or continue with
                  </FieldSeparator>
                  <Field className="grid grid-cols-2 gap-4">
                    <Button variant="outline" type="button">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path
                          d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                          fill="currentColor"
                        />
                      </svg>
                      <span className="sr-only">Sign up with Github</span>
                    </Button>
                    <Button variant="outline" type="button">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path
                          d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                          fill="currentColor"
                        />
                      </svg>
                      <span className="sr-only">Sign up with Google</span>
                    </Button>
                  </Field>
                  <FieldDescription className="text-center">
                    Already have an account? <a href="/login">Sign in</a>
                  </FieldDescription>
                </FieldGroup>
              </form>
              <div className="bg-muted relative hidden md:block">
                <img
                  src="/placeholder.svg"
                  alt="Image"
                  className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
              </div>
            </CardContent>
          </Card>
          <FieldDescription className="px-6 text-center">
            By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
            and <a href="#">Privacy Policy</a>.
          </FieldDescription>
        </div>
      </div>
    </div>
  )
}

export default SignUp