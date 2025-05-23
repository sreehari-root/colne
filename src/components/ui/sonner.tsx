import { useTheme } from "next-themes"
import { Toaster as SonnerPrimitive, toast } from "sonner" // Renamed Sonner to SonnerPrimitive to avoid conflict

type ToasterProps = React.ComponentProps<typeof SonnerPrimitive> // Adjusted type to use SonnerPrimitive

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <SonnerPrimitive // Adjusted to use SonnerPrimitive
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
