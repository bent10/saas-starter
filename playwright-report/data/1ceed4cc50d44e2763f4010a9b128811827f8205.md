# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - generic [ref=e4]:
      - generic [ref=e5]: Welcome back
      - generic [ref=e6]: Enter your email to sign in to your account
    - generic [ref=e7]:
      - generic [ref=e8]:
        - generic [ref=e9]:
          - generic [ref=e10]: Email
          - textbox "Email" [ref=e11]:
            - /placeholder: m@example.com
            - text: test@example.com
        - generic [ref=e12]:
          - generic [ref=e13]:
            - generic [ref=e14]: Password
            - link "Forgot password?" [ref=e15] [cursor=pointer]:
              - /url: /en/forgot-password
          - textbox "Password" [ref=e16]:
            - /placeholder: "******"
            - text: Password123!
        - button "Sign In" [ref=e17]
      - generic [ref=e22]: Or continue with
      - button "Google" [ref=e23]
    - generic [ref=e25]:
      - text: Don't have an account? Sign up
      - link "Sign up" [ref=e26] [cursor=pointer]:
        - /url: /en/register
  - button "Open Next.js Dev Tools" [ref=e32] [cursor=pointer]:
    - img [ref=e33]
  - alert [ref=e36]
```