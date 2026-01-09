import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertTriangle, CheckSquareIcon, ClockIcon, FileTextIcon, FileWarningIcon } from "lucide-react"
import SectionHeader from "../common/section_header"

export function MiddleSection() {
  return (
    <section>
      <div className="py-20">
        <div className="wrapper space-y-12">
      <SectionHeader title="Hiring Problem Today" description=""/>
    <div className="px-15 mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      
      <Card className="w-full">
        <CardContent>
          <ClockIcon className="mb-4 h-6 w-6 text-primary"/>
          Recruiters spend hours manually reviewing resumes
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardContent>
          <FileTextIcon className="mb-4 h-6 w-6 text-primary"/>
          Resume formats vary widely (PDF, text, layouts)
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardContent>
          <CheckSquareIcon className="mb-4 h-6 w-6 text-primary"/>
          Matching skills to job requirements is inconsistent
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardContent>
          <FileWarningIcon className="mb-4 h-6 w-6 text-primary"/>
          Top candidates are often missed due to manual screening
        </CardContent>
      </Card>
      
    </div>
    </div>
    </div>
    </section>
  )
}
