import StatusMessage from "@/components/ui/StatusMessage"

export default function Unauthorized() {
  return <StatusMessage code={401} />
}
